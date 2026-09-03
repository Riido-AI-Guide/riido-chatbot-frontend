import type { AnswerSection } from '@/api/conversations';
import { AnswerHeadline, AnswerShell } from '@/components/chat/answer/AnswerShell';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, hasRestSections, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.step;

type Props = { title: string | null; sections: AnswerSection[] };

/** 단계형: [핵심답변 [준비사항] [[단계별방법] 완료결과]] */
export function StepAnswer({ title, sections }: Props) {
  const headline = pickSection(sections, '핵심답변');
  const prepare = pickSection(sections, '준비사항');
  const steps = pickSection(sections, '단계별방법');
  const done = pickSection(sections, '완료결과');
  const rest = hasRestSections(sections, LABELS);

  return (
    <AnswerShell>
      <AnswerHeadline title={title}>
        <SectionBlock section={headline} />
      </AnswerHeadline>

      {prepare && (
        <SectionBox variant="note">
          <SectionBlock section={prepare} />
        </SectionBox>
      )}

      {(steps || done || rest) && (
        <SectionBox variant="card" gap="lg">
          <div className="flex w-full flex-col gap-3">
            {/* 단계 목록은 라벨을 박스 밖에 두고 본문만 안쪽 박스에 넣는다 */}
            <SectionBlock section={steps} bodyBox />
            <SectionBlock section={done} />
          </div>
          <RestSections sections={sections} except={LABELS} />
        </SectionBox>
      )}
    </AnswerShell>
  );
}
