import type { AnswerSection } from '@/api/conversations';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.judgement;

/** 판단형: [핵심답변 [조건] [방법 [제한사항]]] */
export function JudgementAnswer({ sections }: { sections: AnswerSection[] }) {
  const headline = pickSection(sections, '핵심답변');
  const conditions = pickSection(sections, '조건');
  const method = pickSection(sections, '방법');
  const limits = pickSection(sections, '제한사항');

  return (
    <SectionBox>
      <SectionBlock section={headline} />
      {conditions && (
        <SectionBox depth={1}>
          <SectionBlock section={conditions} />
        </SectionBox>
      )}
      {(method || limits) && (
        <SectionBox depth={1}>
          <SectionBlock section={method} />
          {limits && (
            <SectionBox depth={2}>
              <SectionBlock section={limits} />
            </SectionBox>
          )}
        </SectionBox>
      )}
      <RestSections sections={sections} except={LABELS} />
    </SectionBox>
  );
}
