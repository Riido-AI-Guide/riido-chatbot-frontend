import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { toUserMessage } from '@/api/client';
import { loginUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import { saveCurrentUser } from '@/lib/auth';

const FIELD_CLASS =
  'bg-muted placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-12 w-full rounded-2xl border border-transparent px-4 text-base outline-none focus-visible:ring-3';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  // 화면에만 있는 비밀번호 칸. 서버로 보내지 않고 로그인 조건에도 쓰지 않는다.
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = name.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const user = await loginUser(trimmed);
      saveCurrentUser({ id: user.id, name: user.name });
      navigate('/', { replace: true });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center px-4">
      <div className="border-border bg-card w-full max-w-[400px] rounded-3xl border p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-4">
              {/* 프로필 사진 자리 — 업로드 기능이 붙기 전까지 원형 자리만 잡아 둔다 */}
              <div className="bg-muted size-16 shrink-0 rounded-full" aria-hidden />
              <div className="flex w-full flex-col gap-1 text-center">
                <h1 className="text-xl font-semibold">리도 AI 가이드</h1>
                <p className="text-muted-foreground text-base leading-normal">
                  이름을 입력하면 시작할 수 있어요. 처음 온 이름이면 자동으로 가입돼요.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                placeholder="이름"
                aria-label="이름"
                className={FIELD_CLASS}
              />

              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  placeholder="비밀번호"
                  aria-label="비밀번호"
                  className={`${FIELD_CLASS} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                  aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 rounded outline-offset-2"
                >
                  {isPasswordVisible ? (
                    <Eye className="size-5" aria-hidden />
                  ) : (
                    <EyeOff className="size-5" aria-hidden />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={!trimmed || isSubmitting}
              className="h-12 w-full rounded-2xl text-base"
            >
              {isSubmitting ? '로그인 중…' : '로그인'}
            </Button>
            {error && <p className="text-destructive text-center text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
