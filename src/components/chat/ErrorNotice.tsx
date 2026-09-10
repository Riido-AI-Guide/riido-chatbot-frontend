import { TriangleAlert } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';

type ErrorNoticeProps = {
  message: string;
  onRetry: () => void;
};

/**
 * Figma `chat-light-network-error` — 입력창 위에 뜨는 danger 토스트.
 * danger-soft 배경 + danger-border, 제목(Body/14 Medium) + 설명(Caption/12), 우측 "다시 시도" 버튼.
 */
export function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="bg-status-danger-soft border-status-danger-border rounded-12 flex items-center gap-3 border px-4 py-3"
    >
      <TriangleAlert
        className="text-status-danger-icon size-5 shrink-0"
        strokeWidth={ICON_STROKE}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-status-danger-text text-body-14 font-medium">
          네트워크 연결이 불안정해요.
        </p>
        <p className="text-status-danger-text text-caption-12">
          {message || '잠시 후 다시 시도해 주세요.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="bg-status-danger-solid text-status-danger-button-text hover:bg-status-danger-solid-hover focus-visible:ring-ring/50 rounded-6 text-body-14 h-8 shrink-0 px-3 font-medium transition-colors outline-none focus-visible:ring-3"
      >
        다시 시도
      </button>
    </div>
  );
}
