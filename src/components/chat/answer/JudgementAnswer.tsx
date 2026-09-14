import type { AnswerSection } from '@/api/conversations';
import { AnswerHeadline, AnswerShell } from '@/components/chat/answer/AnswerShell';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, hasRestSections, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.judgement;

type Props = { title: string | null; sections: AnswerSection[] };

/** 판단형: [핵심답변 [조건] [방법 [제한사항]]] */
export function JudgementAnswer({ title, sections }: Props) {
  const headline = pickSection(sections, '핵심답변');
  const conditions = pickSection(sections, '조건');
  const method = pickSection(sections, '방법');
  const limits = pickSection(sections, '제한사항');
  const rest = hasRestSections(sections, LABELS);

  return (
    <AnswerShell>
      <AnswerHeadline title={title}>
        <SectionBlock section={headline} />
      </AnswerHeadline>

      {conditions && (
        <SectionBox variant="note">
          <SectionBlock section={conditions} />
        </SectionBox>
      )}

      {(method || limits || rest) && (
        <SectionBox variant="card" gap="lg">
          <SectionBlock section={method} />
          {limits && (
            <SectionBox variant="danger">
              <SectionBlock section={limits} className="gap-[10px]" />
            </SectionBox>
          )}
          <RestSections sections={sections} except={LABELS} />
        </SectionBox>
      )}
    </AnswerShell>
  );
}
