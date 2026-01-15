interface DiaryCardProps {
  time: string;
  content: string;
  aiPreview: string | null;
  onClick: () => void;
  contentLineClampClass?: string;
  aiPreviewLineClampClass?: string;
}

export function DiaryCard({
  time,
  content,
  aiPreview,
  onClick,
  contentLineClampClass = "",
  aiPreviewLineClampClass = "",
}: DiaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-5 shadow-sm text-left space-y-4 hover:shadow-md transition-shadow"
    >
      {/* 시간 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-light">{time}</span>
      </div>

      {/* 일기 내용 */}
      <div className="space-y-2">
        <p
          className={`text-foreground leading-relaxed ${
            contentLineClampClass ?? ""
          }`}
        >
          {content}
        </p>
      </div>

      {/* AI 답변 미리보기 */}
      {aiPreview ? (
        <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-xs font-semibold text-primary">AI</span>
          </div>
          <p
            className={`text-sm text-foreground leading-relaxed ${
              aiPreviewLineClampClass ?? ""
            }`}
          >
            {aiPreview}
          </p>
        </div>
      ) : null}
    </button>
  );
}

