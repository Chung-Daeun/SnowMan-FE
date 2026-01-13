"use client";

import { useParams, useRouter } from "next/navigation";
import { dateDiaries } from "@/shared/mock/diary";

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
            <button
              key={diary.id}
              onClick={() => router.push(`/dashboard/diary/${date}/${diary.id}`)}
              className="w-full bg-white rounded-2xl p-5 shadow-sm text-left space-y-4 hover:shadow-md transition-shadow"
            >
              {/* 시간 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-light">{diary.time}</span>
              </div>

              {/* 일기 내용 */}
              <div className="space-y-2">
                <p className="text-foreground leading-relaxed line-clamp-3">
                  {diary.content}
                </p>
              </div>

              {/* AI 답변 미리보기 */}
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
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <p className="text-gray text-lg font-medium">
              이 날 작성한 일기가 없습니다
            </p>
            <p className="text-gray-light text-sm">
              일기를 작성해보세요
            </p>
            <button className="mt-4 rounded-xl bg-primary text-white px-6 py-3 font-semibold text-sm">
              일기 작성하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
