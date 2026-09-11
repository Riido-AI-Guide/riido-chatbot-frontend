import { useState } from 'react';
import { useNavigate } from 'react-router';

import loginDark from '@/assets/brand/login-dark.jpg';
import loginLight from '@/assets/brand/login-light.jpg';
import riidoSymbol from '@/assets/brand/riido-symbol-teal.png';
import { toUserMessage } from '@/api/client';
import { loginUser } from '@/api/users';
import { saveCurrentUser } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

/**
 * Figma `log in` (2238:11898) / `log in dark` (2629:4237) — REST JSON 기준.
 * canvas-strong 배경, 664×358 카드(surface, border-default 1px, radius 24, pad 10/40/10/10,
 * shadow 0 16 35 6% + 0 64 64 5%). 좌: 307×338 fill-neutral-strong radius 16 / 우: 256px 컬럼(py 32).
 * 로고 48 → gap16 → 제목(20/600)+설명(16/400) gap4 → gap24 → 입력(48, radius16) … 버튼(48, radius16)
 * ※ Figma에 비밀번호 칸은 없다. 닉네임만 받는다.
 */
export default function Login() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
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
      <div
        className="bg-background-surface border-border-default rounded-24 flex w-full max-w-[664px] items-center justify-between gap-2.5 border py-2.5 pr-10 pl-2.5 shadow-[0_16px_35px_rgba(0,0,0,0.06),0_64px_64px_rgba(0,0,0,0.05)]"
        data-name="login-card"
      >
        {/* Figma Rectangle 1 (307×338, radius 16) — 디자이너 캐릭터 일러스트, 라이트/다크 별도 이미지 */}
        <img
          src={isDark ? loginDark : loginLight}
          alt=""
          className="bg-fill-neutral-strong rounded-16 hidden h-[338px] w-[307px] shrink-0 object-cover md:block"
          data-name="login-illustration"
        />

        <form
          onSubmit={handleSubmit}
          className="flex h-[338px] w-[256px] shrink-0 flex-col items-center justify-between py-8"
          data-name="login-card-content"
        >
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <img src={riidoSymbol} alt="Riido" className="size-12 shrink-0" />
              <div className="flex flex-col gap-1 text-center">
                <h1 className="text-text-primary text-title-20 font-semibold tracking-[-0.4px]">
                  로그인
                </h1>
                <p className="text-text-secondary text-body-16">
                  닉네임을 입력하고 로그인해 주세요.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                placeholder="닉네임을 입력해 주세요."
                aria-label="닉네임"
                aria-invalid={error !== null}
                className={cn(
                  'bg-fill-neutral-strong text-text-primary placeholder:text-text-tertiary rounded-16 text-body-16 h-12 w-full border border-transparent px-4 py-3 outline-none',
                  'focus-visible:ring-ring/50 focus-visible:ring-3',
                  error !== null && 'border-status-danger-border',
                )}
              />
              {error && <p className="text-status-danger-text text-caption-12">{error}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'rounded-16 text-body-16 flex h-12 w-full items-center justify-center px-4 py-3 font-medium tracking-[-0.4px] transition-colors outline-none',
              'focus-visible:ring-ring/50 focus-visible:ring-3',
              canSubmit
                ? 'bg-primary-solid text-text-primary active:bg-primary-solid-strong'
                : 'bg-fill-disable text-text-disable cursor-not-allowed',
            )}
          >
            {isSubmitting ? '로그인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
