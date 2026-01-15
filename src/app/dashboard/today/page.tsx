 "use client";
 
 import { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
 import { apiFetch } from "@/shared/config/api";
 import { DiaryCard } from "@/shared/ui/DiaryCard";
 
 type TodayDiaryItem = {
   id: number;
   time: string;
   content: string;
   aiResponse: string | null;
 };
 
 export default function TodayPage() {
   const router = useRouter();
   const today = new Date();
   const month = today.getMonth() + 1;
   const date = today.getDate();
   const weekDay = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()];
   const dateStr = `${today.getFullYear()}-${String(month).padStart(
     2,
     "0"
   )}-${String(date).padStart(2, "0")}`;
 
   const [diaries, setDiaries] = useState<TodayDiaryItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const fetchTodayDiaries = async () => {
       try {
         const response = await apiFetch(`/api/diary/day?date=${dateStr}`, {
           method: "GET",
         });
         if (!response.ok) {
           console.error("오늘 일기 조회 실패", await response.text());
           setDiaries([]);
           return;
         }
 
         const json = await response.json();
         const rawList: any[] = Array.isArray(json?.data) ? json.data : [];
 
         const mapped: TodayDiaryItem[] = rawList.map((item) => {
           const createdAt: unknown = item?.createdAt;
           const time =
             typeof createdAt === "string" ? createdAt.slice(11, 16) : "";
 
           const aiReplyContent: unknown = item?.aiReply?.replyContent;
 
           return {
             id: item?.diaryId ?? 0,
             time,
             content: String(item?.content ?? ""),
             aiResponse:
               typeof aiReplyContent === "string" ? aiReplyContent : null,
           };
         });
 
         setDiaries(mapped);
       } catch (error) {
         console.error("오늘 일기 조회 중 오류 발생", error);
         setDiaries([]);
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchTodayDiaries();
   }, [dateStr]);
 
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
         {isLoading ? (
           <p className="text-gray text-sm">오늘 일기를 불러오는 중입니다...</p>
         ) : diaries.length === 0 ? (
           <p className="text-gray text-sm">오늘 작성한 일기가 없습니다.</p>
         ) : (
           diaries.map((diary) => (
             <DiaryCard
               key={diary.id}
               time={diary.time}
               content={diary.content}
               aiPreview={diary.aiResponse}
               aiPreviewLineClampClass="line-clamp-2"
               onClick={() =>
                 router.push(`/dashboard/diary/${dateStr}/${diary.id}`)
               }
             />
           ))
         )}
       </div>
 
       {/* 일기 작성 버튼 (모바일 프레임 안쪽 하단 우측) */}
       <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 flex justify-end">
         <button
           onClick={() => router.push("/dashboard/write")}
           className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
         >
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

