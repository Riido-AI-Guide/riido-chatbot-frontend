import { useEffect, useState } from 'react';
import { Leapfrog } from 'ldrs/react';
import 'ldrs/react/Leapfrog.css';

/** 이 시간이 지나도 답이 없으면 안내 문구를 바꾼다 (Figma 코멘트 #57) */
const DELAY_NOTICE_MS = 8000;

/**
 * Figma `chat-light-loading` — 48px 프로필 + 회색 pill 안에 로딩 문구.
 * 로더: ldrs Leapfrog (디자이너 지정). size/speed는 기본값, 색은 icon-secondary 토큰
 */
export function TypingIndicator() {
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsDelayed(true), DELAY_NOTICE_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-start gap-2" role="status" aria-live="polite">
      <span
        className="bg-background-surface-strong rounded-12 size-12 shrink-0"
        aria-hidden
        data-name="chat-profile"
      />
      <div className="bg-fill-neutral rounded-16 flex h-12 items-center gap-3 px-6">
        <span className="text-text-secondary text-body-14">
          {isDelayed
            ? '자료를 찾아 정리하느라 조금 더 걸리고 있어요…'
            : '이용 가이드 문서를 읽고 있습니다…'}
        </span>
        <span className="flex items-center" aria-hidden>
          <Leapfrog size="24" speed="2.5" color="var(--icon-secondary)" />
        </span>
      </div>
    </div>
  );
}
