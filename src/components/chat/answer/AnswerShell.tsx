import type { ReactNode } from 'react';

import { AnswerFooter } from '@/components/chat/answer/AnswerFooter';

type AnswerShellProps = {
  children: ReactNode;
};

/** 답변 전체를 감싸는 흰 카드 (Figma answer-1: 800px, border-disable, radius 16) */
export function AnswerShell({ children }: AnswerShellProps) {
  return (
    <div className="bg-answer-shell border-answer-shell-border rounded-16 w-full border px-4 pt-6 pb-2">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col gap-3">{children}</div>
        <AnswerFooter />
      </div>
    </div>
  );
}

type AnswerHeadlineProps = {
  /** 답변 제목. 서버가 안 주면 생략한다. */
  title: string | null;
  children?: ReactNode;
};

/** 박스 없이 회색 배경 위에 바로 놓이는 제목 + 핵심답변 영역 */
export function AnswerHeadline({ title, children }: AnswerHeadlineProps) {
  const hasTitle = title !== null && title !== '';

  if (!hasTitle && children === undefined) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4 px-2">
      {hasTitle && (
        <h3 className="text-text-primary text-title-20 font-semibold tracking-tight break-words">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
