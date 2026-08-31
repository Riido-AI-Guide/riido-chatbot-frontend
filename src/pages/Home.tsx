import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import { ChatInput } from '@/components/chat/ChatInput';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ErrorNotice } from '@/components/chat/ErrorNotice';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import { clearCurrentUser, getCurrentUser } from '@/lib/auth';

const EXAMPLE_QUERIES = [
  'ERD 먼저 짜는 게 나을까?',
  '팀 프로젝트 브랜치 전략은 어떻게 잡아야 해?',
  '리팩터링은 언제 시작하는 게 좋아?',
];

export default function Home() {
  const { conversationId, messages, error, isSending, send, retry, reset, loadConversation } =
    useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  // 메시지가 늘거나 로딩/에러 상태가 바뀔 때마다 맨 아래로 따라 내려간다.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending, error]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen">
      <ConversationSidebar
        activeId={conversationId}
        refreshKey={conversationId}
        onSelect={loadConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3">
          <div className="flex items-baseline gap-2">
            <h1 className="text-base font-semibold">리도 AI 가이드</h1>
            {conversationId !== null && (
              <span className="text-muted-foreground text-xs tabular-nums">
                대화 #{conversationId}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isEmpty && (
              <Button variant="ghost" size="sm" onClick={reset}>
                새 대화
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/members')}>
              멤버
            </Button>
            <span className="text-muted-foreground px-1 text-xs">{user?.name}</span>
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
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
            {isEmpty ? (
              <div className="flex flex-col items-center gap-6 py-16 text-center">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-2xl font-bold">무엇을 도와드릴까요?</h2>
                  <p className="text-muted-foreground text-sm">
                    프로젝트를 진행하며 막히는 부분을 물어보세요.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {EXAMPLE_QUERIES.map((query) => (
                    <Button
                      key={query}
                      variant="outline"
                      size="lg"
                      disabled={isSending}
                      onClick={() => send(query)}
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => <MessageBubble key={message.key} message={message} />)
            )}

            {isSending && <TypingIndicator />}
            {error !== null && <ErrorNotice message={error} onRetry={retry} />}

            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="border-border shrink-0 border-t px-4 py-3">
          <div className="mx-auto w-full max-w-2xl">
            <ChatInput disabled={isSending} onSend={send} />
          </div>
        </footer>
      </div>
    </div>
  );
}
