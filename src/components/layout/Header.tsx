import { BookOpen, Search } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';
import { cn } from '@/lib/utils';

type HeaderProps = {
  /** 대화 제목. 새 대화(엔트리 화면)면 null → 제목 숨김 */
  title: string | null;
  /** 채팅 검색어 — 검색 API가 없어서 지금은 사이드바 대화 목록을 제목으로 거른다 */
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

/**
 * Figma `header` (962:7519) — 64px, pad 20/12/20/32.
 * 좌: 대화 제목(Title/20 Medium, ls -0.4, 220px 말줄임) / 중앙: 채팅 검색(392×40) / 우: 이용가이드(book-open 40, hover: surface-strong)
 * 배경: 캔버스색이 아래로 번지는 80px 페이드(header background) — 메시지가 헤더 밑으로 스크롤될 때 가려준다.
 */
export function Header({ title, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="relative z-10 flex h-16 shrink-0 items-center gap-3 pr-3 pl-8">
      {/* Figma header background: 그라데이션 + Layer blur 12 + Background blur 1 (Figma 블러 반경 = CSS blur의 2배라 6 / 0.5로) → 밑으로 지나가는 내용이 살짝 흐려진다 */}
      <div
        className="canvas-fade-down pointer-events-none absolute inset-x-0 top-0 h-20 blur-[6px] backdrop-blur-[0.5px]"
        aria-hidden
      />
      {/* 페이드 배경(absolute) 위에 올라오도록 relative — 안 그러면 제목이 흐려 보인다 */}
      <h1
        className={cn(
          'text-text-primary text-title-20 relative w-[220px] shrink-0 truncate font-medium tracking-[-0.4px]',
          title === null && 'opacity-0',
        )}
      >
        {title ?? '새 대화'}
      </h1>

      {/* 채팅 검색 — 검색 API 붙기 전까지는 사이드바 최근 대화를 제목으로 거른다 */}
      {/* Figma: 스크롤바(12px) 뺀 영역 기준 중앙 → 6px 왼쪽 */}
      <div className="absolute top-1/2 left-[calc(50%-6px)] w-[392px] -translate-x-1/2 -translate-y-1/2">
        <label className="bg-background-surface-soft border-border-strong rounded-12 flex h-10 items-center gap-2 border px-[15px]">
          <Search className="text-icon-tertiary size-5 shrink-0" strokeWidth={ICON_STROKE} />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
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
        // Figma book-open: default 회색 아이콘 → hover 회색 배경(surface-strong) → pressed 배경 없이 진한 아이콘
        className="group hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 ml-auto flex size-10 shrink-0 items-center justify-center transition-colors outline-none focus-visible:ring-3 active:bg-transparent"
      >
        <BookOpen
          className="text-icon-tertiary group-active:text-icon-primary size-6 transition-colors"
          strokeWidth={ICON_STROKE}
        />
      </a>
    </header>
  );
}
