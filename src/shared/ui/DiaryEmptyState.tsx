interface DiaryEmptyStateProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onWriteClick: () => void;
  fullHeight?: boolean;
}

export function DiaryEmptyState({
  title = "이 날 작성한 일기가 없습니다",
  description = "일기를 작성해보세요",
  buttonLabel = "일기 작성하기",
  onWriteClick,
  fullHeight = false,
}: DiaryEmptyStateProps) {
  const containerClass = fullHeight
    ? "flex flex-col items-center justify-center py-16"
    : "bg-white rounded-2xl p-6 shadow-sm";

  return (
    <div className={containerClass}>
      <div className="text-center space-y-4">
        <p className="text-gray text-lg font-medium">{title}</p>
        <p className="text-gray-light text-sm">{description}</p>
        <button
          type="button"
          onClick={onWriteClick}
          className="mt-4 rounded-xl bg-primary text-white px-6 py-3 font-semibold text-sm hover:bg-[#7a9588] transition-colors"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

