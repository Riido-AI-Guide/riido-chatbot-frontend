import type { AnswerSection } from '@/api/conversations';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.explore;

/** 추천형: [기능요약 [주요기능 [추천] 활용방법 관련질문]] */
export function ExploreAnswer({ sections }: { sections: AnswerSection[] }) {
  const summary = pickSection(sections, '기능요약');
  const features = pickSection(sections, '주요기능');
  const recommend = pickSection(sections, '추천');
  const usage = pickSection(sections, '활용방법');
  const followUps = pickSection(sections, '관련질문');

  return (
    <SectionBox>
      <SectionBlock section={summary} />
      {(features || recommend || usage || followUps) && (
        <SectionBox depth={1}>
          <SectionBlock section={features} />
          {recommend && (
            <SectionBox depth={2}>
              <SectionBlock section={recommend} />
            </SectionBox>
          )}
          <SectionBlock section={usage} />
          <SectionBlock section={followUps} />
        </SectionBox>
      )}
      <RestSections sections={sections} except={LABELS} />
    </SectionBox>
  );
}
