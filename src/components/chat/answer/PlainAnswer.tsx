import type { AnswerSection } from '@/api/conversations';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';

/** 모르는 answerType의 fallback. 서버가 준 순서대로 평평하게 그린다. */
export function PlainAnswer({ sections }: { sections: AnswerSection[] }) {
  return (
    <SectionBox>
      {sections.map((section, index) => (
        <SectionBlock key={`${section.label}-${index}`} section={section} />
      ))}
    </SectionBox>
  );
}
