import { request } from '@/api/client';

export type FeedbackRating = 'GOOD' | 'BAD';

/** 상세사유 코드. 문구는 서버(/feedback-reasons)가 내려준다 */
export type FeedbackReasonCode =
  | 'ACCURATE'
  | 'EASY_TO_UNDERSTAND'
  | 'WANTED_ANSWER'
  | 'EASY_TO_FOLLOW'
  | 'SUFFICIENT'
  | 'USEFUL_LINK'
  | 'OFF_TOPIC'
  | 'INACCURATE'
  | 'NOT_FOUND'
  | 'INSUFFICIENT'
  | 'TOO_DIFFICULT'
  | 'BROKEN_LINK';

export type FeedbackReason = {
  code: FeedbackReasonCode;
  label: string;
  rating: FeedbackRating;
};

/** 저장된 평가. 대화 상세의 메시지마다 실려 오기도 한다 */
export type MessageFeedback = {
  messageId: number;
  qnaUuid: string | null;
  rating: FeedbackRating;
  reason: FeedbackReasonCode | null;
  reasonLabel: string | null;
  updatedAt: string;
};

export type MessageFeedbackRequest = {
  rating: FeedbackRating;
  reason?: FeedbackReasonCode | null;
};

/**
 * 좋아요/싫어요 저장. 상세사유를 고른 뒤 같은 요청을 다시 보내면 덮어쓴다.
 * (PUT /messages/{id}/feedback)
 */
export function saveFeedback(
  messageId: number,
  body: MessageFeedbackRequest,
  signal?: AbortSignal,
): Promise<MessageFeedback> {
  return request<MessageFeedback>(`/messages/${messageId}/feedback`, {
    method: 'PUT',
    body: JSON.stringify(body),
    signal,
  });
}

/** 평가 취소 (DELETE → 204) */
export function deleteFeedback(messageId: number, signal?: AbortSignal): Promise<void> {
  return request<void>(`/messages/${messageId}/feedback`, { method: 'DELETE', signal });
}

/** 상세사유 선택지. rating으로 좁힌다 */
export function fetchFeedbackReasons(
  rating: FeedbackRating,
  signal?: AbortSignal,
): Promise<FeedbackReason[]> {
  return request<FeedbackReason[]>(`/feedback-reasons?rating=${rating}`, { signal });
}
