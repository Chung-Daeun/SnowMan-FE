"use client";

import { useState } from "react";

// TODO: 백엔드 API 연동 필요
type EmotionType = "기쁨" | "슬픔" | "분노" | "불안" | "평온";

interface EmotionData {
  emotion: EmotionType;
  percentage: number;
  factors: string[];
  timePattern: {
    mostActive: string;
    averageTime: string;
  };
}

interface WeeklyReport {
  week: string;
  totalDiaries: number;
  emotions: EmotionData[];
  insights: string[];
}

interface MonthlyReport {
  month: string;
  totalDiaries: number;
  emotions: EmotionData[];
  insights: string[];
}

const weeklyReports: WeeklyReport[] = [
  {
    week: "2024년 1월 1주차",
    totalDiaries: 5,
    emotions: [
      {
        emotion: "기쁨",
        percentage: 40,
        factors: ["친구와의 만남", "좋은 날씨"],
        timePattern: {
          mostActive: "오후 2시",
          averageTime: "오후 3시",
        },
      },
      {
        emotion: "평온",
        percentage: 30,
        factors: ["충분한 휴식", "편안한 환경"],
        timePattern: {
          mostActive: "저녁 8시",
          averageTime: "저녁 9시",
        },
      },
      {
        emotion: "불안",
        percentage: 20,
        factors: ["업무 스트레스", "미래에 대한 걱정"],
        timePattern: {
          mostActive: "오전 10시",
          averageTime: "오전 11시",
        },
      },
      {
        emotion: "슬픔",
        percentage: 10,
        factors: ["외로움", "과거 회상"],
        timePattern: {
          mostActive: "밤 11시",
          averageTime: "밤 12시",
        },
      },
    ],
    insights: [
      "이번 주에는 긍정적인 감정이 우세했습니다",
      "주말에는 특히 기쁨의 감정이 높았습니다",
      "평온한 감정이 저녁 시간대에 자주 나타났습니다",
    ],
  },
  {
    week: "2024년 1월 2주차",
    totalDiaries: 7,
    emotions: [
      {
        emotion: "평온",
        percentage: 35,
        factors: ["규칙적인 생활", "충분한 수면"],
        timePattern: {
          mostActive: "오전 9시",
          averageTime: "오전 10시",
        },
      },
      {
        emotion: "기쁨",
        percentage: 30,
        factors: ["성취감", "긍정적인 피드백"],
        timePattern: {
          mostActive: "오후 4시",
          averageTime: "오후 5시",
        },
      },
      {
        emotion: "불안",
        percentage: 25,
        factors: ["새로운 도전", "불확실성"],
        timePattern: {
          mostActive: "오전 11시",
          averageTime: "정오",
        },
      },
      {
        emotion: "슬픔",
        percentage: 10,
        factors: ["피로감", "스트레스 누적"],
        timePattern: {
          mostActive: "밤 10시",
          averageTime: "밤 11시",
        },
      },
    ],
    insights: [
      "이번 주에는 평온한 감정이 가장 많이 나타났습니다",
      "불안한 감정이 오전 시간대에 집중되었습니다",
      "일기 작성 횟수가 증가하면서 감정 변화를 더 잘 파악할 수 있었습니다",
    ],
  },
];

