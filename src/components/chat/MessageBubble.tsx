import { AnswerSections } from '@/components/chat/AnswerSections';
import { Markdown } from '@/components/chat/Markdown';
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
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md',
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {message.title !== null && (
              <h3 className="text-sm font-semibold break-words">{message.title}</h3>
            )}
            {/* sections가 오면 그것을 그리고, 없으면 평문 content로 fallback */}
            {hasSections ? (
              <AnswerSections sections={message.sections} />
            ) : (
              <Markdown content={message.content} />
            )}
          </div>
        )}
      </div>
      <time
        dateTime={message.createdAt}
        className="text-muted-foreground px-1 text-[0.7rem] tabular-nums"
      >
        {formatMessageTime(message.createdAt)}
      </time>
    </div>
  );
}
