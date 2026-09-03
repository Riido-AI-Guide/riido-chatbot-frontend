import { ArrowRight, Bookmark, Copy, ThumbsDown, ThumbsUp, type LucideIcon } from 'lucide-react';

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
 * 답변 말풍선 하단 액션 줄.
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
            className="text-muted-foreground hover:bg-answer-card hover:text-foreground flex size-8 items-center justify-center rounded-[10px] outline-offset-2 transition-colors"
          >
            <Icon className="size-5" aria-hidden />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="text-muted-foreground hover:text-foreground flex h-10 shrink-0 items-center gap-1 rounded-xl pr-2.5 pl-4 text-base outline-offset-2 transition-colors"
      >
        운영팀에 문의하기
        <ArrowRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
