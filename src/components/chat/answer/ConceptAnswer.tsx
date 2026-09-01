import type { AnswerSection } from '@/api/conversations';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.concept;

/** 개념형: [핵심답변 [개념설명 [특징] 관련정보]] */
export function ConceptAnswer({ sections }: { sections: AnswerSection[] }) {
  const headline = pickSection(sections, '핵심답변');
  const concept = pickSection(sections, '개념설명');
  const features = pickSection(sections, '특징');
  const related = pickSection(sections, '관련정보');

  return (
    <SectionBox>
      <SectionBlock section={headline} />
      {(concept || features || related) && (
        <SectionBox depth={1}>
          <SectionBlock section={concept} />
          {features && (
            <SectionBox depth={2}>
              <SectionBlock section={features} />
            </SectionBox>
          )}
          <SectionBlock section={related} />
        </SectionBox>
      )}
      <RestSections sections={sections} except={LABELS} />
    </SectionBox>
  );
}
