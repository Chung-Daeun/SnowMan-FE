// Mock data for diaries and AI responses

export type DiaryItem = {
  id: number;
  time: string;
  content: string;
  aiResponse: string;
};

// 날짜별 일기 목록
export const dateDiaries: Record<string, DiaryItem[]> = {
  "2026-01-01": [
    {
      id: 1,
      time: "10:00",
      content: "1월 1일 첫 일기입니다. 새해를 시작하는 마음이 복잡해요.",
      aiResponse: "새해의 시작이네요. 복잡한 마음도 자연스러운 감정이에요.",
    },
  ],
  "2026-01-03": [
    {
      id: 1,
      time: "14:30",
      content: "1월 3일 일기입니다. 오늘 하루가 정말 힘들었어요.",
      aiResponse: "힘든 하루였군요. 잘 견뎌내셨어요.",
    },
  ],
  "2026-01-05": [
    {
      id: 1,
      time: "09:15",
      content: "1월 5일 일기입니다. 오늘은 날씨가 좋아서 기분이 좋았어요.",
      aiResponse: "좋은 날씨가 기분을 좋게 만들었군요.",
    },
  ],
  "2026-01-07": [
    {
      id: 1,
      time: "19:00",
      content: "1월 7일 일기입니다. 오늘은 친구들과 만나서 즐거웠어요.",
      aiResponse: "친구들과의 시간이 즐거웠다니 좋네요.",
    },
  ],
  "2026-01-13": [
    {
      id: 1,
      time: "21:10",
      content: "1월 13일, 조금 무기력했지만 일기를 쓰며 정리했습니다.",
      aiResponse: "무기력한 날도 있어요. 일기를 쓰며 마음을 정리한 것만으로 큰 걸음입니다.",
    },
  ],
};

// 오늘 일기 목록 (예: Today 페이지에서 사용)
export const todayDiaries: DiaryItem[] = [
  {
    id: 1,
    time: "09:30",
    content:
      "오늘 아침 일어나니 날씨가 너무 좋아서 기분이 좋아졌어요. 하지만 회사에 가는 길이 너무 지루했어요.",
    aiResponse:
      "아침의 좋은 날씨가 당신의 기분을 좋게 만들었군요. 하지만 회사로 가는 길이 지루하다는 것은 일상의 반복에서 오는 피로감일 수 있어요. 작은 변화를 주는 것도 좋은 방법일 것 같아요.",
  },
  {
    id: 2,
    time: "14:20",
    content:
      "점심시간에 동료들과 이야기를 나누었는데, 생각보다 재미있었어요. 하지만 오후 업무가 너무 많아서 스트레스를 받았어요.",
    aiResponse:
      "동료들과의 대화가 즐거웠다는 것은 좋은 신호예요. 하지만 업무 스트레스는 누구나 겪는 일이에요. 자신을 너무 몰아세우지 말고, 작은 휴식도 괜찮아요.",
  },
  {
    id: 3,
    time: "19:45",
    content:
      "집에 와서 쉬고 있는데, 오늘 하루가 정말 길었어요. 내일도 비슷한 하루가 반복될 것 같아서 조금 걱정이에요.",
    aiResponse:
      "하루가 길게 느껴졌다는 것은 많은 일을 겪으셨다는 의미일 수 있어요. 내일에 대한 걱정은 자연스러운 감정이지만, 지금 이 순간의 휴식을 즐기는 것도 중요해요.",
  },
];

// 일기 상세 (예시)
export const diaryDetails: Record<string, Record<string, DiaryItem>> = {
  "2026-01-01": {
    "1": {
      id: 1,
      time: "10:00",
      content:
        "1월 1일 첫 일기입니다. 오늘은 새로운 한 달의 시작이라 기대가 됩니다. 하지만 동시에 불안감도 느껴져요. 이번 달에는 어떤 일들이 기다리고 있을까요?",
      aiResponse:
        "12월의 시작이네요. 새로운 한 달을 시작하는 마음이 어떠신가요? 기대와 불안이 공존하는 것은 자연스러운 감정이에요. 한 달을 앞서 걱정하기보다는 하루하루를 차근차근 살아가는 것도 좋은 방법일 수 있어요.",
    },
  },
  "2026-01-13": {
    "1": {
      id: 1,
      time: "21:10",
      content:
        "1월 13일, 조금 무기력했지만 일기를 쓰며 정리했습니다. AI가 뭐라고 답할지 궁금했어요.",
      aiResponse:
        "무기력함을 느낀 날에도 기록을 남긴 건 큰 의미가 있어요. 오늘을 돌아볼 용기가 있다는 뜻이니까요.",
    },
  },
};

// 유틸: 특정 연월의 작성 날짜 리스트
export const getWrittenDatesByMonth = (year: number, monthZeroBased: number) => {
  const result: number[] = [];
  Object.keys(dateDiaries).forEach((dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (y === year && m === monthZeroBased + 1 && dateDiaries[dateStr].length > 0) {
      result.push(d);
    }
  });
  return result;
};
