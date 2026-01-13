"use client";

import { useState } from "react";

// Mock 데이터: 일기를 쓴 날짜들
const writtenDates = [1, 3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28];

export default function DashboardPage() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  // 이번 달의 첫 번째 날과 마지막 날
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 달력 그리드 생성
  const calendarDays = [];
  
  // 첫 주의 빈 칸
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 실제 날짜들
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <p className="text-gray text-sm">일기를 쓴 날을 확인해보세요</p>
      </div>

      {/* 달력 */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square"></div>;
            }

            const isWritten = writtenDates.includes(day);
            const isToday = day === currentDate;

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  isToday
                    ? "bg-primary text-white"
                    : isWritten
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-light/10 text-gray"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* 오늘의 일기 미리보기 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          오늘의 일기
        </h3>
        {writtenDates.includes(currentDate) ? (
          <div className="space-y-2">
            <p className="text-gray text-sm line-clamp-2">
              오늘 하루가 정말 힘들었어요. 많은 일들이 있었지만 그래도
              버텨낼 수 있었습니다...
            </p>
            <button className="text-primary text-sm font-medium">
              더보기 →
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray text-sm mb-3">아직 오늘 일기를 쓰지 않았어요</p>
            <button className="rounded-xl bg-primary text-white px-6 py-2 font-semibold text-sm">
              일기 작성하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
