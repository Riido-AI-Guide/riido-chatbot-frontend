import { request } from '@/api/client';
import { getCurrentUser } from '@/lib/auth';

export type Role = 'user' | 'assistant';

export type Message = {
  id: number;
  role: Role;
  /** assistant의 경우 마크다운 문자열 */
  content: string;
  /** UTC ISO-8601 초 단위 문자열 (예: '2026-08-24T14:20:01Z') */
  createdAt: string;
};

export type Conversation = {
  conversationId: number;
  /** 첫 질문 문자열(최대 200자). 대화 목록의 제목으로 그대로 쓴다. */
  title: string;
  /** 항상 id 오름차순 */
  messages: Message[];
};

export type ConversationResponse = Conversation;

export type CreateConversationRequest = {
  query: string;
  /** 로그인한 사용자 id. 백엔드가 대화의 작성자로 기록한다 */
  userId?: number;
};

/**
 * 새 대화를 만들고 AI 답변까지 받아 온다.
 * 응답의 messages는 user 1건 + assistant 1건이다.
 */
export function createConversation(
  query: string,
  signal?: AbortSignal,
): Promise<ConversationResponse> {
  const body: CreateConversationRequest = {
    query,
    userId: getCurrentUser()?.id,
  };

  return request<ConversationResponse>('/conversations', {
    method: 'POST',
    body: JSON.stringify(body),
    signal,
  });
}

// TODO(backend): 같은 대화에 이어서 질문하는 POST /conversations/{id}/messages가 생기면
// 아래 형태로 추가하고, useChat의 requestReply에서 conversationId 유무로 분기하면 된다.
//
// export function appendMessage(
//   conversationId: number,
//   query: string,
//   signal?: AbortSignal,
// ): Promise<ConversationResponse> {
//   const body: CreateConversationRequest = { query };
//   return request<ConversationResponse>(`/conversations/${conversationId}/messages`, {
//     method: 'POST',
//     body: JSON.stringify(body),
//     signal,
//   });
// }
