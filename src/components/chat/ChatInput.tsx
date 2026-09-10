import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowUp, Mic } from 'lucide-react';
import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';

import { ICON_STROKE } from '@/lib/icon';
import { cn } from '@/lib/utils';

type ChatInputProps = {
  disabled: boolean;
  onSend: (query: string) => void;
};

/**
 * Figma `footer-input-box-light` (1345:3045)
 * 72px 박스: surface 배경 / border-disable / radius-16 / shadow-m
 * 우측 액션: 마이크(24) + 전송(40, 원형)
 */
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
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2.5">
      <div
        className={cn(
          'bg-background-surface border-border-disable rounded-16 shadow-m flex min-h-[72px] w-full items-end gap-8 border py-[15px] pr-[15px] pl-[23px] transition-colors',
          'focus-within:border-primary-border',
        )}
      >
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          aria-label="질문 입력"
          placeholder={
            disabled
              ? '답변을 기다리는 중이에요…'
              : '질문이 구체적일수록 정확한 답변을 받을 수 있어요.'
          }
          className={cn(
            'text-text-primary placeholder:text-text-tertiary text-body-16-reading field-sizing-content max-h-40 min-h-10 flex-1 resize-none self-center bg-transparent outline-none',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        />

        <div className="flex h-10 shrink-0 items-end gap-2">
          {/* TODO: 음성 입력 — 브라우저 SpeechRecognition 붙기 전까지 자리만 */}
          <button
            type="button"
            disabled
            aria-label="음성으로 질문하기 (준비 중)"
            className="hover:bg-fill-hover flex size-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mic className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="전송"
            className={cn(
              'flex size-10 items-center justify-center rounded-full transition-colors outline-none',
              'focus-visible:ring-ring/50 focus-visible:ring-3',
              canSubmit
                ? 'bg-primary-solid text-primary-on-solid hover:bg-primary-solid-strong'
                : 'bg-background-surface-soft text-icon-disable cursor-not-allowed',
            )}
          >
            {disabled ? (
              /* ldrs Ring 2 — Figma Opacity/Loader Track = 0 → bgOpacity 0 */
              <Ring2
                size="24"
                stroke="2"
                strokeLength="0.25"
                bgOpacity="0"
                speed="0.8"
                color="var(--icon-secondary)"
              />
            ) : (
              <ArrowUp className="size-6" strokeWidth={ICON_STROKE} aria-hidden />
            )}
          </button>
        </div>
      </div>
      <p className="text-text-secondary text-body-14 text-center">
        챗봇은 이용가이드 기반으로 답변하며, 문서에 없는 내용이나 최신 변경 사항은 정확하지 않을 수
        있습니다.
      </p>
    </form>
  );
}
