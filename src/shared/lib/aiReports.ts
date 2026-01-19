import { apiFetch } from "@/shared/config/api";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type EmotionScores = {
  anxiety: number;
  calm: number;
  joy: number;
  sadness: number;
  anger: number;
};

export type AiReportResponse = {
  reportId: number;
  userId: number;
  periodType: string;
  periodStart: string;
  periodEnd: string;
  scores: EmotionScores | null;
  anxietySummary: string;
  calmSummary: string;
  joySummary: string;
  sadnessSummary: string;
  angerSummary: string;
  reportContent: string;
  createdAt: string;
};
const REPORT_API_BASE_PATH =
  process.env.NEXT_PUBLIC_REPORT_API_BASE_PATH ?? "/api/ai/report";

async function fetchReports(type: "weekly" | "monthly") {
  const response = await apiFetch(`${REPORT_API_BASE_PATH}/${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} reports`);
  }

  const payload = (await response.json()) as ApiResponse<AiReportResponse[]>;
  return payload.data ?? [];
}

export async function fetchWeeklyReports() {
  return fetchReports("weekly");
}

export async function fetchMonthlyReports() {
  return fetchReports("monthly");
}
