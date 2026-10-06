"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { FeatureNotice } from "@/components/ui/feature-notice";
import { PageHeading } from "@/components/ui/page-heading";

const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function CalendarScreen({ today }: { today: string }) {
  const [year, month, day] = today.split("-").map(Number);
  const [visibleMonth, setVisibleMonth] = useState({ year, month: month - 1 });
  const firstDay = new Date(visibleMonth.year, visibleMonth.month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const monthLabel = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(firstDay);
  const cells = Array.from(
    { length: 42 },
    (_, index) =>
      new Date(visibleMonth.year, visibleMonth.month, index - offset + 1),
  );

  function moveMonth(direction: number) {
    const date = new Date(visibleMonth.year, visibleMonth.month + direction, 1);
    setVisibleMonth({ year: date.getFullYear(), month: date.getMonth() });
  }

  return (
    <>
      <PageHeading
        eyebrow="DÀNH THỜI GIAN CHO ĐIỀU QUAN TRỌNG"
        title="Lịch"
        description="Một góc nhìn rõ ràng cho lịch hẹn và nhịp sinh hoạt của bạn."
        action={
          <button
            className="button primary"
            type="button"
            disabled
            aria-describedby="calendar-status"
          >
            <Plus size={18} aria-hidden="true" />
            Tạo lịch hẹn
          </button>
        }
      />
      <div id="calendar-status">
        <FeatureNotice>
          Bạn có thể xem và chuyển tháng. Lịch hẹn, thời khóa biểu và nhắc lịch
          sẽ được kết nối ở bước sau.
        </FeatureNotice>
      </div>
      <section className="panel calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-month">
            <h2 aria-live="polite">{monthLabel}</h2>
            <div className="calendar-controls">
              <button
                type="button"
                className="icon-button"
                aria-label="Tháng trước"
                onClick={() => moveMonth(-1)}
              >
                <ChevronLeft size={19} />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Tháng sau"
                onClick={() => moveMonth(1)}
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="button secondary small"
            onClick={() => setVisibleMonth({ year, month: month - 1 })}
          >
            Hôm nay
          </button>
        </div>
        <div className="calendar-scroll">
          <table className="month-grid" aria-label={"Lịch " + monthLabel}>
            <thead>
              <tr>
                {weekdays.map((label) => (
                  <th key={label} scope="col">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, row) => (
                <tr key={row}>
                  {cells.slice(row * 7, row * 7 + 7).map((date) => {
                    const isToday =
                      date.getFullYear() === year &&
                      date.getMonth() === month - 1 &&
                      date.getDate() === day;
                    const outside = date.getMonth() !== visibleMonth.month;
                    return (
                      <td
                        key={date.toISOString()}
                        className={outside ? "outside-month" : undefined}
                      >
                        <time
                          dateTime={[
                            date.getFullYear(),
                            String(date.getMonth() + 1).padStart(2, "0"),
                            String(date.getDate()).padStart(2, "0"),
                          ].join("-")}
                          aria-current={isToday ? "date" : undefined}
                          className={
                            isToday ? "day-number today" : "day-number"
                          }
                        >
                          {date.getDate()}
                        </time>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="calendar-bottom">
          <span>
            <span className="legend-dot" />
            Hôm nay
          </span>
          <span>
            <CalendarDays size={15} aria-hidden="true" />
            Chưa có lịch hẹn
          </span>
        </div>
      </section>
    </>
  );
}
