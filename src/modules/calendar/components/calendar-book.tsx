"use client";
import { useAccount } from "@/modules/auth/account-context";
import { DateTime } from "luxon";
import { useRef, useState, type FormEvent } from "react";
import { calendarError, calendarZone, type CalendarSettings } from "../model";
import { copyCalendarGroup, calendarRepository } from "../repository";
import { CalendarDialog } from "./dialogs";

export function CalendarYear({
  year,
  today,
  onDate,
}: {
  year: number;
  today: string;
  onDate: (date: string) => void;
}) {
  const firstDay = useAccount()?.profile.firstDay ?? 1;
  const weekdays =
    firstDay === 1
      ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
      : ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return (
    <div className="calendar-year" aria-label={"Lịch năm " + year}>
      {Array.from({ length: 12 }, (_, index) => {
        const month = DateTime.fromObject(
          { year, month: index + 1, day: 1 },
          { zone: calendarZone },
        );
        const offset = (month.weekday - firstDay + 7) % 7;
        return (
          <section
            className="calendar-year-month"
            key={index}
            aria-label={"Tháng " + (index + 1)}
          >
            <button
              type="button"
              className="calendar-year-title"
              onClick={() => onDate(month.toISODate()!)}
            >
              Tháng {index + 1}
            </button>
            <div className="calendar-year-days">
              {weekdays.map((day) => (
                <span className="calendar-weekday" key={day}>
                  {day}
                </span>
              ))}
              {Array.from({ length: offset }, (_, i) => (
                <span key={"blank" + i} />
              ))}
              {Array.from({ length: month.daysInMonth! }, (_, i) => {
                const date = month.set({ day: i + 1 }).toISODate()!;
                return (
                  <button
                    type="button"
                    className={date === today ? "is-today" : ""}
                    aria-current={date === today ? "date" : undefined}
                    key={date}
                    aria-label={
                      "Ngày " +
                      (i + 1) +
                      " tháng " +
                      (index + 1) +
                      " năm " +
                      year
                    }
                    onClick={() => onDate(date)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function TimetableDialog({
  settings,
  groupId,
  mode,
  onClose,
  onSaved,
}: {
  settings: CalendarSettings;
  groupId?: string;
  mode: "create" | "edit" | "copy";
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const source = settings.groups.find((item) => item.id === groupId);
  const [name, setName] = useState(
    mode === "copy"
      ? (source?.name ?? "Bộ lịch") + " (bản sao)"
      : (source?.name ?? ""),
  );
  const [color, setColor] = useState<
    CalendarSettings["groups"][number]["color"]
  >(source?.color ?? "turquoise");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    try {
      let id = source?.id ?? crypto.randomUUID();
      if (mode === "copy")
        id = await copyCalendarGroup(settings, groupId ?? "", name);
      else {
        if (mode === "edit" && !source)
          throw new Error("Bộ lịch không còn tồn tại.");
        const groups =
          mode === "edit"
            ? settings.groups.map((item) =>
                item.id === id ? { ...item, name, color } : item,
              )
            : [...settings.groups, { id, name, color }];
        await calendarRepository.saveSettings({ ...settings, groups });
      }
      onSaved(id);
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return (
    <CalendarDialog
      title={
        mode === "create"
          ? "Tạo bộ thời khóa biểu"
          : mode === "copy"
            ? "Sao chép bộ thời khóa biểu"
            : "Sửa bộ thời khóa biểu"
      }
      description="Lưu tên và màu của bộ lịch"
      pending={pending}
      onClose={onClose}
    >
      <form className="schedule-form" onSubmit={(event) => void save(event)}>
        <fieldset disabled={pending}>
          <label>
            Tên bộ lịch
            <input
              required
              autoFocus
              maxLength={40}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          {mode !== "copy" && (
            <label>
              Màu bộ lịch
              <select
                value={color}
                onChange={(event) =>
                  setColor(event.target.value as typeof color)
                }
              >
                {Object.entries({
                  turquoise: "Xanh ngọc",
                  blue: "Xanh dương",
                  amber: "Hổ phách",
                  rose: "Hồng",
                  violet: "Tím",
                }).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </fieldset>
        {error && (
          <p className="schedule-error" role="alert">
            {error}
          </p>
        )}
        <div className="schedule-form-actions">
          <button
            className="button secondary"
            type="button"
            disabled={pending}
            onClick={onClose}
          >
            Hủy
          </button>
          <button className="button primary" type="submit" disabled={pending}>
            {pending ? "Đang lưu…" : "Lưu bộ lịch"}
          </button>
        </div>
      </form>
    </CalendarDialog>
  );
}
