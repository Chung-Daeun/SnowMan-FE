import { useState, useCallback } from "react";
import { apiFetch } from "@/shared/config/api";

interface UseWaitForAiReplyOptions {
  diaryId: string | number;
  onSuccess?: (diary: any) => void;
  maxWaitTime?: number;
  checkInterval?: number;
}

/**
 * AI 답변이 생성될 때까지 기다리는 커스텀 훅
 */
export function useWaitForAiReply({
  diaryId,
  onSuccess,
  maxWaitTime = 60000, // 60초
  checkInterval = 2000, // 2초마다 확인
}: UseWaitForAiReplyOptions) {
  const [isLoading, setIsLoading] = useState(false);

  const waitForAiReply = useCallback(async () => {
    setIsLoading(true);
    const startTime = Date.now();

    const check = async () => {
      try {
        const response = await apiFetch(`/api/diary/${diaryId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data.aiReply) {
            setIsLoading(false);
            onSuccess?.(data.data);
            return;
          }
        }

        // 최대 대기 시간 확인
        if (Date.now() - startTime < maxWaitTime) {
          setTimeout(check, checkInterval);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("AI 답변 확인 실패:", err);
        setIsLoading(false);
      }
    };

    setTimeout(check, checkInterval);
  }, [diaryId, onSuccess, maxWaitTime, checkInterval]);

  return {
    isLoading,
    waitForAiReply,
    setIsLoading,
  };
}
