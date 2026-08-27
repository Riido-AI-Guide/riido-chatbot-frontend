import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { LoaderCircle, SendHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ChatInputProps = {
  disabled: boolean;
  onSend: (query: string) => void;
};

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState('');

  // 서버도 400으로 막지만, 공백만 있는 질문은 클라이언트에서 먼저 걸러 낸다.
  const canSubmit = value.trim().length > 0 && !disabled;

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    onSend(value);
    setValue('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter로 전송, Shift+Enter로 줄바꿈. 한글 조합 중 Enter는 무시한다.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        aria-label="질문 입력"
        placeholder={disabled ? '답변을 기다리는 중이에요…' : '무엇이든 물어보세요'}
        className={cn(
          'border-border bg-background field-sizing-content max-h-40 min-h-10 flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm',
          'placeholder:text-muted-foreground transition-all outline-none',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
          'disabled:cursor-not-allowed disabled:opacity-60',
        )}
      />
      <Button type="submit" size="icon-lg" disabled={!canSubmit} aria-label="전송">
        {disabled ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <SendHorizontal aria-hidden="true" />
        )}
      </Button>
    </form>
  );
}
