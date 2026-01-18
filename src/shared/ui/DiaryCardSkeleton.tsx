// src/shared/ui/DiaryCardSkeleton.tsx
"use client";

type Props = {
  count?: number;
};

export function DiaryCardSkeleton({ count = 3 }: Props) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`diary-skeleton-${idx}`}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          {/* time */}
          <div className="h-4 w-16 rounded-md bg-gray-light/20 animate-pulse mb-3" />

          {/* content lines */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-gray-light/20 animate-pulse" />
            <div className="h-4 w-11/12 rounded-md bg-gray-light/20 animate-pulse" />
            <div className="h-4 w-9/12 rounded-md bg-gray-light/20 animate-pulse" />
          </div>

          {/* ai preview */}
          <div className="mt-4 space-y-2">
            <div className="h-3 w-24 rounded-md bg-gray-light/20 animate-pulse" />
            <div className="h-3 w-10/12 rounded-md bg-gray-light/20 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
