import { useEffect, useState } from 'react';

import { fetchConversations, type ConversationSummary } from '@/api/conversations';
import { getCurrentUser } from '@/lib/auth';

type Props = {
  /** 지금 화면에 열려 있는 대화 id (목록에서 강조 표시) */
  activeId: number | null;
  /** 값이 바뀌면 목록을 다시 불러온다 — 새 대화가 만들어졌을 때 갱신용 */
  refreshKey: number | null;
  onSelect: (conversationId: number) => void;
};

export function ConversationSidebar({ activeId, refreshKey, onSelect }: Props) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const userId = getCurrentUser()?.id;

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
      <div className="border-border shrink-0 border-b px-4 py-3">
        <h2 className="text-sm font-semibold">내 대화</h2>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-xs">아직 대화가 없어요.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {conversations.map((conversation) => (
              <li key={conversation.conversationId}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.conversationId)}
                  className={`hover:bg-accent w-full truncate rounded-lg px-3 py-2 text-left text-sm ${
                    conversation.conversationId === activeId ? 'bg-accent font-medium' : ''
                  }`}
                >
                  {conversation.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
