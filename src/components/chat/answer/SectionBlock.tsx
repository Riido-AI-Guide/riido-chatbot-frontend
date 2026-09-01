import type { AnswerSection } from '@/api/conversations';
import { Markdown } from '@/components/chat/Markdown';
import { HEADLINE_LABELS } from '@/components/chat/answer/sections';
import { cn } from '@/lib/utils';

type SectionBlockProps = {
  /** 서버가 안 준 라벨이면 undefined가 들어오고, 이때는 아무것도 그리지 않는다. */
  section: AnswerSection | undefined;
  className?: string;
};

/** 섹션 하나 = 라벨 + 본문 + 근거 문서 */
export function SectionBlock({ section, className }: SectionBlockProps) {
  if (section === undefined) {
    return null;
  }

  const showLabel = !HEADLINE_LABELS.includes(section.label);

  return (
    <section className={cn('flex flex-col gap-1', className)}>
      {showLabel && (
        <h4 className="text-muted-foreground text-xs font-semibold tracking-wide">
          {section.label}
        </h4>
      )}
      <Markdown content={section.text} />
      {section.sources !== undefined && section.sources.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-1">
          {section.sources.map((source, index) => (
            <li
              key={`${source.docId}-${index}`}
              title={source.docId}
              className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[0.7rem] leading-relaxed"
            >
              {source.section || source.docId}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
