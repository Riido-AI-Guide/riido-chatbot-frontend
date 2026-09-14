import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { AnswerSection } from '@/api/conversations';
import { Markdown } from '@/components/chat/Markdown';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { useMessageActions } from '@/components/chat/answer/MessageActionsContext';
import { SourceButton } from '@/components/chat/answer/SourceButton';
import { HEADLINE_LABELS, displayLabel } from '@/components/chat/answer/sections';
import { cn } from '@/lib/utils';

type SectionBlockProps = {
  /** 서버가 안 준 라벨이면 undefined가 들어오고, 이때는 아무것도 그리지 않는다. */
  section: AnswerSection | undefined;
  /** 라벨은 밖에 두고 본문만 안쪽 박스에 넣는다 (단계별방법 · 해결방법) */
  bodyBox?: boolean;
  /** 본문의 각 줄을 카드로 그린다 (관련질문) */
  asChips?: boolean;
  className?: string;
};

/** 목록 마크다운을 칩 한 줄씩으로 쪼갠다. 목록이 아니면 통째로 한 장. */
function toChips(text: string): string[] {
  const lines = text
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '').trim())
    .filter((line) => line.length > 0);

  return lines.length > 0 ? lines : [text];
}

/**
 * Figma text-with-icon — 근거 link 버튼은 본문 마지막 줄 끝(마지막 문단/불릿의 텍스트 뒤, gap 8)에 붙는다.
 * 마크다운이 그린 마지막 블록(p 또는 마지막 li)을 찾아 그 안에 포털로 넣는다.
 */
function MarkdownWithSource({
  content,
  sources,
  className,
}: {
  content: string;
  sources: NonNullable<AnswerSection['sources']>;
  className?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const prose = wrapperRef.current?.querySelector('.answer-prose');
    let last = prose?.lastElementChild as HTMLElement | null | undefined;
    if (last && (last.tagName === 'UL' || last.tagName === 'OL')) {
      const li = last.lastElementChild;
      last = (li?.querySelector(':scope > .li-body') ?? li) as HTMLElement | null;
    }
    setTarget(last ?? null);
  }, [content]);

  return (
    <div ref={wrapperRef} className="w-full min-w-0">
      <Markdown content={content} variant="answer" className={className} />
      {sources.length > 0 &&
        target !== null &&
        createPortal(
          <span className="ml-2 inline-flex align-middle">
            <SourceButton sources={sources} />
          </span>,
          target,
        )}
    </div>
  );
}

/** 섹션 하나 = 라벨 + 본문 + 근거 문서 버튼 */
export function SectionBlock({ section, bodyBox, asChips, className }: SectionBlockProps) {
  const actions = useMessageActions();
  if (section === undefined) {
    return null;
  }

  // 핵심답변·기능요약은 답변의 첫 문단이라 라벨을 감추고 본문을 조금 굵게 쓴다.
  const isHeadline = HEADLINE_LABELS.includes(section.label);
  const sources = section.sources ?? [];

  const body = asChips ? (
    /* Figma related-item — 56px, surface + border-strong, radius 10, pad 16/20, Body/16.
       hover fill-hover / press fill-press. 누르면 그 질문을 이어서 보낸다 */
    <div className="flex w-full flex-col gap-2">
      {toChips(section.text).map((chip, index) => (
        <button
          key={`${chip}-${index}`}
          type="button"
          onClick={() => actions?.onAsk?.(chip)}
          disabled={!actions?.onAsk}
          className="bg-answer-chip border-answer-chip-border text-text-primary hover:bg-fill-hover active:bg-fill-press focus-visible:ring-ring/50 text-body-16 disabled:hover:bg-answer-chip flex min-h-14 w-full items-center rounded-[10px] border px-[19px] py-[15px] text-left break-words transition-colors outline-none focus-visible:ring-3 disabled:cursor-default"
        >
          {chip}
        </button>
      ))}
    </div>
  ) : (
    <MarkdownWithSource
      content={section.text}
      sources={sources}
      className={cn('min-w-0', isHeadline && 'font-medium tracking-[-0.4px] [&_p]:leading-6')}
    />
  );

  return (
    <section className={cn('flex w-full flex-col gap-2', className)}>
      {/* Figma section-heading: Title/16 Medium, ls -0.4 */}
      {!isHeadline && (
        <h4 className="text-text-primary text-title-16 font-medium tracking-[-0.4px]">
          {displayLabel(section.label)}
        </h4>
      )}
      {bodyBox ? <SectionBox variant="inset">{body}</SectionBox> : body}
    </section>
  );
}
