/**
 * 답변 카드에서 북마크를 켜고 끄면 사이드바 "답변 보관" 목록도 갱신돼야 한다.
 * 둘은 트리상 멀리 떨어져 있어서 window 이벤트로 느슨하게 잇는다.
 */
const EVENT = 'riido:bookmarks-changed';

export function emitBookmarksChanged() {
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeBookmarksChanged(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
