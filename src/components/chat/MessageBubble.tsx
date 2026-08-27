import { Markdown } from '@/components/chat/Markdown';
import type { ChatMessage } from '@/hooks/useChat';
import { formatMessageTime } from '@/lib/date';
import { cn } from '@/lib/utils';

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

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
          <Markdown content={message.content} />
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
