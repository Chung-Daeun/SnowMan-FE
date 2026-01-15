"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared/ui/Header";
import { Navbar } from "@/shared/ui/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // 로그아웃 플래그 확인
    const isLoggedOut = localStorage.getItem("isLoggedOut");

    if (isLoggedOut === "true") {
      // 로그아웃 상태면 메인으로 강제 이동
      router.replace("/");
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="pb-20">{children}</main>
      <Navbar />
    </>
  );
}
