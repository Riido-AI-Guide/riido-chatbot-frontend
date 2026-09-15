import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { ArrowUp, Mic, Square } from 'lucide-react';
import { useSpeechInput } from '@/hooks/useSpeechInput';
import { ICON_STROKE } from '@/lib/icon';
import { cn } from '@/lib/utils';

type ChatInputProps = {
  disabled: boolean;
  onSend: (query: string) => void;
  /** 추천 칩에 마우스를 올린 동안 보여줄 미리보기 문구.
   *  placeholder 자리에 흐리게 뜨므로 입력창이 비어 있을 때만 보인다 */
  preview?: string | null;
};

/**
 * Figma `footer-input-box-light` (1345:3045)
 * 72px 박스: surface 배경 / border-disable 1px / radius 16 / shadow-m / pad 16/16/16/24 / gap 32
 * 우측 액션(gap 8): mic 40 원형(hover: surface-soft) + send 40 원형
 *   send disabled = fill-neutral(#F3F5F6) / active = button-inverse(#272F35) + 캔버스색 화살표
 *   mic default → hover surface-soft → recording(듣는 중) = surface-strong 배경 + 20px 정지(square) 아이콘
 * 답변 대기 중엔 Figma chat-light-loading대로 send를 disabled로 둔다 (로더는 입력창 위 AnswerLoader).
 * 상태: empty(placeholder) → typing(글자 text-primary, send active) → expanded(두 줄 이상이면 세로 배치: 텍스트 아래 버튼 줄, gap 8)
 * 아래 안내문: Body/14 text-secondary, gap 10
 */
export function ChatInput({ disabled, onSend, preview = null }: ChatInputProps) {
  const [value, setValue] = useState('');
  // 음성 입력(브라우저 내장 STT) — 확정된 문장을 입력창 뒤에 이어 붙인다
  const [speechError, setSpeechError] = useState<string | null>(null);
  const speech = useSpeechInput({
    onTranscript: (text) => setValue((previous) => (previous ? `${previous} ${text}` : text)),
    onError: setSpeechError,
  });

  useEffect(() => {
    if (speechError === null) {
      return;
    }
    const timer = setTimeout(() => setSpeechError(null), 4000);
    return () => clearTimeout(timer);
  }, [speechError]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  /** Figma state=expanded — 텍스트가 한 줄(28px)을 넘으면 버튼 줄이 아래로 내려간다 */
  const [isExpanded, setIsExpanded] = useState(false);

  // 실제 textarea는 expanded 여부에 따라 폭이 바뀌어(640 ↔ 760) 그걸로 재면 무한 루프가 난다.
  // 한 줄 레이아웃 폭(640px)으로 고정한 숨은 요소에 같은 글을 넣어 높이를 잰다.
  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) {
      return;
    }
    setIsExpanded(measure.scrollHeight > 28);
  }, [value]);

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
    <form onSubmit={handleSubmit} className="relative flex flex-col items-center gap-2.5">
      {/* 줄 수 측정용 (한 줄 레이아웃의 텍스트 폭 640px, 같은 서체) */}
      <div
        ref={measureRef}
        aria-hidden
        className="text-body-16-reading pointer-events-none invisible absolute top-0 left-0 w-[640px] break-words whitespace-pre-wrap"
      >
        {value || ' '}
      </div>
      <div
        className={cn(
          'bg-background-surface border-border-disable rounded-16 shadow-m flex min-h-[72px] w-full border py-[15px] pr-[15px] pl-[23px] transition-colors',
          isExpanded ? 'flex-col items-end gap-2' : 'items-end gap-8',
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          aria-label="질문 입력"
          placeholder={
            disabled
              ? '답변을 기다리는 중이에요…'
              : // 칩 호버 중엔 그 질문을 미리 보여준다 (누르면 실제 입력으로 확정된다)
                (preview ?? '질문이 구체적일수록 정확한 답변을 받을 수 있어요.')
          }
          className={cn(
            'text-text-primary placeholder:text-text-tertiary text-body-16-reading field-sizing-content min-h-7 flex-1 resize-none self-center bg-transparent outline-none',
            // Figma state=expanded: text-area 60px 고정(2줄까지 보임), 3줄부터 안쪽 스크롤(12px 스크롤바)
            isExpanded && 'riido-scrollbar h-[60px] w-full flex-none overflow-y-auto pr-2',
            'disabled:cursor-not-allowed disabled:opacity-60',
          )}
        />

        <div className="flex h-10 shrink-0 items-end gap-2">
          <button
            type="button"
            onClick={speech.toggle}
            disabled={disabled || !speech.isSupported}
            aria-pressed={speech.isListening}
            aria-label={
              !speech.isSupported
                ? '이 브라우저는 음성 입력을 지원하지 않아요'
                : speech.isListening
                  ? '음성 입력 멈추기'
                  : '음성으로 질문하기'
            }
            title={!speech.isSupported ? '이 브라우저는 음성 입력을 지원하지 않아요' : undefined}
            className={cn(
              'flex size-10 items-center justify-center rounded-full transition-colors outline-none',
              'focus-visible:ring-ring/50 focus-visible:ring-3',
              'disabled:cursor-not-allowed disabled:opacity-50',
              speech.isListening
                ? 'bg-background-surface-strong'
                : 'hover:bg-background-surface-soft',
            )}
          >
            {speech.isListening ? (
              <Square
                className="text-icon-primary size-5"
                strokeWidth={ICON_STROKE}
                fill="currentColor"
                aria-hidden
              />
            ) : (
              <Mic className="text-icon-primary size-6" strokeWidth={ICON_STROKE} aria-hidden />
            )}
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label="전송"
            className={cn(
              'flex size-10 items-center justify-center rounded-full transition-colors outline-none',
              'focus-visible:ring-ring/50 focus-visible:ring-3',
              canSubmit
                ? 'bg-button-inverse text-background-canvas'
                : 'bg-fill-neutral text-icon-tertiary cursor-not-allowed',
            )}
          >
            <ArrowUp className="size-6" strokeWidth={ICON_STROKE} aria-hidden />
          </button>
        </div>
      </div>
      {speechError !== null && (
        <p className="text-status-danger-text text-body-14 text-center" role="alert">
          {speechError}
        </p>
      )}
      <p className="text-text-secondary text-body-14 text-center">
        챗봇은 이용가이드 기반으로 답변하며, 문서에 없는 내용이나 최신 변경 사항은 정확하지 않을 수
        있습니다.
      </p>
    </form>
  );
}
