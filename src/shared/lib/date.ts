/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식의 문자열로 반환
 */
export function getTodayDateString(): string {
  return formatDateToString(new Date());
}

/**
 * 날짜 문자열을 파싱하여 Date 객체로 변환
 */
export function parseDateString(dateString: string): Date {
  return new Date(dateString);
}

/**
 * 시간을 HH:mm 형식의 문자열로 변환
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * 날짜를 "X월 Y일 (요일)" 형식의 문자열로 변환
 */
export function formatDateDisplay(date: Date | string): {
  month: number;
  day: number;
  weekDay: string;
  display: string;
} {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekDay = weekDays[dateObj.getDay()];
  
  return {
    month,
    day,
    weekDay,
    display: `${month}월 ${day}일 (${weekDay})`,
  };
}
