import type { AnswerSection } from '@/api/conversations';
import { Markdown } from '@/components/chat/Markdown';

type AnswerSectionsProps = {
  sections: AnswerSection[];
};

/**
 * 구조화된 답변을 섹션 단위로 그린다.
 * 섹션마다 라벨 · 본문 · 근거 문서를 차례로 보여준다.
 * (answerType은 아직 화면에서 쓰지 않는다.)
 */
export function AnswerSections({ sections }: AnswerSectionsProps) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <section key={`${section.label}-${index}`} className="flex flex-col gap-1">
          <h4 className="text-muted-foreground text-xs font-semibold tracking-wide">
            {section.label}
          </h4>
          <Markdown content={section.text} />
          {section.sources && section.sources.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {section.sources.map((source, sourceIndex) => (
                <li
                  key={`${source.docId}-${sourceIndex}`}
                  title={source.docId}
                  className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[0.7rem] leading-relaxed"
                >
                  {source.section || source.docId}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
