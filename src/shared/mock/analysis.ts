// 분석용 Mock 데이터

export type EmotionType = "기쁨" | "슬픔" | "분노" | "불안" | "평온";

export interface EmotionData {
  emotion: EmotionType;
  percentage: number;
  factors: string[];
  timePattern: {
    mostActive: string; // 가장 많이 작성한 시간대
    averageTime: string; // 평균 작성 시간
  };
}

export interface WeeklyReport {
  week: string;
  emotions: EmotionData[];
  totalDiaries: number;
  insights: string[];
  periodStart: string;
  periodEnd: string;
  anxietySummary: string;
  calmSummary: string;
  joySummary: string;
  sadnessSummary: string;
  angerSummary: string;
  reportContent: string;
}

export interface MonthlyReport {
  month: string;
  emotions: EmotionData[];
  totalDiaries: number;
  insights: string[];
  periodStart: string;
  periodEnd: string;
  anxietySummary: string;
  calmSummary: string;
  joySummary: string;
  sadnessSummary: string;
  angerSummary: string;
  reportContent: string;
}

// 주차별 리포트 Mock 데이터
export const weeklyReports: WeeklyReport[] = [
  {
    week: "1주차",
    totalDiaries: 12,
    emotions: [
      {
        emotion: "기쁨",
        percentage: 35,
        factors: ["친구들과의 만남", "좋은 날씨", "취미 활동"],
        timePattern: {
          mostActive: "오후 2시",
          averageTime: "14:30",
        },
      },
      {
        emotion: "불안",
        percentage: 25,
        factors: ["업무 스트레스", "미래에 대한 걱정", "새로운 환경"],
        timePattern: {
          mostActive: "저녁 7시",
          averageTime: "19:15",
        },
      },
      {
        emotion: "슬픔",
        percentage: 20,
        factors: ["외로움", "과거에 대한 아쉬움"],
        timePattern: {
          mostActive: "밤 9시",
          averageTime: "21:00",
        },
      },
      {
        emotion: "평온",
        percentage: 15,
        factors: ["충분한 휴식", "일상의 소소한 행복"],
        timePattern: {
          mostActive: "오전 10시",
          averageTime: "10:20",
        },
      },
      {
        emotion: "분노",
        percentage: 5,
        factors: ["불공평한 상황", "소통 문제"],
        timePattern: {
          mostActive: "오후 5시",
          averageTime: "17:30",
        },
      },
    ],
    insights: [
      "이번 주는 기쁨이 가장 많이 느껴졌어요. 특히 친구들과의 만남이 긍정적인 영향을 주었습니다.",
      "불안감이 두 번째로 높았는데, 주로 저녁 시간대에 많이 느꼈어요.",
      "일기를 쓰는 시간이 오후 2시에 가장 많았습니다.",
    ],
    periodStart: "2024-01-01",
    periodEnd: "2024-01-07",
    anxietySummary: "업무 스트레스가 누적되면서 저녁 시간대에 불안이 높게 나타났어요.",
    calmSummary: "휴식과 가벼운 산책이 평온감을 유지하는 데 도움을 줬어요.",
    joySummary: "사람들과의 만남과 좋은 날씨가 기쁨의 주요 원인이었습니다.",
    sadnessSummary: "외로움이 간헐적으로 나타났지만 짧은 시간에 머물렀어요.",
    angerSummary: "작은 소통 문제로 분노가 잠깐 올라갔지만 금방 가라앉았어요.",
    reportContent:
      "전체적으로 긍정 감정이 우세한 한 주였습니다. 다만 저녁 시간대의 불안을 줄이기 위한 루틴을 만들어보면 좋겠습니다.",
  },
  {
    week: "2주차",
    totalDiaries: 15,
    emotions: [
      {
        emotion: "평온",
        percentage: 40,
        factors: ["규칙적인 생활", "충분한 수면", "명상"],
        timePattern: {
          mostActive: "오전 9시",
          averageTime: "09:15",
        },
      },
      {
        emotion: "기쁨",
        percentage: 30,
        factors: ["취미 활동", "좋은 음악", "성취감"],
        timePattern: {
          mostActive: "오후 3시",
          averageTime: "15:20",
        },
      },
      {
        emotion: "불안",
        percentage: 15,
        factors: ["업무 마감일", "새로운 프로젝트"],
        timePattern: {
          mostActive: "저녁 8시",
          averageTime: "20:00",
        },
      },
      {
        emotion: "슬픔",
        percentage: 10,
        factors: ["그리움", "추억"],
        timePattern: {
          mostActive: "밤 10시",
          averageTime: "22:10",
        },
      },
      {
        emotion: "분노",
        percentage: 5,
        factors: ["교통 체증", "예상치 못한 상황"],
        timePattern: {
          mostActive: "오후 6시",
          averageTime: "18:00",
        },
      },
    ],
    insights: [
      "2주차는 평온한 감정이 가장 많았어요. 규칙적인 생활 패턴이 도움이 되었습니다.",
      "기쁨의 감정이 증가했고, 주로 오후 시간대에 느꼈어요.",
      "일기 작성 시간이 오전으로 앞당겨졌습니다.",
    ],
    periodStart: "2024-01-08",
    periodEnd: "2024-01-14",
    anxietySummary: "마감 일정이 가까워지며 불안이 짧게 올라갔어요.",
    calmSummary: "규칙적인 수면과 명상이 평온을 안정적으로 유지했습니다.",
    joySummary: "취미 활동에서 기쁨이 꾸준히 발생했어요.",
    sadnessSummary: "그리움이 드물게 나타났지만 강도는 낮았습니다.",
    angerSummary: "예상치 못한 상황에서 분노가 소폭 상승했어요.",
    reportContent:
      "생활 리듬이 안정되며 평온이 주도했습니다. 일정 관리로 불안을 사전에 줄이는 흐름을 유지하세요.",
  },
  {
    week: "3주차",
    totalDiaries: 18,
    emotions: [
      {
        emotion: "기쁨",
        percentage: 45,
        factors: ["성공적인 프로젝트 완료", "칭찬받음", "여행 계획"],
        timePattern: {
          mostActive: "오후 4시",
          averageTime: "16:00",
        },
      },
      {
        emotion: "평온",
        percentage: 25,
        factors: ["일상의 소소한 행복", "책 읽기"],
        timePattern: {
          mostActive: "오전 11시",
          averageTime: "11:30",
        },
      },
      {
        emotion: "불안",
        percentage: 15,
        factors: ["새로운 도전", "변화에 대한 두려움"],
        timePattern: {
          mostActive: "저녁 7시",
          averageTime: "19:20",
        },
      },
      {
        emotion: "슬픔",
        percentage: 10,
        factors: ["이별", "아쉬움"],
        timePattern: {
          mostActive: "밤 11시",
          averageTime: "23:00",
        },
      },
      {
        emotion: "분노",
        percentage: 5,
        factors: ["불공평한 대우"],
        timePattern: {
          mostActive: "오후 5시",
          averageTime: "17:15",
        },
      },
    ],
    insights: [
      "3주차는 기쁨이 가장 많았어요. 성공적인 프로젝트 완료가 큰 영향을 주었습니다.",
      "일기 작성 빈도가 증가했고, 감정 표현도 더 풍부해졌어요.",
      "오후 시간대에 긍정적인 감정이 많이 느껴졌습니다.",
    ],
    periodStart: "2024-01-15",
    periodEnd: "2024-01-21",
    anxietySummary: "새로운 도전 앞에서 짧은 불안이 있었어요.",
    calmSummary: "책 읽기와 짧은 휴식이 평온을 회복하는 데 도움이 됐어요.",
    joySummary: "프로젝트 완료와 칭찬이 기쁨을 크게 끌어올렸습니다.",
    sadnessSummary: "이별의 여운이 밤 시간대에 나타났어요.",
    angerSummary: "불공평한 대우에 대한 분노가 일시적으로 발생했어요.",
    reportContent:
      "성과가 기쁨을 크게 끌어올린 주입니다. 긍정 경험을 기록해두면 다음 주에도 좋은 흐름을 이어갈 수 있습니다.",
  },
  {
    week: "4주차",
    totalDiaries: 14,
    emotions: [
      {
        emotion: "불안",
        percentage: 35,
        factors: ["월말 정산", "다음 달 계획", "불확실성"],
        timePattern: {
          mostActive: "저녁 8시",
          averageTime: "20:30",
        },
      },
      {
        emotion: "평온",
        percentage: 30,
        factors: ["휴식", "반성", "마음 정리"],
        timePattern: {
          mostActive: "오전 10시",
          averageTime: "10:00",
        },
      },
      {
        emotion: "기쁨",
        percentage: 20,
        factors: ["작은 성취", "감사한 일"],
        timePattern: {
          mostActive: "오후 2시",
          averageTime: "14:15",
        },
      },
      {
        emotion: "슬픔",
        percentage: 10,
        factors: ["피로감", "그리움"],
        timePattern: {
          mostActive: "밤 9시",
          averageTime: "21:20",
        },
      },
      {
        emotion: "분노",
        percentage: 5,
        factors: ["예상치 못한 상황"],
        timePattern: {
          mostActive: "오후 6시",
          averageTime: "18:00",
        },
      },
    ],
    insights: [
      "4주차는 불안감이 가장 높았어요. 월말과 다음 달 계획에 대한 걱정이 컸습니다.",
      "평온한 감정도 많이 느꼈는데, 주로 오전 시간에 마음을 정리하며 느꼈어요.",
      "일기 작성 시간이 저녁으로 집중되었습니다.",
    ],
    periodStart: "2024-01-22",
    periodEnd: "2024-01-28",
    anxietySummary: "월말 정산과 계획 수립으로 불안이 꾸준히 유지됐어요.",
    calmSummary: "오전의 정리 시간이 평온을 회복하는 데 효과적이었습니다.",
    joySummary: "작은 성취가 기쁨을 보완해주는 역할을 했어요.",
    sadnessSummary: "피로감이 누적되며 슬픔이 간헐적으로 나타났어요.",
    angerSummary: "예상치 못한 상황에서 분노가 짧게 표출됐습니다.",
    reportContent:
      "불안이 높은 편이었지만 평온을 회복하는 루틴이 있어 균형을 유지했습니다. 다음 달 계획을 작은 단계로 나눠보세요.",
  },
];

