import { Markdown } from '@/components/chat/Markdown';
import { AnswerBody } from '@/components/chat/answer/AnswerBody';
import type { ChatMessage } from '@/hooks/useChat';

type MessageBubbleProps = {
  message: ChatMessage;
};

/**
 * Figma chat-light-sidebar-lg
 * - question: 우측 정렬, primary-soft 배경 + primary-border 1px, radius 16, px 24 / py 16, Body/16
 * - ai-message: 좌측 48px 프로필(icon-tertiary, radius 12) + gap 8 + 800px 답변 카드
 * - 질문 → 답변 gap 48
 */
export function MessageBubble({ message }: MessageBubbleProps) {
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

  return (
    <div className="flex items-start gap-2">
      {/* TODO: 뤼이도 챗봇 프로필 이미지 받으면 교체 (48×48) */}
      <span
        className="bg-icon-tertiary rounded-12 size-12 shrink-0"
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
  );
}
