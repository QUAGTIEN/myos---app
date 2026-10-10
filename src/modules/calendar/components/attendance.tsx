"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMobile } from "@/components/use-mobile";

import { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
} from "lucide-react";
import { calendarColors, calendarError, localTime } from "../model";
import {
  activityInputSchema,
  activitySchema,
  attendanceMonthSchema,
  monthDays,
  attendanceText,
  isAttendanceMarked,
  type AttendanceActivity,
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
              <Button
                variant="ghost"
                size="default"
                type="button"
                key={item.id}
                disabled={busy}
                aria-pressed={activity?.id === item.id}
                onClick={() => navigate(() => setSelected(item.id))}
              >
                <span>
                  <strong>{item.name}</strong>
                </span>
              </Button>
            ))}
        </div>
        <Button
          variant="default"
          size="default"
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
        </Button>
      </div>
      {loadingError && (
        <p className="schedule-error" role="alert">
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
          onRemoved={() => {
            dirty.current = false;
            setBusy(false);
            onStateChange(false, false);
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
            <Input
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
                    "Xóa công việc “" +
                      activity.name +
                      "” và các bảng chấm công của công việc này?",
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
              Xóa công việc
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
            {pending ? "Đang lưu…" : "Lưu công việc"}
          </Button>
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
  const mobile = useMobile();
  const [baseline, setBaseline] = useState(saved);
  const [entries, setEntries] = useState(saved?.entries ?? []);
  const [editingDay, setEditingDay] = useState<string | null>(null);
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
          !window.confirm("Ghi chú chưa lưu xong. Rời trang và bỏ thay đổi?"))
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
  // Mỗi lần ghi dùng snapshot và version riêng; gõ trong lúc lưu không bị kết quả cũ ghi đè.
  async function save(close = false) {
    if (lock.current || externalChange || dataError) return;
    if (!dirty) {
      if (close) setEditingDay(null);
      return;
    }
    const snapshot = entries;
    const closingDay = editingDay;
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
      if (close)
        setEditingDay((current) => (current === closingDay ? null : current));
      setMessage("Đã lưu tự động.");
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
    // Save uses exactly the draft/version represented by these dependencies.
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
      setEditingDay(null);
      setMessage("");
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  function apply(date: string, note: string) {
    setEntries((current) =>
      [
        ...current.filter((item) => item.date !== date),
        ...(note.trim()
          ? [{ date, note, status: "done" as const, start: "", end: "" }]
          : []),
      ].sort((a, b) => a.date.localeCompare(b.date)),
    );
    setError("");
    setMessage("");
  }
  function dayEditor(day: string) {
    const entry = entries.find((item) => item.date === day);
    return (
      <form
        className="attendance-day-editor"
        aria-label={"Nội dung ngày " + day}
        onSubmit={(event) => {
          event.preventDefault();
          void save(true);
        }}
      >
        <Textarea
          autoFocus
          rows={4}
          maxLength={2000}
          aria-label={"Nội dung chấm công ngày " + day}
          value={entry?.note ?? ""}
          placeholder="Nhập nội dung…"
          onChange={(event) => apply(day, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setEditingDay(null);
            }
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              void save(true);
            }
          }}
        />
        <div className="attendance-day-actions">
          {entry && (
            <Button
              variant="link"
              type="button"
              className="text-link"
              disabled={pending}
              onClick={() => {
                if (window.confirm("Xóa nội dung chấm công ngày này?")) {
                  apply(day, "");
                  setEditingDay(null);
                }
              }}
            >
              Xóa
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            type="submit"
            className="button secondary small"
            disabled={pending || externalChange || !!dataError}
          >
            Xong
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div className="attendance-workspace">
      <section className="panel attendance-panel" aria-label="Bảng chấm công">
        <div className="schedule-toolbar attendance-toolbar">
          <div className="attendance-board-heading">
            <h2>{activity.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="icon-button"
              aria-label="Sửa công việc"
              title="Sửa công việc"
              onClick={onEditActivity}
              disabled={pending}
            >
              <Pencil size={17} />
            </Button>
          </div>
          <div className="schedule-period">
            <div className="calendar-controls">
              <Button
                variant="ghost"
                size="icon"
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
              </Button>
              <Button
                variant="ghost"
                size="icon"
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
              </Button>
            </div>
            <h3>
              {localTime(month + "-01")
                .setLocale("vi")
                .toFormat("'Tháng' M 'năm' yyyy")}
            </h3>
          </div>
          <Input
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
        </div>
        <div
          className="attendance-save-state"
          aria-live="polite"
          hidden={mobile && !!editingDay}
        >
          {pending
            ? "Đang lưu…"
            : error
              ? "Chưa lưu được"
              : dirty
                ? "Chờ lưu…"
                : message}
        </div>
        {(error || dataError || externalChange) && (
          <p
            className="schedule-error"
            role="alert"
            hidden={mobile && !!editingDay}
          >
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
        <div className="attendance-scroll">
          <div
            className="attendance-grid"
            role="group"
            aria-label="Các ngày chấm công"
          >
            {Array.from({ length: 7 }, (_, i) => (firstDay + i) % 7).map(
              (day) => (
                <div className="attendance-weekday" key={day}>
                  {day === 0 ? "CN" : (mobile ? "T" : "Thứ ") + (day + 1)}
                </div>
              ),
            )}
            {monthDays(month, firstDay).map((day) => {
              const entry = entries.find((item) => item.date === day);
              const inMonth = day.slice(0, 7) === month;
              const text = entry ? attendanceText(entry) : "";
              const editing = editingDay === day;
              return (
                <div
                  key={day}
                  data-date={day}
                  className={
                    "attendance-cell" +
                    (!inMonth ? " outside-month" : "") +
                    (day === today ? " is-today" : "") +
                    (entry && isAttendanceMarked(entry) ? " has-content" : "")
                  }
                >
                  {mobile ? (
                    inMonth ? (
                      <Button
                        variant="ghost"
                        type="button"
                        className="mobile-attendance-day"
                        aria-label={"Chấm công " + day}
                        aria-current={day === today ? "date" : undefined}
                        onClick={() => setEditingDay(day)}
                      >
                        <span>{Number(day.slice(8))}</span>
                        {text ? (
                          <span className="attendance-note">{text}</span>
                        ) : (
                          <Plus size={13} aria-hidden="true" />
                        )}
                      </Button>
                    ) : (
                      <span className="mobile-attendance-outside">
                        {Number(day.slice(8))}
                      </span>
                    )
                  ) : (
                    <>
                      <div className="attendance-cell-heading">
                        {inMonth ? (
                          <Button
                            variant="ghost"
                            size="default"
                            type="button"
                            className="attendance-date"
                            aria-label={"Mở ngày " + day}
                            aria-current={day === today ? "date" : undefined}
                            onClick={() => setEditingDay(day)}
                          >
                            {Number(day.slice(8))}
                          </Button>
                        ) : (
                          <span>{Number(day.slice(8))}</span>
                        )}
                        {inMonth && !editing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="icon-button"
                            aria-label={"Chấm công " + day}
                            title={entry ? "Sửa nội dung" : "Thêm nội dung"}
                            onClick={() => setEditingDay(day)}
                          >
                            {text ? <Pencil size={14} /> : <Plus size={16} />}
                          </Button>
                        )}
                      </div>
                      {editing && !mobile
                        ? dayEditor(day)
                        : text && (
                            <Button
                              variant="ghost"
                              size="default"
                              type="button"
                              className="attendance-content"
                              aria-label={"Sửa nội dung ngày " + day}
                              onClick={() => setEditingDay(day)}
                            >
                              <span className="attendance-note" title={text}>
                                {text}
                              </span>
                            </Button>
                          )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {mobile && editingDay && (
          <CalendarDialog
            title={
              activity.name +
              " · " +
              localTime(editingDay).toFormat("dd/MM/yyyy")
            }
            description="Nhập nội dung để chấm công. Thay đổi được tự lưu."
            onClose={() => setEditingDay(null)}
          >
            {dayEditor(editingDay)}
            <p className="attendance-save-state" role="status">
              {pending
                ? "Đang lưu…"
                : error || dataError || externalChange
                  ? "Chưa lưu được"
                  : dirty
                    ? "Chờ lưu…"
                    : message}
            </p>
            {(error || dataError || externalChange) && (
              <p className="schedule-error" role="alert">
                {externalChange
                  ? "Dữ liệu đã thay đổi. Bản nháp đang được giữ."
                  : error || dataError}
                {error && !externalChange && !dataError && (
                  <Button
                    variant="link"
                    disabled={pending}
                    onClick={() => void save()}
                  >
                    Thử lưu lại
                  </Button>
                )}
                <Button
                  variant="link"
                  disabled={pending}
                  onClick={() => void reload()}
                >
                  Tải bản mới
                </Button>
              </p>
            )}
          </CalendarDialog>
        )}
      </section>
    </div>
  );
}
