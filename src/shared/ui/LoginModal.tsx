"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();

  const handleGoogleLogin = () => {
    const backend =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

    // 지금 접속한 프론트 기준으로 redirect_uri 생성
    const redirect = encodeURIComponent(`${window.location.origin}/dashboard`);

    window.location.href = `${backend}/oauth2/authorization/google?redirect_uri=${redirect}`;
  };

  const handleTestLogin = () => {
    // TODO: 테스트 계정으로 로그인 처리
    // 백엔드에서 테스트 계정 정보 받으면 수정 가능
    // 테스트 계정 정보를 세션/쿠키에 저장

    router.push("/dashboard");
    onClose();
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 모달 컨텐츠 */}
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-light hover:text-foreground transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">로그인</h2>
          <p className="text-gray text-sm">SnowMan과 함께 시작해보세요</p>
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-2xl bg-white border border-gray-light/30 px-6 py-4 flex items-center justify-center gap-3 font-semibold text-foreground text-base transition-all hover:bg-gray-light/5 hover:border-gray-light/50 active:scale-[0.98] shadow-sm mb-6"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google로 계속하기
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-light/30"></div>
          <span className="text-gray-light text-sm">또는</span>
          <div className="flex-1 h-px bg-gray-light/30"></div>
        </div>

        {/* 테스트 입장 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={handleTestLogin}
            className="text-gray text-sm hover:text-foreground transition-colors underline underline-offset-2 decoration-gray-light/50 hover:decoration-gray-light"
          >
            테스트 입장
          </button>
        </div>
      </div>
    </div>
  );
}
