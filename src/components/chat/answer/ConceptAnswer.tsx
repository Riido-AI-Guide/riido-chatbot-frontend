import type { AnswerSection } from '@/api/conversations';
import { AnswerHeadline, AnswerShell } from '@/components/chat/answer/AnswerShell';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, hasRestSections, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.concept;

type Props = { title: string | null; sections: AnswerSection[] };

/** 개념형: [핵심답변 [개념설명 [특징] 관련정보]] */
export function ConceptAnswer({ title, sections }: Props) {
  const headline = pickSection(sections, '핵심답변');
  const concept = pickSection(sections, '개념설명');
  const features = pickSection(sections, '특징');
  const related = pickSection(sections, '관련정보');
  const rest = hasRestSections(sections, LABELS);

  return (
    <AnswerShell>
      <AnswerHeadline title={title}>
        <SectionBlock section={headline} />
      </AnswerHeadline>

      {(concept || features || related || rest) && (
        <SectionBox variant="card" gap="lg">
          {(concept || features) && (
            <div className="flex w-full flex-col gap-3">
              <SectionBlock section={concept} />
              {features && (
                <SectionBox variant="inset">
                  <SectionBlock section={features} />
                </SectionBox>
              )}
            </div>
          )}
          <SectionBlock section={related} />
          <RestSections sections={sections} except={LABELS} />
        </SectionBox>
      )}
    </AnswerShell>
  );
}
