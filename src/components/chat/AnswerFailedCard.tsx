import { TriangleAlert } from 'lucide-react';

import { ChatProfile } from '@/components/chat/ChatProfile';
import { ICON_STROKE } from '@/lib/icon';

type AnswerFailedCardProps = {
  onRetry: () => void;
  disabled?: boolean;
};

/**
 * Figma `answer-creation-failed` — AI가 답변을 만들지 못했을 때 답변 자리에 뜨는 주황 카드.
 * ai-message 행(프로필 48 + gap 8) 안에 내용만큼(hug) 넓어짐.
 * warning-soft + warning-border, radius 16, pad 16, 아이콘 20 → gap 12 → 문구(gap 2) → gap 16 → [다시 생성](warning-solid 40px).
 * 네트워크가 끊긴 경우는 입력창 위 빨간 ErrorNotice가 맡는다.
 */
export function AnswerFailedCard({ onRetry, disabled = false }: AnswerFailedCardProps) {
  return (
    <div className="animate-in fade-in flex items-start gap-2 duration-200" role="alert">
      <ChatProfile />
      <div className="bg-status-warning-soft border-status-warning-border text-status-warning-text rounded-16 flex max-w-full items-center gap-4 border p-[15px]">
        <div className="flex items-start gap-3">
          <span className="flex h-6 w-5 shrink-0 items-center justify-center" aria-hidden>
            <TriangleAlert className="text-status-warning-icon size-5" strokeWidth={ICON_STROKE} />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-body-16 font-medium tracking-[-0.4px]">답변을 만들지 못했어요.</p>
            <p className="text-body-16-reading">일시적인 문제일 수 있어요. 다시 시도해 주세요.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          disabled={disabled}
          className="bg-status-warning-solid text-status-warning-on-solid hover:bg-status-warning-solid-hover focus-visible:ring-ring/50 rounded-12 text-body-16 h-10 shrink-0 px-4 font-medium tracking-[0.4px] whitespace-nowrap transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          다시 생성
        </button>
      </div>
    </div>
  );
}
