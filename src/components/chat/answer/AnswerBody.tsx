import type { AnswerSection, AnswerType } from '@/api/conversations';
import { ConceptAnswer } from '@/components/chat/answer/ConceptAnswer';
import { ExploreAnswer } from '@/components/chat/answer/ExploreAnswer';
import { JudgementAnswer } from '@/components/chat/answer/JudgementAnswer';
import { NoAnswer } from '@/components/chat/answer/NoAnswer';
import { PlainAnswer } from '@/components/chat/answer/PlainAnswer';
import { StepAnswer } from '@/components/chat/answer/StepAnswer';
import { TroubleshootAnswer } from '@/components/chat/answer/TroubleshootAnswer';

type AnswerBodyProps = {
  /** 답변 제목. 각 레이아웃의 헤드라인 영역에 들어간다. */
  title: string | null;
  answerType: AnswerType | null;
  sections: AnswerSection[];
};

/**
 * answerType에 맞는 레이아웃을 고른다.
 * 타입을 모르면(신규 타입·null) 라벨 순서대로 평평하게 그려서 내용은 잃지 않는다.
 */
export function AnswerBody({ title, answerType, sections }: AnswerBodyProps) {
  switch (answerType) {
    case 'concept':
      return <ConceptAnswer title={title} sections={sections} />;
    case 'step':
      return <StepAnswer title={title} sections={sections} />;
    case 'judgement':
      return <JudgementAnswer title={title} sections={sections} />;
    case 'troubleshoot':
      return <TroubleshootAnswer title={title} sections={sections} />;
    case 'explore':
      return <ExploreAnswer title={title} sections={sections} />;
    case 'no_answer':
      return <NoAnswer title={title} sections={sections} />;
    default:
      return <PlainAnswer title={title} sections={sections} />;
  }
}
