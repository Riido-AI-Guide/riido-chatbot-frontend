import { useEffect, useRef, useState } from 'react';

import { ChatInput } from '@/components/chat/ChatInput';
import { ErrorNotice } from '@/components/chat/ErrorNotice';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { QuickLinkChip } from '@/components/home/QuickLinkChip';
import { WelcomeScreen } from '@/components/home/WelcomeScreen';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarRail } from '@/components/layout/SidebarRail';
import { useChat } from '@/hooks/useChat';

/** Figma quick-links-row — 엔트리 화면 입력창 위 추천 질문 */
const QUICK_LINKS = ['대기 작업, 백로그, 작업은 어떻게 다른가요?', 'MCP 서버는 어떻게 연결하나요?'];

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 메시지가 늘거나 로딩/에러 상태가 바뀔 때마다 맨 아래로 따라 내려간다.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isBusy, error]);

  const isEmpty = messages.length === 0;

  return (
    <div className="bg-background-canvas flex h-screen">
      {isSidebarCollapsed ? (
        <SidebarRail onNewChat={reset} onExpand={() => setIsSidebarCollapsed(false)} />
      ) : (
        <Sidebar
          activeId={conversationId}
          refreshKey={conversationId}
          onSelect={loadConversation}
          onNewChat={reset}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={isEmpty ? null : title} />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[856px] flex-col gap-4 px-4 pb-6">
            {isEmpty ? (
              <WelcomeScreen />
            ) : (
              <div className="flex flex-col gap-6 pt-8">
                {messages.map((message) => (
                  <MessageBubble key={message.key} message={message} />
                ))}
              </div>
            )}

            {isSending && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="relative shrink-0 px-4 pt-2 pb-2">
          {/* Figma footer background — 위쪽으로 캔버스색이 번지는 페이드 */}
          <div
            className="from-background-canvas-fade-transparent via-background-canvas-fade-soft to-background-canvas-fade-solid pointer-events-none absolute inset-x-0 -top-10 bottom-0 bg-gradient-to-b"
            aria-hidden
          />
          <div className="relative mx-auto flex w-full max-w-[800px] flex-col gap-2">
            {isEmpty && (
              <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
                {QUICK_LINKS.map((query) => (
                  <QuickLinkChip
                    key={query}
                    label={query}
                    disabled={isBusy}
                    onClick={() => send(query)}
                  />
                ))}
              </div>
            )}
            {error !== null && <ErrorNotice message={error} onRetry={retry} />}
            <ChatInput disabled={isBusy} onSend={send} />
          </div>
        </footer>
      </div>
    </div>
  );
}
