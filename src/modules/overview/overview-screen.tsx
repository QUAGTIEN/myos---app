"use client";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Flag,
  FolderKanban,
  NotebookPen,
  Pin,
  Repeat2,
  Star,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DateTime } from "luxon";
import { PageSkeleton } from "@/components/page-ui";
import {
  addDays,
  calendarColors,
  calendarError,
  calendarZone,
  localTime,
  type CalendarEvent,
  type EventInput,
  type Occurrence,
} from "@/modules/calendar/model";
import { effectiveOccurrence } from "@/modules/calendar/recurrence";
import { calendarService, occurrenceToInput } from "@/modules/calendar/service";
import { useCalendar } from "@/modules/calendar/use-calendar";
import { EventForm } from "@/modules/calendar/components/event-form";
import { EventDetails } from "@/modules/calendar/components/event-details";
import { useNotes } from "@/modules/notes/hooks";
import { noteTime, plainText } from "@/modules/notes/model";
import {
  getProjectProgress,
  projectErrorMessage,
  type Project,
  type ProjectItem,
} from "@/modules/projects/model";
import { projectService } from "@/modules/projects/service";
import { useProjects } from "@/modules/projects/use-projects";
import { selectOverview } from "./model";
import "@/modules/calendar/calendar.css";
import "@/modules/projects/projects.css";
import "./overview.css";

