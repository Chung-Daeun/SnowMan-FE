"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WriteDiaryPage() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    // TODO: 일기 저장 API 호출
    console.log("일기 저장:", content);
    // 저장 후 대시보드로 이동
    router.push("/dashboard");
  };

  const handleCancel = () => {
    router.back();
  };

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
        />

        {/* 하단 버튼 */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-4 rounded-2xl border border-gray-light/30 text-gray font-semibold hover:bg-gray-light/10 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex-1 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-[#7a9588] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