// 월간 리포트 Mock 데이터
export const monthlyReports: MonthlyReport[] = [
  {
    month: "1월",
    totalDiaries: 59,
    emotions: [
      {
        emotion: "기쁨",
        percentage: 35,
        factors: ["친구들과의 만남", "성취감", "좋은 날씨", "취미 활동"],
        timePattern: {
          mostActive: "오후 2시",
          averageTime: "14:30",
        },
      },
      {
        emotion: "평온",
        percentage: 28,
        factors: ["규칙적인 생활", "충분한 휴식", "일상의 소소한 행복"],
        timePattern: {
          mostActive: "오전 10시",
          averageTime: "10:15",
        },
      },
      {
        emotion: "불안",
        percentage: 22,
        factors: ["업무 스트레스", "미래에 대한 걱정", "새로운 환경", "변화에 대한 두려움"],
        timePattern: {
          mostActive: "저녁 7시",
          averageTime: "19:30",
        },
      },
      {
        emotion: "슬픔",
        percentage: 12,
        factors: ["외로움", "그리움", "이별", "아쉬움"],
        timePattern: {
          mostActive: "밤 10시",
          averageTime: "22:00",
        },
      },
      {
        emotion: "분노",
        percentage: 3,
        factors: ["불공평한 상황", "소통 문제", "예상치 못한 상황"],
        timePattern: {
          mostActive: "오후 5시",
          averageTime: "17:20",
        },
      },
    ],
    insights: [
      "1월 한 달 동안 기쁨이 가장 많이 느껴졌어요. 특히 친구들과의 만남과 성취감이 큰 영향을 주었습니다.",
      "불안감은 주로 저녁 시간대에 많이 느꼈는데, 업무 스트레스와 미래에 대한 걱정이 주요 원인이었어요.",
      "일기 작성 시간이 오후 2시에 가장 많았고, 슬픔은 주로 밤 시간대에 많이 느꼈습니다.",
      "전체적으로 평온한 감정도 많이 느꼈는데, 규칙적인 생활 패턴이 도움이 되었어요.",
    ],
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    anxietySummary: "월 중반과 말에 불안이 상승했으며 주로 저녁에 집중되었습니다.",
    calmSummary: "규칙적인 생활과 휴식이 평온을 유지하는 데 크게 기여했습니다.",
    joySummary: "사회적 활동과 성취 경험이 기쁨의 가장 큰 요인이었습니다.",
    sadnessSummary: "슬픔은 밤 시간대에 나타났지만 전반적으로 낮은 편이었습니다.",
    angerSummary: "분노는 드물게 나타났고 강도도 낮았습니다.",
    reportContent:
      "전체적으로 긍정 감정이 우세했으며, 저녁 시간대의 불안을 관리하는 루틴을 강화하면 다음 달에 더 안정적인 흐름을 기대할 수 있습니다.",
  },
];
