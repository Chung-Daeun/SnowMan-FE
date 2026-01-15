"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/shared/config/api";

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

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;
  const id = params.id as string;

  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCreatingAiReply, setIsCreatingAiReply] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewlyCreated, setIsNewlyCreated] = useState(false);

  const pollForAiReply = (isNew: boolean) => {
    // 비용 절감을 위해 폴링 간격을 늘리고 시도 횟수 줄임
    // 작성 직후인 경우: 3초 간격으로 20번 시도 (약 60초)
    // 수동 생성인 경우: 3초 간격으로 10번 시도 (약 30초)
    const pollInterval = 3000; // 3초 간격
    const maxAttempts = isNew ? 20 : 10;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await apiFetch(`/api/diary/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data.aiReply) {
            setDiary(data.data);
            setIsAiLoading(false);
            setIsCreatingAiReply(false);
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval); // 3초마다 재시도
        } else {
          // 최대 시도 횟수 도달 시 로딩 종료
          setIsAiLoading(false);
          setIsCreatingAiReply(false);
        }
      } catch (err) {
        console.error("AI 답변 폴링 실패:", err);
        setIsAiLoading(false);
        setIsCreatingAiReply(false);
      }
    };

    setTimeout(poll, pollInterval); // 첫 시도는 3초 후
  };

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/diary/${id}`);

        if (!response.ok) {
          throw new Error("일기를 불러올 수 없습니다");
        }

        const data = await response.json();
        setDiary(data.data);

        // 작성 직후인지 확인 (createdAt이 최근 2분 이내면 새로 작성한 것으로 간주)
        const createdAt = new Date(data.data.createdAt);
        const now = new Date();
        const isNew = (now.getTime() - createdAt.getTime()) < 120000; // 2분
        setIsNewlyCreated(isNew);

        // 작성 직후인 경우 무조건 폴링 시작 (AI 답변이 없으면)
        if (!data.data.aiReply && isNew) {
          setIsAiLoading(true);
          pollForAiReply(true);
        }
      } catch (err) {
        console.error("일기 로드 실패:", err);
        const errorMessage = err instanceof Error ? err.message : "일기를 불러올 수 없습니다";
        setError(errorMessage);
        
        // 삭제된 일기인 경우 경고창 표시
        if (errorMessage.includes("삭제된 일기")) {
          alert("삭제된 일기입니다.");
          router.back();
        }
      } finally {
        setIsLoading(false);
      }
    };


    if (id) {
      fetchDiary();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-gray mt-4">일기를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="text-gray mb-4">{error || "일기를 찾을 수 없어요"}</p>
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleCreateAiReply = async () => {
    if (!diary || isCreatingAiReply) return;

    setIsCreatingAiReply(true);
    setIsAiLoading(true);
    try {
      const response = await apiFetch(`/api/diary/${id}/ai-reply`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("AI 답변 생성에 실패했습니다");
      }

      // AI 답변 생성 시작했으므로 폴링 시작 (수동 생성이므로 false)
      setIsNewlyCreated(false);
      pollForAiReply(false);
    } catch (error) {
      console.error("AI 답변 생성 실패:", error);
      alert("AI 답변 생성에 실패했습니다. 다시 시도해주세요.");
      setIsCreatingAiReply(false);
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-6 gap-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-light mb-1">일기 상세</p>
          <h2 className="text-2xl font-bold text-foreground">
            {month}월 {day}일 ({weekDay})
          </h2>
          <span className="text-sm text-gray-light">{formatTime(diary.createdAt)}</span>
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
        {isAiLoading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary/70">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">AI가 답변을 생성하고 있어요...</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-primary/10 rounded animate-pulse"></div>
              <div className="h-3 bg-primary/10 rounded animate-pulse w-5/6"></div>
              <div className="h-3 bg-primary/10 rounded animate-pulse w-4/6"></div>
            </div>
          </div>
        ) : diary.aiReply ? (
          <>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {diary.aiReply.replyContent}
            </p>
            <div className="flex items-center gap-2 text-xs text-primary/80">
              <span>• 감정 분석 기반 제안</span>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-gray text-sm">AI 답변이 없습니다</p>
            {/* 작성 직후가 아닌 경우에만 버튼 표시 */}
            {!isNewlyCreated && (
              <button
                onClick={handleCreateAiReply}
                disabled={isCreatingAiReply || isAiLoading}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-[#7a9588] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingAiReply || isAiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>AI 답변 생성 중... 잠시만 기다려주세요</span>
                  </>
                ) : (
                  "AI 답변 생성하기"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
