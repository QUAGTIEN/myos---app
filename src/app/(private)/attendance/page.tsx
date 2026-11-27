import type { Metadata } from "next";
import { AttendanceScreen } from "@/modules/attendance/components/attendance-screen";

export const metadata: Metadata = { title: "Chấm công" };
export const dynamic = "force-dynamic";

export default function AttendancePage() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return <AttendanceScreen today={today} />;
}
