import { Markdown } from '@/components/chat/Markdown';
import { AnswerBody } from '@/components/chat/answer/AnswerBody';
import type { ChatMessage } from '@/hooks/useChat';
import { formatMessageTime } from '@/lib/date';
import { cn } from '@/lib/utils';

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasSections = message.sections.length > 0;

  return (
    <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
      {isUser ? (
        <div className="bg-answer-shell max-w-[85%] rounded-2xl px-5 py-3">
          <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      ) : hasSections ? (
        // 구조화된 답변은 AnswerShell이 말풍선까지 그리므로 여기서 배경을 씌우지 않는다.
        <AnswerBody
          title={message.title}
          answerType={message.answerType}
          sections={message.sections}
        />
      ) : (
        // sections가 없으면 평문 content로 fallback
        <div className="bg-answer-shell max-w-[85%] rounded-2xl px-5 py-3">
          {message.title !== null && (
            <h3 className="mb-2 text-xl leading-tight font-medium break-words">{message.title}</h3>
          )}
          <Markdown content={message.content} variant="answer" />
        </div>
      )}
      <time
        dateTime={message.createdAt}
        className="text-muted-foreground px-1 text-[0.7rem] tabular-nums"
      >
        {formatMessageTime(message.createdAt)}
      </time>
    </div>
  );
}
