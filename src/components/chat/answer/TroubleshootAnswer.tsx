import type { AnswerSection } from '@/api/conversations';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.troubleshoot;

/**
 * 문제해결형: [핵심답변 [원인] [해결방법 해결확인]]
 * '상황확인'은 요구사항의 박스 그림에 자리가 없어 헤드라인 바로 아래 평범하게 둔다.
 */
export function TroubleshootAnswer({ sections }: { sections: AnswerSection[] }) {
  const headline = pickSection(sections, '핵심답변');
  const situation = pickSection(sections, '상황확인');
  const cause = pickSection(sections, '원인');
  const fix = pickSection(sections, '해결방법');
  const verify = pickSection(sections, '해결확인');

  return (
    <SectionBox>
      <SectionBlock section={headline} />
      <SectionBlock section={situation} />
      {cause && (
        <SectionBox depth={1}>
          <SectionBlock section={cause} />
        </SectionBox>
      )}
      {(fix || verify) && (
        <SectionBox depth={1}>
          <SectionBlock section={fix} />
          <SectionBlock section={verify} />
        </SectionBox>
      )}
      <RestSections sections={sections} except={LABELS} />
    </SectionBox>
  );
}
