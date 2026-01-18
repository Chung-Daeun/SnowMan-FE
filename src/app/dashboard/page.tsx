import DashboardClient from "./DashboardClient";
import { serverFetch } from "@/shared/config/serverApi";

export default async function DashboardPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const today = now.getDate();

  const monthParam = `${year}-${String(month).padStart(2, "0")}`;
  const dayParam = `${monthParam}-${String(today).padStart(2, "0")}`;

  const [writtenRes, dayRes] = await Promise.all([
    serverFetch(`/api/diary/month?date=${monthParam}`),
    serverFetch(`/api/diary/day?date=${dayParam}`),
  ]);

  const writtenJson = await writtenRes.json();
  const dayJson = await dayRes.json();

  return (
    <DashboardClient
      initialYear={year}
      initialMonth={month - 1}
      initialSelectedDate={today}
      initialWrittenDays={writtenJson.data ?? []}
      initialDiaries={dayJson.data ?? []}
    />
  );
}
