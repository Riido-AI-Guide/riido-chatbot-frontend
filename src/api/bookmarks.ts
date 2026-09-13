import { request } from '@/api/client';
import type { Message } from '@/api/conversations';

/** 담아 둔 메시지 한 건. 어느 대화에서 담았는지까지 같이 온다 */
export type Bookmark = {
  conversationId: number;
  conversationTitle: string;
  bookmarkedAt: string;
  message: Message;
};

export type MessageBookmarkResponse = {
  messageId: number;
  bookmarkedAt: string;
};

/** 답변 담기 (PUT). 이미 담긴 메시지에 다시 보내도 같은 결과 */
export function addBookmark(
  messageId: number,
  signal?: AbortSignal,
): Promise<MessageBookmarkResponse> {
  return request<MessageBookmarkResponse>(`/messages/${messageId}/bookmark`, {
    method: 'PUT',
    signal,
  });
}

/** 담기 취소 (DELETE → 204) */
export function removeBookmark(messageId: number, signal?: AbortSignal): Promise<void> {
  return request<void>(`/messages/${messageId}/bookmark`, { method: 'DELETE', signal });
}

/** 내가 담아 둔 메시지 목록, 최근에 담은 순 */
export function fetchBookmarks(userId: number, signal?: AbortSignal): Promise<Bookmark[]> {
  return request<Bookmark[]>(`/bookmarks?userId=${userId}`, { signal });
}
