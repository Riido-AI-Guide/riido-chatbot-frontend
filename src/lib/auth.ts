/**
 * lib/auth.ts — 로그인 상태 보관
 *
 * 로그인한 사용자를 localStorage에 저장해 새로고침해도 유지한다.
 * 첫 진입 시에는 'guest' 사용자로 자동 로그인하고, 사용자가 직접 로그아웃했을 때만
 * 로그인 화면을 보여 준다 (로그아웃 표시도 localStorage에 남겨 새로고침해도 유지).
 * 브라우저 설정에 따라 localStorage 접근이 막힐 수 있어 모든 접근을 try/catch로 감싼다.
 */

export type CurrentUser = {
  id: number;
  name: string;
};

const STORAGE_KEY = 'riido.currentUser';
const LOGGED_OUT_KEY = 'riido.loggedOut';

/** 기본 사용자 이름 — 로그인 화면 없이 이 이름으로 자동 로그인한다 */
export const GUEST_NAME = 'guest';

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
    localStorage.removeItem(LOGGED_OUT_KEY);
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

/** 로그아웃 — 사용자 정보를 지우고, 다음 진입 때 게스트 자동 로그인 대신 로그인 화면을 띄우게 표시한다 */
export function logout(): void {
  clearCurrentUser();
  try {
    localStorage.setItem(LOGGED_OUT_KEY, '1');
  } catch {
    // 무시
  }
}

/** 사용자가 직접 로그아웃한 상태인지 */
export function isLoggedOut(): boolean {
  try {
    return localStorage.getItem(LOGGED_OUT_KEY) === '1';
  } catch {
    return false;
  }
}
