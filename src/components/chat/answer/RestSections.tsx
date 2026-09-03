import type { AnswerSection } from '@/api/conversations';
import { SectionBlock } from '@/components/chat/answer/SectionBlock';

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
      {rest.map((section, index) => (
        <SectionBlock key={`${section.label}-${index}`} section={section} />
      ))}
    </>
  );
}
