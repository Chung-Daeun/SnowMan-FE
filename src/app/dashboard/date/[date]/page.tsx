"use client";

import { useParams, useRouter } from "next/navigation";
import { dateDiaries } from "@/shared/mock/diary";
import { DiaryCard } from "@/shared/ui/DiaryCard";
import { DiaryEmptyState } from "@/shared/ui/DiaryEmptyState";

export default function DateDiaryPage() {
  const params = useParams();
  const router = useRouter();
  const date = (params?.date as string) || "";

  const diaries = dateDiaries[date] || [];

  // 날짜 포맷팅
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"][dateObj.getDay()];

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-gray hover:text-foreground"
        >
          ← 뒤로가기
        </button>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {month}월 {day}일 ({weekDay})
        </h2>
        <p className="text-gray text-sm">이 날 작성한 일기</p>
      </div>

      {/* 일기 목록 */}
      {diaries.length > 0 ? (
        <div className="space-y-4">
          {diaries.map((diary) => (
            <DiaryCard
              key={diary.id}
              time={diary.time}
              content={diary.content}
              aiPreview={diary.aiResponse}
              contentLineClampClass="line-clamp-3"
              aiPreviewLineClampClass="line-clamp-2"
              onClick={() =>
                router.push(`/dashboard/diary/${date}/${diary.id}`)
              }
            />
          ))}
        </div>
      ) : (
        <DiaryEmptyState
          onWriteClick={() => router.push("/dashboard/write")}
          fullHeight
        />
      )}
    </div>
  );
}
