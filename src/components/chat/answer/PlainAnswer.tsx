import type { AnswerSection } from '@/api/conversations';
import { AnswerHeadline, AnswerShell } from '@/components/chat/answer/AnswerShell';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox } from '@/components/chat/answer/SectionBox';

type Props = { title: string | null; sections: AnswerSection[] };

/** 모르는 answerType의 fallback. 서버가 준 순서대로 카드 하나에 평평하게 그린다. */
export function PlainAnswer({ title, sections }: Props) {
  return (
    <AnswerShell>
      <AnswerHeadline title={title} />
      <SectionBox variant="card" gap="lg">
        {sections.map((section, index) => (
          <SectionBlock key={`${section.label}-${index}`} section={section} />
        ))}
      </SectionBox>
    </AnswerShell>
  );
}
