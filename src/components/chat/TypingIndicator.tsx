import { useEffect, useState } from 'react';

import { ChatProfile } from '@/components/chat/ChatProfile';

/** 이 시간이 지나도 답이 없으면 Figma delay-reponse 문구로 바꾼다 */
const DELAY_NOTICE_MS = 8000;

/**
 * Figma `chat-light-loading` › ai-message › answer-thinking
 * 48px 프로필(icon-tertiary) + gap 8 + 56px pill(fill-neutral-strong, border-strong, radius 20, pad 16/24)
 * 문구는 Body/16 위로 밝은 띠가 지나가는 shimmer (loader-text shimmer).
 * 점 로더(Leapfrog)는 여기 말고 입력창 위에 따로 뜬다 → <AnswerLoader />
 */
export function TypingIndicator() {
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsDelayed(true), DELAY_NOTICE_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-start gap-2" role="status" aria-live="polite">
      <ChatProfile />
      <div
        className="bg-fill-neutral-strong border-border-strong flex h-14 items-center rounded-[20px] border px-[23px] py-[15px]"
        data-name="answer-thinking"
      >
        <span className="text-shimmer text-body-16">
          {isDelayed
            ? '답변이 평소보다 오래 걸리고 있어요. 조금만 기다려 주세요.'
            : '이용 가이드 문서를 읽고 있습니다…'}
        </span>
      </div>
    </div>
  );
}
