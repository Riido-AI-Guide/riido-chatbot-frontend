export function TypingIndicator() {
  return (
    <div className="flex flex-col items-start gap-1">
      <div
        className="bg-muted flex items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="bg-muted-foreground size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
          <span className="bg-muted-foreground size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
          <span className="bg-muted-foreground size-1.5 animate-bounce rounded-full" />
        </span>
        <span className="text-muted-foreground text-sm">답변을 작성하고 있어요</span>
      </div>
      <p className="text-muted-foreground px-1 text-[0.7rem]">
        자료를 찾아 정리하느라 십수 초까지 걸릴 수 있어요.
      </p>
    </div>
  );
}
