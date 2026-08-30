import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { toUserMessage } from '@/api/client';
import { fetchUsers, type User } from '@/api/users';
import { Button } from '@/components/ui/button';

export default function Members() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(toUserMessage(err)));
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <header className="border-border flex shrink-0 items-center justify-between border-b px-4 py-3">
        <h1 className="text-base font-semibold">멤버</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          채팅으로
        </Button>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-4 py-6">
          {error && <p className="text-destructive text-sm">{error}</p>}
          {!error && users === null && (
            <p className="text-muted-foreground text-sm">불러오는 중…</p>
          )}
          {users && users.length === 0 && (
            <p className="text-muted-foreground text-sm">아직 가입한 멤버가 없어요.</p>
          )}
          {users && users.length > 0 && (
            <ul className="flex flex-col gap-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="border-border flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {user.createdAt.slice(0, 10)} 가입
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
