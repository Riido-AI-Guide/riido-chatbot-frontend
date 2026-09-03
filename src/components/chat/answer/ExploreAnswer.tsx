import type { AnswerSection } from '@/api/conversations';
import { AnswerHeadline, AnswerShell } from '@/components/chat/answer/AnswerShell';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, hasRestSections, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.explore;

type Props = { title: string | null; sections: AnswerSection[] };

/** 추천형: [기능요약 [주요기능 [추천] 활용방법 관련질문]] */
export function ExploreAnswer({ title, sections }: Props) {
  const summary = pickSection(sections, '기능요약');
  const features = pickSection(sections, '주요기능');
  const recommend = pickSection(sections, '추천');
  const usage = pickSection(sections, '활용방법');
  const followUps = pickSection(sections, '관련질문');
  const rest = hasRestSections(sections, LABELS);

  return (
    <AnswerShell>
      <AnswerHeadline title={title}>
        <SectionBlock section={summary} />
      </AnswerHeadline>

      {(features || recommend || usage || followUps || rest) && (
        <SectionBox variant="card" gap="lg">
          {(features || recommend || usage) && (
            <div className="flex w-full flex-col gap-3">
              <SectionBlock section={features} />
              {recommend && (
                <SectionBox variant="inset">
                  <SectionBlock section={recommend} />
                </SectionBox>
              )}
              <SectionBlock section={usage} />
            </div>
          )}
          {/* 관련질문은 본문이 아니라 카드 목록으로 그린다 */}
          <SectionBlock section={followUps} asChips />
          <RestSections sections={sections} except={LABELS} />
        </SectionBox>
      )}
    </AnswerShell>
  );
}
