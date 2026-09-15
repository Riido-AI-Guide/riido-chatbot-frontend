import { cn } from '@/lib/utils';

type AnswerLoaderProps = {
  className?: string;
};

/**
 * Figma `loader-leapfrog/loader-answer`(2611:4138) — 답변 생성 중 입력창 위(24px)에 떠 있는 36×28 pill.
 * 배경은 피그마 변수 977:26 20%(= --background-glass) + GLASS(backdrop blur) + radius 999.
 * 여백은 가운데 정렬이 아니라 피그마 값 그대로 좌우 8 / 위 4 / 아래 12 (8+20+8=36, 4+12+12=28).
 * 위아래가 다른 건 점이 뛰어오를 공간 때문이고, 쉬는 점은 pill 세로 정중앙(14px)에 온다.
 * 점 3개는 피그마 `loader-leapfrog`(2600:4222) frame=01~18 좌표를 그대로 옮긴 CSS 애니메이션
 * (src/index.css `.riido-leapfrog`). ldrs는 점 지름이 4.4px(size×0.22)라 피그마 4px과 달라 걷어냈다.
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
      <span className="riido-leapfrog" aria-hidden>
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
