import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { getCurrentUser } from '@/lib/auth';

/** 로그인하지 않은 사용자를 로그인 화면으로 돌려보내는 문지기 */
export function RequireAuth({ children }: { children: ReactNode }) {
  if (!getCurrentUser()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
