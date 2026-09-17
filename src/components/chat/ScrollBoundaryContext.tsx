import { createContext, useContext } from 'react';

/**
 * 답변 피드백 팝오버 등이 화면 밖으로 안 나가게 기준으로 삼을 영역.
 * main(overflow-y-auto) 전체를 기준으로 삼으면, 입력창(footer)이 main 안에서
 * sticky bottom-0로 떠 있는 부분까지 "빈 공간"으로 계산돼서 팝오버가 입력창/그
 * 바로 위 트리거 줄과 겹쳐 보인다 — 그래서 footer를 뺀, 메시지가 실제로 쌓이는
 * 영역(Home.tsx)의 DOM 엘리먼트를 state로 받아서 그 기준으로 collisionBoundary를 잡는다.
 * (ref.current는 렌더 중에 읽으면 안 돼서 ref가 아니라 마운트된 엘리먼트 자체를 담는다.)
 */
const ScrollBoundaryContext = createContext<HTMLElement | null>(null);

export const ScrollBoundaryProvider = ScrollBoundaryContext.Provider;

export function useScrollBoundary(): HTMLElement | null {
  return useContext(ScrollBoundaryContext);
}
