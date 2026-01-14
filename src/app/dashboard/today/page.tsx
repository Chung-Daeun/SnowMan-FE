"use client";

import { useRouter } from "next/navigation";
import { todayDiaries } from "@/shared/mock/diary";
import { DiaryCard } from "@/shared/ui/DiaryCard";

export default function TodayPage() {
  const router = useRouter();
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()];
  const dateStr = `${today.getFullYear()}-${String(month).padStart(
    2,
    "0"
  )}-${String(date).padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          오늘의 일기
        </h2>
        <p className="text-gray text-sm">
          {month}월 {date}일 ({weekDay})
        </p>
      </div>

      {/* 일기 목록 */}
      <div className="space-y-4">
        {todayDiaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            time={diary.time}
            content={diary.content}
            aiPreview={diary.aiResponse}
            aiPreviewLineClampClass="line-clamp-2"
            onClick={() =>
              router.push(`/dashboard/diary/${dateStr}/${diary.id}`)
            }
          />
        ))}
      </div>

      {/* 일기 작성 버튼 */}
      <div className="fixed bottom-24 right-6">
        <button
          onClick={() => router.push("/dashboard/write")}
          className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

