/**
 * lib/auth.ts — 로그인 상태 보관
 *
 * 로그인한 사용자를 localStorage에 저장해 새로고침해도 유지한다.
 * 브라우저 설정에 따라 localStorage 접근이 막힐 수 있어 모든 접근을 try/catch로 감싼다.
 */

export type CurrentUser = {
  id: number;
  name: string;
};

const STORAGE_KEY = 'riido.currentUser';

export function getCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CurrentUser;
    if (typeof parsed?.id !== 'number' || typeof parsed?.name !== 'string') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: CurrentUser): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // 저장 실패 시 로그인 유지만 안 될 뿐, 동작은 계속된다
  }
}

export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 무시
  }
}
