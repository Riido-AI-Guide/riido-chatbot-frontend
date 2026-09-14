import {
  ArrowRight,
  Bookmark,
  Check,
  Copy,
  ThumbsDown,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import type { FeedbackRating } from '@/api/feedback';
import { FeedbackPopover } from '@/components/chat/answer/FeedbackPopover';
import { useMessageActions } from '@/components/chat/answer/MessageActionsContext';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { ICON_STROKE } from '@/lib/icon';
import { openContactDialog } from '@/lib/contact-events';
import { cn } from '@/lib/utils';

/** 복사 완료 표시(check 아이콘) 유지 시간 */
const COPIED_MS = 1500;

/** Clipboard API가 막힌 환경(HTTP, 권한 없음)에선 숨긴 textarea + execCommand로 대신 복사한다 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    let ok: boolean;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    textarea.remove();
    return ok;
  }
}

type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  /** Figma state=pressed — 채운 아이콘 */
  pressed?: boolean;
  /** 채우진 않고 색만 진하게 (복사 완료 check) */
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

/** Figma copy/save/like/dislike — 32px radius 10, hover: fill-surface-strong, pressed: 채운 아이콘 */
function ActionButton({
  icon: Icon,
  label,
  pressed = false,
  active = false,
  disabled = false,
  onClick,
  className,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'hover:bg-fill-surface-strong focus-visible:ring-ring/50 flex size-8 items-center justify-center rounded-[10px] transition-colors outline-none focus-visible:ring-3',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Figma: 기본 icon-tertiary, pressed는 icon-primary로 채움
        pressed || active ? 'text-icon-primary' : 'text-icon-tertiary',
        className,
      )}
    >
      <Icon
        className="size-6"
        strokeWidth={ICON_STROKE}
        fill={pressed ? 'currentColor' : 'none'}
        aria-hidden
      />
    </button>
  );
}

/**
 * Figma answer-footer — 답변 카드 하단 액션 줄 (40px).
 * 좌: copy / save / like / dislike (32px radius 10) — 서버 메시지가 아니면(낙관적) 비활성
 * 우: contact-team-button 40px radius 12, pad 8/10/8/16, Body/16 text-secondary + arrow-right (문의 API 전까지 자리만)
 */
export function AnswerFooter() {
  const actions = useMessageActions();
  const [isCopied, setIsCopied] = useState(false);
  const [openRating, setOpenRating] = useState<FeedbackRating | null>(null);

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timer = setTimeout(() => setIsCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const isReady = actions !== null && actions.messageId !== null;
  const rating = actions?.feedback?.rating ?? null;

  const handleCopy = async () => {
    if (!actions) {
      return;
    }
    if (await copyToClipboard(actions.copyText)) {
      setIsCopied(true);
    }
  };

  const handleRate = async (next: FeedbackRating) => {
    if (!actions) {
      return;
    }
    if (rating === next) {
      // 같은 버튼을 다시 누르면 평가 취소
      setOpenRating(null);
      await actions.onClearRating().catch(() => undefined);
      return;
    }
    // 먼저 rating만 저장하고, 상세사유는 팝오버에서 고르면 덮어쓴다
    await actions.onRate(next).catch(() => undefined);
    setOpenRating(next);
  };

  const ratingButton = (value: FeedbackRating, icon: LucideIcon, label: string) => (
    <Popover
      open={openRating === value}
      onOpenChange={(open) => setOpenRating(open ? value : null)}
    >
      <PopoverTrigger
        render={
          <ActionButton
            icon={icon}
            label={label}
            // 팝오버가 열려 있는 동안도 pressed — 평가 저장 API가 늦거나 실패해도 Figma처럼 바로 채워진다
            pressed={rating === value || openRating === value}
            disabled={!isReady}
            onClick={() => void handleRate(value)}
          />
        }
      />
      {openRating === value && actions && (
        <FeedbackPopover
          rating={value}
          selected={actions.feedback?.reason ?? null}
          onSend={async (reason) => {
            await actions.onRate(value, reason);
          }}
          onClose={() => setOpenRating(null)}
        />
      )}
    </Popover>
  );

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <ActionButton
          icon={isCopied ? Check : Copy}
          label={isCopied ? '복사됨' : '답변 복사'}
          active={isCopied}
          disabled={!actions}
          onClick={() => void handleCopy()}
        />
        <ActionButton
          icon={Bookmark}
          label={actions?.bookmarked ? '답변 보관 해제' : '답변 보관'}
          pressed={actions?.bookmarked ?? false}
          disabled={!isReady}
          onClick={() => void actions?.onToggleBookmark(!actions.bookmarked).catch(() => undefined)}
        />
        {ratingButton('GOOD', ThumbsUp, '좋아요')}
        {ratingButton('BAD', ThumbsDown, '싫어요')}
      </div>

      <button
        type="button"
        onClick={openContactDialog}
        className="text-text-secondary hover:bg-fill-hover active:bg-fill-press focus-visible:ring-ring/50 rounded-12 text-body-16 flex h-10 shrink-0 items-center gap-1 pr-2.5 pl-4 transition-colors outline-none focus-visible:ring-3"
      >
        운영팀에 문의하기
        <ArrowRight className="size-6" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
