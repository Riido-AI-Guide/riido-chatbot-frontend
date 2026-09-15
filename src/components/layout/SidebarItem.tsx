import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { ICON_STROKE } from '@/lib/icon';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  /**
   * 우측 끝에 붙는 요소 (토글 스위치, 화살표 등).
   * 버튼 밖에 형제로 놓여서 trailing 자체가 버튼이어도 클릭이 겹치지 않는다.
   */
  trailing?: ReactNode;
  className?: string;
};

/**
 * Figma `sidebar-section-list-title` — 48px 줄(pad 4/0/4/12) 안에 40px hover-background(radius 12).
 * 좌측 40×40 아이콘 박스(안에 24px 아이콘) + Title/16(ls -0.4) 텍스트. hover: fill-surface-strong(#E8EBED / #272F35)
 */
export function SidebarItem({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  trailing,
  className,
}: SidebarItemProps) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center" aria-hidden>
        <Icon className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
      </span>
      <span className="text-text-primary text-title-16 min-w-0 flex-1 truncate font-medium tracking-[-0.4px]">
        {label}
      </span>
    </>
  );

  return (
    <div
      className={cn(
        // Figma: 줄 자체가 236px(=248-12) hover 배경, chevron·스위치는 그 오른쪽 끝에 딱 붙는다
        'group/row rounded-12 my-1 mr-3 flex h-10 items-center transition-colors',
        onClick && 'has-[button:hover]:bg-fill-surface-strong',
        active && 'bg-fill-surface-strong',
        disabled && 'opacity-50',
        className,
      )}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'rounded-12 flex h-full min-w-0 flex-1 items-center text-left outline-none',
            'focus-visible:ring-ring/50 focus-visible:ring-3',
            'disabled:cursor-not-allowed',
          )}
        >
          {content}
        </button>
      ) : (
        // onClick이 없으면 (예: 다크모드 줄 — 스위치만 동작) 클릭되지 않는 라벨로 그린다
        <div className="flex h-full min-w-0 flex-1 items-center">{content}</div>
      )}
      {trailing}
    </div>
  );
}
