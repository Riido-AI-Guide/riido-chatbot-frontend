import { useState } from 'react';
import { useNavigate } from 'react-router';

import riidoSymbol from '@/assets/brand/riido-symbol-teal.png';
import { toUserMessage } from '@/api/client';
import { loginUser } from '@/api/users';
import { saveCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

/**
 * Figma `log in` (2238:11898)
 * canvas-strong 배경 위에 700×372 카드(radius 24, shadow-xl).
 * 좌: 이미지 영역(324×352, radius 16) / 우: 로고 + 로그인 + 닉네임 입력 + 버튼(270px)
 * ※ Figma에 비밀번호 칸은 없다. 닉네임만 받는다.
 */
export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

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
    <div className="bg-background-canvas-strong flex h-screen items-center justify-center px-4">
      <div className="bg-background-surface rounded-24 flex w-full max-w-[700px] gap-6 p-2.5 shadow-xl">
        {/* TODO: 디자이너 일러스트 받으면 교체 (324×352) */}
        <div
          className="bg-background-surface-soft rounded-16 hidden h-[352px] w-[324px] shrink-0 md:block"
          aria-hidden
        />

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col items-center justify-center gap-10 py-6 pr-8 pl-2"
        >
          <div className="flex flex-col items-center gap-4">
            <img src={riidoSymbol} alt="Riido" className="size-10 shrink-0" />
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-text-primary text-title-20 font-semibold tracking-tight">
                로그인
              </h1>
              <p className="text-text-secondary text-body-16">닉네임을 입력하고 로그인해 주세요.</p>
            </div>
          </div>

          <div className="flex w-full max-w-[270px] flex-col gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="닉네임을 입력해 주세요."
              aria-label="닉네임"
              className={cn(
                'bg-background-surface-soft text-text-primary placeholder:text-text-tertiary rounded-12 text-body-16 h-[50px] w-full px-5 outline-none',
                'focus-visible:ring-ring/50 focus-visible:ring-3',
              )}
            />
            {error && <p className="text-status-danger-text text-caption-12">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'rounded-12 text-button-16 flex h-[50px] w-full max-w-[270px] items-center justify-center font-medium tracking-wide transition-colors outline-none',
              'focus-visible:ring-ring/50 focus-visible:ring-3',
              canSubmit
                ? 'bg-button-primary text-primary-on-solid hover:bg-primary-solid-strong'
                : 'bg-button-neutral text-text-tertiary cursor-not-allowed',
            )}
          >
            {isSubmitting ? '로그인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
