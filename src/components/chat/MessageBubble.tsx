import { Markdown } from '@/components/chat/Markdown';
import { AnswerBody } from '@/components/chat/answer/AnswerBody';
import type { ChatMessage } from '@/hooks/useChat';

type MessageBubbleProps = {
  message: ChatMessage;
};

/**
 * Figma chat-light-sidebar-lg
 * - question: 우측 정렬, fill-neutral 배경, radius 16, px 24 / py 16, Body/16
 * - ai-message: 좌측 48px 프로필 + 800px 답변 카드
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasSections = message.sections.length > 0;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-fill-neutral rounded-16 max-w-[85%] px-6 py-4">
          <p className="text-text-primary text-body-16 break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      {/* TODO: 뤼이도 챗봇 프로필 이미지 받으면 교체 (48×48) */}
      <span
        className="bg-background-surface-strong rounded-12 size-12 shrink-0"
        aria-hidden
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
          <div className="bg-answer-shell border-answer-shell-border rounded-16 border px-6 py-5">
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
  );
}
