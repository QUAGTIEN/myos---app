"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import viLocale from "@fullcalendar/core/locales/vi";
import type { EventApi, DateSelectArg, DatesSetArg } from "@fullcalendar/core";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Repeat2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageHeading, PageSkeleton } from "@/components/page-ui";

import { useProjects } from "@/modules/projects/use-projects";
import { useNotes } from "@/modules/notes/hooks";
import {
  addDays,
  blankEvent,
  calendarColors,
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
import { CalendarYear, TimetableDialog } from "./calendar-book";
import { ExportDialog } from "./dialogs";

const plugins = [
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
  luxonPlugin,
];
const validRange = { start: "2000-01-01", end: "2100-12-31" };
const views = [
  { id: "dayGridMonth", name: "Tháng" },
  { id: "timeGridWeek", name: "Tuần" },
  { id: "timeGridDay", name: "Ngày" },
  { id: "listMonth", name: "Danh sách" },
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

export function CalendarScreen({
  today,
  query = {},
}: {
  today: string;
  query?: CalendarQuery;
}) {
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
  const [tab, setTab] = useState<"book" | "work">(
    query.eventId || query.projectId || query.noteId ? "work" : "book",
  );
  const [yearView, setYearView] = useState(false);
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
      if (sessionStorage.getItem("myos-calendar-tab") === "work")
        setTab("work");
    } catch {
      /* Storage preferences are optional; schedules remain in IndexedDB. */
    }
  }, [query.eventId, query.projectId, query.noteId]);
  function chooseTab(next: "book" | "work") {
    setTab(next);
    setYearView(false);
    try {
      sessionStorage.setItem("myos-calendar-tab", next);
    } catch {
      /* Keep this tab usable without sessionStorage. */
    }
    calendar.current
      ?.getApi()
      .changeView(next === "work" ? "timeGridWeek" : "dayGridMonth");
  }
  const visibleRange = useMemo(
    () =>
      yearView
        ? {
            from: chosenDate.slice(0, 4) + "-01-01",
            until: String(Number(chosenDate.slice(0, 4)) + 1) + "-01-01",
          }
        : range,
    [yearView, chosenDate, range],
  );
  const occurrences = useMemo(
    () =>
      expandEvents(data.events, visibleRange.from, visibleRange.until).filter(
        (item) => tab === "book" || !group || item.groupId === group,
      ),
    [data.events, visibleRange, group, tab],
  );
  const calendarEvents = useMemo(
    () =>
      occurrences.map((occurrence) => {
        const color =
          calendarColors[
            data.settings.groups.find((item) => item.id === occurrence.groupId)
              ?.color ?? "turquoise"
          ];
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
          backgroundColor: color,
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
  const select = useCallback(
    (info: DateSelectArg) => {
      const initial = blankEvent(info.startStr.slice(0, 10), data.settings);
      setForm({
        initial: {
          ...initial,
          ...(group ? { groupId: group } : {}),
          allDay: info.allDay,
          start: info.allDay
            ? info.startStr.slice(0, 10)
            : wallTime(info.start),
          end: info.allDay ? info.endStr.slice(0, 10) : wallTime(info.end),
        },
      });
      calendar.current?.getApi().unselect();
      setActionError("");
    },
    [data.settings, group],
  );
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
      setTab("work");
      setYearView(false);
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
    setTab("work");
    setYearView(false);
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
      data.refresh();
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
    <div className="schedule-module">
      <div className="schedule-tabs" role="group" aria-label="Phân mục lịch">
        <button
          type="button"
          aria-pressed={tab === "book"}
          onClick={() => chooseTab("book")}
        >
          Lịch
        </button>
        <button
          type="button"
          aria-pressed={tab === "work"}
          onClick={() => chooseTab("work")}
        >
          Công việc
        </button>
      </div>
      <PageHeading
        title="Lịch"
        action={
          tab === "work" && (
            <button
              className="button primary"
              type="button"
              disabled={!!data.error || pending}
              onClick={() => {
                setForm({
                  initial: {
                    ...blankEvent(chosenDate, data.settings),
                    ...(group ? { groupId: group } : {}),
                  },
                });
                setActionError("");
              }}
            >
              <Plus size={18} />
              Tạo lịch hẹn
            </button>
          )
        }
      />
      {tab === "work" && (
        <div className="schedule-note">
          <Link href="/settings">Cài đặt lịch</Link>
        </div>
      )}
      {data.error && (
        <p className="schedule-error" role="alert">
          {data.error}{" "}
          <button className="text-link" type="button" onClick={data.refresh}>
            Thử lại
          </button>
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
      <section className="panel schedule-panel" aria-label="Bộ lịch">
        <div className="schedule-toolbar">
          <div className="calendar-month">
            <h2 aria-live="polite">
              {yearView ? "Năm " + chosenDate.slice(0, 4) : title}
            </h2>
            <div className="calendar-controls">
              <button
                className="icon-button"
                aria-label={
                  yearView
                    ? "Năm trước"
                    : view === "dayGridMonth"
                      ? "Tháng trước"
                      : "Khoảng trước"
                }
                type="button"
                disabled={yearView && Number(chosenDate.slice(0, 4)) <= 2000}
                onClick={() =>
                  yearView
                    ? calendar.current
                        ?.getApi()
                        .gotoDate(
                          localTime(chosenDate)
                            .minus({ years: 1 })
                            .toISODate()!,
                        )
                    : calendar.current?.getApi().prev()
                }
              >
                <ChevronLeft size={19} />
              </button>
              <button
                className="icon-button"
                aria-label={
                  yearView
                    ? "Năm sau"
                    : view === "dayGridMonth"
                      ? "Tháng sau"
                      : "Khoảng sau"
                }
                type="button"
                disabled={yearView && Number(chosenDate.slice(0, 4)) >= 2100}
                onClick={() =>
                  yearView
                    ? calendar.current
                        ?.getApi()
                        .gotoDate(
                          localTime(chosenDate).plus({ years: 1 }).toISODate()!,
                        )
                    : calendar.current?.getApi().next()
                }
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
          <div className="schedule-toolbar-actions">
            <button
              className="button secondary small"
              type="button"
              onClick={() => calendar.current?.getApi().gotoDate(today)}
            >
              Hôm nay
            </button>
            <label className="schedule-date-label">
              Đến ngày
              <input
                aria-label="Đến ngày"
                type="date"
                min="2000-01-01"
                max="2100-12-31"
                value={chosenDate}
                onChange={(e) => {
                  setChosenDate(e.target.value);
                  if (e.target.value)
                    calendar.current?.getApi().gotoDate(e.target.value);
                }}
              />
            </label>
            <button
              className="button secondary small"
              type="button"
              disabled={!!data.error}
              onClick={() => setExporting(true)}
            >
              <Download size={16} />
              Xuất .ics
            </button>
          </div>
        </div>
        <div className="schedule-filter-row">
          <div
            className="schedule-view-buttons"
            role="group"
            aria-label="Chế độ xem lịch"
          >
            {(tab === "work"
              ? views
              : views.filter(
                  (item) => item.name === "Tháng" || item.name === "Ngày",
                )
            ).map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={!yearView && view === item.id}
                onClick={() => {
                  setYearView(false);
                  calendar.current?.getApi().changeView(item.id);
                }}
              >
                {item.name}
              </button>
            ))}
            {tab === "book" && (
              <button
                type="button"
                aria-pressed={yearView}
                onClick={() => setYearView(true)}
              >
                Năm
              </button>
            )}
          </div>
          {tab === "work" && (
            <label>
              Bộ thời khóa biểu
              <select value={group} onChange={(e) => setGroup(e.target.value)}>
                <option value="">Tất cả bộ lịch</option>
                {data.settings.groups.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {tab === "work" && (
            <div className="timetable-actions">
              <button
                className="button secondary small"
                type="button"
                disabled={
                  !!data.error || pending || data.settings.groups.length >= 20
                }
                onClick={() => setTimetable("create")}
              >
                Tạo bộ lịch
              </button>
              <button
                className="button secondary small"
                type="button"
                disabled={!group || !!data.error || pending}
                onClick={() => setTimetable("edit")}
              >
                Sửa bộ lịch
              </button>
              <button
                className="button secondary small"
                type="button"
                disabled={
                  !group ||
                  !!data.error ||
                  pending ||
                  data.settings.groups.length >= 20
                }
                onClick={() => setTimetable("copy")}
              >
                Sao chép bộ lịch
              </button>
            </div>
          )}
        </div>
        {yearView && (
          <CalendarYear
            year={Number(chosenDate.slice(0, 4))}
            today={today}
            onDate={(date) => {
              setYearView(false);
              calendar.current?.getApi().changeView("dayGridMonth", date);
            }}
          />
        )}
        <div
          hidden={yearView}
          className="schedule-calendar-scroll"
          aria-busy={pending}
        >
          <FullCalendar
            ref={calendar}
            plugins={plugins}
            locale={viLocale}
            timeZone={calendarZone}
            initialDate={today}
            initialView="dayGridMonth"
            firstDay={1}
            headerToolbar={false}
            height={view.startsWith("timeGrid") ? 680 : "auto"}
            nowIndicator
            validRange={validRange}
            selectable={tab === "work" && !data.error && !pending}
            editable={tab === "work" && !data.error && !pending}
            eventResizableFromStart
            slotMinTime={data.settings.slotMinTime}
            slotMaxTime={data.settings.slotMaxTime}
            slotDuration="00:30:00"
            allDayText="Cả ngày"
            dayMaxEvents={3}
            noEventsText="Chưa có lịch hẹn trong khoảng này"
            moreLinkText={(count) => `+${count} lịch`}
            moreLinkClick="timeGridDay"
            navLinks={false}
            datesSet={datesSet}
            events={calendarEvents}
            select={select}
            dateClick={(info) => {
              if (tab === "book") {
                calendar.current
                  ?.getApi()
                  .changeView("timeGridDay", info.dateStr.slice(0, 10));
                return;
              }
              const initial = blankEvent(
                info.dateStr.slice(0, 10),
                data.settings,
              );
              if (!info.allDay) {
                initial.start = wallTime(info.date);
                initial.end = localTime(initial.start)
                  .plus({ hours: 1 })
                  .toFormat("yyyy-MM-dd'T'HH:mm");
              }
              if (group) initial.groupId = group;
              if (!pending && !data.error) setForm({ initial });
            }}
            eventClick={(info) => {
              const occurrence = info.event.extendedProps
                .occurrence as Occurrence;
              const event = data.events.find(
                (item) => item.id === occurrence.eventId,
              );
              if (event && !pending) {
                setDetail({ event, occurrence });
                setActionError("");
              }
            }}
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
                    {occurrence.recurring && (
                      <Repeat2 size={12} aria-label="Lặp tuần" />
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
                <i style={{ background: calendarColors[item.color] }} />
                {item.name}
              </span>
            ))}
          </div>
          <span>{occurrences.length} lịch</span>
        </footer>
      </section>
      {timetable && (
        <TimetableDialog
          settings={data.settings}
          groupId={group}
          mode={timetable}
          onClose={() => setTimetable(null)}
          onSaved={(id) => {
            setGroup(id);
            setTimetable(null);
            data.refresh();
            setMessage("Đã lưu bộ thời khóa biểu.");
          }}
        />
      )}
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
              "Đã lưu lịch hẹn.",
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
    </div>
  );
}
