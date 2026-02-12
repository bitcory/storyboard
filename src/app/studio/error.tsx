'use client';

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h2 className="text-lg font-medium mb-2">오류가 발생했습니다</h2>
      <p className="text-sm text-muted mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="text-xs px-4 py-2 border border-border rounded hover:border-border-light transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
