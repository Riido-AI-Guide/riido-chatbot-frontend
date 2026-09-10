import { cn } from '@/lib/utils';

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

/**
 * Figma `switch` (706:93) — 36×20 토글.
 * 설정/알림 항목의 On·Off 전환에 쓴다.
 */
export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors outline-none',
        'focus-visible:ring-ring/50 focus-visible:ring-3',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary-solid' : 'bg-border-strong',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'bg-gray-0 shadow-s size-4 rounded-full transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  );
}
