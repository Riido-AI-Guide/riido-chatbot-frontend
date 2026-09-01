import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SectionBoxProps = {
  /** 중첩 깊이. 0이 바깥 박스이고, 깊어질수록 배경색을 번갈아 줘서 안팎을 구분한다. */
  depth?: number;
  className?: string;
  children: ReactNode;
};

/**
 * 답변 레이아웃의 박스. 테두리 + 깊이별 배경으로 박스 안의 박스를 구분한다.
 * 안이 빌 수 있는 박스는 호출하는 쪽에서 내용 유무를 먼저 확인하고 그린다.
 */
export function SectionBox({ depth = 0, className, children }: SectionBoxProps) {
  return (
    <div
      className={cn(
        'border-border flex flex-col gap-3 rounded-xl border',
        depth === 0 ? 'gap-4 rounded-2xl p-4' : 'p-3',
        depth % 2 === 0 ? 'bg-background' : 'bg-muted',
        className,
      )}
    >
      {children}
    </div>
  );
}
