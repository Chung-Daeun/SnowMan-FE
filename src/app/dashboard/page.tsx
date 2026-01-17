 "use client";
 
 import { useRouter } from "next/navigation";
 import { useEffect, useState } from "react";
 import { apiFetch } from "@/shared/config/api";
 import { DiaryCard } from "@/shared/ui/DiaryCard";
 import { DiaryEmptyState } from "@/shared/ui/DiaryEmptyState";
 
type DiaryItem = {
  id: number;
  time: string;
  content: string;
  aiResponse: string | null;
};
 
 export default function DashboardPage() {
  const router = useRouter();
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [selectedDate, setSelectedDate] = useState<number | null>(currentDate);
  const [writtenDates, setWrittenDates] = useState<Set<number>>(new Set());
  const [selectedDiaries, setSelectedDiaries] = useState<DiaryItem[]>([]);

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
 
  // 현재 보고 있는 달의 작성된 날짜 목록을 서버에서 가져오기
  useEffect(() => {
    const fetchMonthDiaries = async () => {
      const monthParam = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
      try {
        const response = await apiFetch(`/api/diary/month?date=${monthParam}`, {
          method: "GET",
        });
        if (!response.ok) {
          console.error("월별 일기 조회 실패", await response.text());
          setWrittenDates(new Set());
          return;
        }
        const json = await response.json();

        // 기대 형식: { data: [{ createdAt: "2026-01-14T21:30:25.324772", ... }], success: true }
        const items: any[] = Array.isArray(json?.data) ? json.data : [];

        const days = items
          .map((item) => {
            const createdAt: unknown = item?.createdAt;
            if (typeof createdAt !== "string") return null;
            // "YYYY-MM-DD..." 에서 일(day)만 추출
            const dayStr = createdAt.slice(8, 10);
            const dayNum = Number(dayStr);
            return Number.isNaN(dayNum) ? null : dayNum;
          })
          .filter((day): day is number => day !== null);

        setWrittenDates(new Set(days));
      } catch (error) {
        console.error("월별 일기 조회 중 오류 발생", error);
        setWrittenDates(new Set());
      }
    };

    fetchMonthDiaries();
  }, [viewYear, viewMonth]);
 
  // 선택된 날짜의 일기 목록을 서버에서 가져오기
  useEffect(() => {
    if (selectedDate === null) {
      setSelectedDiaries([]);
      return;
    }

    const fetchDateDiaries = async () => {
      const dateParam = `${viewYear}-${String(viewMonth + 1).padStart(
        2,
        "0"
      )}-${String(selectedDate).padStart(2, "0")}`;

      try {
        const response = await apiFetch(`/api/diary/day?date=${dateParam}`, {
          method: "GET",
          credentials: "include", // 세션 쿠키 포함
        });
        if (!response.ok) {
          console.error("일자별 일기 조회 실패", await response.text());
          setSelectedDiaries([]);
          return;
        }

        const json = await response.json();

        const rawList: any[] = Array.isArray(json?.data) ? json.data : [];

        const diaries: DiaryItem[] = rawList.map((item) => {
          const createdAt: unknown = item?.createdAt;
          const time =
            typeof createdAt === "string" ? createdAt.slice(11, 16) : "";

          const aiReplyContent: unknown = item?.aiReply?.replyContent;

          return {
            id: item?.diaryId ?? 0,
            time,
            content: String(item?.content ?? ""),
            aiResponse:
              typeof aiReplyContent === "string" ? aiReplyContent : null,
          };
        });

        setSelectedDiaries(diaries);
      } catch (error) {
        console.error("일자별 일기 조회 중 오류 발생", error);
        setSelectedDiaries([]);
      }
    };

    fetchDateDiaries();
  }, [selectedDate, viewMonth, viewYear]);

  const todayDateOnly = new Date(currentYear, currentMonth, currentDate);
  const selectedDateObj =
    selectedDate !== null ? new Date(viewYear, viewMonth, selectedDate) : null;

  const isSelectedToday =
    selectedDateObj !== null && selectedDateObj.getTime() === todayDateOnly.getTime();

  const isSelectedFuture =
    selectedDateObj !== null && selectedDateObj.getTime() > todayDateOnly.getTime();

  const isSelectedPast =
    selectedDateObj !== null &&
    !isSelectedToday &&
    !isSelectedFuture;

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
          <span className="text-base font-semibold text-foreground">
            {monthNames[viewMonth]}
          </span>
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
                } ${
                  isSelected 
                    ? "ring-2 ring-primary ring-offset-2" 
                    : ""
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
                <DiaryCard
                  key={diary.id}
                  time={diary.time}
                  content={diary.content}
                  aiPreview={diary.aiResponse}
                  contentLineClampClass="line-clamp-3"
                  aiPreviewLineClampClass="line-clamp-2"
                  onClick={() => {
                    const dateStr = `${viewYear}-${String(
                      viewMonth + 1
                    ).padStart(2, "0")}-${String(selectedDate).padStart(
                      2,
                      "0"
                    )}`;
                    router.push(`/dashboard/diary/${dateStr}/${diary.id}`);
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
                <p className="text-gray text-lg font-medium">
                  미래 일기는 아직 작성할 수 없어요
                </p>
                <p className="text-gray-light text-sm">
                  오늘이 되었을 때 천천히 기록해볼까요?
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center space-y-2">
                <p className="text-gray text-lg font-medium">
                  이 날 작성한 일기가 없습니다
                </p>
                <p className="text-gray-light text-sm">
                  앞으로는 이 날들을 더 자주 기록해봐요
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
