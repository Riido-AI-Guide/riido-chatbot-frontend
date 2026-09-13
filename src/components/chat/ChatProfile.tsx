import chatbotProfile from '@/assets/brand/chatbot-profile.png';

/**
 * Figma `chat-profile` (3142:7103) — 48×48 radius 12, fill-surface-strong(#E8EBED / #272F35) 배경 위에
 * 캐릭터 이미지를 70×70으로 키워 (-11, -3)에 놓고 잘라낸 것 (imageTransform 0.684 / offset 0.159, 0.043).
 */
export function ChatProfile() {
  return (
    <span
      className="bg-fill-surface-strong rounded-12 relative block size-12 shrink-0 overflow-hidden"
      aria-hidden
      data-name="chat-profile"
    >
      <img
        src={chatbotProfile}
        alt=""
        className="absolute top-[-3px] left-[-11px] h-[70px] w-[70px] max-w-none"
      />
    </span>
  );
}
