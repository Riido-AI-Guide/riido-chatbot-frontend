import { BookOpen, Search } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';
import { cn } from '@/lib/utils';

type HeaderProps = {
  /** 대화 제목. 새 대화(엔트리 화면)면 null → 제목 숨김 */
  title: string | null;
};

/**
 * Figma `header` (962:7519) — 64px.
 * 좌: 대화 제목(Title/20 Medium, 220px 말줄임) / 중앙: 채팅 검색(392px) / 우: 이용가이드(book-open)
 */
export function Header({ title }: HeaderProps) {
  return (
    <header className="relative flex h-16 shrink-0 items-center gap-3 pr-3 pl-8">
      <h1
        className={cn(
          'text-text-primary text-title-20 w-[220px] shrink-0 truncate font-medium tracking-tight',
          title === null && 'opacity-0',
        )}
      >
        {title ?? '새 대화'}
      </h1>

      {/* TODO: 채팅 검색 — 검색 API 붙기 전까지 입력만 받는다 */}
      <div className="absolute top-1/2 left-1/2 w-[392px] -translate-x-1/2 -translate-y-1/2">
        <label className="bg-background-surface-soft border-border-strong rounded-12 flex items-center gap-2 border px-4 py-2.5">
          <Search className="text-icon-primary size-5 shrink-0" strokeWidth={ICON_STROKE} />
          <input
            type="search"
            placeholder="채팅 검색"
            aria-label="채팅 검색"
            className="text-text-primary placeholder:text-text-tertiary text-body-14 w-full bg-transparent outline-none"
          />
        </label>
      </div>

      <a
        href="https://docs.riido.io"
        target="_blank"
        rel="noreferrer noopener"
        aria-label="뤼이도 이용가이드 열기"
        className="hover:bg-fill-hover focus-visible:ring-ring/50 rounded-12 ml-auto flex size-10 shrink-0 items-center justify-center outline-none focus-visible:ring-3"
      >
        <BookOpen className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
      </a>
    </header>
  );
}
