import { ArrowUpRight, Link } from 'lucide-react';

import { ICON_STROKE } from '@/lib/icon';

import type { Source } from '@/api/conversations';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type SourceButtonProps = {
  sources: Source[];
};

/**
 * 근거 문서 버튼. 문장 끝에 붙는 링크 아이콘이고, 호버(또는 클릭·키보드 포커스)하면
 * 근거 문서 목록이 뜬다. url이 있는 항목은 눌러서 원문으로 이동할 수 있다.
 */
export function SourceButton({ sources }: SourceButtonProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger
        // 링크를 눌러야 하므로 호버로 열되 클릭·키보드로도 열 수 있게 둔다.
        openOnHover
        delay={100}
        closeDelay={200}
        aria-label={`근거 문서 ${sources.length}건 보기`}
        className="hover:bg-fill-hover rounded-6 flex size-6 shrink-0 cursor-pointer items-center justify-center outline-offset-2"
      >
        {/* Figma answer-summary-row: 24px link 아이콘 */}
        <Link className="text-icon-secondary size-5" strokeWidth={ICON_STROKE} aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        // 마우스 호버로 열렸을 땐 포커스를 뺏지 않는다. 키보드로 연 경우에만 링크로 넘긴다.
        initialFocus={(openType) => openType === 'keyboard'}
        className="bg-answer-popup text-answer-popup-fg max-w-xs rounded-xl p-1.5 text-[0.8rem] shadow-none"
      >
        <ul className="flex flex-col gap-1">
          {sources.map((source, index) => {
            const label = source.section || source.docId;

            return (
              <li key={`${source.docId}-${index}`}>
                {source.url === undefined ? (
                  <span className="bg-answer-popup-row flex items-center gap-2 rounded-lg px-2.5 py-1.5">
                    <span className="bg-answer-popup-fg/70 size-3 shrink-0 rounded-full" />
                    <span className="min-w-0 break-words">{label}</span>
                  </span>
                ) : (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={source.docId}
                    className="bg-answer-popup-row hover:bg-answer-popup-fg/25 flex items-center gap-2 rounded-lg px-2.5 py-1.5 outline-offset-2 transition-colors"
                  >
                    <span className="bg-answer-popup-fg/70 size-3 shrink-0 rounded-full" />
                    <span className="min-w-0 break-words">{label}</span>
                    <ArrowUpRight className="ml-auto size-3.5 shrink-0 opacity-70" aria-hidden />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
