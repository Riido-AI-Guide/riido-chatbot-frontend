import type { LucideIcon } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';

type QuickLinkChipProps = {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

/**
 * Figma `recommended question` (2331:13489) — 48px pill 형태 추천 질문.
 * surface 배경 + border-strong + shadow-s, pad 12/20, 20px 아이콘 + gap 8 + Button/16(ls 0.4).
 * hover: fill-hover(8%) / pressed: fill-press(12%)
 */
export function QuickLinkChip({
  icon: Icon,
  label,
  disabled = false,
  onClick,
}: QuickLinkChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="bg-background-surface border-border-strong hover:bg-fill-hover active:bg-fill-press focus-visible:ring-ring/50 shadow-s flex h-12 items-center gap-2 rounded-full border px-[19px] py-3 transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="text-icon-primary size-5 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
      <span className="text-text-primary text-button-16 font-medium tracking-wide whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
