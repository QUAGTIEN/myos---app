"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, type ReactNode, type FormEvent } from "react";
import {
  addDays,
  calendarError,
  type CalendarEvent,
  type CalendarSettings,
} from "../model";
import { exportCalendarIcs } from "../ics";

export function CalendarDialog({
  title,
  description,
  children,
  pending = false,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  pending?: boolean;
  onClose: () => void;
}) {
  const [returnFocus] = useState(() =>
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="schedule-overlay" />
        <Dialog.Content
          className="schedule-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (returnFocus?.isConnected) returnFocus.focus();
            else
              document
                .querySelector<HTMLButtonElement>(
                  ".schedule-module .button.primary",
                )
                ?.focus();
          }}
          onEscapeKeyDown={(event) => {
            if (pending) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (pending) event.preventDefault();
          }}
        >
          <div className="schedule-dialog-heading">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description className="sr-only">
                {description}
              </Dialog.Description>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="Đóng hộp thoại lịch"
              disabled={pending}
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

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
