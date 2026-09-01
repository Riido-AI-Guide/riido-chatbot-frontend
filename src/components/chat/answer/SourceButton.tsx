import type { Source } from '@/api/conversations';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type SourceButtonProps = {
  sources: Source[];
};

/**
 * 근거 문서 버튼. 문장 끝에 붙는 원형 버튼이고, 호버(키보드는 포커스)하면
 * 근거 문서 목록이 뜬다. 문서 전문을 본문에 늘어놓지 않기 위한 시안 요구사항이다.
 */
export function SourceButton({ sources }: SourceButtonProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`근거 문서 ${sources.length}건 보기`}
        className="bg-answer-source mt-0.5 flex size-6 shrink-0 cursor-help items-center justify-center rounded-full outline-offset-2"
      >
        {/* 시안: 24px 원 안에 15px 링 */}
        <span className="border-answer-source-ring size-[15px] rounded-full border" />
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="start"
        sideOffset={8}
        className="bg-answer-popup text-answer-popup-fg max-w-xs flex-col items-stretch gap-1 rounded-xl p-1.5 text-[0.8rem]"
      >
        <ul className="flex flex-col gap-1">
          {sources.map((source, index) => (
            <li
              key={`${source.docId}-${index}`}
              className="bg-answer-popup-row flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            >
              <span className="bg-answer-popup-fg/70 size-3 shrink-0 rounded-full" />
              <span className="min-w-0 break-words">{source.section || source.docId}</span>
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}
