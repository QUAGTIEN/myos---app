"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState, type FormEvent } from "react";
import { calendarError, type CalendarSettings } from "../model";
import { copyCalendarGroup, calendarRepository } from "../repository";
import { CalendarDialog } from "./dialogs";
import { CalendarColorPicker } from "./color-picker";

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
            <Input
              required
              autoFocus
              maxLength={40}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          {mode !== "copy" && (
            <CalendarColorPicker
              label="Màu bộ lịch"
              value={color}
              onChange={(next) => next !== null && setColor(next)}
            />
          )}
        </fieldset>
        {error && (
          <p className="schedule-error" role="alert">
            {error}
          </p>
        )}
        <div className="schedule-dialog-actions">
          <Button
            variant="outline"
            size="default"
            className="button secondary"
            type="button"
            disabled={pending}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            variant="default"
            size="default"
            className="button primary"
            type="submit"
            disabled={pending}
          >
            {pending ? "Đang lưu…" : "Lưu bộ lịch"}
          </Button>
        </div>
      </form>
    </CalendarDialog>
  );
}
