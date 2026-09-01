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
        <div className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-md px-4 py-3">
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      ) : hasSections ? (
        // 구조화된 답변은 박스 자체가 버블 역할을 하므로 말풍선 배경을 씌우지 않는다.
        <div className="flex w-full flex-col gap-2">
          {message.title !== null && (
            <h3 className="px-1 text-sm font-semibold break-words">{message.title}</h3>
          )}
          <AnswerBody answerType={message.answerType} sections={message.sections} />
        </div>
      ) : (
        // sections가 없으면 평문 content로 fallback
        <div className="bg-muted text-foreground max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3">
          <Markdown content={message.content} />
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
