import {
  Archive,
  Bookmark as BookmarkIcon,
  ChevronDown,
  MessageCircleMore,
  MessagesSquare,
  Moon,
  PanelLeft,
  PanelLeftClose,
  SquarePen,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { fetchBookmarks, removeBookmark, type Bookmark } from '@/api/bookmarks';
import { fetchConversations, type ConversationSummary } from '@/api/conversations';
import riidoSymbol from '@/assets/brand/riido-symbol-teal.png';
import { SidebarItem } from '@/components/layout/SidebarItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { clearCurrentUser, getCurrentUser } from '@/lib/auth';
import { openContactDialog } from '@/lib/contact-events';
import { emitBookmarksChanged, subscribeBookmarksChanged } from '@/lib/bookmark-events';
import { ICON_STROKE } from '@/lib/icon';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

type SidebarProps = {
  /** 지금 화면에 열려 있는 대화 id (목록에서 강조 표시) */
  activeId: number | null;
  /** 값이 바뀌면 목록을 다시 불러온다 — 새 대화가 만들어졌을 때 갱신용 */
  refreshKey: number | null;
  onSelect: (conversationId: number) => void;
  onNewChat: () => void;
  /** 사이드바 접기 (Figma sidebar-left 토글) */
  onCollapse: () => void;
  /** 헤더 채팅 검색어 — 최근 대화를 제목으로 거른다 */
  filter?: string;
};

/** Figma chevron toggle / archive·recent-chat — 섹션 접기/펼치기 버튼 */
function SectionChevron({
  isOpen,
  label,
  onToggle,
}: {
  isOpen: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? `${label} 접기` : `${label} 펼치기`}
      aria-expanded={isOpen}
      // Figma list-title-hover-bg-with-chevron: 기본엔 숨김, 줄에 마우스 올리면(또는 키보드 포커스) 우측 끝에 24px chevron
      className="focus-visible:ring-ring/50 rounded-6 flex size-6 shrink-0 items-center justify-center opacity-0 transition-opacity outline-none group-hover/row:opacity-100 focus-visible:opacity-100 focus-visible:ring-3"
    >
      {/* Figma chevron toggle: Direction=down(접힘) / up(펼침), icon-primary 24px */}
      <ChevronDown
        className={cn('text-icon-primary size-6 transition-transform', isOpen && 'rotate-180')}
        strokeWidth={ICON_STROKE}
        aria-hidden
      />
    </button>
  );
}

/**
 * Figma `sidebar` (entry-screen-sidebar-lg 기준, 260px)
 * 헤더(로고+토글) / 본문(새 채팅, 답변 보관, 최근 대화) / 푸터(문의, 설정, 프로필)
 */
