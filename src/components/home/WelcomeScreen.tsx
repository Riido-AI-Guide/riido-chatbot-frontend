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
        {/* Figma group `character` 392×344 — 윤서가 준 그림자 포함 렌더(1568×344 비율 = 392×344와 동일)로 교체.
            그림자가 이미지에 구워져 있어서 CSS 그림자 3겹과 좌우반전이 더는 필요 없다 */}
        <img
          src={welcomeCharacter}
          alt=""
          aria-hidden
          data-name="welcome-character"
          className="h-[344px] w-[392px] shrink-0"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
