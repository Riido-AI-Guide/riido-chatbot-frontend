/**
 * "운영팀에 문의하기"는 사이드바·레일·답변 카드·에러 박스 여러 곳에서 열린다.
 * 트리상 멀리 떨어져 있어서 window 이벤트로 ContactDialogHost(Home)에 알린다.
 */
const EVENT = 'riido:open-contact';

export function openContactDialog() {
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeOpenContact(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
