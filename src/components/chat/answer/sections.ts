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

/**
 * 백엔드 라벨을 화면 표기로 바꾼다. Figma는 "단계별 방법", "완료 결과"처럼 띄어 쓴다.
 * 매칭 키는 어디까지나 백엔드 라벨이고, 띄어쓰기는 보여줄 때만 적용한다.
 */
const DISPLAY_LABELS: Record<string, string> = {
  핵심답변: '핵심 답변',
  개념설명: '개념 설명',
  관련정보: '관련 정보',
  준비사항: '준비 사항',
  단계별방법: '단계별 방법',
  완료결과: '완료 결과',
  상황확인: '상황 확인',
  해결방법: '해결 방법',
  해결확인: '해결 확인',
  기능요약: '기능 요약',
  주요기능: '주요 기능',
  활용방법: '활용 방법',
  관련질문: '관련 질문',
};

export function displayLabel(label: string): string {
  return DISPLAY_LABELS[label] ?? label;
}

/** 라벨로 섹션 하나를 집는다. 서버가 안 준 라벨이면 undefined */
export function pickSection(sections: AnswerSection[], label: string): AnswerSection | undefined {
  return sections.find((section) => section.label === label);
}

/** 레이아웃이 자리를 못 잡아 준 섹션이 있는지. 카드를 열지 말지 판단할 때 쓴다. */
export function hasRestSections(sections: AnswerSection[], except: string[]): boolean {
  return sections.some((section) => !except.includes(section.label));
}
