import { Rocket } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';

type QuickLinkChipProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

/**
 * Figma `recommended question` (2331:13489) — pill 형태 추천 질문.
 * surface 배경 + border-strong + shadow-s, 20px 아이콘 + Button/16.
 */
export function QuickLinkChip({ label, disabled = false, onClick }: QuickLinkChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="bg-background-surface border-border-strong hover:bg-fill-hover focus-visible:ring-ring/50 shadow-s flex items-center gap-2 rounded-full border px-5 py-3 transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Rocket className="text-icon-primary size-5 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
      <span className="text-text-primary text-button-16 font-medium tracking-wide whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
