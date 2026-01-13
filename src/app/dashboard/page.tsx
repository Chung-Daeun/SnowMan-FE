"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { dateDiaries, getWrittenDatesByMonth } from "@/shared/mock/diary";

export default function DashboardPage() {
  const router = useRouter();
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [selectedDate, setSelectedDate] = useState<number | null>(currentDate);

  // 현재 보고 있는 달의 첫 번째 날과 마지막 날
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 이전 달/다음 달로 이동
  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setViewMonth(currentMonth);
    setViewYear(currentYear);
    setSelectedDate(currentDate);
  };

  // 현재 보고 있는 달이 오늘인지 확인
  const isCurrentMonth = viewMonth === currentMonth && viewYear === currentYear;

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

  // 현재 보고 있는 달에서 작성된 날짜 목록
  const writtenDates = useMemo(
    () => getWrittenDatesByMonth(viewYear, viewMonth),
    [viewMonth, viewYear]
  );

  // 선택된 날짜의 일기 가져오기
  const getSelectedDateString = () => {
    if (selectedDate === null) return null;
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(
      selectedDate
    ).padStart(2, "0")}`;
  };

  const selectedDateString = getSelectedDateString();
  const selectedDiaries = selectedDateString
    ? dateDiaries[selectedDateString] || []
    : [];

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-foreground">
            {monthNames[viewMonth]} {viewYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="text-sm text-primary font-medium px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
              오늘 보기
            </button>
          </div>
        </div>
        <p className="text-gray text-sm">일기를 쓴 날을 확인해보세요</p>
      </div>

      {/* 달력 */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        {/* 달력 헤더 (이전/다음 달 버튼) */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-light/10 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-light/10 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

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
              return <div key={`empty-${index}`} className="aspect-square"></div>;
            }

            // 현재 보고 있는 달의 날짜에 일기가 있는지 확인
            const dateString = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isWritten = dateDiaries[dateString] && dateDiaries[dateString].length > 0;
            const isToday = isCurrentMonth && day === currentDate;
            const isSelected = day === selectedDate;

            return (
              <button
                key={`day-${viewYear}-${viewMonth}-${day}`}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                    : isToday
                    ? "bg-primary/30 text-primary"
                    : isWritten
                    ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                    : "bg-gray-light/10 text-gray hover:bg-gray-light/20 cursor-pointer"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 날짜의 일기 목록 */}
      {selectedDate && (
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {monthNames[viewMonth]} {selectedDate}일
            </h3>
            <p className="text-gray text-sm">
              {isCurrentMonth && selectedDate === currentDate ? "오늘" : ""} 작성한 일기
            </p>
          </div>

          {selectedDiaries.length > 0 ? (
            <div className="space-y-4">
              {selectedDiaries.map((diary) => (
                <button
                  key={diary.id}
                  onClick={() => {
                    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
                    router.push(`/dashboard/diary/${dateStr}/${diary.id}`);
                  }}
                  className="w-full bg-white rounded-2xl p-5 shadow-sm text-left space-y-4 hover:shadow-md transition-shadow"
                >
                  {/* 시간 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-light">{diary.time}</span>
                  </div>

                  {/* 일기 내용 */}
                  <div className="space-y-2">
                    <p className="text-foreground leading-relaxed line-clamp-3">
                      {diary.content}
                    </p>
                  </div>

                  {/* AI 답변 미리보기 */}
                  <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs font-semibold text-primary">AI</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                      {diary.aiResponse}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center space-y-4">
                <p className="text-gray text-lg font-medium">
                  이 날 작성한 일기가 없습니다
                </p>
                <p className="text-gray-light text-sm">
                  일기를 작성해보세요
                </p>
                <button className="mt-2 rounded-xl bg-primary text-white px-6 py-3 font-semibold text-sm">
                  일기 작성하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
