import type { AnswerSection } from '@/api/conversations';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';
import { SectionBox, type BoxVariant } from '@/components/chat/answer/SectionBox';

/** Figma에서 색이 정해진 라벨: 주의사항 = 주황 박스, 제한사항 = 빨간 박스 */
const BOXED_LABELS: Record<string, BoxVariant> = {
  주의사항: 'warning',
  제한사항: 'danger',
};

type RestSectionsProps = {
  sections: AnswerSection[];
  /** 레이아웃이 이미 자리를 잡아 준 라벨들 */
  except: string[];
};

/**
 * 레이아웃에 자리가 없는 라벨을 빠뜨리지 않고 뒤에 이어 붙인다.
 * 백엔드가 라벨을 추가해도 화면에서 사라지지 않게 하는 안전망이다.
 */
export function RestSections({ sections, except }: RestSectionsProps) {
  const rest = sections.filter((section) => !except.includes(section.label));

  if (rest.length === 0) {
    return null;
  }

  return (
    <>
      {rest.map((section, index) => {
        const variant = BOXED_LABELS[section.label];
        const key = `${section.label}-${index}`;
        return variant ? (
          <SectionBox key={key} variant={variant}>
            <SectionBlock section={section} className="gap-[10px]" />
          </SectionBox>
        ) : (
          <SectionBlock key={key} section={section} />
        );
      })}
    </>
  );
}
