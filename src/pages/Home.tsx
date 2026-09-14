import { CalendarDays, Rocket, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { AnswerFailedCard } from '@/components/chat/AnswerFailedCard';
import { AnswerLoader } from '@/components/chat/AnswerLoader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ContactDialogHost } from '@/components/contact/ContactDialog';
import { ErrorNotice } from '@/components/chat/ErrorNotice';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { QuestionListBar, type QuestionListEntry } from '@/components/chat/QuestionListBar';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { QuickLinkChip } from '@/components/home/QuickLinkChip';
import { WelcomeScreen } from '@/components/home/WelcomeScreen';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarRail } from '@/components/layout/SidebarRail';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

/** Figma quick-links-row — 엔트리 화면 입력창 위 추천 질문. 이용가이드에 답이 있는 질문(Figma 채팅 예시)으로 */
const QUICK_LINKS = [
  { icon: Rocket, query: '대기랑 백로그 차이가 뭔가요?' },
  { icon: Wrench, query: 'AI 에이전트는 어떻게 설정하고 작업을 맡기나요?' },
  { icon: CalendarDays, query: '미팅을 구글 캘린더와 연동할 수 있나요?' },
] as const;

export default function Home() {
  const {
    conversationId,
    title,
    messages,
    error,
    errorKind,
    isSending,
    isRetrying,
    retryCount,
    isBusy,
    send,
    retry,
    reset,
    loadConversation,
    toggleBookmark,
    rateMessage,
    clearRating,
  } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 메시지가 늘거나 로딩/에러 상태가 바뀔 때마다 맨 아래로 따라 내려간다.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isBusy, error]);

  const isEmpty = messages.length === 0;

  // Figma question-list-bar — 사용자 질문마다 바 하나. 클릭하면 그 질문으로 스크롤.
  const questionEntries: QuestionListEntry[] = messages
    .filter((message) => message.role === 'user')
    .map((message) => ({ targetId: `question-${message.key}`, label: message.content }));

  return (
    <div className="bg-background-canvas flex h-screen">
      <ContactDialogHost />
      {isSidebarCollapsed ? (
        <SidebarRail onNewChat={reset} onExpand={() => setIsSidebarCollapsed(false)} />
      ) : (
        <Sidebar
          activeId={conversationId}
          refreshKey={conversationId}
          onSelect={loadConversation}
          onNewChat={reset}
          onCollapse={() => setIsSidebarCollapsed(true)}
          filter={searchQuery}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={isEmpty ? null : title}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="riido-scrollbar relative min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto">
          {/* Figma question-list-bar — 채팅 영역(스크롤바 제외) 우측 상단(top 32, right 8)에 붙어 따라다닌다 */}
          {!isEmpty && (
            <div className="sticky top-8 z-10 h-0">
              <QuestionListBar entries={questionEntries} className="absolute top-0 right-2" />
            </div>
          )}
          {/* Figma: 스크롤바(12px) 뺀 1168 영역 기준 — 엔트리 800 컬럼은 중앙(184), 채팅 856 컬럼은 좌 134 / 우 178(질문 바 자리) */}
          <div
            className={cn(
              'mx-auto flex w-full flex-col',
              // 채팅: 맨 아래로 내렸을 때 마지막 답변 카드 ↔ 입력창 72px (푸터 위 pad 8 + 64)
              // main이 스크롤바 칸(12px)을 항상 비워 두므로(scrollbar-gutter) 1168 기준 중앙 = Figma x184
              isEmpty ? 'max-w-[800px] pb-6' : 'max-w-[900px] pr-11 pb-16',
            )}
          >
            {isEmpty ? (
              <WelcomeScreen />
            ) : (
              /* Figma message-list: 위 32, 질문→답변 48, 답변→다음 질문 72 */
              <div className="flex flex-col pt-8">
                {messages.map((message, index) => (
                  <div
                    key={message.key}
                    id={message.role === 'user' ? `question-${message.key}` : undefined}
                    className={
                      index === 0 ? undefined : message.role === 'user' ? 'mt-[72px]' : 'mt-12'
                    }
                  >
                    <MessageBubble
                      message={message}
                      actions={{
                        onToggleBookmark: toggleBookmark,
                        onRate: rateMessage,
                        onClearRating: clearRating,
                        onAsk: send,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {isSending && (
              <div className="mt-12">
                <TypingIndicator />
              </div>
            )}

            {/* Figma answer-creation-failed: 답변 자리(질문 아래 48px)에 주황 카드 + [다시 생성] */}
            {error !== null && errorKind === 'answer' && !isSending && (
              <div className="mt-12">
                <AnswerFailedCard onRetry={retry} disabled={isBusy} />
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="relative shrink-0 px-4 pt-2 pb-2.5">
          {/* Figma footer background — 위쪽으로 캔버스색이 번지는 페이드 (162px) */}
          <div
            className="from-background-canvas-fade-transparent via-background-canvas-fade-soft to-background-canvas-fade-solid pointer-events-none absolute inset-x-0 -top-16 bottom-0 bg-gradient-to-b"
            aria-hidden
          />
          <div className="relative mx-auto flex w-full max-w-[812px] flex-col gap-2 pr-3">
            {/* Figma quick-links-row: 입력창 위 24px */}
            {isEmpty && (
              <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
                {QUICK_LINKS.map(({ icon, query }) => (
                  <QuickLinkChip
                    key={query}
                    icon={icon}
                    label={query}
                    disabled={isBusy}
                    onClick={() => send(query)}
                  />
                ))}
              </div>
            )}
            {((error !== null && errorKind === 'network') || isRetrying) && (
              <ErrorNotice
                message={error ?? ''}
                onRetry={retry}
                isRetrying={isRetrying}
                retryCount={retryCount}
              />
            )}
            <div className="relative">
              {/* Figma loader-answer: 답변 생성 중 입력창 위 24px 중앙 */}
              {isSending && (
                <AnswerLoader className="absolute -top-[52px] left-1/2 -translate-x-1/2" />
              )}
              <ChatInput disabled={isBusy} onSend={send} />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