export function Sidebar({
  activeId,
  refreshKey,
  onSelect,
  onNewChat,
  onCollapse,
  filter = '',
}: SidebarProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const user = getCurrentUser();
  const userId = user?.id;

  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    // 목록은 부가 기능 — 불러오기에 실패해도 채팅 자체는 계속되어야 하므로 조용히 비운다
    fetchConversations(userId)
      .then(setConversations)
      .catch(() => setConversations([]));
  }, [userId, refreshKey]);

  // 답변 보관 목록 — 처음 한 번 + 답변 카드에서 북마크가 바뀔 때마다 다시 불러온다
  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    const load = () => {
      fetchBookmarks(userId)
        .then(setBookmarks)
        .catch(() => setBookmarks([]));
    };
    load();
    return subscribeBookmarksChanged(load);
  }, [userId]);

  const handleRemoveBookmark = async (messageId: number) => {
    setBookmarks((previous) => previous.filter((bookmark) => bookmark.message.id !== messageId));
    try {
      await removeBookmark(messageId);
      emitBookmarksChanged();
    } catch {
      // 실패하면 목록을 다시 받아 원상복구
      if (userId !== undefined) {
        fetchBookmarks(userId)
          .then(setBookmarks)
          .catch(() => undefined);
      }
    }
  };

  const normalizedFilter = filter.trim().toLowerCase();
  const visibleConversations = normalizedFilter
    ? conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(normalizedFilter),
      )
    : conversations;

  const initial = user?.name.trim().charAt(0).toUpperCase() ?? 'R';

  return (
    <aside className="bg-fill-neutral-strong flex h-full w-[260px] shrink-0 flex-col shadow-[inset_-1px_0_0_var(--border-strong)]">
      {/* 헤더: 로고 + 서비스명 + 접기 토글 */}
      <div className="flex shrink-0 items-center gap-4 p-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <img src={riidoSymbol} alt="" className="size-8 shrink-0" data-name="riido-symbol" />
          <span className="text-text-primary text-title-20 truncate font-semibold tracking-[-0.4px]">
            Riido AI Guide
          </span>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="사이드바 접기"
          className="group hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 flex size-10 shrink-0 items-center justify-center outline-none focus-visible:ring-3"
        >
          {/* Figma sidebar-left: default=panel-left, hover-close=화살표 있는 panel-left-close */}
          <PanelLeft
            className="text-icon-primary size-6 group-hover:hidden group-focus-visible:hidden"
            strokeWidth={ICON_STROKE}
          />
          <PanelLeftClose
            className="text-icon-primary hidden size-6 group-hover:block group-focus-visible:block"
            strokeWidth={ICON_STROKE}
          />
        </button>
      </div>

      {/* 본문 */}
      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3 pl-3">
        <SidebarItem icon={SquarePen} label="새 채팅" onClick={onNewChat} />
        {/* Figma chat-storage-section-scroll — 답변 보관 (펼치면 sidebar-list-item-1 목록) */}
        <SidebarItem
          icon={Archive}
          label="답변 보관"
          onClick={() => setIsBookmarksOpen((open) => !open)}
          trailing={
            <SectionChevron
              isOpen={isBookmarksOpen}
              label="답변 보관"
              onToggle={() => setIsBookmarksOpen((open) => !open)}
            />
          }
        />
        {isBookmarksOpen &&
          (bookmarks.length === 0 ? (
            <p className="text-text-tertiary text-body-14 px-4 py-2">담아 둔 답변이 없어요.</p>
          ) : (
            /* Figma list: 좌측 32 들여쓰기, 항목 = 1px 선(icon-tertiary) + gap 8 + 40px hover-background(pad 8, radius 12) */
            <ul className="flex flex-col pr-3 pl-5">
              {bookmarks.map((bookmark) => {
                const label = bookmark.message.title || bookmark.conversationTitle;
                return (
                  <li
                    key={bookmark.message.id}
                    className="border-icon-tertiary flex items-center gap-2 border-l"
                  >
                    <div className="group/item hover:bg-fill-surface-strong focus-within:bg-fill-surface-strong rounded-12 flex h-10 min-w-0 flex-1 items-center pr-2">
                      <button
                        type="button"
                        onClick={() => onSelect(bookmark.conversationId)}
                        title={label}
                        className="focus-visible:ring-ring/50 rounded-12 flex h-full min-w-0 flex-1 items-center px-2 text-left outline-none focus-visible:ring-3"
                      >
                        <span className="text-text-secondary text-body-16 min-w-0 flex-1 truncate">
                          {label}
                        </span>
                      </button>
                      {/* Figma sidebar-list-item-1 hover — 우측에 bookmark 아이콘, 누르면 보관 해제 */}
                      <button
                        type="button"
                        aria-label="답변 보관 해제"
                        title="답변 보관 해제"
                        onClick={() => void handleRemoveBookmark(bookmark.message.id)}
                        className="text-icon-tertiary hover:text-icon-primary active:text-icon-tertiary group/bm focus-visible:ring-ring/50 rounded-6 hidden size-6 shrink-0 items-center justify-center transition-colors outline-none group-focus-within/item:flex group-hover/item:flex focus-visible:ring-3"
                      >
                        <BookmarkIcon
                          className="size-6 fill-current group-active/bm:fill-none"
                          strokeWidth={ICON_STROKE}
                        />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ))}

        <SidebarItem
          icon={MessagesSquare}
          label="최근 대화"
          onClick={() => setIsRecentOpen((open) => !open)}
          trailing={
            <SectionChevron
              isOpen={isRecentOpen}
              label="최근 대화"
              onToggle={() => setIsRecentOpen((open) => !open)}
            />
          }
        />

        {isRecentOpen &&
          (conversations.length === 0 ? (
            <p className="text-text-tertiary text-body-14 px-4 py-2">아직 대화가 없어요.</p>
          ) : (
            /* Figma sidebar-list-item-2: 40px, 좌측 1px 선 + gap 8 만큼 들여쓰기, pad 8, radius 12, hover: fill-surface-strong */
            <ul className="flex flex-col pr-3 pl-[9px]">
              {visibleConversations.map((conversation) => {
                const isActive = conversation.conversationId === activeId;
                return (
                  <li key={conversation.conversationId}>
                    <button
                      type="button"
                      onClick={() => onSelect(conversation.conversationId)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 flex h-10 w-full items-center px-2 text-left outline-none focus-visible:ring-3',
                        isActive && 'bg-fill-surface-strong',
                      )}
                    >
                      <span className="text-text-secondary text-body-16 truncate">
                        {conversation.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ))}
      </nav>

      {/* 푸터 */}
      <div className="flex shrink-0 flex-col">
        <div className="pl-3">
          <SidebarItem
            icon={MessageCircleMore}
            label="운영팀에 문의하기"
            onClick={openContactDialog}
          />
        </div>

        <div className="border-border-strong border-t">
          <p className="text-text-primary text-title-16 px-5 pt-[15px] pb-2 font-medium tracking-[-0.4px]">
            설정
          </p>
          <div className="pl-3">
            <SidebarItem
              icon={Moon}
              label="다크모드"
              trailing={
                <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="다크모드" />
              }
            />
          </div>
        </div>

        {/* Figma sidebar-footer-profile — 프로필 줄. 로그아웃은 Figma에 없어서 누르면 뜨는 메뉴에 넣는다 */}
        <div className="border-border-strong border-t px-3 pt-[11px] pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 flex w-full items-center gap-2 text-left outline-none focus-visible:ring-3"
              aria-label="프로필 메뉴"
            >
              <span className="flex size-10 shrink-0 items-center justify-center">
                <span
                  className="bg-background-surface-strong text-text-secondary text-title-16 flex size-8 items-center justify-center rounded-full font-medium tracking-[-0.4px]"
                  aria-hidden
                >
                  {initial}
                </span>
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-text-primary text-button-16 truncate font-medium tracking-wide">
                  {user?.name ?? 'Name'}
                </span>
                <span className="text-text-secondary text-caption-12">Free</span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[236px]">
              <DropdownMenuItem
                onClick={() => {
                  clearCurrentUser();
                  navigate('/login', { replace: true });
                }}
              >
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
