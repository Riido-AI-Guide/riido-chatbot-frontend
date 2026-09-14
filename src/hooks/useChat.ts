import { useCallback, useEffect, useRef, useState } from 'react';

import { addBookmark, removeBookmark } from '@/api/bookmarks';
import { ApiError, toUserMessage } from '@/api/client';
import {
  appendMessage,
  createConversation,
  fetchConversation,
  type AnswerSection,
  type AnswerType,
  type ConversationResponse,
  type Message,
  type Role,
} from '@/api/conversations';
import {
  deleteFeedback,
  saveFeedback,
  type FeedbackRating,
  type FeedbackReasonCode,
  type MessageFeedback,
} from '@/api/feedback';
import { emitBookmarksChanged, subscribeBookmarksChanged } from '@/lib/bookmark-events';

/** 화면에 그리는 메시지. 서버 메시지와 낙관적으로 추가한 메시지를 같은 모양으로 다룬다. */
export type ChatMessage = {
  /** React key. 서버 메시지는 'server-{id}', 낙관적 메시지는 'local-{n}' */
  key: string;
  /** 서버 메시지 id. 낙관적 메시지(아직 서버에 없음)는 null */
  id: number | null;
  role: Role;
  /** sections가 비어 있을 때 대신 그리는 평문(마크다운) */
  content: string;
  /** assistant 답변 제목. 없으면 null */
  title: string | null;
  /** 답변 형태. 아직 화면에서 쓰지 않는다 */
  answerType: AnswerType | null;
  /** 구조화된 답변. 비어 있으면 content로 fallback */
  sections: AnswerSection[];
  /** 담아 둔(북마크한) 답변인지 */
  bookmarked: boolean;
  /** 남긴 평가. 없으면 null */
  feedback: MessageFeedback | null;
  /** UTC ISO-8601 문자열 */
  createdAt: string;
};

/**
 * 'sending'은 답변을 기다리는 중, 'loading'은 옛 대화를 불러오는 중이다.
 * 둘을 나눠 둬야 대화 전환에서는 '답변을 작성하고 있어요'를 안 띄울 수 있다.
 */
export type ChatStatus = 'idle' | 'sending' | 'loading' | 'error';
export type ErrorKind = 'network' | 'answer';

/** Figma 에러 컴포넌트 분기: 서버가 응답한(ApiError) 실패는 answer-creation-failed, 나머지는 network-connection-error */
function toErrorKind(caught: unknown): ErrorKind {
  return caught instanceof ApiError ? 'answer' : 'network';
}

function toChatMessage(message: Message): ChatMessage {
  return {
    key: `server-${message.id}`,
    id: message.id,
    role: message.role,
    content: message.content,
    title: message.title ?? null,
    answerType: message.answerType ?? null,
    sections: message.sections ?? [],
    bookmarked: message.bookmarked ?? false,
    feedback: message.feedback ?? null,
    createdAt: message.createdAt,
  };
}

