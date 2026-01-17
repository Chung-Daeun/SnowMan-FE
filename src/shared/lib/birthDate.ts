export type BirthParts = {
    year: string;
    month: string;
    day: string;
  };
  
  export function parseBirthDateToParts(value: string): BirthParts {
    if (!value) return { year: "", month: "", day: "" };
    const [y, m, d] = value.split("-");
    return { year: y ?? "", month: m ?? "", day: d ?? "" };
  }
  
  export function pad2(s: string) {
    return s.padStart(2, "0");
  }
  
  export function toYyyyMmDdFromParts(parts: BirthParts): string {
    const y = parts.year.trim();
    const m = parts.month.trim();
    const d = parts.day.trim();
    if (!y || !m || !d) return "";
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }
  
  export function isValidDateParts(year: number, month: number, day: number) {
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
  
    const dt = new Date(year, month - 1, day);
    return (
      dt.getFullYear() === year &&
      dt.getMonth() === month - 1 &&
      dt.getDate() === day
    );
  }
  
  /**
   * 생년월일 입력 검증
   * - 전부 비어있으면 통과(선택사항)
   * - 일부만 입력: 에러
   * - 존재하지 않는 날짜: 에러
   * - 미래 날짜: 에러
   */
  export function validateBirthDate(parts: BirthParts, now = new Date()): string | null {
    const yStr = parts.year.trim();
    const mStr = parts.month.trim();
    const dStr = parts.day.trim();
  
    if (!yStr && !mStr && !dStr) return null;
    if (!yStr || !mStr || !dStr) return "생년월일을 모두 입력해 주세요.";
  
    if (!/^\d{4}$/.test(yStr)) return "연도는 4자리 숫자로 입력해 주세요. (예: 2007)";
    if (!/^\d{1,2}$/.test(mStr)) return "월은 숫자로 입력해 주세요. (1~12)";
    if (!/^\d{1,2}$/.test(dStr)) return "일은 숫자로 입력해 주세요. (1~31)";
  
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);
  
    const currentYear = now.getFullYear();
    if (y < 1900 || y > currentYear) return `연도는 1900 ~ ${currentYear} 사이로 입력해 주세요.`;
  
    if (!isValidDateParts(y, m, d)) return "존재하지 않는 날짜예요. 다시 확인해 주세요.";
  
    const inputDate = new Date(y, m - 1, d);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (inputDate.getTime() > todayStart.getTime()) return "미래 날짜는 입력할 수 없어요.";
  
    return null;
  }
  
  /**
   * onBlur에서 월/일을 2자리로 보정 (1 -> 01)
   * - 빈 값이면 그대로
   * - 숫자면 padStart(2)
   */
  export function normalizeTwoDigitsOnBlur(value: string): string {
    const v = value.trim();
    if (!v) return "";
    // "0" 같은 것도 "00"으로 만들지 말고 그냥 "0" 유지하고 싶으면 여기서 커스텀 가능
    if (!/^\d{1,2}$/.test(v)) return value;
    return pad2(v);
  }
  