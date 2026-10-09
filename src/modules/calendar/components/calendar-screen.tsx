"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from "@/modules/auth/account-context";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import viLocale from "@fullcalendar/core/locales/vi";
import type { EventApi, DatesSetArg } from "@fullcalendar/core";
import {
  Check,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  ListTodo,
  Search,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings2,
  Star,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeading, PageSkeleton } from "@/components/page-ui";

import { useProjects } from "@/modules/projects/use-projects";
import { useNotes } from "@/modules/notes/hooks";
import {
  addDays,
  blankEvent,
  calendarTextColor,
  resolveCalendarColor,
  calendarError,
  calendarZone,
  localTime,
  wallTime,
  type CalendarEvent,
  type EventInput,
  type Occurrence,
} from "../model";
import { allOccurrences, conflictingEvents, expandEvents } from "../recurrence";
import {
  calendarService,
  editCalendarEvent,
  occurrenceToInput,
} from "../service";
import { useCalendar } from "../use-calendar";
import { EventForm } from "./event-form";
import { EventDetails } from "./event-details";
import { TimetableDialog } from "./calendar-book";
import { CalendarDialog, ExportDialog } from "./dialogs";
import { Attendance } from "./attendance";

const plugins = [dayGridPlugin, interactionPlugin, luxonPlugin];
const validRange = { start: "2000-01-01", end: "2100-12-31" };
const views = [
  { id: "dayGridMonth", name: "Tháng" },
  { id: "dayGridWeek", name: "Tuần" },
];
type FormState = {
  initial: EventInput;
  event?: CalendarEvent;
  occurrence?: Occurrence;
  source?: CalendarEvent["sourceMilestone"];
};
export type CalendarQuery = {
  projectId?: string;
  noteId?: string;
  milestoneId?: string;
  eventId?: string;
  occurrence?: string;
};

function CalendarTools({
  actions,
}: {
  actions: {
    label: string;
    icon: LucideIcon;
    disabled: boolean;
    onSelect: () => void;
  }[];
}) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  function close() {
    if (disclosure.current) disclosure.current.open = false;
    disclosure.current?.querySelector("summary")?.focus();
  }
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (
        disclosure.current?.open &&
        event.target instanceof Node &&
        !disclosure.current.contains(event.target)
      )
        disclosure.current.open = false;
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return (
    <details
      className="schedule-tools"
      ref={disclosure}
      onKeyDown={(event) => {
        if (event.key === "Escape" && disclosure.current?.open) {
          event.preventDefault();
          close();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          event.currentTarget.open = false;
      }}
    >
      <summary
        className="icon-button"
        aria-label="Thao tác lịch"
        title="Thao tác lịch"
      >
        <MoreHorizontal size={20} aria-hidden="true" />
      </summary>
      <div className="schedule-tools-actions">
        {actions.map(({ label, icon: Icon, disabled, onSelect }) => (
          <Button
            variant="ghost"
            size="default"
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => {
              close();
              onSelect();
            }}
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </Button>
        ))}
        <Link href="/settings" onClick={close}>
          <Settings2 size={17} aria-hidden="true" />
          Cài đặt lịch
        </Link>
      </div>
    </details>
  );
}

