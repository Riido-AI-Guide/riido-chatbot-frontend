import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * 시안에 나오는 세 가지 박스.
 * - note:  버블 위에 반투명하게 얹히는 강조 박스 (준비사항 · 조건 · 원인)
 * - card:  답변 본문을 담는 흰 카드
 * - inset: 카드 안에 한 겹 더 들어가는 박스 (특징 · 추천 · 단계 목록)
 * - danger: 빨간 경고 박스 (제한사항)
 * - warning: 주황 주의 박스 (주의사항)
 */
export type BoxVariant = 'note' | 'card' | 'inset' | 'danger' | 'warning';

const VARIANTS: Record<BoxVariant, string> = {
  // Figma info-box(헤더 아래): radius 12, pad 16/20
  note: 'bg-answer-note border-answer-note-border rounded-12 border px-[19px] py-[15px]',
  // Figma answer-body-panel: radius 12, pad 16/20, border-strong
  card: 'bg-answer-card border-answer-card-border rounded-12 border px-[19px] py-[15px]',
  // Figma step-list / 본문 안 info-box(주의사항 등): radius 10, pad 16/20
  inset: 'bg-answer-inset border-answer-inset-border rounded-[10px] border px-[19px] py-[15px]',
  // Figma info-box '제한사항': Danger soft(#FAEBEC / #272F35) + Danger border(#F46773 / #3A444B), radius 10, gap 10
  danger:
    'bg-status-danger-soft border-status-danger-border gap-[10px] rounded-[10px] border px-[19px] py-[15px]',
  // Figma info-box '주의사항': Warning soft(#FAF4EB / #272F35) + Warning border(#F9BA4D / #3A444B), radius 10, gap 10
  warning:
    'bg-status-warning-soft border-status-warning-border gap-[10px] rounded-[10px] border px-[19px] py-[15px]',
};

type SectionBoxProps = {
  variant: BoxVariant;
  /** 자식 사이 간격. 카드는 24px, 나머지는 8px가 기본이다. */
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
};

const GAPS = { sm: 'gap-2', md: 'gap-3', lg: 'gap-6' } as const;

export function SectionBox({ variant, gap = 'sm', className, children }: SectionBoxProps) {
  return (
    <div className={cn('flex w-full flex-col', GAPS[gap], VARIANTS[variant], className)}>
      {children}
    </div>
  );
}
