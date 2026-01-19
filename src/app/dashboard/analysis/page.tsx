"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchMonthlyReports,
  fetchWeeklyReports,
  type AiReportResponse,
  type EmotionScores,
} from "@/shared/lib/aiReports";
import type { EmotionType } from "@/shared/mock/analysis";

const emotionColors: Record<EmotionType, string> = {
  기쁨: "bg-yellow-400",
  슬픔: "bg-blue-400",
  분노: "bg-red-400",
  불안: "bg-orange-400",
  평온: "bg-green-400",
};

const summaryOrder: {
  label: EmotionType;
  key:
    | "anxietySummary"
    | "calmSummary"
    | "joySummary"
    | "sadnessSummary"
    | "angerSummary";
  scoreKey: keyof EmotionScores;
}[] = [
  { label: "불안", key: "anxietySummary", scoreKey: "anxiety" },
  { label: "평온", key: "calmSummary", scoreKey: "calm" },
  { label: "기쁨", key: "joySummary", scoreKey: "joy" },
  { label: "슬픔", key: "sadnessSummary", scoreKey: "sadness" },
  { label: "분노", key: "angerSummary", scoreKey: "anger" },
];
type SummaryKey = (typeof summaryOrder)[number]["key"];
const summaryKeyByEmotion = summaryOrder.reduce(
  (acc, summary) => {
    acc[summary.label] = summary.key;
    return acc;
  },
  {} as Record<EmotionType, SummaryKey>
);

type EmotionBreakdown = {
  emotion: EmotionType;
  percentage: number;
};

type AnalysisReport = {
  id: string;
  label: string;
  periodStart: string;
  periodEnd: string;
  totalDiaries?: number;
  insights?: string[];
  reportContent: string;
  summaries: Record<
    | "anxietySummary"
    | "calmSummary"
    | "joySummary"
    | "sadnessSummary"
    | "angerSummary",
    string
  >;
  breakdowns: EmotionBreakdown[];
};

const formatDate = (value: string) => value.replaceAll("-", ".");
const toMonthLabel = (value: string) => {
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  return `${year}년 ${Number(month)}월`;
};

const toScorePercentages = (scores: EmotionScores): EmotionBreakdown[] => {
  const total =
    scores.anxiety +
    scores.calm +
    scores.joy +
    scores.sadness +
    scores.anger;
  return summaryOrder.map((summary) => {
    const score = scores[summary.scoreKey] ?? 0;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    return {
      emotion: summary.label,
      percentage,
    };
  });
};

