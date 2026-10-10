"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { monthDays } from "../attendance-model";
import {
  addDays,
  calendarTextColor,
  localTime,
  resolveCalendarColor,
  type CalendarSettings,
  type Occurrence,
} from "../model";
import { expandEvents } from "../recurrence";
import type { CalendarEvent } from "../model";
import { CalendarDialog } from "./dialogs";

export function MobileCalendar({
  date,
  view,
  firstDay,
  today,
  events,
  settings,
  group,
  search,
  disabled,
  onDate,
  onView,
  onGroup,
  onSearch,
  onOpen,
  onCreate,
  tools,
}: {
  date: string;
  view: string;
  firstDay: number;
  today: string;
  events: CalendarEvent[];
  settings: CalendarSettings;
  group: string;
  search: string;
  disabled: boolean;
  onDate: (date: string) => void;
  onView: (view: string) => void;
  onGroup: (group: string) => void;
  onSearch: (search: string) => void;
  onOpen: (occurrence: Occurrence) => void;
  onCreate: (date: string) => void;
  tools: ReactNode;
}) {
  const [filters, setFilters] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const weekday = localTime(date).weekday % 7;
  const days =
    view === "dayGridMonth"
      ? monthDays(date.slice(0, 7), firstDay)
      : Array.from({ length: 7 }, (_, index) =>
          addDays(date, -((weekday - firstDay + 7) % 7) + index),
        );
  const from = days[0];
  const until = addDays(days[days.length - 1], 1);
  const occurrences = useMemo(
    () =>
      expandEvents(events, from, until).filter(
        (item) =>
          (!group || item.groupId === group) &&
          (!search.trim() ||
            (item.title + " " + item.description)
              .toLocaleLowerCase("vi")
              .includes(search.trim().toLocaleLowerCase("vi"))),
      ),
    [events, from, until, group, search],
  );
  function onDay(day: string) {
    return occurrences.filter(
      (item) =>
        localTime(item.start).toMillis() <
          localTime(addDays(day, 1)).toMillis() &&
        localTime(item.end).toMillis() > localTime(day).toMillis(),
    );
  }
  const selected = onDay(date);
  function color(item: Occurrence) {
    return resolveCalendarColor(
      item.color ??
        settings.groups.find((value) => value.id === item.groupId)?.color ??
        "turquoise",
    );
  }
  function shift(amount: number) {
    const next = localTime(date)
      .plus(view === "dayGridMonth" ? { months: amount } : { weeks: amount })
      .toISODate()!;
    if (next >= "2000-01-01" && next <= "2100-12-31") onDate(next);
  }
  function entry(item: Occurrence) {
    const background = color(item);
    return (
      <Button
        key={item.eventId + item.originalStart}
        variant="ghost"
        type="button"
        className={
          "mobile-calendar-event" +
          (item.completed ? " schedule-completed" : "")
        }
        style={{ background, color: calendarTextColor(background) }}
        onClick={() => {
          setDayOpen(false);
          onOpen(item);
        }}
      >
        <span>
          {item.allDay ? "Cả ngày" : localTime(item.start).toFormat("HH:mm")}
        </span>
        <strong>{item.title}</strong>
        {item.completed && <span className="sr-only">Đã hoàn thành</span>}
      </Button>
    );
  }
  return (
    <section className="mobile-calendar" aria-label="Bộ lịch">
      <div className="mobile-calendar-toolbar">
        <Button
          variant="ghost"
          size="icon"
          aria-label={view === "dayGridMonth" ? "Tháng trước" : "Tuần trước"}
          onClick={() => shift(-1)}
        >
          <ChevronLeft size={18} />
        </Button>
        <h2 aria-live="polite">
          {localTime(date).setLocale("vi").toFormat("'Tháng' M, yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label={view === "dayGridMonth" ? "Tháng sau" : "Tuần sau"}
          onClick={() => shift(1)}
        >
          <ChevronRight size={18} />
        </Button>
        <div
          className="schedule-view-buttons"
          role="group"
          aria-label="Chế độ xem lịch"
        >
          {[
            ["dayGridMonth", "Tháng"],
            ["dayGridWeek", "Tuần"],
          ].map(([id, name]) => (
            <Button
              key={id}
              variant="ghost"
              aria-pressed={view === id}
              onClick={() => onView(id)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
      <div className="mobile-calendar-options">
        <span>
          {settings.groups.find((item) => item.id === group)?.name ??
            "Tất cả bộ lịch"}
          {search && " · Đang tìm kiếm"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Tìm kiếm và lọc lịch"
          aria-expanded={filters}
          onClick={() => setFilters(!filters)}
        >
          <Search size={18} />
        </Button>
        {tools}
      </div>
      {filters && (
        <div className="mobile-calendar-filters">
          <Input
            aria-label="Tìm lịch hẹn, ghi chú"
            placeholder="Tìm lịch hẹn, ghi chú…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Input
            aria-label="Đến ngày"
            type="date"
            min="2000-01-01"
            max="2100-12-31"
            value={date}
            onChange={(e) => {
              if (
                e.target.value >= "2000-01-01" &&
                e.target.value <= "2100-12-31"
              )
                onDate(e.target.value);
            }}
          />
          <NativeSelect
            aria-label="Bộ thời khóa biểu"
            value={group}
            onChange={(e) => onGroup(e.target.value)}
          >
            <option value="">Tất cả bộ lịch</option>
            {settings.groups.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </NativeSelect>
        </div>
      )}
      <div
        className="mobile-month-grid"
        role="group"
        aria-label={view === "dayGridMonth" ? "Lịch tháng" : "Lịch tuần"}
      >
        {Array.from({ length: 7 }, (_, i) => (firstDay + i) % 7).map((day) => (
          <span key={day} className="mobile-month-weekday">
            {day === 0 ? "CN" : "T" + (day + 1)}
          </span>
        ))}
        {days.map((day) => {
          const items = onDay(day);
          return (
            <Button
              key={day}
              variant="ghost"
              type="button"
              className={
                "mobile-month-day" +
                (day === date ? " selected" : "") +
                (day.slice(0, 7) !== date.slice(0, 7) ? " outside-month" : "")
              }
              aria-label={
                "Xem ngày " +
                day +
                (items.length ? ", " + items.length + " mục" : "")
              }
              aria-current={day === today ? "date" : undefined}
              aria-pressed={day === date}
              disabled={day < "2000-01-01" || day > "2100-12-31"}
              onClick={() => {
                onDate(day);
                setDayOpen(true);
              }}
            >
              <span>{Number(day.slice(8))}</span>
              <span className="mobile-month-dots" aria-hidden="true">
                {items.slice(0, 3).map((item) => (
                  <i
                    key={item.eventId + item.originalStart}
                    style={{ background: color(item) }}
                  />
                ))}
              </span>
            </Button>
          );
        })}
      </div>
      <div className="mobile-day-preview">
        <div className="mobile-day-heading">
          <h3>
            {localTime(date).setLocale("vi").toFormat("cccc, dd/MM")}{" "}
            <span>· {selected.length} mục</span>
          </h3>
          <Button
            variant="default"
            size="icon"
            aria-label={"Thêm vào ngày " + date}
            disabled={disabled}
            onClick={() => onCreate(date)}
          >
            <Plus size={18} />
          </Button>
        </div>
        {selected[0] ? (
          entry(selected[0])
        ) : (
          <p>Chưa có nội dung cho ngày này.</p>
        )}
        <Button
          variant="ghost"
          className="mobile-day-open"
          onClick={() => setDayOpen(true)}
        >
          Xem lịch trong ngày <ChevronRight size={17} />
        </Button>
      </div>
      {dayOpen && (
        <CalendarDialog
          title={localTime(date).setLocale("vi").toFormat("cccc, dd/MM/yyyy")}
          description="Toàn bộ nội dung của ngày được chọn."
          onClose={() => setDayOpen(false)}
        >
          <div className="mobile-day-list">
            {selected.length ? (
              selected.map(entry)
            ) : (
              <p>Chưa có nội dung cho ngày này.</p>
            )}
          </div>
          <Button
            variant="default"
            disabled={disabled}
            onClick={() => {
              setDayOpen(false);
              onCreate(date);
            }}
          >
            Thêm nội dung
          </Button>
        </CalendarDialog>
      )}
    </section>
  );
}
