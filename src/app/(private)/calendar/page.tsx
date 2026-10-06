import type { Metadata } from "next";
import { CalendarScreen } from "@/modules/calendar/components/calendar-screen";
export const metadata: Metadata = { title: "Lịch" };
export const dynamic = "force-dynamic";
export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query: Record<string, string> = {};
  for (const key of ["projectId", "noteId", "milestoneId", "eventId"]) {
    const value = params[key];
    if (
      typeof value === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
      )
    )
      query[key] = value;
  }
  if (
    typeof params.occurrence === "string" &&
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(params.occurrence)
  )
    query.occurrence = params.occurrence;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return <CalendarScreen today={today} query={query} />;
}
