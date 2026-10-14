import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router';

import { loginUser } from '@/api/users';
import { GUEST_NAME, getCurrentUser, isLoggedOut, saveCurrentUser } from '@/lib/auth';

// StrictMode에서 effect가 두 번 돌아도 게스트 로그인 요청은 한 번만 보낸다
let guestLogin: Promise<void> | null = null;

function loginAsGuest(): Promise<void> {
  guestLogin ??= loginUser(GUEST_NAME)
    .then((user) => saveCurrentUser({ id: user.id, name: user.name }))
    .finally(() => {
      guestLogin = null;
    });
  return guestLogin;
}

/**
 * 로그인 사용자가 있어야 들어갈 수 있는 화면의 문지기.
 * 사용자가 없으면 'guest'로 자동 로그인하고, 직접 로그아웃한 경우에만 로그인 화면으로 보낸다.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'ready' | 'pending' | 'login'>(() => {
    if (getCurrentUser()) return 'ready';
    return isLoggedOut() ? 'login' : 'pending';
  });

  useEffect(() => {
    if (status !== 'pending') return;
    let cancelled = false;
    loginAsGuest()
      .then(() => !cancelled && setStatus('ready'))
      // 게스트 로그인에 실패하면 로그인 화면에서 직접 시도할 수 있게 한다
      .catch(() => !cancelled && setStatus('login'));
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === 'login') {
    return <Navigate to="/login" replace />;
  }
  if (status === 'pending') {
    return null;
  }
  return <>{children}</>;
}
