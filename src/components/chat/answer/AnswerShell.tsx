import type { ReactNode } from 'react';

type AnswerShellProps = {
  children: ReactNode;
};

/** 답변 전체를 감싸는 회색 말풍선 */
export function AnswerShell({ children }: AnswerShellProps) {
  return (
    <div className="bg-answer-shell w-full rounded-2xl px-4 pt-6 pb-4">
      <div className="flex w-full flex-col gap-3">{children}</div>
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
      {hasTitle && <h3 className="text-xl leading-tight font-medium break-words">{title}</h3>}
      {children}
    </div>
  );
}
