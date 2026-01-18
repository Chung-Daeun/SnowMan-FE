"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/shared/config/api";
import { DiaryCard } from "@/shared/ui/DiaryCard";
import { DiaryEmptyState } from "@/shared/ui/DiaryEmptyState";
import { DiaryCardSkeleton } from "@/shared/ui/DiaryCardSkeleton";

type DiaryItem = {
  diaryId: number; // 백에서 오는 원본 키 (권장)
  createdAt: string; // "2026-01-18T21:30:25..." 같은 형태
  content: string;
  aiReply?: {
    replyContent?: string | null;
  } | null;
};

type Props = {
  initialYear: number;
  initialMonth: number; // 0~11
  initialSelectedDate: number;
  initialWrittenDays: number[];
  initialDiaries: DiaryItem[];
};

export default function DashboardClient({
  initialYear,
  initialMonth,
  initialSelectedDate,
  initialWrittenDays,
  initialDiaries,
}: Props) {
  const router = useRouter();

  // =========================
  // 상태
  // =========================
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [isDayLoading, setIsDayLoading] = useState(false);
  const [dayLoadedOnce, setDayLoadedOnce] = useState(true);

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<number | null>(
    initialSelectedDate
  );

  const [writtenDates, setWrittenDates] = useState<Set<number>>(
    () => new Set(initialWrittenDays)
  );

  const [selectedDiaries, setSelectedDiaries] = useState<DiaryItem[]>(
    () => initialDiaries
  );

  // ✅ 첫 렌더에서는 서버에서 이미 값이 있으니 fetch 스킵
  const didMountRef = useRef(false);

  // =========================
  // 캘린더 계산
  // =========================
  const firstDay = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);
  const lastDay = useMemo(() => new Date(viewYear, viewMonth + 1, 0), [viewYear, viewMonth]);

  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays = useMemo(() => {
    const arr: Array<number | null> = [];
    for (let i = 0; i < startingDayOfWeek; i++) arr.push(null);
    for (let day = 1; day <= daysInMonth; day++) arr.push(day);
    return arr;
  }, [startingDayOfWeek, daysInMonth]);

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const isCurrentMonth = viewMonth === currentMonth && viewYear === currentYear;

  // =========================
  // 네비게이션
  // =========================
  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setSelectedDiaries([]);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setSelectedDiaries([]);
  };

  const goToToday = () => {
    setViewYear(currentYear);
    setViewMonth(currentMonth);
    setSelectedDate(currentDate);
  };

  // =========================
  // 월별 작성일 fetch (점 찍기)
  // =========================
  useEffect(() => {
    // 첫 렌더는 서버 값으로 이미 완성되어 있으니 스킵
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const run = async () => {
      const monthParam = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
      const res = await apiFetch(`/api/diary/month?date=${monthParam}`, {
        method: "GET",
      });

      if (!res.ok) {
        console.error("월별 작성일 조회 실패", await res.text());
        setWrittenDates(new Set());
        return;
      }

      const json = await res.json();
      setWrittenDates(new Set(json.data ?? []));
    };

    run();
  }, [viewYear, viewMonth]);

  // =========================
  // 일자별 일기 fetch (카드 리스트)
  // =========================
  useEffect(() => {
    if (!selectedDate) return;
  
    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
  
    const dateParam = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
  
    const fetchDay = async () => {
      setIsDayLoading(true);
      setDayLoadedOnce(true);
  
      try {
        const res = await apiFetch(`/api/diary/day?date=${dateParam}`);
        const json = await res.json();
  
        if (cancelled) return;
  
        const diaries = json.data ?? [];
        setSelectedDiaries(diaries);
  
        return diaries;
      } catch {
        if (cancelled) return;
        setSelectedDiaries([]);
        return [];
      } finally {
        if (cancelled) return;
        setIsDayLoading(false);
      }
    };
  
    const run = async () => {
      const diaries = await fetchDay();
  
      // ✅ aiReply가 비어있는 일기가 있으면 짧게 폴링(최대 5번)
      if (!diaries?.some((d: any) => d.aiReply == null)) return;
  
      let tries = 0;
      const poll = async () => {
        if (cancelled) return;
        tries += 1;
  
        const next = await fetchDay();
        const stillPending = next?.some((d: any) => d.aiReply == null);
  
        if (!stillPending || tries >= 5) return;
        pollTimer = setTimeout(poll, 2000);
      };
  
      pollTimer = setTimeout(poll, 2000);
    };
  
    run();
  
    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [selectedDate, viewYear, viewMonth]);
  

  // =========================
  // 시간 표시용 (시:분)
  // =========================
  const formatHHmm = (createdAt: string) => {
    // "2026-01-18T21:30:25..." => "21:30"
    if (!createdAt) return "";
    return createdAt.slice(11, 16);
  };

  // =========================
  // 오늘/과거/미래 체크
  // =========================
  const todayDateOnly = new Date(currentYear, currentMonth, currentDate);
  const selectedDateObj =
    selectedDate !== null ? new Date(viewYear, viewMonth, selectedDate) : null;

  const isSelectedToday =
    selectedDateObj !== null && selectedDateObj.getTime() === todayDateOnly.getTime();

  const isSelectedFuture =
    selectedDateObj !== null && selectedDateObj.getTime() > todayDateOnly.getTime();

  const isSelectedPast =
    selectedDateObj !== null && !isSelectedToday && !isSelectedFuture;

  // =========================
  // 렌더
  // =========================
  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      {/* 상단 타이틀 */}
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
        {/* 달력 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-light/10 rounded-lg transition-colors"
            aria-label="이전 달"
          >
            <svg className="w-5 h-5 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-base font-semibold text-foreground">
            {monthNames[viewMonth]}
          </span>

          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-light/10 rounded-lg transition-colors"
            aria-label="다음 달"
          >
            <svg className="w-5 h-5 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 요일 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray py-2">
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${viewYear}-${viewMonth}-${index}`} className="aspect-square" />;
            }

            const isWritten = writtenDates.has(day);
            const isToday = isCurrentMonth && day === currentDate;
            const isSelected = day === selectedDate;

            return (
              <button
                key={`day-${viewYear}-${viewMonth}-${day}`}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  isToday
                    ? "bg-primary text-white"
                    : isWritten
                    ? "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                    : "bg-gray-light/10 text-gray hover:bg-gray-light/20 cursor-pointer"
                } ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
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

          {isDayLoading ? <DiaryCardSkeleton count={1} /> : (
            selectedDiaries.length > 0 ? (
                <div className="space-y-4">
                    {selectedDiaries.map((item: any) => (
                        <DiaryCard
                            key={`${viewYear}-${viewMonth}-${selectedDate}-${item.diaryId}-${item.time}`}
                            time={item.time ?? ""}
                            content={item.content ?? ""}
                            aiPreview={item.aiReply?.replyContent ?? null}
                            contentLineClampClass="line-clamp-3"
                            aiPreviewLineClampClass="line-clamp-2"
                            onClick={() => {
                                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
                                router.push(`/dashboard/diary/${dateStr}/${item.diaryId}`);
                            }}
                        />   
                    ))}
                </div>
            ) : isSelectedToday ? (
                <DiaryEmptyState
                    title="오늘 작성한 일기가 없습니다"
                    description="오늘의 감정을 간단히 남겨볼까요?"
                    buttonLabel="오늘 일기 작성하기"
                    onWriteClick={() => router.push("/dashboard/write")}
                />
            ) : isSelectedFuture ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="text-center space-y-2">
                            <p className="text-gray text-lg font-medium">미래 일기는 아직 작성할 수 없어요</p>
                            <p className="text-gray-light text-sm">오늘이 되었을 때 천천히 기록해볼까요?</p>
                        </div>
                    </div>
            ) : (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="text-center space-y-2">
                            <p className="text-gray text-lg font-medium">이 날 작성한 일기가 없습니다</p>
                            <p className="text-gray-light text-sm">앞으로는 이 날들을 더 자주 기록해봐요</p>
                        </div>
                    </div>
            ))}
        </div>
      )}
    </div>
  );
}
