import type { AnswerSection } from '@/api/conversations';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.step;

/** 단계형: [핵심답변 [준비사항] [[단계별방법] 완료결과]] */
export function StepAnswer({ sections }: { sections: AnswerSection[] }) {
  const headline = pickSection(sections, '핵심답변');
  const prepare = pickSection(sections, '준비사항');
  const steps = pickSection(sections, '단계별방법');
  const done = pickSection(sections, '완료결과');

  return (
    <SectionBox>
      <SectionBlock section={headline} />
      {prepare && (
        <SectionBox depth={1}>
          <SectionBlock section={prepare} />
        </SectionBox>
      )}
      {(steps || done) && (
        <SectionBox depth={1}>
          {steps && (
            <SectionBox depth={2}>
              <SectionBlock section={steps} />
            </SectionBox>
          )}
          <SectionBlock section={done} />
        </SectionBox>
      )}
      <RestSections sections={sections} except={LABELS} />
    </SectionBox>
  );
}
