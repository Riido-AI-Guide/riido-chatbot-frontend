import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

/**
 * react-markdown은 기본적으로 원본 HTML을 렌더링하지 않지만,
 * rehype-sanitize를 함께 걸어 XSS를 한 겹 더 막는다.
 */
const REHYPE_PLUGINS = [rehypeSanitize];
const REMARK_PLUGINS = [remarkGfm];

const components: Components = {
  h1: ({ children }) => (
    <h3 className="mt-5 mb-2 text-base font-semibold first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => (
    <h4 className="mt-5 mb-2 text-[0.95rem] font-semibold first:mt-0">{children}</h4>
  ),
  h3: ({ children }) => (
    <h5 className="mt-4 mb-1.5 text-sm font-semibold first:mt-0">{children}</h5>
  ),
  h4: ({ children }) => (
    <h6 className="mt-4 mb-1.5 text-sm font-semibold first:mt-0">{children}</h6>
  ),
  p: ({ children }) => <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-border text-muted-foreground my-2 border-l-2 pl-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-4" />,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-primary underline underline-offset-4"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isBlock = Boolean(className);

    if (isBlock) {
      return <code className="block font-mono text-[0.8rem]">{children}</code>;
    }

    return <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.8rem]">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="bg-muted my-3 overflow-x-auto rounded-lg p-3 text-[0.8rem]">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.8rem]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-border border px-2 py-1 font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-border border px-2 py-1">{children}</td>,
};

/**
 * 답변 섹션 본문용. 목록 마커는 .answer-prose(index.css)가 CSS로 그리므로
 * 여기서는 기본 list-style을 걷어내기만 한다.
 */
const answerComponents: Components = {
  ...components,
  p: ({ children }) => <p className="my-2 leading-7 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  // 텍스트를 span으로 감싸야 줄 끝에 근거 link 버튼을 인라인으로 붙일 수 있다 (SectionBlock)
  li: ({ children }) => (
    <li>
      <span className="li-body min-w-0">{children}</span>
    </li>
  ),
};

type MarkdownProps = {
  content: string;
  /** 'answer'는 답변 버블 안에서 쓰는 서체·목록 스타일 */
  variant?: 'chat' | 'answer';
  className?: string;
};

export function Markdown({ content, variant = 'chat', className }: MarkdownProps) {
  const isAnswer = variant === 'answer';

  return (
    <div
      className={cn(
        'break-words',
        isAnswer ? 'answer-prose text-body-16-reading' : 'text-sm',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={isAnswer ? answerComponents : components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
