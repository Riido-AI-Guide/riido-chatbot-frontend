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

/**
 * Figma quick-links-row — 엔트리 화면 입력창 위 추천 질문. 이용가이드에 답이 있는 질문으로.
 * 칩에는 keyword(짧은 키워드)만 쓰고, 호버하면 입력창에 query(문장형 질문)가 미리 보인다.
 * 피그마 IA에도 이 자리가 `recommended-question-keywords`(추천 질문 키워드)로 잡혀 있다.
 */
const QUICK_LINKS = [
  { icon: Rocket, keyword: '대기와 백로그 차이', query: '대기랑 백로그 차이가 뭔가요?' },
  {
    icon: Wrench,
    keyword: 'AI 에이전트 설정',
    query: 'AI 에이전트는 어떻게 설정하고 작업을 맡기나요?',
  },
  {
    icon: CalendarDays,
    keyword: '구글 캘린더 연동',
    query: '미팅을 구글 캘린더와 연동할 수 있나요?',
  },
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
  /** 접힌 레일에서 "답변 보관"을 눌렀을 때 — 값이 바뀌면 사이드바가 보관 목록을 편다 */
  const [openBookmarksKey, setOpenBookmarksKey] = useState(0);
  /** 마우스를 올린 추천 칩의 질문 — 입력창에 흐리게 미리 보여 준다 */
  const [chipPreview, setChipPreview] = useState<string | null>(null);

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
        <SidebarRail
          onNewChat={reset}
          onExpand={() => setIsSidebarCollapsed(false)}
          onOpenBookmarks={() => {
            setIsSidebarCollapsed(false);
            setOpenBookmarksKey((key) => key + 1);
          }}
        />
      ) : (
        <Sidebar
          activeId={conversationId}
          refreshKey={conversationId}
          onSelect={loadConversation}
          onNewChat={reset}
          onCollapse={() => {
            setIsSidebarCollapsed(true);
            setOpenBookmarksKey(0);
          }}
          openBookmarksKey={openBookmarksKey}
          filter={searchQuery}
        />
      )}

      {/* 채팅 영역 배경은 페이드가 수렴하는 색과 반드시 같아야 한다.
          background-canvas는 라이트에서 #FFFFFF인데 canvas-fade-solid는 #F9FAFB라
          페이드가 안 덮는 자리(스크롤바 칸 등)에서 흰색이 드러나 경계선이 생겼다.
          다크는 둘 다 #181D21이라 원래 문제가 없었다 — 즉 라이트 canvas 쪽이 어긋난 것.
          레이어: 사이드바 #F3F5F6 < 채팅 캔버스 #F9FAFB < 답변 카드 #FFFFFF */}
      <div className="bg-background-canvas-fade-solid flex min-h-0 min-w-0 flex-1 flex-col">
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
          {/* 메시지 영역 + 입력창을 한 flex 컬럼으로 묶는다.
              Figma sidebar-scrollbar(id 1934:1493 등)는 헤더 바로 아래~화면 맨 아래(960px, y 64~1024)까지
              이어지고 푸터(y 872~1024, 152px)는 그 안쪽에 겹쳐 떠 있는 레이어다 — 즉 스크롤 영역이
              푸터 자리까지 포함해야 맞다. 그런데 footer가 main의 형제(shrink-0)로 따로 높이를 차지하면
              main이 그만큼 짧아져서 커스텀 스크롤바(riido-scrollbar)도 푸터 위에서 멈춰버린다(#이수현 리포트).
              → footer를 main 안의 sticky bottom-0 마지막 자식으로 넣어 스크롤 영역 자체를 전체 높이로 두고,
              대화가 짧을 때도 입력창이 맨 아래에 붙도록 메시지 영역에 flex-1 + min-h-full을 준다. */}
          <div className="flex min-h-full flex-col">
            {/* Figma: 스크롤바(12px) 뺀 1168 영역 기준 — 엔트리 800 컬럼은 중앙(184), 채팅 856 컬럼은 좌 134 / 우 178(질문 바 자리) */}
            <div
              className={cn(
                'mx-auto flex w-full flex-1 flex-col',
                // 채팅: 맨 아래로 내렸을 때 마지막 답변 카드 ↔ 입력창 72px (푸터 위 pad 8 + 64)
                // main이 스크롤바 칸(12px)을 항상 비워 두므로(scrollbar-gutter) 1168 기준 중앙 = Figma x184
                // 엔트리: 812 + pl-3 → 800 컬럼이 입력창·답변 카드와 같은 세로선에 온다.
                // (main이 스크롤바 12px를 늘 비워 두므로 그냥 중앙이면 6px 왼쪽으로 치우친다)
                // 엔트리 pb-24: 추천 칩이 푸터 위로 64px 떠오르는(입력창 위 24 + 칩 48 − 푸터 pt 8)
                // 레이어라 그만큼을 비워 두지 않으면 기능 카드를 덮는다. 64 + 여유 32 = 96px
                isEmpty ? 'max-w-[812px] pb-24 pl-3' : 'max-w-[900px] pr-11 pb-16',
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

            {/* 좌 16 / 우 4 — main이 [scrollbar-gutter:stable]로 오른쪽 12px를 늘 비워 두기 때문에
                px-4 + mx-auto로 가운데를 잡으면 입력창이 채팅 영역(1180) 실제 중앙보다 6px 왼쪽에 놓인다.
                좌우 패딩을 12px 차이나게 줘서 그만큼 되돌리면 입력창이 Figma footer 기준 x190~990,
                즉 답변 카드와 오른쪽 끝이 맞고 1180 기준 중앙에 온다 */}
            <footer className="sticky bottom-0 shrink-0 pt-2 pr-1 pb-2.5 pl-4">
              {/* Figma footer background(541:2) — 푸터 위쪽 끝에 맞춘 162px 페이드
                  (푸터 152 + 아래로 10px 더 내려온 만큼).
                  CSS blur는 쓰지 않는다. 피그마의 Layer blur 12는 세로 그라데이션에 걸린
                  거라 눈에 띄는 차이가 없는데, filter를 걸면 투명도가 박스 위쪽으로 번져서
                  clip 경계에서 알파가 0 → 0.2로 튄다. 그 계단이 화면에서는 말풍선이 탁
                  잘린 선으로 보인다. 그라데이션만 두면 박스 맨 위가 진짜 0이라 경계가 안 보인다 */}
              {/* right-3을 쓰지 않는다. footer가 main(= [scrollbar-gutter:stable]) 안에 있어서
                  스크롤바 12px는 이미 main 컨텐츠 박스에서 빠져 있다. 여기서 또 12px를 빼면
                  총 24px가 비어 그 띠에서 본문이 페이드 없이 그대로 드러난다.
                  inset-x-0 = footer 폭 = 1168 = 피그마 footer 폭 */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-[-10px] h-[162px] overflow-hidden"
                aria-hidden
              >
                <div className="canvas-fade-up absolute inset-0" />
                {/* 93px 레이어 (푸터 위에서 69px 아래) */}
                <div className="canvas-fade-up-bottom absolute inset-x-0 top-[69px] h-[93px]" />
              </div>
              {/* 입력창 800px를 답변 카드와 같은 세로선에 둔다.
                  피그마는 입력창이 푸터(1168) 기준 중앙이라 답변 카드보다 6px 왼쪽에 있는데,
                  그러면 세로 라인이 안 맞아서 답변 카드와 같은 전체폭 중앙으로 맞췄다 */}
              <div className="relative mx-auto flex w-full max-w-[800px] flex-col gap-2">
                {((error !== null && errorKind === 'network') || isRetrying) && (
                  <ErrorNotice
                    message={error ?? ''}
                    onRetry={retry}
                    isRetrying={isRetrying}
                    retryCount={retryCount}
                  />
                )}
                <div className="relative">
                  {/* Figma quick-links-row — 피그마 상에서도 푸터 안이 아니라 푸터 위에 떠 있는
                      별도 레이어(입력창 위 24px, row 48px = -72px). 푸터 플로우에 넣지 않고
                      입력창 기준으로 떠 있게 해야 배경 그라데이션이 그 위로 그대로 비친다 */}
                  {isEmpty && (
                    <div className="absolute inset-x-0 -top-[84px] flex scrollbar-none flex-nowrap items-center justify-center gap-2 overflow-x-auto px-2 py-3">
                      {QUICK_LINKS.map(({ icon, keyword, query }) => (
                        <QuickLinkChip
                          key={query}
                          icon={icon}
                          label={keyword}
                          disabled={isBusy}
                          onHoverChange={(hovering) => setChipPreview(hovering ? query : null)}
                          // 호버로 문장을 미리 보여 주고, 누르면 그대로 바로 전송한다
                          onClick={() => {
                            setChipPreview(null);
                            send(query);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {/* Figma loader-answer: 답변 생성 중 입력창 위 24px 중앙 */}
                  {isSending && (
                    <AnswerLoader className="absolute -top-[52px] left-1/2 -translate-x-1/2" />
                  )}
                  <ChatInput disabled={isBusy} onSend={send} preview={chipPreview} />
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
