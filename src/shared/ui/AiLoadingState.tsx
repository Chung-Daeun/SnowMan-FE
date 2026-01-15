/**
 * AI 답변 생성 중 로딩 상태 컴포넌트
 */
export function AiLoadingState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="space-y-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">AI 답변 생성 중...</h2>
          <p className="text-gray text-sm">잠시만 기다려주세요</p>
        </div>
        <div className="space-y-2 mt-6">
          <div className="h-3 bg-primary/10 rounded animate-pulse w-64 mx-auto"></div>
          <div className="h-3 bg-primary/10 rounded animate-pulse w-56 mx-auto"></div>
          <div className="h-3 bg-primary/10 rounded animate-pulse w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
