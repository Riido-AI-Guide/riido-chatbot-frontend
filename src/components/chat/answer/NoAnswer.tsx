import type { AnswerSection } from '@/api/conversations';
import { RestSections } from '@/components/chat/answer/RestSections';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';
import { SECTION_LABELS, pickSection } from '@/components/chat/answer/sections';

const LABELS = SECTION_LABELS.no_answer;

/** 답변 불가: [안내] */
export function NoAnswer({ sections }: { sections: AnswerSection[] }) {
  const notice = pickSection(sections, '안내');

  return (
    <SectionBox>
      <SectionBlock section={notice} />
      <RestSections sections={sections} except={LABELS} />
    </SectionBox>
  );
}
