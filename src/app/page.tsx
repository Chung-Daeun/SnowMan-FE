import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 bg-primary">
      {/* 배경 도형들 */}
      <div className="absolute top-20 left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute bottom-32 right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-lg rotate-12"></div>
      <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/5 rounded-full"></div>
      
      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex w-full flex-col items-center gap-12">
        {/* 로고/타이틀 영역 */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            {/* 눈송이 도형 */}
            <div className="relative">
              <div className="w-3 h-3 bg-white/80 rounded-full"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-2 h-2 bg-white/60 rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">SnowMan</h1>
            <div className="relative">
              <div className="w-3 h-3 bg-white/80 rounded-full"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-2 h-2 bg-white/60 rounded-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-2 h-2 bg-white/60 rounded-full"></div>
            </div>
          </div>
          <p className="text-center text-white/90 text-lg leading-relaxed font-light">
            나를 알아가는 시간
          </p>
        </div>

        {/* 이용하기 버튼 */}
        <Link
          href="/login"
          className="w-full rounded-2xl bg-white px-6 py-4 text-center text-primary font-semibold text-lg shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          이용하기
        </Link>
      </div>
    </div>
  );
}
