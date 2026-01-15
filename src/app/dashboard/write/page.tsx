"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/shared/config/api";
import { getTodayDateString } from "@/shared/lib/date";
import { AiLoadingState } from "@/shared/ui";

export default function WriteDiaryPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaitingForAi, setIsWaitingForAi] = useState(false);
  const [diaryId, setDiaryId] = useState<number | null>(null);
  const responseReceivedRef = useRef(false);

  // isWaitingForAi가 true이고 diaryId가 있으면 상세 페이지로 이동
  useEffect(() => {
    if (isWaitingForAi && diaryId) {
      const dateString = getTodayDateString();
      router.push(`/dashboard/diary/${dateString}/${diaryId}`);
    }
  }, [isWaitingForAi, diaryId, router]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting || isWaitingForAi) return;

    setIsSubmitting(true);
    responseReceivedRef.current = false;
    
    let twoSecondTimer: NodeJS.Timeout | null = null;
    
    // 0.5초 타이머 시작
    twoSecondTimer = setTimeout(() => {
      if (!responseReceivedRef.current) {
        setIsSubmitting(false);
        setIsWaitingForAi(true);
      }
    }, 500);

    try {
      const response = await apiFetch("/api/diary/create", {
        method: "POST",
        body: JSON.stringify({ content: content.trim() }),
      });

      responseReceivedRef.current = true;
      if (twoSecondTimer) {
        clearTimeout(twoSecondTimer);
      }

      if (!response.ok) {
        throw new Error("일기 저장에 실패했습니다");
      }

      const data = await response.json();
      const receivedDiaryId = data.data.diaryId;

      // 0.5초 이내에 응답이 왔으면 바로 상세 페이지로 이동
      if (!isWaitingForAi) {
        const dateString = getTodayDateString();
        router.push(`/dashboard/diary/${dateString}/${receivedDiaryId}`);
      } else {
        // 이미 로딩 페이지가 표시된 경우 diaryId 설정 (useEffect에서 처리)
        setDiaryId(receivedDiaryId);
      }
    } catch (error) {
      responseReceivedRef.current = true;
      if (twoSecondTimer) {
        clearTimeout(twoSecondTimer);
      }
      console.error("일기 저장 실패:", error);
      alert("일기 저장에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
      setIsWaitingForAi(false);
      setDiaryId(null);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // AI 답변 생성 중 로딩 페이지
  if (isWaitingForAi) {
    return <AiLoadingState />;
  }

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">일기 작성</h2>
        <button
          onClick={handleCancel}
          className="text-gray hover:text-foreground transition-colors"
        >
          취소
        </button>
      </div>

      {/* 일기 작성 영역 */}
      <div className="flex-1 flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘 하루는 어땠나요?&#10;마음껏 적어보세요..."
          className="flex-1 w-full bg-white rounded-2xl p-6 text-foreground placeholder-gray-light resize-none border border-gray-light/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          autoFocus
          disabled={isSubmitting}
        />

        {/* 하단 버튼 */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 py-4 rounded-2xl border border-gray-light/30 text-gray font-semibold hover:bg-gray-light/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="flex-1 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-[#7a9588] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
