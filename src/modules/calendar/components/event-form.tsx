"use client";
import { useMemo, useState, type FormEvent } from "react";
import { useProjects } from "@/modules/projects/use-projects";
import { useNotes } from "@/modules/notes/hooks";
import {
  addDays,
  calendarError,
  eventInputSchema,
  localTime,
  occurrenceInputSchema,
  weekdays,
  type CalendarEvent,
  type CalendarSettings,
  type EventInput,
  type Occurrence,
} from "../model";
import { conflictingEvents } from "../recurrence";
import {
  editCalendarEvent,
  newCalendarEvent,
  occurrenceToInput,
} from "../service";
import { CalendarDialog } from "./dialogs";

export function EventForm({
  initial,
  event,
  occurrence,
  events,
  settings,
  onSave,
  onClose,
}: {
  initial: EventInput;
  event?: CalendarEvent;
  occurrence?: Occurrence;
  events: CalendarEvent[];
  settings: CalendarSettings;
  onSave: (input: EventInput, originalStart?: string) => Promise<unknown>;
  onClose: () => void;
}) {
  const [scope, setScope] = useState<"one" | "series">(
    event?.repeat ? "one" : "series",
  );
  const [input, setInput] = useState(initial);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const {
    projects,
    loading: projectsLoading,
    error: projectError,
  } = useProjects();
  const { notes, loading: notesLoading, error: noteError } = useNotes();
  const one = !!event?.repeat && scope === "one";
  const label =
    input.entryKind === "note"
      ? "ghi chú"
      : input.entryKind === "task"
        ? "công việc"
        : "lịch hẹn";
  const conflicts = useMemo(() => {
    try {
      return conflictingEvents(
        events,
        event
          ? editCalendarEvent(
              event,
              input,
              one ? occurrence?.originalStart : undefined,
            )
          : newCalendarEvent(input),
      );
    } catch {
      return [];
    }
  }, [events, event, input, one, occurrence]);
  function change(patch: Partial<EventInput>) {
    setInput((current) => ({ ...current, ...patch }));
  }
  function close() {
    if (
      !pending &&
      (JSON.stringify(input) === baseline ||
        window.confirm("Bỏ thay đổi lịch chưa lưu?"))
    )
      onClose();
  }
  function switchScope(next: "one" | "series") {
    if (
      !event ||
      !occurrence ||
      (JSON.stringify(input) !== baseline &&
        !window.confirm("Bỏ nội dung đang sửa để đổi phạm vi?"))
    )
      return;
    const draft =
      next === "one"
        ? occurrenceToInput(occurrence, event)
        : eventInputSchema.parse(event);
    setScope(next);
    setInput(draft);
    setBaseline(JSON.stringify(draft));
    setError("");
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError("");
    try {
      if (one) occurrenceInputSchema.parse(input);
      else eventInputSchema.parse(input);
      if (
        conflicts.length &&
        !window.confirm(
          "Lịch này trùng thời gian với lịch khác. Bạn vẫn muốn lưu?",
        )
      )
        return;
      if (
        event?.exceptions.length &&
        !one &&
        (event.start !== input.start ||
          event.end !== input.end ||
          event.allDay !== input.allDay ||
          JSON.stringify(event.repeat) !== JSON.stringify(input.repeat)) &&
        !window.confirm(
          "Đổi lịch gốc sẽ đặt lại mọi ngoại lệ: các buổi nghỉ, đổi giờ và hoàn thành riêng. Tiếp tục?",
        )
      )
        return;
      setPending(true);
      await onSave(input, one ? occurrence?.originalStart : undefined);
      onClose();
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      setPending(false);
    }
  }
  function toggleLink(kind: "projectIds" | "noteIds", id: string) {
    change({
      [kind]: input[kind].includes(id)
        ? input[kind].filter((value) => value !== id)
        : [...input[kind], id],
    });
  }
  return (
    <CalendarDialog
      title={(event ? "Sửa " : "Tạo ") + label}
      description="Nội dung trên lịch theo giờ Việt Nam (UTC+7)."
      pending={pending}
      onClose={close}
    >
      <form className="schedule-form" onSubmit={(e) => void submit(e)}>
        <fieldset disabled={pending}>
          {event?.repeat && (
            <label>
              Phạm vi sửa
              <select
                value={scope}
                onChange={(e) =>
                  switchScope(e.target.value as "one" | "series")
                }
              >
                <option value="one">Chỉ buổi này</option>
                <option value="series">Toàn chuỗi</option>
              </select>
            </label>
          )}
          <label>
            {"Tên " + label}
            <input
              required
              autoFocus
              maxLength={120}
              value={input.title}
              onChange={(e) => change({ title: e.target.value })}
            />
          </label>
          <label>
            Nội dung
            <textarea
              rows={3}
              maxLength={10000}
              value={input.description}
              onChange={(e) => change({ description: e.target.value })}
            />
          </label>
          <label className="schedule-check">
            <input
              type="checkbox"
              checked={input.allDay}
              disabled={one}
              onChange={(e) =>
                change({
                  allDay: e.target.checked,
                  start: e.target.checked
                    ? input.start.slice(0, 10)
                    : input.start.slice(0, 10) + "T09:00",
                  end: e.target.checked
                    ? addDays(input.end.slice(0, 10), 1)
                    : addDays(input.end, -1) + "T10:00",
                })
              }
            />
            Cả ngày
          </label>
          <div className="schedule-form-grid">
            <label>
              Bắt đầu
              <input
                required
                type={input.allDay ? "date" : "datetime-local"}
                min={input.allDay ? "2000-01-01" : "2000-01-01T00:00"}
                max={input.allDay ? "2100-12-31" : "2100-12-31T23:59"}
                value={input.start}
                onChange={(e) => change({ start: e.target.value })}
              />
            </label>
            <label>
              {input.allDay ? "Ngày cuối" : "Kết thúc"}
              <input
                required
                type={input.allDay ? "date" : "datetime-local"}
                value={input.allDay ? addDays(input.end, -1) : input.end}
                onChange={(e) =>
                  change({
                    end: input.allDay
                      ? addDays(e.target.value, 1)
                      : e.target.value,
                  })
                }
              />
            </label>
            <label>
              Nhóm lịch
              <select
                value={input.groupId}
                onChange={(e) => change({ groupId: e.target.value })}
              >
                {settings.groups.map((group) => (
                  <option value={group.id} key={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nhắc trước (chưa bật)
              <select
                value={input.reminderMinutes ?? "off"}
                onChange={(e) =>
                  change({
                    reminderMinutes:
                      e.target.value === "off" ? null : Number(e.target.value),
                  })
                }
              >
                {[
                  null,
                  0,
                  5,
                  15,
                  30,
                  60,
                  1440,
                  ...(input.reminderMinutes !== null &&
                  ![0, 5, 15, 30, 60, 1440].includes(input.reminderMinutes)
                    ? [input.reminderMinutes]
                    : []),
                ].map((value) => (
                  <option key={value ?? "off"} value={value ?? "off"}>
                    {value === null
                      ? "Không nhắc"
                      : value === 0
                        ? "Đúng giờ"
                        : `${value} phút`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="schedule-flags">
            <label className="schedule-check">
              <input
                type="checkbox"
                checked={input.important}
                onChange={(e) => change({ important: e.target.checked })}
              />
              Quan trọng
            </label>
            {(!input.repeat || one) && (
              <label className="schedule-check">
                <input
                  type="checkbox"
                  checked={input.completed}
                  onChange={(e) => change({ completed: e.target.checked })}
                />
                Đã hoàn thành
              </label>
            )}
          </div>
          {!one && (
            <div className="schedule-repeat">
              <label className="schedule-check">
                <input
                  type="checkbox"
                  checked={!!input.repeat}
                  onChange={(e) =>
                    change({
                      completed: false,
                      repeat: e.target.checked
                        ? {
                            weekdays: [localTime(input.start).weekday % 7],
                            until: addDays(input.start.slice(0, 10), 90),
                          }
                        : null,
                    })
                  }
                />
                Lặp hàng tuần
              </label>
              {input.repeat && (
                <>
                  <div
                    className="schedule-weekdays"
                    role="group"
                    aria-label="Các thứ lặp"
                  >
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                      <label key={day}>
                        <input
                          type="checkbox"
                          checked={input.repeat!.weekdays.includes(day)}
                          onChange={(e) =>
                            change({
                              repeat: {
                                ...input.repeat!,
                                weekdays: e.target.checked
                                  ? [...input.repeat!.weekdays, day]
                                  : input.repeat!.weekdays.filter(
                                      (value) => value !== day,
                                    ),
                              },
                            })
                          }
                        />
                        {weekdays[day]}
                      </label>
                    ))}
                  </div>
                  <label>
                    Lặp đến hết ngày
                    <input
                      type="date"
                      required
                      min={input.start.slice(0, 10)}
                      value={input.repeat.until}
                      onChange={(e) =>
                        change({
                          repeat: { ...input.repeat!, until: e.target.value },
                        })
                      }
                    />
                  </label>
                </>
              )}
            </div>
          )}
          <details
            className="schedule-links"
            open={!!input.projectIds.length || !!input.noteIds.length}
          >
            <summary>Liên kết Dự án / Ghi chú</summary>
            {(projectError || noteError) && (
              <p role="alert">
                {projectError || noteError} Có thể lưu lịch; tải lại để chọn
                liên kết mới.
              </p>
            )}
            <p className="schedule-help">
              Dự án{projectsLoading ? " — đang tải…" : ""}
            </p>
            <div className="schedule-link-options">
              {projects
                .filter(
                  (project) =>
                    !project.archivedAt ||
                    input.projectIds.includes(project.id),
                )
                .map((project) => (
                  <label className="schedule-check" key={project.id}>
                    <input
                      type="checkbox"
                      checked={input.projectIds.includes(project.id)}
                      onChange={() => toggleLink("projectIds", project.id)}
                    />
                    {project.title}
                    {project.archivedAt ? " (lưu trữ)" : ""}
                  </label>
                ))}
              {!projects.length && !projectsLoading && (
                <span>Chưa có dự án.</span>
              )}
              {input.projectIds
                .filter((id) => !projects.some((project) => project.id === id))
                .map((id) => (
                  <label className="schedule-check" key={id}>
                    <input
                      type="checkbox"
                      checked
                      onChange={() => toggleLink("projectIds", id)}
                    />
                    Dự án không còn khả dụng
                  </label>
                ))}
            </div>
            <p className="schedule-help">
              Ghi chú{notesLoading ? " — đang tải…" : ""}
            </p>
            <div className="schedule-link-options">
              {notes
                .filter(
                  (note) => !note.trashedAt || input.noteIds.includes(note.id),
                )
                .map((note) => (
                  <label className="schedule-check" key={note.id}>
                    <input
                      type="checkbox"
                      checked={input.noteIds.includes(note.id)}
                      onChange={() => toggleLink("noteIds", note.id)}
                    />
                    {note.title}
                    {note.trashedAt ? " (thùng rác)" : ""}
                  </label>
                ))}
              {!notes.length && !notesLoading && <span>Chưa có ghi chú.</span>}
              {input.noteIds
                .filter((id) => !notes.some((note) => note.id === id))
                .map((id) => (
                  <label className="schedule-check" key={id}>
                    <input
                      type="checkbox"
                      checked
                      onChange={() => toggleLink("noteIds", id)}
                    />
                    Ghi chú không còn khả dụng
                  </label>
                ))}
            </div>
          </details>
        </fieldset>
        {conflicts.length > 0 && (
          <p className="schedule-warning" role="status">
            Trùng thời gian:{" "}
            {[...new Set(conflicts.map((item) => item.title))]
              .slice(0, 3)
              .join(", ")}
            . Bạn sẽ được hỏi trước khi lưu.
          </p>
        )}
        {error && (
          <p className="schedule-error" role="alert">
            {error}
          </p>
        )}
        <div className="schedule-dialog-actions">
          <button
            type="button"
            className="button secondary"
            disabled={pending}
            onClick={close}
          >
            Đóng
          </button>
          <button className="button primary" type="submit" disabled={pending}>
            {pending ? "Đang lưu…" : "Lưu " + label}
          </button>
        </div>
      </form>
    </CalendarDialog>
  );
}
