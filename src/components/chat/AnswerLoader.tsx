import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';

import { cn } from '@/lib/utils';

type AnswerLoaderProps = {
  className?: string;
};

/**
 * Figma `loader-leapfrog/loader-answer`(2611:4138) — 답변 생성 중 입력창 위(24px)에 떠 있는 36×28 글래스 pill.
 * background-glass(반투명) + radius 999 + backdrop blur, 안에 ldrs Leapfrog.
 * 여백은 가운데 정렬이 아니라 피그마 값 그대로 좌우 8 / 위 4 / 아래 12 (8+20+8=36, 4+12+12=28).
 * Leapfrog 수치는 Figma 프레임(20×12, 점 4px, 간격 8)에 맞춘 size 20 (ldrs: 점 = size×0.22, 간격 = size×0.4).
 */
export function AnswerLoader({ className }: AnswerLoaderProps) {
  return (
    <div
      className={cn(
        'bg-background-glass flex h-7 w-9 flex-col items-center rounded-full px-2 pt-1 pb-3 backdrop-blur-sm',
        className,
      )}
      role="status"
      aria-label="답변 생성 중"
      data-name="loader-answer"
    >
      <Leapfrog size="20" speed="2.5" color="var(--fill-inverse)" />
    </div>
  );
}
