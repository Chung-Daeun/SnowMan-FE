"use client";

import { useParams, useRouter } from "next/navigation";
import { diaryDetails } from "@/shared/mock/diary";

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;
  const id = params.id as string;

  const diary = diaryDetails[date]?.[id] || null;

  if (!diary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="text-gray mb-4">일기를 찾을 수 없어요</p>
        <button
          onClick={() => router.back()}
          className="text-primary font-medium"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"][dateObj.getDay()];

  return (
    <div className="flex min-h-screen flex-col px-6 py-6 gap-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-light mb-1">일기 상세</p>
          <h2 className="text-2xl font-bold text-foreground">
            {month}월 {day}일 ({weekDay})
          </h2>
          <span className="text-sm text-gray-light">{diary.time}</span>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-full border border-gray-light/50 px-3 py-1 text-sm text-gray hover:text-foreground hover:border-gray-light transition-colors"
        >
          ← 돌아가기
        </button>
      </div>

      {/* 일기 카드 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 border border-gray-light/30">
        <div className="flex items-center gap-2 text-sm text-gray">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="font-medium text-foreground">나의 일기</span>
        </div>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {diary.content}
        </p>
      </div>

      {/* AI 답변 카드 */}
      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/30 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm font-semibold text-primary">AI 응답</span>
        </div>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {diary.aiResponse}
        </p>
        <div className="flex items-center gap-2 text-xs text-primary/80">
          <span>• 감정 분석 기반 제안</span>
        </div>
      </div>
    </div>
  );
}
