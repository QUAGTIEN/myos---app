"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import {
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  FileText,
  X,
  Pencil,
  Plus,
} from "lucide-react";
import { calendarColors, calendarError, localTime } from "../model";
import {
  activityInputSchema,
  activitySchema,
  attendanceEntrySchema,
  attendanceMonthSchema,
  monthDays,
  type AttendanceActivity,
  type AttendanceEntry,
  type AttendanceMonth,
} from "../attendance-model";
import {
  attendanceRepository,
  useAttendanceActivities,
  useAttendanceMonth,
} from "../attendance-repository";
import { CalendarDialog } from "./dialogs";

export function Attendance({
  today,
  firstDay,
  onStateChange,
}: {
  today: string;
  firstDay: number;
  onStateChange: (dirty: boolean, busy: boolean) => void;
}) {
  const activities = useAttendanceActivities();
  const [selected, setSelected] = useState("");
  const [month, setMonth] = useState(today.slice(0, 7));
  const [editing, setEditing] = useState<AttendanceActivity | "new" | null>(
    null,
  );
  const dirty = useRef(false);
  const [busy, setBusy] = useState(false);
  const activity =
    activities.data?.find((item) => item.id === selected) ??
    activities.data?.[0];
  function navigate(operation: () => void) {
    if (busy) return;
    if (dirty.current && !window.confirm("Bỏ các ngày chấm công chưa lưu?"))
      return;
    dirty.current = false;
    onStateChange(false, false);
    operation();
  }
  const loadingError = activities.error ? calendarError(activities.error) : "";
  return (
    <div className="attendance-module">
      <div className="attendance-heading">
        <span className="attendance-activity-label">Công việc</span>
        <div
          className="attendance-activities"
          role="group"
          aria-label="Loại công việc"
        >
          {[...(activities.data ?? [])]
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            .map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={busy}
                aria-pressed={activity?.id === item.id}
                onClick={() => navigate(() => setSelected(item.id))}
              >
                <span>
                  <strong>{item.name}</strong>
                </span>
              </button>
            ))}
        </div>
        <button
          type="button"
          className="button primary"
          disabled={
            busy ||
            !!loadingError ||
            activities.loading ||
            (activities.data?.length ?? 0) >= 50
          }
          onClick={() => setEditing("new")}
        >
          Tạo công việc
        </button>
      </div>
      {loadingError && (
        <p className="schedule-error" role="alert">
          {loadingError}{" "}
          <button
            type="button"
            className="text-link"
            onClick={activities.refresh}
          >
            Thử lại
          </button>
        </p>
      )}
      {activities.loading && <p role="status">Đang tải công việc…</p>}
      {!activity && !activities.loading && !loadingError && (
        <div className="panel attendance-empty">
          <BriefcaseBusiness size={30} />
          <h3>Chưa có công việc</h3>
          <p>Tạo công việc để mở bảng chấm công theo tháng.</p>
        </div>
      )}
      {activity && (
        <AttendanceMonthView
          key={activity.id + month}
          activity={activity}
          month={month}
          today={today}
          firstDay={firstDay}
          onEditActivity={() => setEditing(activity)}
          onMonth={(next) => navigate(() => setMonth(next))}
          onStateChange={(value, pending) => {
            dirty.current = value;
            setBusy(pending);
            onStateChange(value, pending);
          }}
        />
      )}
      {editing && (
        <ActivityForm
          activity={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(value) => {
            navigate(() => setSelected(value.id));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ActivityForm({
  activity,
  onClose,
  onSaved,
}: {
  activity: AttendanceActivity | null;
  onClose: () => void;
  onSaved: (activity: AttendanceActivity) => void;
}) {
  const [name, setName] = useState(activity?.name ?? "");
  const [color, setColor] = useState(activity?.color ?? "turquoise");
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  function close() {
    if (
      !pending &&
      ((name === (activity?.name ?? "") &&
        color === (activity?.color ?? "turquoise")) ||
        window.confirm("Bỏ thay đổi công việc chưa lưu?"))
    )
      onClose();
  }
  return (
    <CalendarDialog
      title={activity ? "Sửa công việc" : "Tạo công việc"}
      description="Mỗi công việc có bảng chấm công theo tháng riêng."
      onClose={close}
      pending={pending}
    >
      <form
        className="schedule-form"
        onSubmit={async (event) => {
          event.preventDefault();
          if (lock.current) return;
          lock.current = true;
          setPending(true);
          setError("");
          try {
            const input = activityInputSchema.parse({ name, color });
            const now = new Date().toISOString();
            const saved = await attendanceRepository.save(
              "attendanceActivities",
              activitySchema.parse({
                ...input,
                id: activity?.id ?? crypto.randomUUID(),
                version: (activity?.version ?? 0) + 1,
                createdAt: activity?.createdAt ?? now,
                updatedAt: now,
              }),
              activity?.version ?? 0,
            );
            onSaved(activitySchema.parse(saved));
          } catch (cause) {
            setError(calendarError(cause));
          } finally {
            lock.current = false;
            setPending(false);
          }
        }}
      >
        <fieldset disabled={pending}>
          <label>
            Tên công việc
            <input
              autoFocus
              required
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ví dụ: Đi dạy, đi làm, tập gym"
            />
          </label>
          <label>
            Màu
            <select
              value={color}
              onChange={(event) =>
                setColor(event.target.value as AttendanceActivity["color"])
              }
            >
              {Object.keys(calendarColors).map((value, index) => (
                <option key={value} value={value}>
                  {["Xanh ngọc", "Xanh lam", "Cam", "Hồng", "Tím"][index]}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
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
          <button type="submit" className="button primary" disabled={pending}>
            {pending ? "Đang lưu…" : "Lưu công việc"}
          </button>
        </div>
      </form>
    </CalendarDialog>
  );
}

function AttendanceMonthView(props: {
  activity: AttendanceActivity;
  month: string;
  today: string;
  firstDay: number;
  onMonth: (month: string) => void;
  onStateChange: (dirty: boolean, busy: boolean) => void;
  onEditActivity: () => void;
}) {
  const id = props.activity.id + "_" + props.month;
  const data = useAttendanceMonth(id);
  const { mutate } = useSWRConfig();
  if (data.loading)
    return (
      <div className="panel" role="status">
        Đang tải bảng chấm công…
      </div>
    );
  if (data.error && data.data === undefined)
    return (
      <p role="alert" className="schedule-error">
        {calendarError(data.error)}{" "}
        <button type="button" className="text-link" onClick={data.refresh}>
          Thử lại
        </button>
      </p>
    );
  return (
    <MonthEditor
      {...props}
      saved={data.data ?? null}
      dataError={data.error ? calendarError(data.error) : ""}
      readLatest={async () => {
        const latest = await attendanceRepository.month(id);
        await mutate(["attendanceMonths", id], latest, { revalidate: false });
        return latest;
      }}
    />
  );
}

function MonthEditor({
  activity,
  month,
  today,
  firstDay,
  onMonth,
  onStateChange,
  onEditActivity,
  saved,
  dataError,
  readLatest,
}: {
  activity: AttendanceActivity;
  month: string;
  today: string;
  firstDay: number;
  onMonth: (month: string) => void;
  onStateChange: (dirty: boolean, busy: boolean) => void;
  onEditActivity: () => void;
  saved: AttendanceMonth | null;
  dataError: string;
  readLatest: () => Promise<AttendanceMonth | null>;
}) {
  const [baseline, setBaseline] = useState(saved);
  const [entries, setEntries] = useState(saved?.entries ?? []);
  const [editingDay, setEditingDay] = useState<{
    date: string;
    original: AttendanceEntry | null;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const dirty =
    JSON.stringify(entries) !== JSON.stringify(baseline?.entries ?? []);
  const externalChange = (saved?.version ?? 0) > (baseline?.version ?? 0);
  useEffect(() => {
    onStateChange(dirty, pending);
  }, [dirty, pending, onStateChange]);
  useEffect(() => {
    if (!dirty && (saved?.version ?? 0) >= (baseline?.version ?? 0)) {
      if ((saved?.version ?? 0) !== (baseline?.version ?? 0)) {
        // Hủy editor sạch phải khôi phục dữ liệu mới từ tab khác, không dùng snapshot cũ.
        setEditingDay((current) =>
          current
            ? {
                ...current,
                original:
                  saved?.entries.find((entry) => entry.date === current.date) ??
                  null,
              }
            : null,
        );
      }
      setBaseline(saved);
      setEntries(saved?.entries ?? []);
    }
  }, [saved, dirty, baseline]);
  useEffect(() => {
    function warn(event: BeforeUnloadEvent) {
      if (dirty || pending) event.preventDefault();
    }
    function leave(event: MouseEvent) {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      const destination = link ? new URL(link.href) : null;
      const changesPage =
        destination?.origin === window.location.origin &&
        destination.pathname + destination.search !==
          window.location.pathname + window.location.search;
      if (
        dirty &&
        changesPage &&
        link?.target !== "_blank" &&
        !event.ctrlKey &&
        !event.metaKey &&
        (pending || !window.confirm("Bỏ các ngày chấm công chưa lưu?"))
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty, pending]);
  const days = monthDays(month, firstDay);
  const done = entries.filter((entry) => entry.status === "done");
  const rest = entries.filter((entry) => entry.status === "rest");
  const hours = done.reduce(
    (sum, entry) =>
      sum +
      (entry.start && entry.end
        ? (localTime(entry.date + "T" + entry.end).toMillis() -
            localTime(entry.date + "T" + entry.start).toMillis()) /
          3600000
        : 0),
    0,
  );
  function apply(day: string, entry: AttendanceEntry | null) {
    setEntries((current) =>
      [
        ...current.filter((item) => item.date !== day),
        ...(entry ? [entry] : []),
      ].sort((a, b) => a.date.localeCompare(b.date)),
    );
    setMessage("");
    setError("");
  }
  function closeDayEditor() {
    const day = editingDay?.date;
    setEditingDay(null);
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLButtonElement>(
          `.attendance-cell[data-date="${day}"] .attendance-cell-heading button`,
        )
        ?.focus();
    });
  }
  async function save() {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const value = attendanceMonthSchema.parse({
        id: activity.id + "_" + month,
        activityId: activity.id,
        month,
        entries: entries.filter(
          (entry) => entry.status !== "note" || entry.note.trim(),
        ),
        version: (baseline?.version ?? 0) + 1,
        updatedAt: new Date().toISOString(),
      });
      const result = attendanceMonthSchema.parse(
        await attendanceRepository.save(
          "attendanceMonths",
          value,
          baseline?.version ?? 0,
        ),
      );
      setBaseline(result);
      setEntries(result.entries);
      setEditingDay(null);
      setMessage("Đã lưu chấm công.");
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  async function reload() {
    if (dirty && !window.confirm("Bỏ bản nháp chấm công và tải dữ liệu mới?"))
      return;
    setPending(true);
    setError("");
    try {
      const latest = await readLatest();
      setBaseline(latest);
      setEntries(latest?.entries ?? []);
      setEditingDay(null);
      setMessage("");
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="schedule-workspace">
      <section className="panel attendance-panel" aria-label="Bảng chấm công">
        <div className="schedule-toolbar attendance-toolbar">
          <div className="attendance-board-heading">
            <h2>{activity.name}</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="Sửa công việc"
              title="Sửa công việc"
              onClick={onEditActivity}
              disabled={pending}
            >
              <Pencil size={17} />
            </button>
          </div>
          <div className="schedule-period">
            <div className="calendar-controls">
              <button
                type="button"
                className="icon-button"
                aria-label="Tháng trước"
                disabled={pending || month === "2000-01"}
                onClick={() =>
                  onMonth(
                    localTime(month + "-01")
                      .minus({ months: 1 })
                      .toFormat("yyyy-MM"),
                  )
                }
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Tháng sau"
                disabled={pending || month === "2100-12"}
                onClick={() =>
                  onMonth(
                    localTime(month + "-01")
                      .plus({ months: 1 })
                      .toFormat("yyyy-MM"),
                  )
                }
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <h3>
              {localTime(month + "-01")
                .setLocale("vi")
                .toFormat("'Tháng' M 'năm' yyyy")}
            </h3>
          </div>
          <input
            type="month"
            aria-label="Tháng chấm công"
            min="2000-01"
            max="2100-12"
            value={month}
            disabled={pending}
            onChange={(event) => {
              if (
                event.target.value >= "2000-01" &&
                event.target.value <= "2100-12"
              )
                onMonth(event.target.value);
            }}
          />
          <button
            type="button"
            className="button primary"
            disabled={pending || !dirty || !!dataError}
            onClick={() => void save()}
          >
            {pending ? "Đang lưu…" : "Lưu chấm công"}
          </button>
        </div>
        <div className="attendance-save-state" aria-live="polite">
          {dirty
            ? "Có thay đổi chưa lưu"
            : message || (baseline ? "Các thay đổi đã được lưu" : "")}
        </div>
        {(error || dataError || externalChange) && (
          <p className="schedule-error" role="alert">
            {error ||
              dataError ||
              "Dữ liệu đã thay đổi ở tab hoặc thiết bị khác. Bản nháp đang được giữ."}{" "}
            <button
              type="button"
              className="text-link"
              disabled={pending}
              onClick={() => void reload()}
            >
              Tải bản mới
            </button>
          </p>
        )}
        <div className="attendance-scroll">
          <div
            className="attendance-grid"
            role="group"
            aria-label="Các ngày chấm công"
          >
            {Array.from({ length: 7 }, (_, i) => (firstDay + i) % 7).map(
              (day) => (
                <div className="attendance-weekday" key={day}>
                  {day === 0 ? "CN" : "Thứ " + (day + 1)}
                </div>
              ),
            )}
            {days.map((day) => {
              const entry = entries.find((item) => item.date === day);
              const inMonth = day.slice(0, 7) === month;
              const status =
                entry?.status === "done"
                  ? "Đã thực hiện"
                  : entry?.status === "rest"
                    ? "Nghỉ"
                    : entry
                      ? "Ghi chú"
                      : "Chưa chấm";
              const editing = editingDay?.date === day;
              function open() {
                setEditingDay({ date: day, original: entry ?? null });
              }
              return (
                <div
                  key={day}
                  className={
                    "attendance-cell" +
                    (!inMonth ? " outside-month" : "") +
                    (day === today ? " is-today" : "") +
                    (entry ? " has-content" : "")
                  }
                  data-date={day}
                >
                  <div className="attendance-cell-heading">
                    <span aria-label={day === today ? "Hôm nay" : undefined}>
                      {Number(day.slice(8))}
                    </span>
                    {inMonth && !editing && (
                      <button
                        type="button"
                        className="icon-button"
                        aria-label={"Chấm công " + day + ", " + status}
                        title={
                          entry
                            ? "Sửa chấm công và ghi chú"
                            : "Chấm công hoặc ghi chú"
                        }
                        disabled={pending}
                        onClick={open}
                      >
                        {entry ? <Pencil size={14} /> : <Plus size={16} />}
                      </button>
                    )}
                  </div>
                  {editing ? (
                    <DayAttendanceEditor
                      date={day}
                      entry={entry ?? null}
                      pending={pending}
                      onChange={(value) => apply(day, value)}
                      onDone={closeDayEditor}
                      onCancel={() => {
                        apply(day, editingDay.original);
                        closeDayEditor();
                      }}
                    />
                  ) : (
                    entry && (
                      <button
                        type="button"
                        className="attendance-content"
                        disabled={pending}
                        onClick={open}
                        aria-label={"Sửa nội dung ngày " + day}
                      >
                        <span className={"attendance-status " + entry.status}>
                          {entry.status === "done" ? (
                            <Check size={14} />
                          ) : entry.status === "rest" ? (
                            <Minus size={14} />
                          ) : (
                            <FileText size={14} />
                          )}
                          {status}
                        </span>
                        {entry.start && (
                          <small>
                            {entry.start} – {entry.end}
                          </small>
                        )}
                        {entry.note && (
                          <span className="attendance-note" title={entry.note}>
                            {entry.note}
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <aside className="schedule-side">
        <section className="panel">
          <h2>Tổng kết · {activity.name}</h2>
          <p className="schedule-help">
            {localTime(month + "-01")
              .setLocale("vi")
              .toFormat("'Tháng' M, yyyy")}
          </p>
          <dl className="attendance-summary">
            <div>
              <dt>Đã thực hiện</dt>
              <dd>{done.length} ngày</dd>
            </div>
            <div>
              <dt>Nghỉ</dt>
              <dd>{rest.length} ngày</dd>
            </div>
            <div>
              <dt>Chưa chấm</dt>
              <dd>
                {localTime(month + "-01").daysInMonth! -
                  done.length -
                  rest.length}{" "}
                ngày
              </dd>
            </div>
            <div>
              <dt>Tổng giờ đã nhập</dt>
              <dd>
                {hours.toLocaleString("vi-VN", { maximumFractionDigits: 2 })}{" "}
                giờ
              </dd>
            </div>
          </dl>
          {dirty && (
            <p className="schedule-help">Tổng kết bao gồm thay đổi chưa lưu.</p>
          )}
        </section>
        <section className="panel">
          <h2>Ngày đã chấm gần đây</h2>
          {!entries.length && (
            <p className="schedule-help">Chưa chấm ngày nào trong tháng.</p>
          )}
          <ul className="attendance-recent">
            {entries
              .slice(-5)
              .reverse()
              .map((entry) => (
                <li key={entry.date}>
                  <span>{localTime(entry.date).toFormat("dd/MM")}</span>
                  <strong>
                    {entry.note ||
                      (entry.status === "done"
                        ? "Đã thực hiện"
                        : entry.status === "rest"
                          ? "Nghỉ"
                          : "Ghi chú")}
                  </strong>
                  {entry.status === "note" && <small>Ghi chú</small>}
                  {entry.start && (
                    <small>
                      {entry.start} – {entry.end}
                    </small>
                  )}
                </li>
              ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function DayAttendanceEditor({
  date,
  entry,
  pending,
  onChange,
  onDone,
  onCancel,
}: {
  date: string;
  entry: AttendanceEntry | null;
  pending: boolean;
  onChange: (entry: AttendanceEntry | null) => void;
  onDone: () => void;
  onCancel: () => void;
}) {
  const inputId = useId();
  const [error, setError] = useState("");
  const value: AttendanceEntry = entry ?? {
    date,
    status: "note",
    start: "",
    end: "",
    note: "",
  };
  function change(next: Partial<AttendanceEntry>) {
    setError("");
    onChange({ ...value, ...next });
  }
  function finish() {
    try {
      if (value.status === "note" && !value.note.trim()) onChange(null);
      else onChange(attendanceEntrySchema.parse(value));
      onDone();
    } catch (cause) {
      setError(calendarError(cause));
    }
  }
  return (
    <form
      className="attendance-day-editor"
      aria-label={"Nội dung ngày " + date}
      onSubmit={(event) => {
        event.preventDefault();
        finish();
      }}
    >
      <fieldset disabled={pending}>
        <label htmlFor={inputId + "-note"}>Ghi chú</label>
        <textarea
          id={inputId + "-note"}
          autoFocus
          rows={3}
          maxLength={2000}
          value={value.note}
          placeholder="Nhập ghi chú…"
          onChange={(event) => change({ note: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              onCancel();
            }
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              finish();
            }
          }}
        />
        <label htmlFor={inputId + "-status"} className="sr-only">
          Trạng thái
        </label>
        <select
          id={inputId + "-status"}
          value={value.status}
          onChange={(event) => {
            const status = event.target.value as AttendanceEntry["status"];
            change({
              status,
              ...(status !== "done" ? { start: "", end: "" } : {}),
            });
          }}
        >
          <option value="note">Chỉ ghi chú</option>
          <option value="done">Đã thực hiện</option>
          <option value="rest">Nghỉ</option>
        </select>
        {value.status === "done" && (
          <div className="attendance-day-times">
            <label>
              Giờ bắt đầu
              <input
                type="time"
                value={value.start}
                onChange={(event) => change({ start: event.target.value })}
              />
            </label>
            <label>
              Giờ kết thúc
              <input
                type="time"
                value={value.end}
                onChange={(event) => change({ end: event.target.value })}
              />
            </label>
          </div>
        )}
        {error && (
          <p className="schedule-error" role="alert">
            {error}
          </p>
        )}
        <div className="attendance-day-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Hủy thay đổi ngày"
            title="Hủy thay đổi ngày"
            onClick={onCancel}
          >
            <X size={16} />
          </button>
          {entry && (
            <button
              type="button"
              className="text-link"
              onClick={() => {
                if (window.confirm("Xóa nội dung ngày này khỏi bảng nháp?")) {
                  onChange(null);
                  onDone();
                }
              }}
            >
              Xóa
            </button>
          )}
          <button type="submit" className="button primary small">
            <Check size={15} />
            Xong
          </button>
        </div>
      </fieldset>
    </form>
  );
}
