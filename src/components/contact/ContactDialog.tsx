import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { subscribeOpenContact } from '@/lib/contact-events';
import { env } from '@/lib/env';
import { ICON_STROKE } from '@/lib/icon';
import { cn } from '@/lib/utils';

/** Figma type-list — 문의 유형 9개 */
const INQUIRY_TYPES = [
  '계정 / 로그인',
  '워크스페이스 / 멤버 / 권한',
  '요금제 / 결제',
  '기능 사용법',
  '오류 / 버그 신고',
  'AI / MCP / 에이전트',
  '데이터 관리',
  '보안 / 계약 / 도입',
  '제안 / 기타',
] as const;

const CONTENT_MIN = 10;
const CONTENT_MAX = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Figma input-row: 48px, surface 배경, border-disable, radius 16, pad 12/16 */
const FIELD =
  'bg-background-surface border-border-disable text-text-primary placeholder:text-text-tertiary w-full rounded-16 border px-[15px] text-body-16 outline-none';

/**
 * Figma `customer inquiry` (2235:11893) — 운영팀에 문의하기 팝업.
 * 396×508 카드: background-answer, radius 16, pad 24/32, shadow-xl. 헤더(Title/20 + X) + 캡션(Body/14 secondary)
 * → 이메일 라벨/입력(48) → 유형 select(48, chevron) + 내용(168) → 보내기(332×40, radius 12; 유효할 때 primary-solid)
 * 유형 목록(type-list): 264×277 radius 16 shadow-xl, surface 20% + 글래스(backdrop blur), 행 48(안쪽 44 radius 12, hover fill-hover), 선택 항목에 check, 넘치면 스크롤.
 * 문의 API가 아직 없어서 보내기는 mailto로 메일 앱을 연다 (받는 곳 VITE_SUPPORT_EMAIL, 제목 [유형], 본문에 답변 이메일+내용).
 */
export function ContactDialogHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeOpenContact(() => setOpen(true)), []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="bg-fill-dim data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50" />
        {/* Figma엔 열릴 때 커서(포커스)가 어느 칸에도 없다 → 첫 입력칸 자동 포커스 끔 */}
        <DialogPrimitive.Popup
          initialFocus={false}
          className="bg-answer-card data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 rounded-16 fixed top-1/2 left-1/2 z-50 w-[396px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 px-8 py-6 shadow-xl outline-none"
          aria-labelledby="contact-title"
        >
          {open && <ContactForm onClose={() => setOpen(false)} />}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function ContactForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const trimmed = content.trim();
  const canSend =
    EMAIL_PATTERN.test(email.trim()) &&
    type !== null &&
    trimmed.length >= CONTENT_MIN &&
    trimmed.length <= CONTENT_MAX;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSend) {
      return;
    }
    // TODO: 문의 API 붙으면 mailto 대신 API 호출로 교체
    const subject = `[Riido 문의] ${type}`;
    const body = `답변받을 이메일: ${email.trim()}\n문의 유형: ${type}\n\n${trimmed}`;
    window.location.href = `mailto:${env.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-3">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="contact-title"
              className="text-text-strong text-title-20 font-semibold tracking-[-0.4px]"
            >
              운영팀에 문의하기
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="hover:bg-fill-hover focus-visible:ring-ring/50 rounded-6 flex size-6 items-center justify-center outline-none focus-visible:ring-3"
            >
              <X className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
            </button>
          </div>
          <p className="text-text-secondary text-body-14">확인 후 이메일로 답변드리겠습니다.</p>
        </div>

        <label className="flex flex-col gap-3">
          <span className="text-text-primary text-title-16 font-medium tracking-[-0.4px]">
            답변받을 이메일을 입력해주세요.
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일"
            autoComplete="email"
            className={cn(FIELD, 'h-12 py-3')}
          />
        </label>

        <div className="flex flex-col gap-2">
          <Popover open={isTypeOpen} onOpenChange={setIsTypeOpen}>
            <PopoverTrigger
              className={cn(FIELD, 'flex h-12 items-center gap-2.5 py-3 text-left')}
              aria-label="문의 유형"
            >
              <span className="min-w-0 flex-1 truncate">{type ?? '문의 유형을 선택해주세요.'}</span>
              <ChevronDown
                className={cn(
                  'text-icon-primary size-6 shrink-0 transition-transform',
                  isTypeOpen && 'rotate-180',
                )}
                strokeWidth={ICON_STROKE}
              />
            </PopoverTrigger>
            {/* Figma type-list: select 가운데 정렬 264px, select 위를 덮으며 열린다.
                첫 줄(select type)은 현재 선택값 헤더, 그 아래 유형 9개 */}
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={-48}
              className="bg-background-surface/20 w-[264px] rounded-[16px] p-0 shadow-xl backdrop-blur-2xl"
            >
              <div className="text-text-primary text-body-16 flex h-12 items-center gap-2.5 rounded-t-[16px] px-4">
                <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
                  {type !== null && (
                    <Check className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {type ?? '문의 유형을 선택해주세요.'}
                </span>
              </div>
              {/* Figma type-list 264×277: 넘치는 항목은 스크롤 */}
              <ul
                role="listbox"
                aria-label="문의 유형"
                className="riido-scrollbar flex max-h-[229px] flex-col overflow-y-auto pb-0.5"
              >
                {INQUIRY_TYPES.map((item) => {
                  const isSelected = item === type;
                  return (
                    <li key={item} className="px-2 py-0.5">
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setType(item);
                          setIsTypeOpen(false);
                        }}
                        className="hover:bg-fill-hover active:bg-fill-press rounded-12 flex h-11 w-full items-center gap-2.5 px-2 text-left outline-none"
                      >
                        <span
                          className="flex size-6 shrink-0 items-center justify-center"
                          aria-hidden
                        >
                          {isSelected && (
                            <Check className="text-icon-primary size-6" strokeWidth={ICON_STROKE} />
                          )}
                        </span>
                        <span className="text-text-primary text-body-16">{item}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value.slice(0, CONTENT_MAX))}
            placeholder={`내용을 작성해주세요. (최소 ${CONTENT_MIN}자, 최대 ${CONTENT_MAX}자)`}
            aria-label="문의 내용"
            className={cn(FIELD, 'riido-scrollbar h-[168px] resize-none py-3 leading-6')}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSend}
        className={cn(
          'rounded-12 text-body-16 flex h-10 w-full items-center justify-center font-medium tracking-[0.4px] transition-colors outline-none',
          'focus-visible:ring-ring/50 focus-visible:ring-3',
          canSend
            ? 'bg-primary-solid text-text-primary active:bg-primary-solid-strong'
            : 'bg-fill-neutral text-text-disable cursor-not-allowed',
        )}
      >
        보내기
      </button>
    </form>
  );
}
