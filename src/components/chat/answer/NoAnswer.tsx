import type { AnswerSection } from '@/api/conversations';
import { AnswerHeadline, AnswerShell } from '@/components/chat/answer/AnswerShell';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.no_answer;

type Props = { title: string | null; sections: AnswerSection[] };

/** 답변 불가 (Figma chat-light-not-guide): 제목 + 흰 answer-body-panel 안에 [안내] 한 문단 */
export function NoAnswer({ title, sections }: Props) {
  const notice = pickSection(sections, '안내');

  return (
    <AnswerShell>
      <AnswerHeadline title={title} />
      <SectionBox variant="card">
        <SectionBlock section={notice} />
        <RestSections sections={sections} except={LABELS} />
      </SectionBox>
    </AnswerShell>
  );
}
