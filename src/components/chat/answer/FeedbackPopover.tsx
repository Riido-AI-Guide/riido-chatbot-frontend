import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  fetchFeedbackReasons,
  type FeedbackRating,
  type FeedbackReason,
  type FeedbackReasonCode,
} from '@/api/feedback';
import { PopoverContent } from '@/components/ui/popover';
import { ICON_STROKE } from '@/lib/icon';
import { cn } from '@/lib/utils';

type FeedbackPopoverProps = {
  rating: FeedbackRating;
  /** 이미 고른 사유가 있으면 미리 선택해 둔다 */
  selected: FeedbackReasonCode | null;
  onSend: (reason: FeedbackReasonCode) => Promise<void>;
  onClose: () => void;
};

/**
 * Figma `feedback-popover-good` / `feedback-popover-bad` — 좋아요/싫어요 누른 뒤 뜨는 상세사유 창.
 * background-answer + border-disable, radius 16, pad 24/32, shadow-l.
 * 제목(Title/20 Semibold) + X / 질문(Title/16 Medium) + "(선택사항)" / 사유 칩(feedback 컴포넌트, 40px radius 12) 3×2 / 보내기(send-popover 80×40)
 */
export function FeedbackPopover({ rating, selected, onSend, onClose }: FeedbackPopoverProps) {
  const [reasons, setReasons] = useState<FeedbackReason[]>([]);
  const [choice, setChoice] = useState<FeedbackReasonCode | null>(selected);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchFeedbackReasons(rating, controller.signal)
      .then(setReasons)
      .catch(() => setReasons([]));
    return () => controller.abort();
  }, [rating]);

  const canSend = choice !== null && choice !== selected && !isSending;

  const handleSend = async () => {
    if (choice === null || !canSend) {
      return;
    }
    setIsSending(true);
    try {
      await onSend(choice);
      onClose();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PopoverContent
      side="bottom"
      align="start"
      sideOffset={8}
      className="bg-answer-card border-border-disable shadow-l rounded-16 w-[498px] max-w-[calc(100vw-32px)] border px-8 py-6"
    >
      <div className="flex flex-col items-end gap-6">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-text-strong text-title-20 font-semibold tracking-[-0.4px]">
              소중한 의견을 남겨주세요
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="hover:bg-fill-hover focus-visible:ring-ring/50 rounded-6 flex size-6 items-center justify-center outline-none focus-visible:ring-3"
            >
              <X className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
            </button>
          </div>
          <p className="flex items-center gap-1">
            <span className="text-text-primary text-title-16 font-medium tracking-[-0.4px]">
              {rating === 'GOOD'
                ? '이 응답의 어떤 점이 만족스러웠나요?'
                : '이 응답의 어떤 점이 불만족스러웠나요?'}
            </span>
            <span className="text-text-secondary text-body-14">(선택사항)</span>
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="상세 사유">
            {reasons.map((reason) => {
              const isChosen = reason.code === choice;
              return (
                <button
                  key={reason.code}
                  type="button"
                  role="radio"
                  aria-checked={isChosen}
                  onClick={() => setChoice(isChosen ? null : reason.code)}
                  className={cn(
                    'border-border-strong text-text-primary hover:bg-fill-hover active:bg-fill-press focus-visible:ring-ring/50 rounded-12 text-body-16 h-10 border px-4 font-medium tracking-[0.4px] transition-colors outline-none focus-visible:ring-3',
                    isChosen ? 'bg-primary-soft border-primary-border' : 'bg-background-surface',
                  )}
                >
                  {reason.label}
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'rounded-12 text-body-16 h-10 w-20 font-medium tracking-[0.4px] transition-colors outline-none',
            'focus-visible:ring-ring/50 focus-visible:ring-3',
            canSend
              ? 'bg-primary-solid text-text-primary active:bg-primary-solid-strong'
              : 'bg-fill-neutral text-text-disable cursor-not-allowed',
          )}
        >
          보내기
        </button>
      </div>
    </PopoverContent>
  );
}
