import { RotateCcw, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ErrorNoticeProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 flex flex-col gap-2 rounded-xl border px-4 py-3"
    >
      <div className="flex items-start gap-2">
        <TriangleAlert className="text-destructive mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p className="text-destructive text-sm">{message}</p>
      </div>
      <div>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw aria-hidden="true" />
          다시 시도
        </Button>
      </div>
    </div>
  );
}
