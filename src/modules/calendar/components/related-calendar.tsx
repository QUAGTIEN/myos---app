"use client";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { localTime } from "../model";
import { allOccurrences } from "../recurrence";
import { useCalendar } from "../use-calendar";
import "../calendar.css";

export function RelatedCalendar({
  kind,
  id,
  readonly = false,
}: {
  kind: "project" | "note";
  id: string;
  readonly?: boolean;
}) {
  const { events, loading, error, refresh } = useCalendar();
  const today = localTime(new Date().toISOString()).toISODate()!;
  const linked = events
    .filter((event) => !event.cancelledAt)
    .flatMap((event) => {
      const occurrences = allOccurrences(event).filter((item) =>
        item[kind === "project" ? "projectIds" : "noteIds"].includes(id),
      );
      const item =
        occurrences.find((item) => item.end > today) ?? occurrences.at(-1);
      return item ? [item] : [];
    })
    .sort((a, b) => a.start.localeCompare(b.start));
  return (
    <section className="panel schedule-related">
      <div className="schedule-related-heading">
        <h2>
          <CalendarDays size={17} />
          Lịch liên quan
        </h2>
        {!readonly && (
          <Link
            className="button secondary small"
            href={`/calendar?${kind}Id=${id}`}
          >
            <Plus size={15} />
            Tạo lịch
          </Link>
        )}
      </div>
      {loading ? (
        <p>Đang tải lịch…</p>
      ) : error ? (
        <p role="alert">
          {error}{" "}
          <button type="button" className="text-link" onClick={refresh}>
            Thử lại
          </button>
        </p>
      ) : linked.length ? (
        <ul>
          {linked.slice(0, 5).map((item) => (
            <li key={item.eventId}>
              <Link
                href={`/calendar?eventId=${item.eventId}&occurrence=${encodeURIComponent(item.originalStart)}`}
              >
                {item.title}
              </Link>
              <span>
                {localTime(item.start).toFormat(
                  item.allDay ? "dd/MM/yyyy · 'Cả ngày'" : "dd/MM/yyyy · HH:mm",
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Chưa có lịch hẹn liên quan.</p>
      )}
      {linked.length > 5 && (
        <p>{linked.length} chuỗi/lịch liên quan. Xem đầy đủ trong Lịch.</p>
      )}
    </section>
  );
}