const monthlyReports: MonthlyReport[] = [
  {
    month: "2024년 1월",
    totalDiaries: 28,
    emotions: [
      {
        emotion: "기쁨",
        percentage: 35,
        factors: ["성취감", "인간관계", "취미 활동"],
        timePattern: {
          mostActive: "오후 3시",
          averageTime: "오후 4시",
        },
      },
      {
        emotion: "평온",
        percentage: 30,
        factors: ["규칙적인 생활", "충분한 휴식", "명상"],
        timePattern: {
          mostActive: "저녁 8시",
          averageTime: "저녁 9시",
        },
      },
      {
        emotion: "불안",
        percentage: 20,
        factors: ["업무 스트레스", "새로운 도전", "불확실성"],
        timePattern: {
          mostActive: "오전 10시",
          averageTime: "오전 11시",
        },
      },
      {
        emotion: "슬픔",
        percentage: 10,
        factors: ["외로움", "피로감", "과거 회상"],
        timePattern: {
          mostActive: "밤 11시",
          averageTime: "자정",
        },
      },
      {
        emotion: "분노",
        percentage: 5,
        factors: ["불공평함", "좌절감"],
        timePattern: {
          mostActive: "오후 2시",
          averageTime: "오후 3시",
        },
      },
    ],
    insights: [
      "이번 달에는 긍정적인 감정(기쁨, 평온)이 전체의 65%를 차지했습니다",
      "주말에는 특히 기쁨의 감정이 높게 나타났습니다",
      "불안한 감정은 주로 업무일 오전 시간대에 집중되었습니다",
      "일기 작성 습관이 정착되면서 감정 관리 능력이 향상되었습니다",
      "저녁 시간대의 평온한 감정이 전반적인 삶의 만족도를 높였습니다",
    ],
  },
  {
    month: "2024년 2월",
    totalDiaries: 25,
    emotions: [
      {
        emotion: "평온",
        percentage: 40,
        factors: ["안정된 일상", "충분한 휴식", "건강한 습관"],
        timePattern: {
          mostActive: "오전 9시",
          averageTime: "오전 10시",
        },
      },
      {
        emotion: "기쁨",
        percentage: 30,
        factors: ["성취감", "긍정적인 변화", "인간관계"],
        timePattern: {
          mostActive: "오후 4시",
          averageTime: "오후 5시",
        },
      },
      {
        emotion: "불안",
        percentage: 20,
        factors: ["새로운 시작", "책임감", "기대감"],
        timePattern: {
          mostActive: "오전 11시",
          averageTime: "정오",
        },
      },
      {
        emotion: "슬픔",
        percentage: 7,
        factors: ["피로감", "스트레스"],
        timePattern: {
          mostActive: "밤 10시",
          averageTime: "밤 11시",
        },
      },
      {
        emotion: "분노",
        percentage: 3,
        factors: ["불공평함"],
        timePattern: {
          mostActive: "오후 1시",
          averageTime: "오후 2시",
        },
      },
    ],
    insights: [
      "이번 달에는 평온한 감정이 가장 높은 비율을 차지했습니다",
      "전반적으로 감정이 안정화되는 추세를 보였습니다",
      "불안한 감정이 줄어들고 긍정적인 감정이 증가했습니다",
      "일기 작성이 감정 인식과 관리에 도움이 되었습니다",
    ],
  },
];

const emotionColors: Record<EmotionType, string> = {
  기쁨: "bg-yellow-400",
  슬픔: "bg-blue-400",
  분노: "bg-red-400",
  불안: "bg-orange-400",
  평온: "bg-green-400",
};

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

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

      {/* 주차별 리포트 */}
      {activeTab === "weekly" && (
        <div className="space-y-4">
          {weeklyReports.length > 0 ? (
            weeklyReports.map((report) => {
            const isExpanded = expandedWeeks.has(report.week);
            return (
              <div
                key={report.week}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* 헤더 (클릭 가능) */}
                <button
                  onClick={() => toggleWeek(report.week)}
                  className="w-full p-6 text-left border-b border-gray-light/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {report.week} 리포트
                      </h3>
                      <p className="text-sm text-gray">
                        총 {report.totalDiaries}개의 일기 작성
                      </p>
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
                    {/* 감정 분석 */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-foreground">
                        감정 분석
                      </h4>
                      {report.emotions.map((emotion: EmotionData) => (
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
                        </div>
                      ))}
                    </div>

                    {/* 인사이트 */}
                    <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary space-y-2">
                      <h4 className="text-sm font-semibold text-primary">인사이트</h4>
                      <ul className="space-y-1">
                        {report.insights.map((insight: string, index: number) => (
                          <li key={index} className="text-sm text-foreground">
                            • {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center space-y-2">
                <p className="text-gray text-lg font-medium">
                  아직 분석할 데이터가 없습니다
                </p>
                <p className="text-gray-light text-sm">
                  일기를 작성하면 분석 결과를 확인할 수 있어요
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 월간 리포트 */}
      {activeTab === "monthly" && (
        <div className="space-y-6">
          {monthlyReports.length > 0 ? (
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
                    {monthlyReports[currentMonthIndex].month} 리포트
                  </h3>
                  <p className="text-sm text-gray">
                    총 {monthlyReports[currentMonthIndex].totalDiaries}개의 일기 작성
                  </p>
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
              const report = monthlyReports[currentMonthIndex];
              return (
                <>
                  {/* 감정 분석 */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      감정 분석
                    </h4>
                    {report.emotions.map((emotion) => (
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
                      </div>
                    ))}
                  </div>

                  {/* 인사이트 */}
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
                </>
              );
            })()}
          </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center space-y-2">
                <p className="text-gray text-lg font-medium">
                  아직 분석할 데이터가 없습니다
                </p>
                <p className="text-gray-light text-sm">
                  일기를 작성하면 분석 결과를 확인할 수 있어요
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
