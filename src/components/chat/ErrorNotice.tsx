import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';
import { TriangleAlert } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';

/** Figma 네트워크 에러 흐름은 최대 3회 재시도 */
export const MAX_RETRY = 3;

type ErrorNoticeProps = {
  message: string;
  onRetry: () => void;
  /** 재시도 중이면 로더 + "(n/3)" 문구로 바뀐다 */
  isRetrying?: boolean;
  /** 지금까지 재시도한 횟수 */
  retryCount?: number;
};

const BOX =
  'bg-status-danger-soft border-status-danger-border text-status-danger-text w-full rounded-16 border px-[19px] py-[15px]';

/**
 * Figma `network-connection-error` / `network-connection-retry-loading` / `network-connection-failed-3times`
 * 800px, danger-soft + danger-border, radius 16, pad 16/20. 입력창 위 8px.
 * - 기본:   triangle-alert 20 + 제목(Body/16 Medium) + 설명(Body/16 reading) + [다시 시도]
 * - 재시도: ldrs Ring2(18, stroke 2, danger-solid, 트랙 20%) + "연결을 다시 시도하는 중입니다...(n/3)"
 * - 3회 실패: 제목/설명 바뀌고 [다시 시도] + [문제 신고]
 */
export function ErrorNotice({
  message,
  onRetry,
  isRetrying = false,
  retryCount = 0,
}: ErrorNoticeProps) {
  if (isRetrying) {
    return (
      <div role="status" aria-live="polite" className={`${BOX} flex items-center gap-4`}>
        <span className="flex h-6 w-[18px] shrink-0 items-center justify-center" aria-hidden>
          <Ring2
            size="18"
            stroke="2"
            strokeLength="0.25"
            bgOpacity="0.2"
            speed="0.8"
            color="var(--status-danger-solid)"
          />
        </span>
        <p className="text-body-16 font-medium tracking-[-0.4px]">
          연결을 다시 시도하는 중입니다...({Math.min(retryCount, MAX_RETRY)}/{MAX_RETRY})
        </p>
      </div>
    );
  }

  const isFailed = retryCount >= MAX_RETRY;

  return (
    <div role="alert" className={`${BOX} flex items-center gap-2`}>
      {/* Figma messages: 아이콘 20 + gap 16 + contents(fill) / 버튼은 우측 끝 */}
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span className="flex h-6 w-5 shrink-0 items-center justify-center" aria-hidden>
          <TriangleAlert className="text-status-danger-icon size-5" strokeWidth={ICON_STROKE} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-16 font-medium tracking-[-0.4px]">
            {isFailed ? '서버에 연결하지 못했어요.' : '네트워크 연결이 불안정해요.'}
          </p>
          <p className="text-body-16-reading">
            {isFailed ? '네트워크 상태를 확인해 주세요.' : message || '잠시 후 다시 시도해 주세요.'}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="bg-status-danger-solid text-status-danger-on-solid hover:bg-status-danger-solid-hover focus-visible:ring-ring/50 rounded-12 text-body-16 h-10 px-4 font-medium tracking-[0.4px] transition-colors outline-none focus-visible:ring-3"
        >
          다시 시도
        </button>
        {isFailed && (
          // TODO: 문제 신고 — 운영팀 문의 폼 붙기 전까지 자리만
          <button
            type="button"
            disabled
            className="bg-background-canvas border-status-danger-border text-status-danger-text rounded-12 text-body-16 h-10 border px-4 font-medium tracking-[0.4px] disabled:cursor-not-allowed"
          >
            문제 신고
          </button>
        )}
      </div>
    </div>
  );
}
