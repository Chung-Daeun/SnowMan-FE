"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/shared/config/api";
import { DiaryCard, DiaryEmptyState, LoadingSpinner } from "@/shared/ui";
import { formatDateDisplay, formatTime } from "@/shared/lib/date";

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

export default function DateDiaryPage() {
  const params = useParams();
  const router = useRouter();
  const date = (params?.date as string) || "";

  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDateDiaries = async () => {
      if (!date) return;

      setIsLoading(true);
      try {
        const response = await apiFetch(`/api/diary/day?date=${date}`);
        
        if (response.ok) {
          const data = await response.json();
          setDiaries(data.data || []);
        }
      } catch (error) {
        console.error("날짜별 일기 로드 실패:", error);
        setDiaries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDateDiaries();
  }, [date]);

  // 날짜 포맷팅
  const dateObj = new Date(date);
  const { month, day, weekDay, display } = formatDateDisplay(dateObj);

  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const dateOnly = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );

  const isToday = dateOnly.getTime() === todayDateOnly.getTime();
  const isFuture = dateOnly.getTime() > todayDateOnly.getTime();

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-gray hover:text-foreground"
        >
          ← 뒤로가기
        </button>
        <h2 className="text-2xl font-bold text-foreground mb-2">{display}</h2>
        <p className="text-gray text-sm">이 날 작성한 일기</p>
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
                contentLineClampClass="line-clamp-3"
                aiPreviewLineClampClass="line-clamp-2"
                onClick={() =>
                  router.push(`/dashboard/diary/${date}/${diary.diaryId}`)
                }
              />
            );
          })}
        </div>
      ) : isToday ? (
        <DiaryEmptyState
          title="오늘 작성한 일기가 없습니다"
          description="오늘의 감정을 간단히 남겨볼까요?"
          buttonLabel="오늘 일기 작성하기"
          onWriteClick={() => router.push("/dashboard/write")}
          fullHeight
        />
      ) : isFuture ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <p className="text-gray text-lg font-medium">
              미래 일기는 아직 작성할 수 없어요
            </p>
            <p className="text-gray-light text-sm">
              오늘이 되었을 때 천천히 기록해볼까요?
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <p className="text-gray text-lg font-medium">
              이 날 작성한 일기가 없습니다
            </p>
            <p className="text-gray-light text-sm">
              앞으로는 이 날들을 더 자주 기록해봐요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