const normalizeApiReport = (report: AiReportResponse): AnalysisReport => {
  const scores = report.scores ?? {
    anxiety: 0,
    calm: 0,
    joy: 0,
    sadness: 0,
    anger: 0,
  };
  const isMonthly = report.periodType?.toLowerCase().includes("month");
  const label = isMonthly
    ? toMonthLabel(report.periodStart)
    : `${formatDate(report.periodStart)} ~ ${formatDate(report.periodEnd)}`;

  return {
    id: report.reportId ? String(report.reportId) : label,
    label,
    periodStart: report.periodStart,
    periodEnd: report.periodEnd,
    reportContent: report.reportContent,
    summaries: {
      anxietySummary: report.anxietySummary,
      calmSummary: report.calmSummary,
      joySummary: report.joySummary,
      sadnessSummary: report.sadnessSummary,
      angerSummary: report.angerSummary,
    },
    breakdowns: toScorePercentages(scores),
  };
};

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [weeklyReports, setWeeklyReports] = useState<AnalysisReport[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<AnalysisReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const toggleWeek = (week: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(week)) {
      newExpanded.delete(week);
    } else {
      newExpanded.add(week);
    }
    setExpandedWeeks(newExpanded);
  };

  const goToPreviousMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex < monthlyReports.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadReports = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [weekly, monthly] = await Promise.all([
          fetchWeeklyReports(),
          fetchMonthlyReports(),
        ]);

        if (!isMounted) return;

        setWeeklyReports(weekly.map(normalizeApiReport));
        setMonthlyReports(monthly.map(normalizeApiReport));
        setCurrentMonthIndex(0);
        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error(error);
        setLoadError("리포트를 불러오는 데 실패했어요.");
        setIsLoading(false);
      }
    };

    loadReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentMonthlyReport = useMemo(
    () => monthlyReports[currentMonthIndex],
    [monthlyReports, currentMonthIndex]
  );

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">분석</h2>
        <p className="text-gray text-sm">나의 감정 패턴을 확인해보세요</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "weekly"
              ? "bg-primary text-white shadow-sm"
              : "text-gray hover:text-foreground"
          }`}
        >
          주차별
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "monthly"
              ? "bg-primary text-white shadow-sm"
              : "text-gray hover:text-foreground"
          }`}
        >
          월간
        </button>
      </div>

      {isLoading && (
        <div className="rounded-2xl bg-white p-6 text-sm text-gray shadow-sm">
          리포트를 불러오는 중입니다...
        </div>
      )}

      {loadError && (
        <div className="rounded-2xl bg-white p-6 text-sm text-red-500 shadow-sm">
          {loadError}
        </div>
      )}

      {/* 주차별 리포트 */}
      {activeTab === "weekly" && !isLoading && !loadError && (
        <div className="space-y-4">
          {weeklyReports.map((report) => {
            const isExpanded = expandedWeeks.has(report.id);
            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* 헤더 (클릭 가능) */}
                <button
                  onClick={() => toggleWeek(report.id)}
                  className="w-full p-6 text-left border-b border-gray-light/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {report.label} 리포트
                      </h3>
                      {report.totalDiaries !== undefined && (
                        <p className="text-sm text-gray">
                          총 {report.totalDiaries}개의 일기 작성
                        </p>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* 내용 (접기/펼치기) */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray">
                      <span className="rounded-full bg-gray-light/20 px-3 py-1">
                        기간 {report.periodStart} ~ {report.periodEnd}
                      </span>
                    </div>

                    {/* 감정 분석 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-foreground">
                        감정 분석
                      </h4>
                      {report.breakdowns.map((emotion) => (
                        <div key={emotion.emotion} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full ${emotionColors[emotion.emotion]}`}
                              ></div>
                              <span className="font-medium text-foreground">
                                {emotion.emotion}
                              </span>
                            </div>
                            <span className="text-sm text-gray">
                              {emotion.percentage}%
                            </span>
                          </div>
                          <div className="flex h-2 rounded-full overflow-hidden bg-gray-light/20">
                            <div
                              className={`${emotionColors[emotion.emotion]}`}
                              style={{ width: `${emotion.percentage}%` }}
                            ></div>
                          </div>
                          {(() => {
                            const summaryKey = summaryKeyByEmotion[emotion.emotion];
                            const summaryText = report.summaries[summaryKey];
                            return (
                              summaryText && (
                                <p className="pl-6 text-xs text-gray">
                                  <span className="font-medium">감정 요약:</span>{" "}
                                  {summaryText}
                                </p>
                              )
                            );
                          })()}
                          {emotion.factors?.length && emotion.timePattern && (
                            <div className="pl-6 space-y-1">
                              <p className="text-xs text-gray">
                                <span className="font-medium">주요 요인:</span>{" "}
                                {emotion.factors.join(", ")}
                              </p>
                              <p className="text-xs text-gray">
                                <span className="font-medium">활발한 시간:</span>{" "}
                                {emotion.timePattern.mostActive} (평균:{" "}
                                {emotion.timePattern.averageTime})
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  {/* 인사이트 */}
                  {report.insights?.length && (
                    <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary space-y-2">
                      <h4 className="text-sm font-semibold text-primary">인사이트</h4>
                      <ul className="space-y-1">
                        {report.insights.map((insight, index) => (
                          <li key={index} className="text-sm text-foreground">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                    <div className="rounded-xl bg-foreground/5 p-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        리포트 종합
                      </h4>
                      <p className="text-sm text-gray">{report.reportContent}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 월간 리포트 */}
      {activeTab === "monthly" &&
        !isLoading &&
        !loadError &&
        monthlyReports.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
            {/* 헤더 (이전/다음 달 버튼) */}
            <div className="border-b border-gray-light/20 pb-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  disabled={currentMonthIndex === 0}
                  className="p-2 hover:bg-gray-light/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {currentMonthlyReport?.label} 리포트
                  </h3>
                  {currentMonthlyReport?.totalDiaries !== undefined && (
                    <p className="text-sm text-gray">
                      총 {currentMonthlyReport.totalDiaries}개의 일기 작성
                    </p>
                  )}
                  {currentMonthlyReport && (
                    <p className="text-xs text-gray mt-1">
                      {currentMonthlyReport.periodStart} ~{" "}
                      {currentMonthlyReport.periodEnd}
                    </p>
                  )}
                </div>
                <button
                  onClick={goToNextMonth}
                  disabled={currentMonthIndex === monthlyReports.length - 1}
                  className="p-2 hover:bg-gray-light/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
            </div>

            {/* 현재 선택된 월 리포트 */}
            {(() => {
              const report = currentMonthlyReport;
              if (!report) return null;
              return (
                <>
                  {/* 감정 분석 */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      감정 분석
                    </h4>
                      {report.breakdowns.map((emotion) => (
                        <div key={emotion.emotion} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full ${emotionColors[emotion.emotion]}`}
                              ></div>
                              <span className="font-medium text-foreground">
                                {emotion.emotion}
                              </span>
                            </div>
                            <span className="text-sm text-gray">
                              {emotion.percentage}%
                            </span>
                          </div>
                          <div className="flex h-2 rounded-full overflow-hidden bg-gray-light/20">
                            <div
                              className={`${emotionColors[emotion.emotion]}`}
                              style={{ width: `${emotion.percentage}%` }}
                            ></div>
                          </div>
                          {(() => {
                            const summaryKey = summaryKeyByEmotion[emotion.emotion];
                            const summaryText = report.summaries[summaryKey];
                            return (
                              summaryText && (
                                <p className="pl-6 text-xs text-gray">
                                  <span className="font-medium">감정 요약:</span>{" "}
                                  {summaryText}
                                </p>
                              )
                            );
                          })()}
                          {emotion.factors?.length && emotion.timePattern && (
                            <div className="pl-6 space-y-1">
                              <p className="text-xs text-gray">
                                <span className="font-medium">주요 요인:</span>{" "}
                                {emotion.factors.join(", ")}
                              </p>
                              <p className="text-xs text-gray">
                                <span className="font-medium">활발한 시간:</span>{" "}
                                {emotion.timePattern.mostActive} (평균:{" "}
                                {emotion.timePattern.averageTime})
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 인사이트 */}
                    {report.insights?.length && (
                      <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary space-y-2">
                        <h4 className="text-sm font-semibold text-primary">인사이트</h4>
                        <ul className="space-y-1">
                          {report.insights.map((insight, index) => (
                            <li key={index} className="text-sm text-foreground">
                              • {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="rounded-xl bg-foreground/5 p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      리포트 종합
                    </h4>
                    <p className="text-sm text-gray">{report.reportContent}</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
