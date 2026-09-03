import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { ChatInput } from '@/components/chat/ChatInput';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ErrorNotice } from '@/components/chat/ErrorNotice';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';

const EXAMPLE_QUERIES = [
  'ERD 먼저 짜는 게 나을까?',
  '팀 프로젝트 브랜치 전략은 어떻게 잡아야 해?',
  '리팩터링은 언제 시작하는 게 좋아?',
];

export default function Home() {
  const {
    conversationId,
    title,
    messages,
    error,
    isSending,
    isBusy,
    send,
    retry,
    reset,
    loadConversation,
  } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // 메시지가 늘거나 로딩/에러 상태가 바뀔 때마다 맨 아래로 따라 내려간다.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isBusy, error]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen">
      <ConversationSidebar
        activeId={conversationId}
        refreshKey={conversationId}
        onSelect={loadConversation}
        onNewChat={reset}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <h1 className="truncate text-base font-semibold">{title ?? '새 대화'}</h1>
            {conversationId !== null && (
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                대화 #{conversationId}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            render={
              <a href="https://docs.riido.io" target="_blank" rel="noreferrer noopener">
                뤼이도 이용가이드
                <ArrowUpRight data-icon="inline-end" />
              </a>
            }
          />
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
                      disabled={isBusy}
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
            <ChatInput disabled={isBusy} onSend={send} />
          </div>
        </footer>
      </div>
    </div>
  );
}
