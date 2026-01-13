"use client";

// Mock 데이터: 주차별 감정 분석
const weeklyData = [
  { week: "1주차", positive: 65, negative: 35, neutral: 0 },
  { week: "2주차", positive: 45, negative: 40, neutral: 15 },
  { week: "3주차", positive: 70, negative: 20, neutral: 10 },
  { week: "4주차", positive: 55, negative: 30, neutral: 15 },
];

// Mock 데이터: 월별 감정 분석
const monthlyData = [
  { month: "1월", positive: 60, negative: 30, neutral: 10 },
  { month: "2월", positive: 55, negative: 35, neutral: 10 },
  { month: "3월", positive: 65, negative: 25, neutral: 10 },
];

export default function AnalysisPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">분석</h2>
        <p className="text-gray text-sm">나의 감정 패턴을 확인해보세요</p>
      </div>

      {/* 주차별 분석 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          이번 달 주차별 감정 분석
        </h3>
        <div className="space-y-4">
          {weeklyData.map((week, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {week.week}
                </span>
                <span className="text-xs text-gray">
                  긍정 {week.positive}% | 부정 {week.negative}%
                  {week.neutral > 0 && ` | 중립 ${week.neutral}%`}
                </span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-light/20">
                <div
                  className="bg-primary"
                  style={{ width: `${week.positive}%` }}
                ></div>
                <div
                  className="bg-red-400"
                  style={{ width: `${week.negative}%` }}
                ></div>
                {week.neutral > 0 && (
                  <div
                    className="bg-gray-light"
                    style={{ width: `${week.neutral}%` }}
                  ></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 월별 분석 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          월별 감정 추이
        </h3>
        <div className="space-y-4">
          {monthlyData.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {month.month}
                </span>
                <span className="text-xs text-gray">
                  긍정 {month.positive}% | 부정 {month.negative}%
                  {month.neutral > 0 && ` | 중립 ${month.neutral}%`}
                </span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-light/20">
                <div
                  className="bg-primary"
                  style={{ width: `${month.positive}%` }}
                ></div>
                <div
                  className="bg-red-400"
                  style={{ width: `${month.negative}%` }}
                ></div>
                {month.neutral > 0 && (
                  <div
                    className="bg-gray-light"
                    style={{ width: `${month.neutral}%` }}
                  ></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">요약</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">42</div>
            <div className="text-xs text-gray">총 일기 수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">58%</div>
            <div className="text-xs text-gray">평균 긍정도</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">12</div>
            <div className="text-xs text-gray">연속 작성일</div>
          </div>
        </div>
      </div>
    </div>
  );
}
