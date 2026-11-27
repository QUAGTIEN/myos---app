"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useSWRConfig } from "swr";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ImageDown,
  Pencil,
  Plus,
  TableProperties,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeading, PageSkeleton } from "@/components/page-ui";
import { useAccount } from "@/modules/auth/account-context";
import { calendarColors, calendarError, localTime } from "@/modules/calendar/model";
import {
  activityInputSchema,
  activitySchema,
  attendanceEvaluation,
  attendanceLesson,
  attendanceMonthSchema,
  isAttendanceMarked,
  monthDays,
  type AttendanceActivity,
  type AttendanceEntry,
  type AttendanceMonth,
} from "../model";
import {
  attendanceRepository,
  useAttendanceActivities,
  useAttendanceMonth,
} from "../repository";
import {
  attendanceImageName,
  canCopyAttendanceImage,
  copyAttendanceImage,
  renderAttendanceImage,
  saveAttendanceImage,
} from "../export";
import "../attendance.css";

const colorLabels = ["Xanh ngọc", "Xanh lam", "Cam", "Hồng", "Tím"];

export function AttendanceScreen({ today }: { today: string }) {
  const account = useAccount();
  const firstDay = account?.profile.firstDay ?? 1;
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
    if (dirty.current && !window.confirm("Bỏ các thay đổi chấm công chưa lưu?"))
      return;
    dirty.current = false;
    operation();
  }

  const loadingError = activities.error ? calendarError(activities.error) : "";
  const canCreate =
    !busy &&
    !loadingError &&
    !activities.loading &&
    (activities.data?.length ?? 0) < 50;

  return (
    <div className="attendance-module">
      <PageHeading title="Chấm công" />
      <div className="attendance-bar">
        <div className="attendance-tables" role="group" aria-label="Bảng công">
          {[...(activities.data ?? [])]
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            .map((item) => (
              <Button
                variant="ghost"
                size="default"
                type="button"
                key={item.id}
                className="attendance-table-chip"
                disabled={busy}
                aria-pressed={activity?.id === item.id}
                onClick={() => navigate(() => setSelected(item.id))}
              >
                <span
                  className="attendance-dot"
                  style={{ background: calendarColors[item.color] }}
                  aria-hidden="true"
                />
                <strong>{item.name}</strong>
              </Button>
            ))}
        </div>
        <Button
          variant="default"
          size="default"
          type="button"
          className="button primary attendance-create"
          disabled={!canCreate}
          onClick={() => setEditing("new")}
        >
          <Plus size={16} aria-hidden="true" />
          Tạo bảng công
        </Button>
      </div>
      {loadingError && (
        <p className="attendance-error" role="alert">
          {loadingError}{" "}
          <Button
            variant="link"
            size="default"
            type="button"
            className="text-link"
            onClick={activities.refresh}
          >
            Thử lại
          </Button>
        </p>
      )}
      {activities.loading && <PageSkeleton variant="calendar" />}
      {!activity && !activities.loading && !loadingError && (
        <div className="panel attendance-empty">
          <TableProperties size={32} />
          <h3>Chưa có bảng công</h3>
          <p>Tạo bảng công để ghi chép bài học và đánh giá theo từng buổi.</p>
          <Button
            variant="default"
            type="button"
            className="button primary"
            disabled={!canCreate}
            onClick={() => setEditing("new")}
          >
            <Plus size={16} aria-hidden="true" />
            Tạo bảng công
          </Button>
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
          }}
        />
      )}
      {editing && (
        <ActivityForm
          activity={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onRemoved={() => {
            dirty.current = false;
            setBusy(false);
            setSelected("");
            setEditing(null);
          }}
          onSaved={(value) => {
            navigate(() => setSelected(value.id));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function AttendanceDialog({
  title,
  description,
  children,
  pending = false,
  showDescription = false,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  pending?: boolean;
  showDescription?: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="attendance-overlay" />
        <Dialog.Content
          className="attendance-dialog"
          onEscapeKeyDown={(event) => {
            if (pending) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (pending) event.preventDefault();
          }}
        >
          <div className="attendance-dialog-heading">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description
                className={
                  showDescription ? "attendance-dialog-description" : "sr-only"
                }
              >
                {description}
              </Dialog.Description>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="icon-button"
              type="button"
              aria-label="Đóng hộp thoại"
              disabled={pending}
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
          <div className="attendance-dialog-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ActivityForm({
  activity,
  onClose,
  onSaved,
  onRemoved,
}: {
  activity: AttendanceActivity | null;
  onClose: () => void;
  onSaved: (activity: AttendanceActivity) => void;
  onRemoved: () => void;
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
        window.confirm("Bỏ thay đổi bảng công chưa lưu?"))
    )
      onClose();
  }

  return (
    <AttendanceDialog
      title={activity ? "Sửa bảng công" : "Tạo bảng công"}
      description="Mỗi bảng công theo dõi bài học và đánh giá riêng theo từng tháng."
      onClose={close}
      pending={pending}
    >
      <form
        className="attendance-form"
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
            Tên bảng công
            <Input
              autoFocus
              required
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ví dụ: Anh 10, Toán 9, Lớp kèm Minh"
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
                  {colorLabels[index]}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        {error && (
          <p className="attendance-error" role="alert">
            {error}
          </p>
        )}
        <div className="attendance-dialog-actions">
          {activity && (
            <Button
              variant="ghost"
              size="default"
              type="button"
              className="button danger"
              disabled={pending}
              onClick={async () => {
                if (
                  lock.current ||
                  !window.confirm(
                    "Xóa bảng công “" +
                      activity.name +
                      "” và toàn bộ dữ liệu chấm công các tháng?",
                  )
                )
                  return;
                lock.current = true;
                setPending(true);
                setError("");
                try {
                  await attendanceRepository.remove(activity);
                  onRemoved();
                } catch (cause) {
                  setError(calendarError(cause));
                } finally {
                  lock.current = false;
                  setPending(false);
                }
              }}
            >
              Xóa bảng công
            </Button>
          )}
          <Button
            variant="outline"
            size="default"
            type="button"
            className="button secondary"
            disabled={pending}
            onClick={close}
          >
            Đóng
          </Button>
          <Button
            variant="default"
            size="default"
            type="submit"
            className="button primary"
            disabled={pending}
          >
            {pending ? "Đang lưu…" : "Lưu bảng công"}
          </Button>
        </div>
      </form>
    </AttendanceDialog>
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

  if (data.loading) return <PageSkeleton variant="calendar" />;
  if (data.error && data.data === undefined)
    return (
      <p role="alert" className="attendance-error">
        {calendarError(data.error)}{" "}
        <Button
          variant="link"
          size="default"
          type="button"
          className="text-link"
          onClick={data.refresh}
        >
          Thử lại
        </Button>
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
  const [entries, setEntries] = useState<AttendanceEntry[]>(
    saved?.entries ?? [],
  );
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [addingSession, setAddingSession] = useState(false);
  const [editingDateOf, setEditingDateOf] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const dirty =
    JSON.stringify(entries) !== JSON.stringify(baseline?.entries ?? []);
  const externalChange = (saved?.version ?? 0) > (baseline?.version ?? 0);

  useEffect(() => {
    onStateChange(dirty, pending);
  }, [dirty, pending, onStateChange]);

  useEffect(() => {
    if (
      !dirty &&
      !pending &&
      (saved?.version ?? 0) > (baseline?.version ?? 0)
    ) {
      setBaseline(saved);
      setEntries(saved?.entries ?? []);
    }
  }, [saved, dirty, pending, baseline]);

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
        (pending ||
          !window.confirm("Thay đổi chấm công chưa lưu xong. Rời trang?"))
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

  async function save() {
    if (lock.current || externalChange || dataError || !dirty) return;
    const snapshot = entries;
    lock.current = true;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const value = attendanceMonthSchema.parse({
        id: activity.id + "_" + month,
        activityId: activity.id,
        month,
        entries: snapshot,
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
      setEntries((current) =>
        JSON.stringify(current) === JSON.stringify(snapshot)
          ? result.entries
          : current,
      );
      setMessage("Đã lưu tự động");
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  useEffect(() => {
    if (!dirty || pending || error || dataError || externalChange) return;
    const timer = window.setTimeout(() => {
      void save();
    }, 700);
    return () => window.clearTimeout(timer);
    // Save uses the exact draft/version represented by these dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, baseline, dirty, pending, error, dataError, externalChange]);

  async function reload() {
    if (
      lock.current ||
      (dirty && !window.confirm("Bỏ bản nháp chấm công và tải dữ liệu mới?"))
    )
      return;
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const latest = await readLatest();
      setBaseline(latest);
      setEntries(latest?.entries ?? []);
      setMessage("");
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  const monthStart = localTime(month + "-01").setLocale("vi");
  const monthEnd = month + "-" + String(monthStart.daysInMonth!).padStart(2, "0");
  const sessions = [...entries]
    .filter(isAttendanceMarked)
    .sort((a, b) => a.date.localeCompare(b.date));
  const sessionDates = new Set(sessions.map((item) => item.date));
  const accent = calendarColors[activity.color];

  const saveState = pending
    ? "Đang lưu…"
    : error
      ? "Chưa lưu được"
      : dirty
        ? "Chờ lưu…"
        : message;

  function shiftMonth(offset: number) {
    return monthStart.plus({ months: offset }).toFormat("yyyy-MM");
  }

  function focusSession(date: string) {
    setActiveDate(date);
    requestAnimationFrame(() => {
      const card = document.querySelector<HTMLElement>(
        `[data-session-date="${date}"]`,
      );
      card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      card?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    });
  }

  function addSession(date: string) {
    if (sessionDates.has(date)) {
      focusSession(date);
      return;
    }
    setEntries((current) =>
      [
        ...current.filter((item) => item.date !== date),
        {
          date,
          status: "done" as const,
          start: "",
          end: "",
          note: "",
          lesson: "",
          evaluation: "",
        },
      ].sort((a, b) => a.date.localeCompare(b.date)),
    );
    setError("");
    setMessage("");
    focusSession(date);
  }

  function updateField(
    date: string,
    field: "lesson" | "evaluation",
    value: string,
  ) {
    setEntries((current) =>
      current.map((item) => {
        if (item.date !== date) return item;
        const nextLesson =
          field === "lesson" ? value : attendanceLesson(item);
        const nextEvaluation =
          field === "evaluation" ? value : attendanceEvaluation(item);
        return {
          ...item,
          status: "done" as const,
          note: "",
          lesson: nextLesson,
          evaluation: nextEvaluation,
        };
      }),
    );
    setError("");
    setMessage("");
  }

  function changeSessionDate(oldDate: string, nextDate: string) {
    if (oldDate === nextDate) {
      setEditingDateOf(null);
      return;
    }
    setEntries((current) =>
      current
        .map((item) =>
          item.date === oldDate ? { ...item, date: nextDate } : item,
        )
        .sort((a, b) => a.date.localeCompare(b.date)),
    );
    setEditingDateOf(null);
    setError("");
    setMessage("");
    focusSession(nextDate);
  }

  function removeSession(date: string) {
    if (
      !window.confirm(
        "Xóa buổi học ngày " + localTime(date).toFormat("dd/MM/yyyy") + "?",
      )
    )
      return;
    setEntries((current) => current.filter((item) => item.date !== date));
    if (activeDate === date) setActiveDate(null);
    setError("");
    setMessage("");
  }

  function suggestedDate() {
    if (today.slice(0, 7) === month && !sessionDates.has(today)) return today;
    const days = monthDays(month, firstDay).filter(
      (day) => day.slice(0, 7) === month,
    );
    return days.find((day) => !sessionDates.has(day)) ?? month + "-01";
  }

  return (
    <section
      className="panel attendance-panel"
      aria-label="Bảng chấm công"
      style={{ "--attendance-accent": accent } as React.CSSProperties}
    >
      <header className="attendance-board-bar">
        <div className="attendance-board-title">
          <span
            className="attendance-dot"
            style={{ background: accent }}
            aria-hidden="true"
          />
          <div>
            <h2>{activity.name}</h2>
            <p>
              <span>{sessions.length} buổi trong tháng</span>
              <span className="attendance-save-state" aria-live="polite">
                {saveState}
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="icon-button"
            aria-label="Sửa bảng công"
            title="Sửa bảng công"
            onClick={onEditActivity}
            disabled={pending}
          >
            <Pencil size={16} />
          </Button>
        </div>

        <div className="attendance-board-actions">
          <div className="attendance-month-nav">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="icon-button"
              aria-label="Tháng trước"
              disabled={pending || month === "2000-01"}
              onClick={() => onMonth(shiftMonth(-1))}
            >
              <ChevronLeft size={18} />
            </Button>
            <label className="attendance-month-picker">
              <span>{monthStart.toFormat("'Tháng' M, yyyy")}</span>
              <ChevronDown size={15} aria-hidden="true" />
              <input
                type="month"
                aria-label="Chọn tháng chấm công"
                min="2000-01"
                max="2100-12"
                value={month}
                disabled={pending}
                onClick={(event) => {
                  try {
                    event.currentTarget.showPicker();
                  } catch {
                    // Trình duyệt tự mở bộ chọn khi chạm vào ô.
                  }
                }}
                onChange={(event) => {
                  if (
                    event.target.value >= "2000-01" &&
                    event.target.value <= "2100-12"
                  )
                    onMonth(event.target.value);
                }}
              />
            </label>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="icon-button"
              aria-label="Tháng sau"
              disabled={pending || month === "2100-12"}
              onClick={() => onMonth(shiftMonth(1))}
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {month !== today.slice(0, 7) && (
            <Button
              variant="outline"
              type="button"
              className="button secondary attendance-current-month"
              disabled={pending}
              onClick={() => onMonth(today.slice(0, 7))}
            >
              Tháng này
            </Button>
          )}

          <Button
            variant="outline"
            type="button"
            className="button secondary attendance-export"
            aria-label="Xuất bảng công dạng ảnh"
            title="Xuất bảng công dạng ảnh"
            onClick={() => setExportOpen(true)}
          >
            <ImageDown size={16} aria-hidden="true" />
            <span>Xuất ảnh</span>
          </Button>

          <Button
            variant="default"
            type="button"
            className="button primary attendance-add-session"
            disabled={
              pending ||
              externalChange ||
              !!dataError ||
              sessions.length >= monthStart.daysInMonth!
            }
            onClick={() => setAddingSession(true)}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Thêm buổi</span>
          </Button>
        </div>
      </header>

      {(error || dataError || externalChange) && (
        <p className="attendance-error" role="alert">
          {externalChange
            ? "Dữ liệu đã thay đổi ở tab hoặc thiết bị khác. Bản nháp đang được giữ."
            : error || dataError}{" "}
          {error && !externalChange && !dataError && (
            <Button
              variant="link"
              size="default"
              type="button"
              className="text-link"
              disabled={pending}
              onClick={() => void save()}
            >
              Thử lưu lại
            </Button>
          )}{" "}
          <Button
            variant="link"
            size="default"
            type="button"
            className="text-link"
            disabled={pending}
            onClick={() => void reload()}
          >
            Tải bản mới
          </Button>
        </p>
      )}

      <div className="attendance-split">
        <aside
          className="attendance-calendar-card"
          aria-label={"Lịch tháng " + monthStart.toFormat("M/yyyy")}
        >
          <h3 className="attendance-calendar-heading">
            Lịch tháng {monthStart.toFormat("M/yyyy")}
          </h3>
          <div className="attendance-mini-grid">
            {Array.from({ length: 7 }, (_, i) => (firstDay + i) % 7).map(
              (day) => (
                <div className="attendance-mini-weekday" key={day}>
                  {day === 0 ? "CN" : "T" + (day + 1)}
                </div>
              ),
            )}
            {monthDays(month, firstDay).map((day) => {
              const inMonth = day.slice(0, 7) === month;
              if (!inMonth)
                return (
                  <span className="attendance-mini-outside" key={day}>
                    {Number(day.slice(8))}
                  </span>
                );
              const marked = sessionDates.has(day);
              const isActive = activeDate === day;
              return (
                <button
                  key={day}
                  type="button"
                  disabled={externalChange || !!dataError}
                  aria-current={day === today ? "date" : undefined}
                  aria-pressed={marked}
                  aria-label={
                    (marked ? "Xem buổi học ngày " : "Thêm buổi học ngày ") +
                    localTime(day).toFormat("dd/MM/yyyy")
                  }
                  className={
                    "attendance-mini-day" +
                    (day === today ? " is-today" : "") +
                    (marked ? " is-marked" : "") +
                    (isActive ? " is-active" : "")
                  }
                  onClick={() =>
                    marked ? focusSession(day) : addSession(day)
                  }
                >
                  <span>{Number(day.slice(8))}</span>
                  {marked && (
                    <span className="attendance-mini-dot" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="attendance-calendar-legend">
            <div className="attendance-calendar-legend-row">
              <span
                className="attendance-dot"
                style={{ background: accent }}
                aria-hidden="true"
              />
              <span>Ngày có buổi học ({sessions.length})</span>
            </div>
            <p>Bấm vào ngày để chấm công hoặc xem buổi học.</p>
          </div>
        </aside>

        <div className="attendance-sessions-column">
          <div className="attendance-sessions-heading">
            <h3>Chi tiết các buổi học ({sessions.length} buổi)</h3>
          </div>

          {!sessions.length ? (
            <div className="attendance-sessions-empty">
              <CalendarDays size={28} />
              <h4>Chưa có buổi học nào trong tháng {monthStart.month}</h4>
              <p>
                Bấm vào một ngày trên lịch tháng bên cạnh hoặc bấm “Thêm buổi”
                để ghi bài học và đánh giá.
              </p>
            </div>
          ) : (
            <div className="attendance-session-list">
              {sessions.map((entry, index) => {
                const dateLabel = localTime(entry.date)
                  .setLocale("vi")
                  .toFormat("cccc, dd/MM/yyyy");
                return (
                  <article
                    key={entry.date}
                    data-session-date={entry.date}
                    className={
                      "attendance-session-card" +
                      (activeDate === entry.date ? " is-active" : "")
                    }
                    onFocusCapture={() => setActiveDate(entry.date)}
                  >
                    <div className="attendance-session-head">
                      <div className="attendance-session-title">
                        <span className="attendance-session-badge">
                          Buổi {index + 1}
                        </span>
                        <time
                          dateTime={entry.date}
                          className="attendance-session-date"
                        >
                          {dateLabel}
                        </time>
                      </div>
                      <div className="attendance-session-actions">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="icon-button"
                          aria-label={"Đổi ngày buổi " + (index + 1)}
                          title="Đổi ngày buổi học"
                          disabled={externalChange || !!dataError}
                          onClick={() => setEditingDateOf(entry.date)}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="icon-button danger"
                          aria-label={"Xóa buổi " + (index + 1)}
                          title="Xóa buổi học"
                          disabled={externalChange || !!dataError}
                          onClick={() => removeSession(entry.date)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>

                    <div className="attendance-session-fields">
                      <label className="attendance-field">
                        <span>Bài học</span>
                        <Textarea
                          rows={3}
                          maxLength={2000}
                          disabled={externalChange || !!dataError}
                          value={attendanceLesson(entry)}
                          placeholder="Nhập nội dung bài học…"
                          onChange={(event) =>
                            updateField(
                              entry.date,
                              "lesson",
                              event.target.value,
                            )
                          }
                        />
                      </label>
                      <label className="attendance-field">
                        <span>Đánh giá</span>
                        <Textarea
                          rows={3}
                          maxLength={2000}
                          disabled={externalChange || !!dataError}
                          value={attendanceEvaluation(entry)}
                          placeholder="Nhập nhận xét gửi phụ huynh…"
                          onChange={(event) =>
                            updateField(
                              entry.date,
                              "evaluation",
                              event.target.value,
                            )
                          }
                        />
                      </label>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {addingSession && (
        <SessionDateDialog
          title="Thêm buổi học"
          description={
            "Chọn ngày trong tháng " +
            monthStart.toFormat("M/yyyy") +
            " để thêm buổi học mới."
          }
          minDate={month + "-01"}
          maxDate={monthEnd}
          initialDate={suggestedDate()}
          usedDates={sessionDates}
          submitLabel="Thêm buổi"
          onClose={() => setAddingSession(false)}
          onConfirm={(date) => {
            setAddingSession(false);
            addSession(date);
          }}
        />
      )}

      {editingDateOf && (
        <SessionDateDialog
          title="Đổi ngày buổi học"
          description={
            "Chọn ngày mới trong tháng " + monthStart.toFormat("M/yyyy") + "."
          }
          minDate={month + "-01"}
          maxDate={monthEnd}
          initialDate={editingDateOf}
          usedDates={
            new Set([...sessionDates].filter((item) => item !== editingDateOf))
          }
          submitLabel="Lưu ngày"
          onClose={() => setEditingDateOf(null)}
          onConfirm={(date) => changeSessionDate(editingDateOf, date)}
        />
      )}

      {exportOpen && (
        <AttendanceExportDialog
          activity={activity}
          draftMonth={month}
          draftEntries={entries}
          onClose={() => setExportOpen(false)}
        />
      )}
    </section>
  );
}

function SessionDateDialog({
  title,
  description,
  minDate,
  maxDate,
  initialDate,
  usedDates,
  submitLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  minDate: string;
  maxDate: string;
  initialDate: string;
  usedDates: Set<string>;
  submitLabel: string;
  onClose: () => void;
  onConfirm: (date: string) => void;
}) {
  const [date, setDate] = useState(initialDate);
  const [error, setError] = useState("");

  return (
    <AttendanceDialog
      title={title}
      description={description}
      showDescription
      onClose={onClose}
    >
      <form
        className="attendance-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!date || date < minDate || date > maxDate) {
            setError("Chọn ngày hợp lệ trong tháng đang xem.");
            return;
          }
          if (usedDates.has(date)) {
            setError("Ngày này đã có buổi học. Hãy chọn ngày khác.");
            return;
          }
          onConfirm(date);
        }}
      >
        <label>
          Ngày học
          <Input
            autoFocus
            type="date"
            required
            min={minDate}
            max={maxDate}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setError("");
            }}
          />
        </label>
        {error && (
          <p className="attendance-error" role="alert">
            {error}
          </p>
        )}
        <div className="attendance-dialog-actions">
          <Button
            variant="outline"
            type="button"
            className="button secondary"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button variant="default" type="submit" className="button primary">
            {submitLabel}
          </Button>
        </div>
      </form>
    </AttendanceDialog>
  );
}

// Xuất được mọi tháng: tháng đang mở dùng bản nháp, tháng khác đọc dữ liệu đã lưu.
function AttendanceExportDialog({
  activity,
  draftMonth,
  draftEntries,
  onClose,
}: {
  activity: AttendanceActivity;
  draftMonth: string;
  draftEntries: AttendanceMonth["entries"];
  onClose: () => void;
}) {
  const [month, setMonth] = useState(draftMonth);
  const [image, setImage] = useState<{
    month: string;
    blob: Blob;
    url: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [canCopy] = useState(canCopyAttendanceImage);
  const loading = !error && image?.month !== month;
  const monthStart = localTime(month + "-01").setLocale("vi");

  useEffect(() => {
    let cancelled = false;
    let url = "";
    setError("");
    setNotice("");
    void (async () => {
      try {
        const entries =
          month === draftMonth
            ? draftEntries
            : ((await attendanceRepository.month(activity.id + "_" + month))
                ?.entries ?? []);
        const blob = await renderAttendanceImage({
          activity,
          month,
          entries,
        });
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setImage({ month, blob, url });
      } catch (cause) {
        if (!cancelled) setError(calendarError(cause));
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [activity, month, draftMonth, draftEntries, attempt]);

  function choose(next: string) {
    if (next >= "2000-01" && next <= "2100-12") setMonth(next);
  }

  const ready = !loading && !error && image ? image : null;

  return (
    <AttendanceDialog
      title="Xuất bảng công"
      description={"Chọn tháng cần xuất của bảng " + activity.name + "."}
      showDescription
      onClose={onClose}
    >
      <div className="attendance-export-toolbar">
        <div className="attendance-month-nav">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="icon-button"
            aria-label="Tháng trước"
            disabled={month === "2000-01"}
            onClick={() =>
              choose(monthStart.minus({ months: 1 }).toFormat("yyyy-MM"))
            }
          >
            <ChevronLeft size={18} />
          </Button>
          <label className="attendance-month-picker">
            <span>{monthStart.toFormat("'Tháng' M, yyyy")}</span>
            <ChevronDown size={15} aria-hidden="true" />
            <input
              type="month"
              aria-label="Chọn tháng xuất ảnh"
              min="2000-01"
              max="2100-12"
              value={month}
              onClick={(event) => {
                try {
                  event.currentTarget.showPicker();
                } catch {
                  // Trình duyệt tự mở bộ chọn khi chạm vào ô.
                }
              }}
              onChange={(event) => choose(event.target.value)}
            />
          </label>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="icon-button"
            aria-label="Tháng sau"
            disabled={month === "2100-12"}
            onClick={() =>
              choose(monthStart.plus({ months: 1 }).toFormat("yyyy-MM"))
            }
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      <div className="attendance-export-preview" aria-busy={loading}>
        {error ? (
          <p className="attendance-error" role="alert">
            {error}{" "}
            <Button
              variant="link"
              type="button"
              className="text-link"
              onClick={() => {
                setError("");
                setAttempt((current) => current + 1);
              }}
            >
              Thử lại
            </Button>
          </p>
        ) : (
          image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              data-loading={loading || undefined}
              alt={"Bảng công " + activity.name + " tháng " + image.month}
            />
          )
        )}
        {loading && (
          <p className="attendance-export-loading" role="status">
            Đang tạo ảnh…
          </p>
        )}
      </div>
      <p className="attendance-export-notice" role="status">
        {notice}
      </p>
      <div className="attendance-dialog-actions">
        <Button
          variant="outline"
          type="button"
          className="button secondary"
          onClick={onClose}
        >
          Đóng
        </Button>
        {canCopy && (
          <Button
            variant="outline"
            type="button"
            className="button secondary"
            disabled={!ready}
            onClick={async () => {
              if (!ready) return;
              setNotice("");
              try {
                await copyAttendanceImage(ready.blob);
                setNotice("Đã sao chép ảnh. Dán vào nơi bạn muốn gửi.");
              } catch (cause) {
                setNotice(calendarError(cause));
              }
            }}
          >
            <Copy size={16} aria-hidden="true" />
            Sao chép ảnh
          </Button>
        )}
        <Button
          variant="default"
          type="button"
          className="button primary"
          disabled={!ready}
          onClick={() =>
            ready &&
            void saveAttendanceImage(
              ready.blob,
              attendanceImageName(activity, ready.month),
            )
          }
        >
          <ImageDown size={16} aria-hidden="true" />
          Lưu ảnh PNG
        </Button>
      </div>
    </AttendanceDialog>
  );
}
