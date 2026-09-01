import type { AnswerSection } from '@/api/conversations';
import { AnswerHeadline, AnswerShell } from '@/components/chat/answer/AnswerShell';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, hasRestSections, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.troubleshoot;

type Props = { title: string | null; sections: AnswerSection[] };

/**
 * 문제해결형: [핵심답변 [원인] [해결방법 해결확인]]
 * 시안은 상황확인을 핵심답변과 같은 문단에 붙여 놨다. 라벨은 그대로 두고
 * 자리만 헤드라인 영역으로 맞춘다.
 */
export function TroubleshootAnswer({ title, sections }: Props) {
  const headline = pickSection(sections, '핵심답변');
  const situation = pickSection(sections, '상황확인');
  const cause = pickSection(sections, '원인');
  const fix = pickSection(sections, '해결방법');
  const verify = pickSection(sections, '해결확인');
  const rest = hasRestSections(sections, LABELS);

  return (
    <AnswerShell>
      <AnswerHeadline title={title}>
        <SectionBlock section={headline} />
        <SectionBlock section={situation} />
      </AnswerHeadline>

      {cause && (
        <SectionBox variant="note">
          <SectionBlock section={cause} />
        </SectionBox>
      )}

      {(fix || verify || rest) && (
        <SectionBox variant="card" gap="lg">
          <div className="flex w-full flex-col gap-3">
            <SectionBlock section={fix} bodyBox />
            <SectionBlock section={verify} />
          </div>
          <RestSections sections={sections} except={LABELS} />
        </SectionBox>
      )}
    </AnswerShell>
  );
}
