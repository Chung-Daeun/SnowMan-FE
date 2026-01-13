"use client";

import { useRouter } from "next/navigation";
import { todayDiaries } from "@/shared/mock/diary";

export default function TodayPage() {
  const router = useRouter();
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()];
  const dateStr = `${today.getFullYear()}-${String(month).padStart(2, "0")}-${String(
    date
  ).padStart(2, "0")}`;

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
          <button
            key={diary.id}
            onClick={() => router.push(`/dashboard/diary/${dateStr}/${diary.id}`)}
            className="w-full bg-white rounded-2xl p-5 shadow-sm space-y-4 text-left hover:shadow-md transition-shadow"
          >
            {/* 시간 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-light">{diary.time}</span>
            </div>

            {/* 일기 내용 */}
            <div className="space-y-2">
              <p className="text-foreground leading-relaxed">
                {diary.content}
              </p>
            </div>

            {/* AI 답변 */}
            <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs font-semibold text-primary">AI</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                {diary.aiResponse}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* 일기 작성 버튼 */}
      <div className="fixed bottom-24 right-6">
        <button className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
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
