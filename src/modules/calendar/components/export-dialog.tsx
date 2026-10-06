"use client";
import { useState, type FormEvent } from "react";
import {
  addDays,
  calendarError,
  type CalendarEvent,
  type CalendarSettings,
} from "../model";
import { exportCalendarIcs } from "../ics";
import { CalendarDialog } from "./calendar-dialog";

export function ExportDialog({
  events,
  settings,
  from,
  until,
  onClose,
}: {
  events: CalendarEvent[];
  settings: CalendarSettings;
  from: string;
  until: string;
  onClose: () => void;
}) {
  const [start, setStart] = useState(from);
  const [end, setEnd] = useState(addDays(until, -1));
  const [group, setGroup] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  function download(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const result = exportCalendarIcs(events, settings, start, end, group);
      const url = URL.createObjectURL(
        new Blob([result.content], { type: "text/calendar;charset=utf-8" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `myos-${start}-${end}.ics`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(`Đã xuất ${result.count} buổi lịch.`);
    } catch (cause) {
      setError(calendarError(cause));
    }
  }
  return (
    <CalendarDialog
      title="Xuất lịch .ics"
      description="Chọn khoảng ngày và nhóm lịch để nhập vào ứng dụng lịch khác."
      onClose={onClose}
    >
      <form className="schedule-form" onSubmit={download}>
        <fieldset>
          <div className="schedule-form-grid">
            <label>
              Từ ngày
              <input
                type="date"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label>
              Đến hết ngày
              <input
                type="date"
                required
                min={start}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </div>
          <label>
            Nhóm cần xuất
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">Tất cả nhóm</option>
              {settings.groups.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        <p className="schedule-help">
          Tối đa 367 ngày. File giữ múi giờ Việt Nam, chuỗi tuần và ngoại lệ;
          những buổi ngoài phạm vi được loại bằng EXDATE. Xuất file là một bản
          chụp, chưa có đồng bộ hai chiều.
        </p>
        {error && (
          <p role="alert" className="schedule-error">
            {error}
          </p>
        )}
        {message && <p role="status">{message}</p>}
        <div className="schedule-dialog-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Đóng
          </button>
          <button type="submit" className="button primary">
            Tải file .ics
          </button>
        </div>
      </form>
    </CalendarDialog>
  );
}
