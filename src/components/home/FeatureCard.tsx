import type { ComponentType, SVGProps } from 'react';

type FeatureCardProps = {
  /** 디자이너 riido 아이콘 (components/icons/riido) */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

/**
 * Figma `feature-card-*` (2238:12564~) — 392px 카드.
 * 좌측 40×40 뱃지: primary-soft 배경 + riido 아이콘(stroke primary-border) + Title/18 + Body/14.
 */
export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-fill-question-preview border-border-disable rounded-16 flex h-20 items-start gap-3 border p-[15px]">
      <span
        className="bg-primary-soft rounded-12 flex size-10 shrink-0 items-center justify-center"
        aria-hidden
      >
        <Icon className="text-primary-border size-6" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-text-primary text-title-18 font-semibold tracking-tight">{title}</p>
        <p className="text-text-secondary text-body-14">{description}</p>
      </div>
    </div>
  );
}
