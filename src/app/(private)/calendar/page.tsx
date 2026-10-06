import type { Metadata } from "next";
import { CalendarScreen } from "@/modules/calendar/components/calendar-screen";
export const metadata: Metadata = { title: "Lịch" };
export const dynamic = "force-dynamic";
export default function CalendarPage() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return <CalendarScreen today={today} />;
}
