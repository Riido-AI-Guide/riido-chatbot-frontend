import {
  Archive,
  ChevronDown,
  MessageCircleMore,
  MessagesSquare,
  Moon,
  PanelLeft,
  SquarePen,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

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
};

/**
 * Figma `sidebar` (entry-screen-sidebar-lg 기준, 260px)
 * 헤더(로고+토글) / 본문(새 채팅, 답변 보관, 최근 대화) / 푸터(문의, 설정, 프로필)
 */
export function Sidebar({ activeId, refreshKey, onSelect, onNewChat, onCollapse }: SidebarProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
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

  const initial = user?.name.trim().charAt(0).toUpperCase() ?? 'R';

  return (
    <aside className="bg-fill-neutral-strong border-border-strong flex h-full w-[260px] shrink-0 flex-col border-r">
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
          className="hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 flex size-10 shrink-0 items-center justify-center outline-none focus-visible:ring-3"
        >
          <PanelLeft className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
        </button>
      </div>

      {/* 본문 */}
      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3 pl-3">
        <SidebarItem icon={SquarePen} label="새 채팅" onClick={onNewChat} />
        {/* TODO: 답변 보관(북마크) — 저장/조회 API 붙기 전까지 비활성 */}
        <SidebarItem icon={Archive} label="답변 보관" disabled />

        <SidebarItem
          icon={MessagesSquare}
          label="최근 대화"
          onClick={() => setIsRecentOpen((open) => !open)}
          trailing={
            <button
              type="button"
              onClick={() => setIsRecentOpen((open) => !open)}
              aria-label={isRecentOpen ? '최근 대화 접기' : '최근 대화 펼치기'}
              aria-expanded={isRecentOpen}
              className="rounded-6 focus-visible:ring-ring/50 flex size-8 shrink-0 items-center justify-center outline-none focus-visible:ring-3"
            >
              <ChevronDown
                className={cn(
                  'text-icon-secondary size-5 transition-transform',
                  !isRecentOpen && '-rotate-90',
                )}
                strokeWidth={ICON_STROKE}
                aria-hidden
              />
            </button>
          }
        />

        {isRecentOpen &&
          (conversations.length === 0 ? (
            <p className="text-text-tertiary text-body-14 px-4 py-2">아직 대화가 없어요.</p>
          ) : (
            /* Figma sidebar-list-item-2: 40px, 좌측 1px 선 + gap 8 만큼 들여쓰기, pad 8, radius 12, hover: fill-surface-strong */
            <ul className="flex flex-col pr-3 pl-[9px]">
              {conversations.map((conversation) => {
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
          {/* TODO: 운영팀 문의 폼(이메일/유형/내용) — 문의 API 붙기 전까지 비활성 */}
          <SidebarItem icon={MessageCircleMore} label="운영팀에 문의하기" disabled />
        </div>

        <div className="border-border-strong border-t">
          <p className="text-text-primary text-title-16 px-5 pt-4 pb-2 font-medium tracking-[-0.4px]">
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
        <div className="border-border-strong border-t p-3">
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
