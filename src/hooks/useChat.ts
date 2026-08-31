import { useCallback, useRef, useState } from 'react';

import { toUserMessage } from '@/api/client';
import {
  appendMessage,
  createConversation,
  fetchConversation,
  type ConversationResponse,
  type Message,
  type Role,
} from '@/api/conversations';

/** 화면에 그리는 메시지. 서버 메시지와 낙관적으로 추가한 메시지를 같은 모양으로 다룬다. */
export type ChatMessage = {
  /** React key. 서버 메시지는 'server-{id}', 낙관적 메시지는 'local-{n}' */
  key: string;
  role: Role;
  content: string;
  createdAt: string;
};

export type ChatStatus = 'idle' | 'sending' | 'error';

function toChatMessage(message: Message): ChatMessage {
  return {
    key: `server-${message.id}`,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
  };
}

export function useChat() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  /** 실패했을 때 재전송할 질문. 성공하면 비운다. */
  const pendingQueryRef = useRef<string | null>(null);
  const localIdRef = useRef(0);

  const requestReply = useCallback(
    async (query: string) => {
      setStatus('sending');
      setError(null);

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
        setStatus('idle');
      } catch (caught) {
        // 낙관적으로 붙여 둔 사용자 메시지는 그대로 두고 재전송할 수 있게 한다.
        setError(toUserMessage(caught));
        setStatus('error');
      }
    },
    [conversationId],
  );

  const send = useCallback(
    (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || status === 'sending') {
        return;
      }

      localIdRef.current += 1;
      const optimistic: ChatMessage = {
        key: `local-${localIdRef.current}`,
        role: 'user',
        content: query,
        createdAt: new Date().toISOString(),
      };

      setMessages((previous) => [...previous, optimistic]);
      pendingQueryRef.current = query;

      void requestReply(query);
    },
    [requestReply, status],
  );

  /** 실패한 질문을 다시 보낸다. 사용자 메시지는 이미 화면에 있으니 새로 추가하지 않는다. */
  const retry = useCallback(() => {
    const query = pendingQueryRef.current;
    if (!query || status === 'sending') {
      return;
    }

    void requestReply(query);
  }, [requestReply, status]);

  /** 사이드바에서 고른 옛 대화를 불러와 화면에 띄운다. */
  const loadConversation = useCallback(
    async (id: number) => {
      if (status === 'sending') {
        return;
      }
      setStatus('sending');
      setError(null);
      pendingQueryRef.current = null;

      try {
        const conversation = await fetchConversation(id);
        setConversationId(conversation.conversationId);
        setTitle(conversation.title);
        setMessages(conversation.messages.map(toChatMessage));
        setStatus('idle');
      } catch (caught) {
        setError(toUserMessage(caught));
        setStatus('error');
      }
    },
    [status],
  );

  const reset = useCallback(() => {
    pendingQueryRef.current = null;
    setConversationId(null);
    setTitle(null);
    setMessages([]);
    setError(null);
    setStatus('idle');
  }, []);

  return {
    conversationId,
    title,
    messages,
    status,
    error,
    isSending: status === 'sending',
    send,
    retry,
    reset,
    loadConversation,
  };
}
