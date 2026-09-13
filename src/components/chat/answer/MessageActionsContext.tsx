import { createContext, useContext } from 'react';

import type { FeedbackRating, FeedbackReasonCode, MessageFeedback } from '@/api/feedback';

/**
 * 답변 카드 하단 액션(복사·담기·좋아요·싫어요)이 쓰는 값과 콜백.
 * MessageBubble이 제공하고 AnswerFooter가 소비한다 — 답변 레이아웃 7종에 props를 다 뚫지 않으려고 컨텍스트로 둔다.
 */
export type MessageActions = {
  /** 서버 메시지 id. 아직 서버에 없는 메시지면 null (액션 비활성) */
  messageId: number | null;
  /** 복사 버튼이 클립보드에 넣을 평문 */
  copyText: string;
  bookmarked: boolean;
  feedback: MessageFeedback | null;
  onToggleBookmark: (bookmarked: boolean) => Promise<void>;
  onRate: (rating: FeedbackRating, reason?: FeedbackReasonCode | null) => Promise<MessageFeedback>;
  onClearRating: () => Promise<void>;
};

const MessageActionsContext = createContext<MessageActions | null>(null);

export const MessageActionsProvider = MessageActionsContext.Provider;

export function useMessageActions(): MessageActions | null {
  return useContext(MessageActionsContext);
}
