/**
 * 답변 카드에서 북마크를 켜고 끄면 사이드바 "답변 보관" 목록도 갱신돼야 하고,
 * 반대로 보관 목록에서 해제하면 채팅 카드의 북마크 아이콘도 꺼져야 한다.
 * 둘은 트리상 멀리 떨어져 있어서 window 이벤트로 느슨하게 잇는다.
 */
const EVENT = 'riido:bookmarks-changed';

/** 어떤 메시지가 어떻게 바뀌었는지. 목록만 새로 받으면 될 때는 생략한다 */
export type BookmarkChange = { messageId: number; bookmarked: boolean };

export function emitBookmarksChanged(change?: BookmarkChange) {
  window.dispatchEvent(new CustomEvent<BookmarkChange | undefined>(EVENT, { detail: change }));
}

export function subscribeBookmarksChanged(listener: (change?: BookmarkChange) => void): () => void {
  const handler = (event: Event) => {
    listener((event as CustomEvent<BookmarkChange | undefined>).detail);
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
