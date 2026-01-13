"use client";

// Mock 데이터: 오늘의 일기들
const todayDiaries = [
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

export default function TodayPage() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()];

  return (
    <div className="flex min-h-screen flex-col px-6 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          오늘의 일기
        </h2>
        <p className="text-gray text-sm">
          {month}월 {date}일 ({weekDay})
        </p>
      </div>

      {/* 일기 목록 */}
      <div className="space-y-4">
        {todayDiaries.map((diary) => (
          <div
            key={diary.id}
            className="bg-white rounded-2xl p-5 shadow-sm space-y-4"
          >
            {/* 시간 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-light">{diary.time}</span>
            </div>

            {/* 일기 내용 */}
            <div className="space-y-2">
              <p className="text-foreground leading-relaxed">
                {diary.content}
              </p>
            </div>

            {/* AI 답변 */}
            <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs font-semibold text-primary">AI</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {diary.aiResponse}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 일기 작성 버튼 */}
      <div className="fixed bottom-24 right-6">
        <button className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
