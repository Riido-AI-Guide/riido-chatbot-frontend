import { useState } from 'react';

import { cn } from '@/lib/utils';

export type QuestionListEntry = {
  /** 스크롤 목표가 되는 DOM id */
  targetId: string;
  label: string;
};

type QuestionListBarProps = {
  entries: QuestionListEntry[];
  className?: string;
};

/**
 * Figma `question-list-bar` (1707:3803) — 대화 우측에 질문 개수만큼 쌓이는 24×4 바 (gap 8).
 * 바에 마우스를 올리면 바가 진해지고(text-primary) 왼쪽에 질문 미리보기 pill이 뜬다:
 * `question preview` — surface 배경, border-disable, radius 12, pad 8/16, Body/14 Medium, shadow-m.
 * 클릭하면 해당 질문으로 스크롤한다.
 */
export function QuestionListBar({ entries, className }: QuestionListBarProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (entries.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="질문 목록"
      className={cn('flex w-6 flex-col gap-2', className)}
      onMouseLeave={() => setHoverIndex(null)}
    >
      {entries.map((entry, index) => {
        const isHover = hoverIndex === index;
        return (
          <div key={entry.targetId} className="relative h-1">
            <button
              type="button"
              aria-label={entry.label}
              onMouseEnter={() => setHoverIndex(index)}
              onFocus={() => setHoverIndex(index)}
              onBlur={() => setHoverIndex(null)}
              onClick={() =>
                document
                  .getElementById(entry.targetId)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className={cn(
                'block h-1 w-6 rounded-[10px] transition-colors outline-none',
                isHover ? 'bg-text-primary' : 'bg-fill-surface-strong',
              )}
            />
            {isHover && (
              <div
                role="tooltip"
                className="bg-background-surface border-border-disable text-text-primary shadow-m rounded-12 text-body-14 pointer-events-none absolute top-1/2 right-full mr-2 max-w-[320px] -translate-y-1/2 truncate border px-4 py-[7px] font-medium whitespace-nowrap"
                data-name="question preview"
              >
                {entry.label}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
