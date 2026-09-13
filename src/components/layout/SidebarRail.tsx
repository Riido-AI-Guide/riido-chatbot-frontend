import {
  Archive,
  MessageCircleMore,
  MessagesSquare,
  Moon,
  PanelLeftOpen,
  Settings,
  SquarePen,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import riidoSymbol from '@/assets/brand/riido-symbol-teal.png';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { clearCurrentUser, getCurrentUser } from '@/lib/auth';
import { openContactDialog } from '@/lib/contact-events';
import { ICON_STROKE } from '@/lib/icon';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

type RailButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

function RailButton({ icon: Icon, label, onClick, disabled = false, className }: RailButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 my-1 flex size-10 shrink-0 items-center justify-center outline-none focus-visible:ring-3',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <Icon className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
    </button>
  );
}

type SidebarRailProps = {
  onNewChat: () => void;
  onExpand: () => void;
};

/**
 * Figma `entry-screen-sidebar-sm` — 접힌 사이드바 (64px 아이콘 레일, fill-neutral-strong + border-strong).
 * 헤더 64(로고 32, hover 시 펼치기 토글) / sidebar-small-icon 48px 줄(pad 4/12, 40 박스 radius 12, hover: fill-surface-strong)
 * 하단 문의·설정, 그 아래 border-top + pad 12 프로필(32 원형).
 */
export function SidebarRail({ onNewChat, onExpand }: SidebarRailProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const user = getCurrentUser();
  const initial = user?.name.trim().charAt(0).toUpperCase() ?? 'R';

  return (
    <aside className="bg-fill-neutral-strong flex h-full w-16 shrink-0 flex-col items-center shadow-[inset_-1px_0_0_var(--border-strong)]">
      {/* 로고 자리 — 마우스 올리면 펼치기 아이콘으로 바뀐다 (Prototype State sm-header-logo/toggle-visible) */}
      <div className="flex h-16 shrink-0 items-center justify-center">
        <button
          type="button"
          onClick={onExpand}
          aria-label="사이드바 펼치기"
          className="group hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 flex size-10 items-center justify-center outline-none focus-visible:ring-3"
        >
          <img
            src={riidoSymbol}
            alt=""
            className="size-8 group-hover:hidden group-focus-visible:hidden"
            data-name="riido-symbol"
          />
          <PanelLeftOpen
            className="text-icon-primary hidden size-6 group-hover:block group-focus-visible:block"
            strokeWidth={ICON_STROKE}
            aria-hidden
          />
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center py-3">
        <RailButton icon={SquarePen} label="새 채팅" onClick={onNewChat} />
        {/* TODO: 답변 보관 — API 붙기 전까지 비활성 */}
        <RailButton icon={Archive} label="답변 보관" disabled />
        <RailButton icon={MessagesSquare} label="최근 대화" onClick={onExpand} />
      </nav>

      <div className="flex flex-col items-center">
        <RailButton
          icon={MessageCircleMore}
          label="운영팀에 문의하기"
          onClick={openContactDialog}
        />

        <Popover>
          <PopoverTrigger
            aria-label="설정"
            title="설정"
            className="hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 my-1 flex size-10 items-center justify-center outline-none focus-visible:ring-3"
          >
            <Settings className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
          </PopoverTrigger>
          <PopoverContent side="right" align="end" className="w-[236px] p-2">
            <p className="text-text-primary text-title-16 px-2 pt-1 pb-2 font-medium tracking-[-0.4px]">
              설정
            </p>
            <div className="flex h-10 items-center gap-2 pr-1">
              <span className="flex size-10 shrink-0 items-center justify-center" aria-hidden>
                <Moon className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
              </span>
              <span className="text-text-primary text-title-16 flex-1 font-medium tracking-[-0.4px]">
                다크모드
              </span>
              <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="다크모드" />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Figma sidebar-small-avatar-wrapper — border-top + pad 12 */}
      <div className="border-border-strong flex w-full items-center justify-center border-t px-3 pt-[11px] pb-3">
        {/* Figma avatar-placeholder 40×42 (pad 1/0) */}
        <div className="flex h-[42px] items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="프로필 메뉴"
              className="hover:bg-fill-surface-strong focus-visible:ring-ring/50 rounded-12 flex size-10 items-center justify-center outline-none focus-visible:ring-3"
            >
              <span
                className="bg-background-surface-strong text-text-secondary text-title-16 flex size-8 items-center justify-center rounded-full font-medium tracking-[-0.4px]"
                aria-hidden
              >
                {initial}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-[236px]">
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