export function useChat() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  /** 에러 종류 — network: 서버에 못 닿음(입력창 위 빨간 카드), answer: 서버는 응답했지만 답변 생성 실패(답변 자리 주황 카드) */
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  /** 같은 질문을 다시 보낸 횟수. Figma 네트워크 에러 흐름(최대 3회) 표시에 쓴다. */
  const [retryCount, setRetryCount] = useState(0);

  /** 답변 대기든 대화 로딩이든, 새 요청을 막아야 하는 상태 */
  const isBusy = status === 'sending' || status === 'loading';

  /** 실패했을 때 재전송할 질문. 성공하면 비운다. */
  const pendingQueryRef = useRef<string | null>(null);
  const localIdRef = useRef(0);

  const requestReply = useCallback(
    async (query: string) => {
      setStatus('sending');
      setError(null);
      setErrorKind(null);

      try {
        // 열려 있는 대화가 있으면 이어가고(멀티턴), 없으면 새 대화를 만든다.
        const conversation: ConversationResponse =
          conversationId === null
            ? await createConversation(query)
            : await appendMessage(conversationId, query);

        setConversationId(conversation.conversationId);
        setTitle(conversation.title);
        // 서버가 준 messages가 정답이므로 낙관적 목록을 통째로 교체한다.
        // (이어가기 API가 붙으면 교체 대신 이어붙이기로 바꾸면 된다.)
        setMessages(conversation.messages.map(toChatMessage));

        pendingQueryRef.current = null;
        setRetryCount(0);
        setStatus('idle');
      } catch (caught) {
        // 낙관적으로 붙여 둔 사용자 메시지는 그대로 두고 재전송할 수 있게 한다.
        setError(toUserMessage(caught));
        setErrorKind(toErrorKind(caught));
        setStatus('error');
      }
    },
    [conversationId],
  );

  const send = useCallback(
    (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || isBusy) {
        return;
      }

      localIdRef.current += 1;
      const optimistic: ChatMessage = {
        key: `local-${localIdRef.current}`,
        id: null,
        role: 'user',
        content: query,
        title: null,
        answerType: null,
        sections: [],
        bookmarked: false,
        feedback: null,
        createdAt: new Date().toISOString(),
      };

      setMessages((previous) => [...previous, optimistic]);
      pendingQueryRef.current = query;
      setRetryCount(0);

      void requestReply(query);
    },
    [requestReply, isBusy],
  );

  /** 실패한 질문을 다시 보낸다. 사용자 메시지는 이미 화면에 있으니 새로 추가하지 않는다. */
  const retry = useCallback(() => {
    const query = pendingQueryRef.current;
    if (!query || isBusy) {
      return;
    }

    // 재시도 횟수(n/3)는 네트워크 에러 흐름에만 있다. 답변 생성 실패의 [다시 생성]은 보통 전송처럼 보인다.
    if (errorKind === 'network') {
      setRetryCount((count) => count + 1);
    }
    void requestReply(query);
  }, [requestReply, isBusy, errorKind]);

  /** 사이드바에서 고른 옛 대화를 불러와 화면에 띄운다. */
  const loadConversation = useCallback(
    async (id: number) => {
      if (isBusy) {
        return;
      }
      // 'sending'이 아니라 'loading'이다 — 대화 전환에는 타이핑 인디케이터를 띄우지 않는다.
      setStatus('loading');
      setError(null);
      setErrorKind(null);
      pendingQueryRef.current = null;

      try {
        const conversation = await fetchConversation(id);
        setConversationId(conversation.conversationId);
        setTitle(conversation.title);
        setMessages(conversation.messages.map(toChatMessage));
        setStatus('idle');
      } catch (caught) {
        setError(toUserMessage(caught));
        setErrorKind('network');
        setStatus('error');
      }
    },
    [isBusy],
  );

  /** 메시지 하나의 필드만 바꾼다 (북마크·평가 낙관적 갱신용) */
  const patchMessage = useCallback((messageId: number, patch: Partial<ChatMessage>) => {
    setMessages((previous) =>
      previous.map((message) => (message.id === messageId ? { ...message, ...patch } : message)),
    );
  }, []);

  /** 답변 담기 토글. 실패하면 원래 상태로 되돌리고 에러를 던진다. */
  const toggleBookmark = useCallback(
    async (messageId: number, bookmarked: boolean) => {
      patchMessage(messageId, { bookmarked });
      try {
        if (bookmarked) {
          await addBookmark(messageId);
        } else {
          await removeBookmark(messageId);
        }
        emitBookmarksChanged({ messageId, bookmarked });
      } catch (caught) {
        patchMessage(messageId, { bookmarked: !bookmarked });
        throw caught;
      }
    },
    [patchMessage],
  );

  /**
   * 좋아요/싫어요 저장. 처음 누를 땐 reason 없이, 상세사유를 고르면 같은 rating에 reason을 실어 다시 보낸다.
   * 응답이 곧 서버 상태라 그대로 메시지에 덮어쓴다.
   */
  // 사이드바 "답변 보관"에서 해제하면 채팅에 떠 있는 같은 답변의 북마크도 꺼진다
  useEffect(
    () =>
      subscribeBookmarksChanged((change) => {
        if (change !== undefined) {
          patchMessage(change.messageId, { bookmarked: change.bookmarked });
        }
      }),
    [patchMessage],
  );

  const rateMessage = useCallback(
    async (messageId: number, rating: FeedbackRating, reason: FeedbackReasonCode | null = null) => {
      const saved = await saveFeedback(messageId, { rating, reason });
      patchMessage(messageId, { feedback: saved });
      return saved;
    },
    [patchMessage],
  );

  /** 평가 취소 */
  const clearRating = useCallback(
    async (messageId: number) => {
      await deleteFeedback(messageId);
      patchMessage(messageId, { feedback: null });
    },
    [patchMessage],
  );

  const reset = useCallback(() => {
    pendingQueryRef.current = null;
    setConversationId(null);
    setTitle(null);
    setMessages([]);
    setError(null);
    setErrorKind(null);
    setRetryCount(0);
    setStatus('idle');
  }, []);

  return {
    conversationId,
    title,
    messages,
    status,
    error,
    errorKind,
    /** 답변 대기 중. 타이핑 인디케이터 표시 여부에 쓴다. */
    isSending: status === 'sending',
    /** 실패한 질문을 다시 보내는 중 (Figma network-connection-retry-loading) */
    isRetrying: status === 'sending' && retryCount > 0,
    retryCount,
    /** 답변 대기 + 대화 로딩. 입력·버튼 잠금에 쓴다. */
    isBusy,
    send,
    retry,
    reset,
    loadConversation,
    toggleBookmark,
    rateMessage,
    clearRating,
  };
}
