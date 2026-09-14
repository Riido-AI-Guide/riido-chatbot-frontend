import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * riido 타이포 유틸리티(text-title-20 등)를 tailwind-merge에 글자 크기로 알려준다.
 * 안 그러면 색(text-text-primary)과 충돌한다고 보고 둘 중 하나를 지워 버린다.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'welcome',
            'title-20',
            'title-18',
            'title-16',
            'body-24',
            'body-16',
            'body-16-reading',
            'body-14',
            'caption-12',
            'button-16',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
