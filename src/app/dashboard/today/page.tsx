"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/shared/config/api";
import { DiaryCard, LoadingSpinner } from "@/shared/ui";
import { getTodayDateString, formatDateDisplay, formatTime } from "@/shared/lib/date";

interface DiaryData {
  diaryId: number;
  userId: number;
  content: string;
  aiReply: {
    aiReplyId: number;
    replyContent: string;
    createdAt: string;
  } | null;
  createdAt: string;
}

export default function TodayPage() {
  const router = useRouter();
  const today = new Date();
  const { month, day, weekDay, display } = formatDateDisplay(today);
  const dateStr = getTodayDateString();

  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayDiaries = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch(`/api/diary/day?date=${dateStr}`);
        
        if (response.ok) {
          const data = await response.json();
          setDiaries(data.data || []);
        }
      } catch (error) {
        console.error("오늘 일기 로드 실패:", error);
        setDiaries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayDiaries();
  }, [dateStr]);

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          오늘의 일기
        </h2>
        <p className="text-gray text-sm">{display}</p>
      </div>

      {/* 일기 목록 */}
      {isLoading ? (
        <LoadingSpinner className="py-8" />
      ) : diaries.length > 0 ? (
        <div className="space-y-4">
          {diaries.map((diary) => {
            const timeStr = formatTime(diary.createdAt);

            return (
              <DiaryCard
                key={diary.diaryId}
                time={timeStr}
                content={diary.content}
                aiPreview={diary.aiReply?.replyContent || ""}
                aiPreviewLineClampClass="line-clamp-2"
                onClick={() =>
                  router.push(`/dashboard/diary/${dateStr}/${diary.diaryId}`)
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center space-y-2">
            <p className="text-gray text-lg font-medium">
              오늘 작성한 일기가 없습니다
            </p>
            <p className="text-gray-light text-sm">
              오늘의 감정을 간단히 남겨볼까요?
            </p>
          </div>
        </div>
      )}

      {/* 일기 작성 버튼 (모바일 프레임 안쪽 하단 우측) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 flex justify-end">
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

