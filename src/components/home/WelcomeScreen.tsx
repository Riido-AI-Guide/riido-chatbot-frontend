import welcomeCharacter from '@/assets/brand/welcome-character.png';
import { FeatureCard } from '@/components/home/FeatureCard';
import {
  RiidoAiSearchIcon,
  RiidoArrangeIcon,
  RiidoChatIcon,
  RiidoVisionIcon,
} from '@/components/icons/riido';

const FEATURES = [
  {
    icon: RiidoChatIcon,
    title: '대화로 원하는 답 찾아가기',
    description: '후속 질문을 이어가며 답을 찾아갈 수 있어요.',
  },
  {
    icon: RiidoAiSearchIcon,
    title: '필요한 정보 바로 찾기',
    description: '질문만으로 필요한 정보를 빠르게 확인할 수 있어요.',
  },
  {
    icon: RiidoArrangeIcon,
    title: '내 질문에 맞게 쉽게 이해하기',
    description: '필요한 내용만 구성된 답변을 확인할 수 있어요.',
  },
  {
    icon: RiidoVisionIcon,
    title: '흩어진 정보 한 번에 확인하기',
    description: '여러 페이지의 정보를 하나의 답변으로 확인할 수 있어요.',
  },
] as const;

/**
 * Figma `entry-screen-sidebar-lg` 본문 — 인사말 + 이미지 영역 + 기능 카드 4개.
 */
export function WelcomeScreen() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-14 pt-8">
      <div className="flex items-start justify-between gap-6">
        <div className="text-text-strong flex w-[364px] shrink-0 flex-col gap-5 pt-[70px]">
          <h2 className="text-welcome font-semibold tracking-tight">
            안녕하세요,
            <br />
            가이드 리로예요.
          </h2>
          <p className="text-body-16-reading">
            뤼이도를 이용하다 궁금한 점이 생기면 편하게 물어보세요.
            <br />
            이용가이드를 바탕으로 빠르고 정확하게 답변해드릴게요!
          </p>
        </div>
        {/* Figma group `character` 392×344 — 바닥 그림자 3겹(블러 타원) 위에 캐릭터 이미지.
            이미지는 346×346으로 (28, -33)에 놓고 위쪽을 잘라낸다 (imageTransform 1.132/0.994, offset -0.080/0.095).
            윤서 요청으로 그림자까지 통째로 좌우반전(-scale-x-100) — Figma 원본은 오른쪽을 본다 */}
        <div
          className="relative h-[344px] w-[392px] shrink-0 -scale-x-100 overflow-hidden"
          aria-hidden
          data-name="welcome-character"
        >
          <span className="absolute top-[256px] left-[135px] h-10 w-[191px] rounded-full bg-[#181d21]/22 blur-[20px]" />
          <span className="absolute top-[263px] left-[126px] h-[26px] w-[172px] rounded-full bg-[#181d21]/36 blur-[12px]" />
          <span className="absolute top-[262px] left-[223px] h-[22px] w-[46px] rounded-full bg-[#181d21] blur-[8px]" />
          <img
            src={welcomeCharacter}
            alt=""
            className="absolute top-[-33px] left-[28px] h-[346px] w-[346px] max-w-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
