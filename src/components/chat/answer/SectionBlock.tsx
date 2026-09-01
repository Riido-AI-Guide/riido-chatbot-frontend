import type { AnswerSection } from '@/api/conversations';
import { Markdown } from '@/components/chat/Markdown';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SourceButton } from '@/components/chat/answer/SourceButton';
import { HEADLINE_LABELS } from '@/components/chat/answer/sections';
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

/** 섹션 하나 = 라벨 + 본문 + 근거 문서 버튼 */
export function SectionBlock({ section, bodyBox, asChips, className }: SectionBlockProps) {
  if (section === undefined) {
    return null;
  }

  // 핵심답변·기능요약은 답변의 첫 문단이라 라벨을 감추고 본문을 조금 굵게 쓴다.
  const isHeadline = HEADLINE_LABELS.includes(section.label);
  const sources = section.sources ?? [];

  const body = asChips ? (
    <div className="flex w-full flex-col gap-2">
      {toChips(section.text).map((chip, index) => (
        <p
          key={`${chip}-${index}`}
          className="bg-answer-chip border-answer-chip-border rounded-[20px] border px-6 py-4 text-base leading-tight break-words"
        >
          {chip}
        </p>
      ))}
    </div>
  ) : (
    <Markdown
      content={section.text}
      variant="answer"
      className={cn('min-w-0', isHeadline && 'font-medium')}
    />
  );

  return (
    <section className={cn('flex w-full flex-col gap-2', className)}>
      {!isHeadline && <h4 className="text-base leading-tight font-medium">{section.label}</h4>}
      {bodyBox ? (
        <SectionBox variant="inset">{body}</SectionBox>
      ) : (
        <div className="flex w-full items-start gap-2">
          {body}
          <SourceButton sources={sources} />
        </div>
      )}
      {bodyBox && sources.length > 0 && (
        <div className="flex justify-end">
          <SourceButton sources={sources} />
        </div>
      )}
    </section>
  );
}
