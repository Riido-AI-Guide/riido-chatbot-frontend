import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** 첫 진입(새로고침)에는 딤을 띄우지 않는다 — 페이지를 "이동"한 게 아니라서 */
let hasMounted = false;

/**
 * 페이지가 바뀔 때 화면을 잠깐 덮었다가 걷히는 딤.
 * 색은 Figma Design system의 Dim 토큰(`--fill-dim`: 라이트 α40% / 다크 α60%),
 * 시간은 파일 기본 인터랙션과 같은 300ms ease-out.
 * (딤 화면 자체는 Figma에 시안이 없어 토큰·시간만 따랐다)
 */
export function RouteDim() {
  const { pathname } = useLocation();
  const isFirstRender = !hasMounted;

  useEffect(() => {
    hasMounted = true;
  }, []);

  if (isFirstRender) {
    return null;
  }

  return (
    // key가 바뀌면 새로 마운트되면서 페이드아웃 애니메이션이 다시 돈다
    <div
      key={pathname}
      className="bg-fill-dim route-dim pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}
