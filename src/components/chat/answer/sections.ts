import type { AnswerSection, AnswerType } from '@/api/conversations';

/**
 * answerType별로 서버가 내려주는 라벨 목록. 백엔드 SECTION_LABELS와 같은 순서다.
 * 라벨 문자열이 매칭 키이므로 백엔드와 글자가 정확히 같아야 한다.
 */
export const SECTION_LABELS: Record<AnswerType, string[]> = {
  concept: ['핵심답변', '개념설명', '특징', '관련정보'],
  step: ['핵심답변', '준비사항', '단계별방법', '완료결과'],
  judgement: ['핵심답변', '조건', '방법', '제한사항'],
  troubleshoot: ['핵심답변', '상황확인', '원인', '해결방법', '해결확인'],
  explore: ['기능요약', '주요기능', '추천', '활용방법', '관련질문'],
  no_answer: ['안내'],
};

/**
 * 답변의 첫 문단 역할이라 라벨을 감추고 본문만 보여주는 섹션.
 * explore의 '기능요약'도 같은 자리라 함께 감춘다.
 */
export const HEADLINE_LABELS = ['핵심답변', '기능요약'];

/** 라벨로 섹션 하나를 집는다. 서버가 안 준 라벨이면 undefined */
export function pickSection(sections: AnswerSection[], label: string): AnswerSection | undefined {
  return sections.find((section) => section.label === label);
}
