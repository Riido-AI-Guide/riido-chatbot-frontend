import { useState } from 'react';
import { useNavigate } from 'react-router';

import { toUserMessage } from '@/api/client';
import { loginUser } from '@/api/users';
import { Button } from '@/components/ui/button';
import { saveCurrentUser } from '@/lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-bold">리도 AI 가이드</h1>
          <p className="text-muted-foreground text-sm">
            이름을 입력하면 시작할 수 있어요. 처음 온 이름이면 자동으로 가입돼요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            placeholder="이름"
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-10 rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:ring-3"
          />
          <Button type="submit" disabled={!trimmed || isSubmitting}>
            {isSubmitting ? '로그인 중…' : '시작하기'}
          </Button>
        </form>

        {error && <p className="text-destructive text-center text-sm">{error}</p>}
      </div>
    </div>
  );
}
