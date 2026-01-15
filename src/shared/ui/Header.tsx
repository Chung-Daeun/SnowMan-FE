"use client";

import { API_BASE_URL } from "@/shared/config/api";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "SnowMan" }: HeaderProps) {
  const handleLogout = async () => {
    try {
      // 백엔드 로그아웃 API 호출
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // 세션 쿠키 포함
      });

      // 로그아웃 플래그 저장
      localStorage.setItem("isLoggedOut", "true");

      // 메인 페이지로 리디렉션 (히스토리 교체)
      window.location.replace("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // 실패해도 플래그 저장하고 메인 페이지로 이동
      localStorage.setItem("isLoggedOut", "true");
      window.location.replace("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-light/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="text-gray hover:text-foreground transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-light/10"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
