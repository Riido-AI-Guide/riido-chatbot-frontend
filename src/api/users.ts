import { request } from '@/api/client';

export type LoginResponse = {
  id: number;
  name: string;
  /** true면 이번에 처음 가입된 사용자 */
  isNew: boolean;
};

export type User = {
  id: number;
  name: string;
  /** UTC ISO-8601 초 단위 문자열 */
  createdAt: string;
};

/** 이름으로 로그인한다. 없는 이름이면 서버가 가입시킨 뒤 로그인한다. */
export function loginUser(name: string): Promise<LoginResponse> {
  return request<LoginResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

/** 가입된 멤버 전체 목록 */
export function fetchUsers(): Promise<User[]> {
  return request<User[]>('/users');
}
