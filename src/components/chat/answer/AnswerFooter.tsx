import { ArrowRight, Bookmark, Copy, ThumbsDown, ThumbsUp, type LucideIcon } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';

type Action = {
  key: string;
  label: string;
  Icon: LucideIcon;
};

const ACTIONS: Action[] = [
  { key: 'copy', label: '메시지 복사', Icon: Copy },
  { key: 'bookmark', label: '북마크', Icon: Bookmark },
  { key: 'like', label: '좋아요', Icon: ThumbsUp },
  { key: 'dislike', label: '싫어요', Icon: ThumbsDown },
];

/**
 * Figma answer-footer — 답변 카드 하단 액션 줄 (40px).
 * 좌: copy/save/like/dislike 32px radius 10 (hover: fill-surface-strong, pressed: 채운 아이콘)
 * 우: contact-team-button 40px radius 12, pad 8/10/8/16, Body/16 text-secondary + arrow-right
 * 아직 동작은 붙이지 않았다 — 자리와 모양만 잡아 둔 상태다.
 */
export function AnswerFooter() {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {ACTIONS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            aria-label={label}
            title={label}
            className="text-icon-primary hover:bg-fill-surface-strong focus-visible:ring-ring/50 flex size-8 items-center justify-center rounded-[10px] transition-colors outline-none focus-visible:ring-3"
          >
            <Icon className="size-6" strokeWidth={ICON_STROKE} aria-hidden />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="text-text-secondary hover:bg-fill-hover active:bg-fill-press focus-visible:ring-ring/50 rounded-12 text-body-16 flex h-10 shrink-0 items-center gap-1 pr-2.5 pl-4 transition-colors outline-none focus-visible:ring-3"
      >
        운영팀에 문의하기
        <ArrowRight className="size-6" strokeWidth={ICON_STROKE} aria-hidden />
      </button>
    </div>
  );
}
