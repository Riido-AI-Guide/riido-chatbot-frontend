import chatbotProfile from '@/assets/brand/chatbot-profile.png';
import { Markdown } from '@/components/chat/Markdown';
import type { FeedbackRating, FeedbackReasonCode } from '@/api/feedback';
import { AnswerBody } from '@/components/chat/answer/AnswerBody';
import {
  MessageActionsProvider,
  type MessageActions,
} from '@/components/chat/answer/MessageActionsContext';
import type { ChatMessage } from '@/hooks/useChat';

export type MessageActionHandlers = {
  onToggleBookmark: (messageId: number, bookmarked: boolean) => Promise<void>;
  onRate: (
    messageId: number,
    rating: FeedbackRating,
    reason?: FeedbackReasonCode | null,
  ) => Promise<MessageActions['feedback'] & object>;
  onClearRating: (messageId: number) => Promise<void>;
};

type MessageBubbleProps = {
  message: ChatMessage;
  /** 답변 카드 액션(담기·평가). 없으면 버튼이 비활성으로 그려진다 */
  actions?: MessageActionHandlers;
};

/** 복사 버튼용 평문 — 제목 + 섹션(라벨: 본문) 순서대로. 섹션이 없으면 content */
function toCopyText(message: ChatMessage): string {
  const parts: string[] = [];
  if (message.title) {
    parts.push(message.title);
  }
  if (message.sections.length > 0) {
    for (const section of message.sections) {
      parts.push(`[${section.label}]\n${section.text}`);
    }
  } else {
    parts.push(message.content);
  }
  return parts.join('\n\n');
}

/**
 * Figma chat-light-sidebar-lg
 * - question: 우측 정렬, primary-soft 배경 + primary-border 1px, radius 16, px 24 / py 16, Body/16
 * - ai-message: 좌측 48px 프로필(icon-tertiary, radius 12) + gap 8 + 800px 답변 카드
 * - 질문 → 답변 gap 48
 */
export function MessageBubble({ message, actions }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasSections = message.sections.length > 0;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-primary-soft border-primary-border rounded-16 max-w-[85%] border px-6 py-[15px]">
          <p className="text-text-primary text-body-16 break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  const messageId = message.id;
  const messageActions: MessageActions = {
    messageId,
    copyText: toCopyText(message),
    bookmarked: message.bookmarked,
    feedback: message.feedback,
    onToggleBookmark: (bookmarked) =>
      messageId !== null && actions
        ? actions.onToggleBookmark(messageId, bookmarked)
        : Promise.resolve(),
    onRate: (rating, reason) => {
      if (messageId === null || !actions) {
        return Promise.reject(new Error('아직 저장되지 않은 메시지입니다.'));
      }
      return actions.onRate(messageId, rating, reason);
    },
    onClearRating: () =>
      messageId !== null && actions ? actions.onClearRating(messageId) : Promise.resolve(),
  };

  return (
    <MessageActionsProvider value={messageActions}>
      <div className="flex items-start gap-2">
        <img
          src={chatbotProfile}
          alt=""
          className="size-12 shrink-0 object-contain"
          data-name="chat-profile"
        />
        <div className="min-w-0 flex-1">
          {hasSections ? (
            // 구조화된 답변은 AnswerShell이 카드까지 그린다.
            <AnswerBody
              title={message.title}
              answerType={message.answerType}
              sections={message.sections}
            />
          ) : (
            // sections가 없으면 평문 content로 fallback
            <div className="bg-answer-shell border-answer-shell-border rounded-16 border px-6 pt-6 pb-4">
              {message.title !== null && (
                <h3 className="text-text-primary text-title-20 mb-2 font-semibold tracking-tight break-words">
                  {message.title}
                </h3>
              )}
              <Markdown content={message.content} variant="answer" />
            </div>
          )}
        </div>
      </div>
    </MessageActionsProvider>
  );
}