export function CalendarScreen({
  today,
  query = {},
}: {
  today: string;
  query?: CalendarQuery;
}) {
  const account = useAccount();
  const calendar = useRef<FullCalendar>(null);
  const data = useCalendar();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const { notes, loading: notesLoading, error: notesError } = useNotes();
  const [range, setRange] = useState({ from: today, until: addDays(today, 1) });
  const [title, setTitle] = useState("");
  const [view, setView] = useState("dayGridMonth");
  const [chosenDate, setChosenDate] = useState(today);
  const [group, setGroup] = useState("");
  const [tab, setTab] = useState<"book" | "attendance">("book");
  const [search, setSearch] = useState("");
  const [dayActions, setDayActions] = useState<string | null>(null);
  const attendanceDirty = useRef(false);
  const [attendanceBusy, setAttendanceBusy] = useState(false);
  const [timetable, setTimetable] = useState<"create" | "edit" | "copy" | null>(
    null,
  );
  const [form, setForm] = useState<FormState | null>(null);
  const [detail, setDetail] = useState<{
    event: CalendarEvent;
    occurrence: Occurrence;
  } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [pending, setPending] = useState(false);
  const writeLock = useRef(false);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const seenQuery = useRef("");
  useEffect(() => {
    if (query.eventId || query.projectId || query.noteId) return;
    try {
      if (sessionStorage.getItem("myos-calendar-tab") === "attendance")
        setTab("attendance");
    } catch {
      /* Preferences are optional. */
    }
  }, [query.eventId, query.projectId, query.noteId]);
  function chooseTab(next: "book" | "attendance") {
    if (next === tab || attendanceBusy) return;
    if (
      attendanceDirty.current &&
      !window.confirm("Bỏ các ngày chấm công chưa lưu?")
    )
      return;
    attendanceDirty.current = false;
    setTab(next);
    try {
      sessionStorage.setItem("myos-calendar-tab", next);
    } catch {
      /* Preferences are optional. */
    }
  }
  const visibleRange = range;
  const occurrences = useMemo(
    () =>
      expandEvents(data.events, range.from, range.until).filter(
        (item) =>
          (!group || item.groupId === group) &&
          (!search.trim() ||
            (item.title + " " + item.description)
              .toLocaleLowerCase("vi")
              .includes(search.trim().toLocaleLowerCase("vi"))),
      ),
    [data.events, range, group, search],
  );
  function createOnDate(
    date: string,
    entryKind: EventInput["entryKind"] = "appointment",
  ) {
    const initial = blankEvent(date, data.settings);
    if (group) initial.groupId = group;
    initial.entryKind = entryKind;
    if (entryKind !== "appointment") {
      initial.allDay = true;
      initial.start = date;
      initial.end = addDays(date, 1);
      initial.reminderMinutes = null;
    }
    setDayActions(null);
    setForm({ initial });
    setActionError("");
  }
  function openOccurrence(occurrence: Occurrence) {
    const event = data.events.find((item) => item.id === occurrence.eventId);
    if (event && !pending) {
      setDetail({ event, occurrence });
      setActionError("");
    }
  }
  const calendarEvents = useMemo(
    () =>
      occurrences.map((occurrence) => {
        const color = resolveCalendarColor(
          occurrence.color ??
            data.settings.groups.find((item) => item.id === occurrence.groupId)
              ?.color ??
            "turquoise",
        );
        return {
          id: occurrence.eventId + ":" + occurrence.originalStart,
          title: occurrence.title,
          start: occurrence.allDay
            ? occurrence.start
            : localTime(occurrence.start).toISO()!,
          end: occurrence.allDay
            ? occurrence.end
            : localTime(occurrence.end).toISO()!,
          allDay: occurrence.allDay,
          display: "block",
          backgroundColor: color,
          textColor: calendarTextColor(color),
          borderColor: "transparent",
          classNames: occurrence.completed ? ["schedule-completed"] : [],
          extendedProps: { occurrence },
        };
      }),
    [occurrences, data.settings.groups],
  );
  const datesSet = useCallback((info: DatesSetArg) => {
    const next = { from: wallTime(info.start), until: wallTime(info.end) };
    setRange((current) =>
      current.from === next.from && current.until === next.until
        ? current
        : next,
    );
    setTitle(info.view.title);
    setView(info.view.type);
    setChosenDate(wallTime(info.view.calendar.getDate()).slice(0, 10));
  }, []);
  useEffect(() => {
    const key = JSON.stringify(query);
    if (
      data.loading ||
      projectsLoading ||
      notesLoading ||
      data.error ||
      projectsError ||
      notesError ||
      seenQuery.current === key
    )
      return;
    seenQuery.current = key;
    if (query.eventId) {
      setTab("book");
      const event = data.events.find(
        (item) => item.id === query.eventId && !item.cancelledAt,
      );
      if (!event) {
        setActionError("Lịch liên kết không còn khả dụng.");
        return;
      }
      const sessions = allOccurrences(event);
      const occurrence =
        (query.occurrence
          ? sessions.find((item) => item.originalStart === query.occurrence)
          : undefined) ??
        sessions.find((item) => item.end > today) ??
        sessions[0];
      if (occurrence) {
        calendar.current?.getApi().gotoDate(occurrence.start.slice(0, 10));
        setDetail({ event, occurrence });
      }
      return;
    }
    if (!query.projectId && !query.noteId) return;
    setTab("book");
    const initial = blankEvent(today, data.settings);
    let source: CalendarEvent["sourceMilestone"] = null;
    if (query.projectId) {
      const project = projects.find(
        (item) => item.id === query.projectId && !item.archivedAt,
      );
      if (!project) {
        setActionError("Dự án không còn khả dụng hoặc đang lưu trữ.");
        return;
      }
      initial.projectIds = [project.id];
      if (query.milestoneId) {
        const milestone = project.items.find(
          (item) => item.id === query.milestoneId && item.kind === "milestone",
        );
        if (!milestone) {
          setActionError("Mốc dự án không còn khả dụng.");
          return;
        }
        initial.title = milestone.title;
        initial.description = milestone.description;
        initial.allDay = true;
        initial.start = milestone.dueDate || today;
        initial.end = addDays(initial.start, 1);
        source = { projectId: project.id, itemId: milestone.id };
      }
    }
    if (query.noteId) {
      const note = notes.find(
        (item) => item.id === query.noteId && !item.trashedAt,
      );
      if (!note) {
        setActionError("Ghi chú liên kết không còn khả dụng.");
        return;
      }
      initial.noteIds = [note.id];
    }
    setForm({ initial, source });
  }, [
    query,
    data.loading,
    data.error,
    data.events,
    data.settings,
    projectsLoading,
    projectsError,
    projects,
    notesLoading,
    notesError,
    notes,
    today,
  ]);
  async function run(operation: () => Promise<unknown>, success: string) {
    if (writeLock.current)
      throw new Error("Đang lưu thay đổi khác. Vui lòng đợi.");
    writeLock.current = true;
    setPending(true);
    setActionError("");
    setMessage("");
    try {
      await operation();
      setDetail(null);
      setMessage(success);
    } catch (cause) {
      setActionError(calendarError(cause));
      throw cause;
    } finally {
      writeLock.current = false;
      setPending(false);
    }
  }
  async function move(info: {
    event: EventApi;
    oldEvent: EventApi;
    revert: () => void;
  }) {
    const occurrence = info.oldEvent.extendedProps.occurrence as Occurrence;
    const event = data.events.find((item) => item.id === occurrence.eventId);
    if (!event || !info.event.start || !info.event.end || writeLock.current) {
      info.revert();
      return;
    }
    const input = {
      ...occurrenceToInput(occurrence, event),
      start: info.event.allDay
        ? info.event.startStr.slice(0, 10)
        : wallTime(info.event.start),
      end: info.event.allDay
        ? info.event.endStr.slice(0, 10)
        : wallTime(info.event.end),
      allDay: info.event.allDay,
    };
    try {
      const candidate = editCalendarEvent(
        event,
        input,
        event.repeat ? occurrence.originalStart : undefined,
      );
      if (
        conflictingEvents(data.events, candidate).length &&
        !window.confirm("Đổi giờ sẽ trùng lịch khác. Vẫn lưu?")
      ) {
        info.revert();
        return;
      }
      await run(
        () =>
          calendarService.save(
            event,
            input,
            event.repeat ? occurrence.originalStart : undefined,
          ),
        event.repeat ? "Đã đổi riêng buổi này." : "Đã cập nhật thời gian.",
      );
    } catch (cause) {
      info.revert();
      setActionError(calendarError(cause));
      data.refresh();
    }
  }
  if (data.loading) return <PageSkeleton />;
  return (
    <Tabs
      className="schedule-module"
      value={tab}
      onValueChange={(value) => chooseTab(value as "book" | "attendance")}
    >
      <PageHeading title="Lịch" />
      <div className="schedule-heading">
        <TabsList
          variant="line"
          className="schedule-tabs"
          aria-label="Phân mục lịch"
        >
          <TabsTrigger value="book" disabled={attendanceBusy}>
            Lịch
          </TabsTrigger>
          <TabsTrigger value="attendance" disabled={attendanceBusy}>
            Chấm công
          </TabsTrigger>
        </TabsList>
      </div>
      {data.error && (
        <p className="schedule-error" role="alert">
          {data.error}{" "}
          <Button
            variant="link"
            size="default"
            className="text-link"
            type="button"
            onClick={data.refresh}
          >
            Thử lại
          </Button>
        </p>
      )}
      {actionError && !detail && (
        <p className="schedule-error" role="alert">
          {actionError}
        </p>
      )}
      {message && (
        <p className="schedule-message" role="status">
          {message}
        </p>
      )}
      <TabsContent value={tab}>
        {tab === "attendance" ? (
          <Attendance
            today={today}
            firstDay={account?.profile.firstDay ?? 1}
            onStateChange={(dirty, busy) => {
              attendanceDirty.current = dirty;
              setAttendanceBusy(busy);
            }}
          />
        ) : (
          <div className="schedule-workspace">
            <section className="panel schedule-panel" aria-label="Bộ lịch">
              <div className="schedule-toolbar">
                <div className="schedule-period">
                  <div className="calendar-controls">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-button"
                      aria-label={
                        view === "dayGridMonth" ? "Tháng trước" : "Tuần trước"
                      }
                      type="button"
                      onClick={() => calendar.current?.getApi().prev()}
                    >
                      <ChevronLeft size={19} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-button"
                      aria-label={
                        view === "dayGridMonth" ? "Tháng sau" : "Tuần sau"
                      }
                      type="button"
                      onClick={() => calendar.current?.getApi().next()}
                    >
                      <ChevronRight size={19} />
                    </Button>
                  </div>
                  <h2 aria-live="polite">{title}</h2>
                </div>
                <div className="schedule-calendar-filters">
                  <div
                    className="schedule-view-buttons"
                    role="group"
                    aria-label="Chế độ xem lịch"
                  >
                    {views.map((item) => (
                      <Button
                        variant="ghost"
                        size="default"
                        type="button"
                        key={item.id}
                        aria-pressed={view === item.id}
                        onClick={() =>
                          calendar.current?.getApi().changeView(item.id)
                        }
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                  <label className="schedule-search">
                    <Search size={17} aria-hidden="true" />
                    <Input
                      aria-label="Tìm lịch hẹn, ghi chú"
                      placeholder="Tìm lịch hẹn, ghi chú…"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </label>
                  <Input
                    className="schedule-date-input"
                    aria-label="Đến ngày"
                    title="Đến ngày"
                    type="date"
                    min="2000-01-01"
                    max="2100-12-31"
                    value={chosenDate}
                    onChange={(event) => {
                      if (event.target.value)
                        calendar.current?.getApi().gotoDate(event.target.value);
                    }}
                  />
                  <select
                    className="schedule-group-select"
                    aria-label="Bộ thời khóa biểu"
                    value={group}
                    onChange={(event) => setGroup(event.target.value)}
                  >
                    <option value="">Tất cả bộ lịch</option>
                    {data.settings.groups.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <CalendarTools
                    actions={[
                      {
                        label: "Tạo bộ lịch",
                        icon: Plus,
                        disabled:
                          !!data.error ||
                          pending ||
                          data.settings.groups.length >= 20,
                        onSelect: () => setTimetable("create"),
                      },
                      ...(group
                        ? [
                            {
                              label: "Sửa bộ lịch",
                              icon: Pencil,
                              disabled: !!data.error || pending,
                              onSelect: () => setTimetable("edit"),
                            },
                            {
                              label: "Sao chép bộ lịch",
                              icon: Copy,
                              disabled:
                                !!data.error ||
                                pending ||
                                data.settings.groups.length >= 20,
                              onSelect: () => setTimetable("copy"),
                            },
                          ]
                        : []),
                      {
                        label: "Xuất .ics",
                        icon: Download,
                        disabled: !!data.error,
                        onSelect: () => setExporting(true),
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="schedule-calendar-scroll" aria-busy={pending}>
                <FullCalendar
                  ref={calendar}
                  plugins={plugins}
                  locale={viLocale}
                  timeZone={calendarZone}
                  initialDate={chosenDate}
                  initialView={view}
                  firstDay={account?.profile.firstDay ?? 1}
                  headerToolbar={false}
                  height="auto"
                  fixedWeekCount={false}
                  validRange={validRange}
                  selectable={false}
                  editable={!data.error && !pending}
                  eventResizableFromStart
                  dayMaxEvents={false}
                  navLinks={false}
                  datesSet={datesSet}
                  events={calendarEvents}
                  dayCellContent={(info) => (
                    <span className="schedule-day-heading">
                      <span>{info.dayNumberText}</span>
                      <Button
                        variant="ghost"
                        size="default"
                        className="schedule-day-add"
                        type="button"
                        aria-label={
                          "Thêm vào ngày " + wallTime(info.date).slice(0, 10)
                        }
                        title="Thêm nội dung"
                        disabled={!!data.error || pending}
                        onClick={(event) => {
                          event.stopPropagation();
                          setDayActions(wallTime(info.date).slice(0, 10));
                        }}
                      >
                        <Plus size={14} />
                      </Button>
                    </span>
                  )}
                  dateClick={(info) => {
                    if (!pending && !data.error)
                      setDayActions(info.dateStr.slice(0, 10));
                  }}
                  eventClick={(info) =>
                    openOccurrence(
                      info.event.extendedProps.occurrence as Occurrence,
                    )
                  }
                  eventDrop={(info) => void move(info)}
                  eventResize={(info) => void move(info)}
                  eventAllow={(drop, dragged) =>
                    !dragged?.extendedProps.occurrence.recurring ||
                    drop.allDay === dragged.extendedProps.occurrence.allDay
                  }
                  eventContent={(info) => {
                    const occurrence = info.event.extendedProps
                      .occurrence as Occurrence;
                    return (
                      <span className="schedule-event-content">
                        <span className="schedule-event-icons">
                          {occurrence.completed && (
                            <Check size={12} aria-label="Đã hoàn thành" />
                          )}
                          {occurrence.important && (
                            <Star size={12} aria-label="Quan trọng" />
                          )}
                        </span>
                        {info.timeText && <b>{info.timeText}</b>}
                        <span>{info.event.title}</span>
                      </span>
                    );
                  }}
                />
              </div>
              <footer className="schedule-footer">
                <div>
                  {data.settings.groups.map((item) => (
                    <span key={item.id}>
                      <i
                        style={{ background: resolveCalendarColor(item.color) }}
                      />
                      {item.name}
                    </span>
                  ))}
                </div>
                <span>{occurrences.length} mục</span>
              </footer>
            </section>
          </div>
        )}
        {dayActions && (
          <CalendarDialog
            title={localTime(dayActions)
              .setLocale("vi")
              .toFormat("cccc, dd/MM/yyyy")}
            description="Thêm nội dung cho ngày được chọn."
            onClose={() => setDayActions(null)}
          >
            <div className="schedule-day-actions">
              <Button
                variant="ghost"
                size="default"
                type="button"
                onClick={() => createOnDate(dayActions)}
              >
                <CalendarDays size={22} />
                <span>
                  <strong>Tạo lịch hẹn</strong>
                  <small>Đặt thời gian, nội dung và nhắc lịch</small>
                </span>
              </Button>
              <Button
                variant="ghost"
                size="default"
                type="button"
                onClick={() => createOnDate(dayActions, "task")}
              >
                <ListTodo size={22} />
                <span>
                  <strong>Thêm công việc</strong>
                  <small>Nội dung cần làm cho ngày này</small>
                </span>
              </Button>
              <Button
                variant="ghost"
                size="default"
                type="button"
                onClick={() => createOnDate(dayActions, "note")}
              >
                <FileText size={22} />
                <span>
                  <strong>Thêm ghi chú</strong>
                  <small>Lưu nội dung ngay trên lịch</small>
                </span>
              </Button>
            </div>
          </CalendarDialog>
        )}
        {timetable && (
          <TimetableDialog
            settings={data.settings}
            groupId={group}
            mode={timetable}
            onClose={() => setTimetable(null)}
            onSaved={(id) => {
              setGroup(id);
              setTimetable(null);
              setMessage("Đã lưu bộ thời khóa biểu.");
            }}
          />
        )}
      </TabsContent>
      {form && (
        <EventForm
          {...form}
          events={data.events}
          settings={data.settings}
          onClose={() => setForm(null)}
          onSave={async (input, originalStart) => {
            await run(
              () =>
                form.event
                  ? calendarService.save(form.event, input, originalStart)
                  : calendarService.create(input, form.source),
              "Đã lưu nội dung trên lịch.",
            );
          }}
        />
      )}
      {detail && (
        <EventDetails
          {...detail}
          settings={data.settings}
          pending={pending}
          error={actionError}
          onClose={() => setDetail(null)}
          onEdit={() => {
            setForm({
              initial: occurrenceToInput(detail.occurrence, detail.event),
              ...detail,
            });
            setDetail(null);
          }}
          onComplete={() =>
            void run(
              () => calendarService.complete(detail.event, detail.occurrence),
              "Đã cập nhật hoàn thành.",
            ).catch(() => {})
          }
          onCancel={(whole) =>
            void run(
              () =>
                calendarService.cancel(
                  detail.event,
                  !whole && detail.event.repeat
                    ? detail.occurrence.originalStart
                    : undefined,
                ),
              "Đã hủy lịch hẹn.",
            ).catch(() => {})
          }
        />
      )}
      {exporting && (
        <ExportDialog
          events={data.events}
          settings={data.settings}
          from={visibleRange.from.slice(0, 10)}
          until={visibleRange.until.slice(0, 10)}
          onClose={() => setExporting(false)}
        />
      )}
    </Tabs>
  );
}
