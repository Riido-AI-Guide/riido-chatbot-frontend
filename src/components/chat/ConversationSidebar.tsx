import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { fetchConversations, type ConversationSummary } from '@/api/conversations';
import { Button } from '@/components/ui/button';
import { clearCurrentUser, getCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

type Props = {
  /** 지금 화면에 열려 있는 대화 id (목록에서 강조 표시) */
  activeId: number | null;
  /** 값이 바뀌면 목록을 다시 불러온다 — 새 대화가 만들어졌을 때 갱신용 */
  refreshKey: number | null;
  onSelect: (conversationId: number) => void;
  /** 새 대화 시작 */
  onNewChat: () => void;
};

export function ConversationSidebar({ activeId, refreshKey, onSelect, onNewChat }: Props) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user?.id;

  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    // 목록은 부가 기능 — 불러오기에 실패해도 채팅 자체는 계속되어야 하므로 조용히 비운다
    fetchConversations(userId)
      .then(setConversations)
      .catch(() => setConversations([]));
  }, [userId, refreshKey]);

  return (
    <aside className="border-border hidden w-64 shrink-0 flex-col border-r md:flex">
      <div className="flex shrink-0 items-center gap-2 px-4 py-3">
        {/* 서비스 아이콘 자리 — 확정 로고가 나오면 교체 */}
        <span className="bg-foreground size-6 shrink-0 rounded-full" aria-hidden />
        <span className="truncate text-sm font-semibold">Riido AI Guide</span>
      </div>

      <div className="shrink-0 px-2 pb-2">
        <Button variant="ghost" size="lg" className="w-full justify-start" onClick={onNewChat}>
          새 대화
        </Button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <button
          type="button"
          onClick={() => setIsRecentOpen((open) => !open)}
          aria-expanded={isRecentOpen}
          className="hover:bg-muted flex w-full items-center justify-between rounded-lg px-3 py-2 text-left"
        >
          <span className="text-muted-foreground text-xs font-semibold">최근 대화</span>
          <ChevronDown
            className={cn(
              'text-muted-foreground size-4 transition-transform',
              !isRecentOpen && '-rotate-90',
            )}
            aria-hidden
          />
        </button>

        {isRecentOpen &&
          (conversations.length === 0 ? (
            <p className="text-muted-foreground px-3 py-2 text-xs">아직 대화가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-1 pt-1">
              {conversations.map((conversation) => (
                <li key={conversation.conversationId}>
                  <button
                    type="button"
                    onClick={() => onSelect(conversation.conversationId)}
                    className={cn(
                      'hover:bg-accent w-full truncate rounded-lg px-3 py-2 text-left text-sm',
                      conversation.conversationId === activeId && 'bg-accent font-medium',
                    )}
                  >
                    {conversation.title}
                  </button>
                </li>
              ))}
            </ul>
          ))}
      </nav>

      <div className="border-border flex shrink-0 flex-col gap-1 border-t p-2">
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-start"
          onClick={() => navigate('/members')}
        >
          멤버
        </Button>
        <div className="flex items-center justify-between gap-2 pl-3">
          <span className="truncate text-sm">{user?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearCurrentUser();
              navigate('/login', { replace: true });
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </aside>
  );
}