export function OverviewScreen() {
  const calendar = useCalendar();
  const projects = useProjects();
  const notes = useNotes();
  const [today, setToday] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [noteTab, setNoteTab] = useState<"recent" | "pinned">("recent");
  const [form, setForm] = useState<{
    initial: EventInput;
    event?: CalendarEvent;
    occurrence?: Occurrence;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<{
    eventId: string;
    originalStart: string;
  } | null>(null);
  const [eventPending, setEventPending] = useState(false);
  const [eventError, setEventError] = useState("");
  const [taskPending, setTaskPending] = useState("");
  const [taskError, setTaskError] = useState("");
  useEffect(() => {
    const update = () =>
      setToday(DateTime.now().setZone(calendarZone).toISODate()!);
    update();
    const timer = window.setInterval(update, 60000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const day = selectedDay ?? today;
  const data = useMemo(
    () =>
      today
        ? selectOverview(
            projects.projects,
            notes.notes,
            calendar.events,
            today,
            day,
          )
        : null,
    [projects.projects, notes.notes, calendar.events, today, day],
  );
  const detailEvent = calendar.events.find(
    (event) => event.id === selectedEvent?.eventId,
  );
  const detailOccurrence =
    detailEvent && selectedEvent
      ? effectiveOccurrence(detailEvent, selectedEvent.originalStart)
      : null;
  async function completeTask(project: Project, item: ProjectItem) {
    if (taskPending) return;
    setTaskPending(item.id);
    setTaskError("");
    try {
      await projectService.toggleItem(project, item.id);
    } catch (cause) {
      setTaskError(projectErrorMessage(cause));
      projects.refresh();
    } finally {
      setTaskPending("");
    }
  }
  async function changeEvent(operation: () => Promise<unknown>) {
    if (eventPending) return;
    setEventPending(true);
    setEventError("");
    try {
      await operation();
      setSelectedEvent(null);
    } catch (cause) {
      setEventError(calendarError(cause));
      calendar.refresh();
    } finally {
      setEventPending(false);
    }
  }
  if (!data) return <PageSkeleton />;
  const visibleNotes =
    noteTab === "pinned"
      ? data.liveNotes.filter((note) => note.pinned)
      : data.liveNotes;
  const dateTitle = localTime(day).setLocale("vi").toFormat("cccc, dd/MM/yyyy");
  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h1 className="sr-only">Tổng quan</h1>
          <time dateTime={today}>
            {localTime(today).setLocale("vi").toFormat("cccc, dd/MM/yyyy")}
          </time>
        </div>
      </div>
      <div className="dashboard-metrics" aria-label="Thống kê tổng quan">
        <Metric
          icon={CalendarDays}
          label="Lịch hôm nay"
          value={data.todayEvents.length}
          state={calendar}
          tone="blue"
          href="/calendar"
        />
        <Metric
          icon={CircleCheck}
          label="Checklist cần làm"
          value={data.tasks.length}
          state={projects}
          tone="mint"
          href="/projects"
          detail={
            data.overdueTasks ? data.overdueTasks + " quá hạn" : undefined
          }
        />
        <Metric
          icon={FolderKanban}
          label="Dự án đang làm"
          value={data.activeProjects.length}
          state={projects}
          tone="orange"
          href="/projects"
        />
        <Metric
          icon={NotebookPen}
          label="Ghi chú"
          value={data.liveNotes.length}
          state={notes}
          tone="violet"
          href="/notes"
        />
      </div>
      <div className="dashboard-grid">
        <section
          className="panel dashboard-panel"
          aria-labelledby="overview-calendar"
        >
          <PanelHeading
            id="overview-calendar"
            title="Lịch trong ngày"
            icon={CalendarDays}
            href="/calendar"
          />
          <div className="dashboard-date-controls">
            <time dateTime={day}>{dateTitle}</time>
            <div>
              <Button
                variant="outline"
                size="sm"
                className="button secondary small"
                type="button"
                onClick={() => setSelectedDay(null)}
              >
                Hôm nay
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="icon-button"
                aria-label="Ngày trước"
                type="button"
                onClick={() => setSelectedDay(addDays(day, -1))}
              >
                <ChevronLeft size={17} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="icon-button"
                aria-label="Ngày sau"
                type="button"
                onClick={() => setSelectedDay(addDays(day, 1))}
              >
                <ChevronRight size={17} />
              </Button>
            </div>
          </div>
          <BlockState
            state={calendar}
            empty={!data.dayEvents.length}
            emptyText="Chưa có lịch trong ngày"
          >
            <ol className="dashboard-agenda">
              {data.dayEvents.slice(0, 5).map((occurrence) => {
                const group = calendar.settings.groups.find(
                  (group) => group.id === occurrence.groupId,
                );
                return (
                  <li
                    key={occurrence.eventId + occurrence.originalStart}
                    style={
                      {
                        "--item-color":
                          calendarColors[group?.color ?? "turquoise"],
                      } as React.CSSProperties
                    }
                  >
                    <div className="dashboard-agenda-time">
                      {occurrence.allDay ? (
                        "Cả ngày"
                      ) : (
                        <>
                          <time dateTime={occurrence.start}>
                            {occurrence.start.slice(0, 10) < day
                              ? "Từ " +
                                localTime(occurrence.start).toFormat("dd/MM")
                              : localTime(occurrence.start).toFormat("HH:mm")}
                          </time>
                          <time dateTime={occurrence.end}>
                            {occurrence.end.slice(0, 10) > day
                              ? localTime(occurrence.end).toFormat(
                                  "HH:mm · dd/MM",
                                )
                              : localTime(occurrence.end).toFormat("HH:mm")}
                          </time>
                        </>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="default"
                      type="button"
                      className="dashboard-agenda-entry"
                      onClick={() => {
                        setSelectedEvent({
                          eventId: occurrence.eventId,
                          originalStart: occurrence.originalStart,
                        });
                        setEventError("");
                      }}
                    >
                      <strong>{occurrence.title}</strong>
                      <span>
                        {group?.name ?? "Nhóm lịch"}
                        {occurrence.recurring && (
                          <Repeat2 size={13} aria-label="Lặp tuần" />
                        )}
                        {occurrence.important && (
                          <Star size={13} aria-label="Quan trọng" />
                        )}
                        {occurrence.completed && (
                          <Check size={14} aria-label="Đã hoàn thành" />
                        )}
                      </span>
                    </Button>
                  </li>
                );
              })}
            </ol>
            {data.dayEvents.length > 5 && (
              <Link className="dashboard-more" href="/calendar">
                Xem đủ {data.dayEvents.length} lịch
                <ArrowRight size={14} />
              </Link>
            )}
          </BlockState>
        </section>
        <section
          className="panel dashboard-panel"
          aria-labelledby="overview-tasks"
        >
          <PanelHeading
            id="overview-tasks"
            title="Checklist cần làm"
            icon={CircleCheck}
            href="/projects"
          />
          {taskError && (
            <p className="dashboard-error" role="alert">
              {taskError}
            </p>
          )}
          <BlockState
            state={projects}
            empty={!data.tasks.length}
            emptyText="Không có checklist cần làm"
          >
            <ul className="dashboard-list">
              {data.tasks.slice(0, 5).map(({ project, item }) => (
                <li key={item.id} className="dashboard-task">
                  <input
                    type="checkbox"
                    checked={taskPending === item.id}
                    disabled={!!taskPending}
                    aria-label={"Hoàn thành " + item.title}
                    onChange={() => void completeTask(project, item)}
                  />
                  <Link href={"/projects/" + project.id}>
                    <strong>{item.title}</strong>
                    <span>{project.title}</span>
                  </Link>
                  <DueDate date={item.dueDate} today={today} />
                </li>
              ))}
            </ul>
          </BlockState>
        </section>
        <section
          className="panel dashboard-panel"
          aria-labelledby="overview-projects"
        >
          <PanelHeading
            id="overview-projects"
            title="Tiến độ dự án"
            icon={FolderKanban}
            href="/projects"
          />
          <BlockState
            state={projects}
            empty={!data.activeProjects.length}
            emptyText="Chưa có dự án đang làm"
          >
            <ul className="dashboard-list">
              {data.activeProjects.slice(0, 4).map((project) => {
                const progress = getProjectProgress(project);
                const completed = project.items.filter(
                  (item) => item.countsTowardProgress && item.completed,
                ).length;
                const total = project.items.filter(
                  (item) => item.countsTowardProgress,
                ).length;
                return (
                  <li key={project.id}>
                    <Link
                      className={
                        "dashboard-project dashboard-color-" + project.color
                      }
                      href={"/projects/" + project.id}
                    >
                      <span className="dashboard-record-icon">
                        <FolderKanban size={20} />
                      </span>
                      <div>
                        <strong>
                          {project.title}
                          {project.pinned && (
                            <Pin size={13} aria-label="Đã ghim" />
                          )}
                        </strong>
                        <span>
                          {project.progressMode === "checklist"
                            ? completed + "/" + total + " mục"
                            : "Tiến độ thủ công"}
                          <b>
                            {progress === null
                              ? "Chưa có dữ liệu"
                              : progress + "%"}
                          </b>
                        </span>
                        {progress !== null && (
                          <div
                            className="dashboard-progress"
                            role="progressbar"
                            aria-label={"Tiến độ " + project.title}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={progress}
                          >
                            <i style={{ width: progress + "%" }} />
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </BlockState>
        </section>
        <section
          className="panel dashboard-panel dashboard-notes"
          aria-labelledby="overview-notes"
        >
          <PanelHeading
            id="overview-notes"
            title="Ghi chú"
            icon={NotebookPen}
            href="/notes"
          />
          <div
            className="dashboard-tabs"
            role="group"
            aria-label="Lọc ghi chú tổng quan"
          >
            <Button
              variant="ghost"
              size="default"
              type="button"
              aria-pressed={noteTab === "recent"}
              onClick={() => setNoteTab("recent")}
            >
              Mới nhất
            </Button>
            <Button
              variant="ghost"
              size="default"
              type="button"
              aria-pressed={noteTab === "pinned"}
              onClick={() => setNoteTab("pinned")}
            >
              <Pin size={13} />
              Đã ghim
            </Button>
          </div>
          <BlockState
            state={notes}
            empty={!visibleNotes.length}
            emptyText={
              noteTab === "pinned"
                ? "Chưa có ghi chú đã ghim"
                : "Chưa có ghi chú"
            }
          >
            <div className="dashboard-note-grid">
              {visibleNotes.slice(0, 6).map((note) => (
                <Link
                  className="dashboard-note"
                  href={"/notes/" + note.id}
                  key={note.id}
                >
                  <span className="dashboard-record-icon">
                    <NotebookPen size={20} />
                  </span>
                  <div>
                    <strong>
                      {note.title}
                      {note.pinned && <Pin size={13} aria-label="Đã ghim" />}
                    </strong>
                    <p>
                      {plainText(note.content).slice(0, 180) ||
                        (note.content.content?.some(
                          (node) => node.type === "localImage",
                        )
                          ? "Ghi chú có hình ảnh"
                          : "Chưa có nội dung")}
                    </p>
                    <time dateTime={note.updatedAt}>
                      {noteTime(note.updatedAt)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </BlockState>
        </section>
        <section
          className="panel dashboard-panel"
          aria-labelledby="overview-milestones"
        >
          <PanelHeading
            id="overview-milestones"
            title="Mốc gần hạn"
            icon={Flag}
            href="/projects"
          />
          <BlockState
            state={projects}
            empty={!data.milestones.length}
            emptyText="Chưa có mốc đang chờ"
          >
            <ul className="dashboard-list">
              {data.milestones.slice(0, 4).map(({ project, item }) => (
                <li key={item.id} className="dashboard-milestone">
                  <Flag size={18} />
                  <Link href={"/projects/" + project.id}>
                    <strong>{item.title}</strong>
                    <span>{project.title}</span>
                  </Link>
                  <DueDate date={item.dueDate} today={today} />
                </li>
              ))}
            </ul>
          </BlockState>
        </section>
      </div>
      {form && (
        <EventForm
          {...form}
          events={calendar.events}
          settings={calendar.settings}
          onClose={() => setForm(null)}
          onSave={async (input, originalStart) => {
            if (form.event)
              await calendarService.save(form.event, input, originalStart);
            else await calendarService.create(input);
          }}
        />
      )}
      {detailEvent && detailOccurrence && (
        <EventDetails
          event={detailEvent}
          occurrence={detailOccurrence}
          settings={calendar.settings}
          pending={eventPending}
          error={eventError}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => {
            setForm({
              initial: occurrenceToInput(detailOccurrence, detailEvent),
              event: detailEvent,
              occurrence: detailOccurrence,
            });
            setSelectedEvent(null);
          }}
          onComplete={() =>
            void changeEvent(() =>
              calendarService.complete(detailEvent, detailOccurrence),
            )
          }
          onCancel={(whole) => {
            if (
              window.confirm(
                whole ? "Hủy toàn bộ chuỗi lịch này?" : "Hủy lịch hẹn này?",
              )
            )
              void changeEvent(() =>
                calendarService.cancel(
                  detailEvent,
                  !whole && detailEvent.repeat
                    ? detailOccurrence.originalStart
                    : undefined,
                ),
              );
          }}
        />
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  state,
  tone,
  href,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  state: { loading: boolean; error: string };
  tone: string;
  href: string;
  detail?: string;
}) {
  return (
    <Link
      href={href}
      className={"dashboard-metric dashboard-tone-" + tone}
      aria-label={
        label +
        ": " +
        (state.loading ? "đang tải" : state.error ? "không khả dụng" : value)
      }
    >
      <span className="dashboard-record-icon">
        <Icon size={23} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{state.loading || state.error ? "—" : value}</strong>
        {!state.loading && !state.error && detail && <small>{detail}</small>}
      </div>
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
function PanelHeading({
  id,
  title,
  icon: Icon,
  href,
}: {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <div className="dashboard-panel-heading">
      <h2 id={id}>
        <Icon size={19} aria-hidden="true" />
        {title}
      </h2>
      <Link href={href} aria-label={"Xem tất cả " + title.toLowerCase()}>
        Xem tất cả
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
function BlockState({
  state,
  empty,
  emptyText,
  children,
}: {
  state: { loading: boolean; error: string; refresh: () => void };
  empty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  if (state.loading)
    return (
      <div
        className="dashboard-block-loading"
        role="status"
        aria-label="Đang tải dữ liệu"
      >
        {[0, 1, 2].map((i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    );
  if (state.error)
    return (
      <div className="dashboard-block-state dashboard-error" role="alert">
        <p>{state.error}</p>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="button secondary small"
          onClick={state.refresh}
        >
          Thử lại
        </Button>
      </div>
    );
  if (empty) return <p className="dashboard-block-state">{emptyText}</p>;
  return <>{children}</>;
}
function DueDate({ date, today }: { date: string; today: string }) {
  if (!date) return <span className="dashboard-due">Chưa đặt hạn</span>;
  return (
    <time
      dateTime={date}
      className={
        "dashboard-due " +
        (date < today ? "overdue" : date === today ? "today" : "")
      }
    >
      {date < today
        ? "Quá hạn · " + localTime(date).toFormat("dd/MM")
        : date === today
          ? "Hôm nay"
          : localTime(date).toFormat("dd/MM")}
    </time>
  );
}
