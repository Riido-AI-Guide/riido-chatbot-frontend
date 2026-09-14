import { Check, Copy, Globe, Link } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Source } from '@/api/conversations';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type SourceButtonProps = {
  sources: Source[];
};

/** 근거 문서 url 복사 버튼 (Figma link-list-copy: default=copy → pressed=check) */
function CopyUrlButton({ url }: { url: string }) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timer = setTimeout(() => setIsCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <button
      type="button"
      aria-label={isCopied ? '복사됨' : '링크 복사'}
      onClick={() => {
        navigator.clipboard
          .writeText(url)
          .then(() => setIsCopied(true))
          .catch(() => undefined);
      }}
      className="flex size-4 shrink-0 items-center justify-center outline-none"
    >
      {isCopied ? (
        <Check className="size-4" strokeWidth={1.2} aria-hidden />
      ) : (
        <Copy className="size-4" strokeWidth={1.2} aria-hidden />
      )}
    </button>
  );
}

/**
 * Figma `link` (392:6904) — 문장 끝 24px 버튼, 안에 16px link 아이콘(stroke 1.2, icon-primary).
 * hover: fill-inverse 원형 배경 + 캔버스색 아이콘 (300ms ease-out).
 * 호버(또는 클릭·키보드)하면 Figma `tooltip`이 뜬다:
 *   fill-inverse 배경, radius 16, pad 4, gap 2, shadow-l
 *   행(link-connection) 192×32 radius 12 pad 7/8: globe 16 + Caption/12 text-secondary + copy 16
 *   행 hover: fill-hover-inverse(흰 8%) + 흰 글자 / pressed: 12%
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
        className="text-icon-primary hover:bg-fill-inverse hover:text-background-canvas focus-visible:ring-ring/50 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3"
      >
        <Link className="size-4" strokeWidth={1.2} aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        // 마우스 호버로 열렸을 땐 포커스를 뺏지 않는다. 키보드로 연 경우에만 링크로 넘긴다.
        initialFocus={(openType) => openType === 'keyboard'}
        className="bg-fill-inverse shadow-l w-[200px] rounded-[16px] p-1"
      >
        <ul className="flex flex-col gap-0.5">
          {sources.map((source, index) => {
            const label = source.section || source.docId;
            const rowClass =
              'text-text-secondary hover:bg-fill-hover-inverse hover:text-text-inverse active:bg-fill-press-inverse flex h-8 w-full items-center gap-1 rounded-12 px-2 py-[7px] text-caption-12 transition-colors outline-none focus-visible:text-text-inverse';

            return (
              <li key={`${source.docId}-${index}`}>
                {source.url === undefined ? (
                  <span className={rowClass}>
                    <Globe className="size-4 shrink-0" strokeWidth={1.2} aria-hidden />
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </span>
                ) : (
                  <span className={rowClass}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      title={source.docId}
                      className="flex min-w-0 flex-1 items-center gap-1 outline-none"
                    >
                      <Globe className="size-4 shrink-0" strokeWidth={1.2} aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                    </a>
                    <CopyUrlButton url={source.url} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
