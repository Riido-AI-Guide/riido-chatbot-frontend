import { request } from '@/api/client';
import type { MessageFeedback } from '@/api/feedback';
import { getCurrentUser } from '@/lib/auth';

export type Role = 'user' | 'assistant';

/**
 * 답변의 형태. 메시지 버블 레이아웃을 고르는 데 쓴다.
 * 서버가 목록에 없는 값을 보내면 화면은 평평한 fallback 레이아웃으로 떨어진다.
 */
export type AnswerType =
  'concept' | 'step' | 'judgement' | 'troubleshoot' | 'explore' | 'no_answer';

/** 답변이 근거로 삼은 가이드 문서 한 곳 */
export type Source = {
  /** 문서 식별자 (예: 'guide/휴지통/복구-및-영구-삭제') */
  docId: string;
  /** 사람이 읽는 문서 위치 (예: '휴지통 > 복구 및 영구 삭제') */
  section: string;
  /** 가이드 문서 원문 주소. 없으면 링크 없이 텍스트만 보여준다. */
  url?: string;
};

/** 구조화된 답변의 한 덩어리 */
export type AnswerSection = {
  /** 섹션 제목 (예: '핵심답변') */
  label: string;
  /** 섹션 본문. 마크다운일 수 있다. */
  text: string;
  /** 이 섹션의 근거 문서. 없을 수 있다. */
  sources?: Source[];
};

export type Message = {
  id: number;
  role: Role;
  /** sections가 없을 때 화면에 그리는 평문(마크다운) fallback */
  content: string;
  /** assistant 답변의 제목. user 메시지는 null */
  title?: string | null;
  /** 답변 형태. user 메시지는 null */
  answerType?: AnswerType | null;
  /** 구조화된 답변. user 메시지나 구버전 응답에서는 비어 있다 */
  sections?: AnswerSection[];
  /** AI가 이 턴에 붙인 식별자. 평가를 AI 품질 로그와 대조할 때 쓴다 */
  qnaUuid?: string | null;
  /** 이 답변이 답한 질문 메시지 id. 질문 메시지는 null */
  questionId?: number | null;
  /** 이미 남긴 평가. 평가 전이면 null */
  feedback?: MessageFeedback | null;
  /** 담아 둔(북마크한) 메시지인지 */
  bookmarked?: boolean;
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

/** 대화 목록의 한 줄 (본문 없음) */
export type ConversationSummary = {
  conversationId: number;
  title: string;
  createdAt: string;
};

/** 내 대화 목록, 최신순 */
export function fetchConversations(
  userId: number,
  signal?: AbortSignal,
): Promise<ConversationSummary[]> {
  return request<ConversationSummary[]>(`/conversations?userId=${userId}`, { signal });
}

/** 대화 하나를 메시지까지 포함해 조회 */
export function fetchConversation(
  conversationId: number,
  signal?: AbortSignal,
): Promise<ConversationResponse> {
  return request<ConversationResponse>(`/conversations/${conversationId}`, { signal });
}

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

/**
 * 기존 대화에 이어서 질문한다. 백엔드가 이전 대화를 AI에 함께 보내
 * 대명사·생략("그럼 그거는?")을 풀어서 답한다.
 */
export function appendMessage(
  conversationId: number,
  query: string,
  signal?: AbortSignal,
): Promise<ConversationResponse> {
  const body: CreateConversationRequest = { query };

  return request<ConversationResponse>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(body),
    signal,
  });
}
