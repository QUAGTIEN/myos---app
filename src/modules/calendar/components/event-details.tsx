"use client";
import { Check, Pencil, Repeat2, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useNotes } from "@/modules/notes/hooks";
import { useProjects } from "@/modules/projects/use-projects";
import {
  addDays,
  localTime,
  type CalendarEvent,
  type CalendarSettings,
  type Occurrence,
} from "../model";
import { CalendarDialog } from "./dialogs";

export function EventDetails({
  event,
  occurrence,
  settings,
  pending,
  error,
  onClose,
  onEdit,
  onComplete,
  onCancel,
}: {
  event: CalendarEvent;
  occurrence: Occurrence;
  settings: CalendarSettings;
  pending: boolean;
  error: string;
  onClose: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onCancel: (whole: boolean) => void;
}) {
  const [whole, setWhole] = useState(false);
  const label =
    occurrence.entryKind === "note"
      ? "ghi chú"
      : occurrence.entryKind === "task"
        ? "công việc"
        : "lịch hẹn";
  const { projects, error: projectsError } = useProjects();
  const { notes, error: notesError } = useNotes();
  const format = (value: string) =>
    localTime(value)
      .setLocale("vi")
      .toFormat(
        occurrence.allDay ? "cccc, dd/MM/yyyy" : "cccc, dd/MM/yyyy · HH:mm",
      );
  return (
    <CalendarDialog
      title={occurrence.title}
      description={
        event.repeat
          ? "Một buổi trong thời khóa biểu lặp tuần."
          : "Chi tiết lịch hẹn."
      }
      pending={pending}
      onClose={onClose}
    >
      <div className="schedule-details">
        <div className="schedule-tags">
          <span>
            {
              settings.groups.find((group) => group.id === occurrence.groupId)
                ?.name
            }
          </span>
          {occurrence.important && (
            <span>
              <Star size={15} />
              Quan trọng
            </span>
          )}
          {occurrence.completed && (
            <span>
              <Check size={15} />
              Đã hoàn thành
            </span>
          )}
          {occurrence.recurring && (
            <span>
              <Repeat2 size={15} />
              Lặp tuần
            </span>
          )}
        </div>
        <dl>
          <div>
            <dt>Bắt đầu</dt>
            <dd>{format(occurrence.start)}</dd>
          </div>
          <div>
            <dt>{occurrence.allDay ? "Ngày cuối" : "Kết thúc"}</dt>
            <dd>
              {format(
                occurrence.allDay
                  ? addDays(occurrence.end, -1)
                  : occurrence.end,
              )}
            </dd>
          </div>
          <div>
            <dt>Múi giờ</dt>
            <dd>Việt Nam · UTC+7{occurrence.allDay ? " · Cả ngày" : ""}</dd>
          </div>
        </dl>
        {occurrence.description && (
          <p className="schedule-description">{occurrence.description}</p>
        )}
        {event.sourceMilestone && <p className="schedule-help">Từ mốc dự án</p>}
        {(projectsError || notesError) && (
          <p role="alert">{projectsError || notesError}</p>
        )}
        {(occurrence.projectIds.length > 0 ||
          occurrence.noteIds.length > 0) && (
          <div className="schedule-related-list">
            <h3>Liên kết</h3>
            {occurrence.projectIds.map((id) => {
              const project = projects.find((item) => item.id === id);
              return project ? (
                <Link key={id} href={"/projects/" + id}>
                  {project.title}
                </Link>
              ) : (
                <span key={id}>Dự án không còn khả dụng</span>
              );
            })}
            {occurrence.noteIds.map((id) => {
              const note = notes.find((item) => item.id === id);
              return note && !note.trashedAt ? (
                <Link key={id} href={"/notes/" + id}>
                  {note.title}
                </Link>
              ) : (
                <span key={id}>Ghi chú không còn khả dụng</span>
              );
            })}
          </div>
        )}
        <p className="schedule-help">
          {occurrence.reminderMinutes === null
            ? "Không đặt nhắc."
            : `Đã đặt nhắc trước ${occurrence.reminderMinutes} phút.`}{" "}
          (chưa bật)
        </p>
        {event.repeat && (
          <label className="schedule-check">
            <input
              type="checkbox"
              checked={whole}
              disabled={pending}
              onChange={(e) => setWhole(e.target.checked)}
            />
            Hủy toàn chuỗi thay vì chỉ buổi này
          </label>
        )}
        {error && (
          <p className="schedule-error" role="alert">
            {error}
          </p>
        )}
        <div className="schedule-detail-actions">
          <button
            type="button"
            className="button secondary"
            disabled={pending}
            onClick={onEdit}
          >
            <Pencil size={16} />
            {"Sửa " + label}
          </button>
          <button
            type="button"
            className="button secondary"
            disabled={pending}
            onClick={onComplete}
          >
            <Check size={16} />
            {occurrence.completed ? "Bỏ hoàn thành" : "Hoàn thành buổi này"}
          </button>
          <button
            type="button"
            className="button secondary schedule-danger"
            disabled={pending}
            onClick={() => {
              if (
                window.confirm(
                  whole
                    ? "Hủy toàn bộ chuỗi lịch này?"
                    : "Hủy " + label + " này?",
                )
              )
                onCancel(whole);
            }}
          >
            <Trash2 size={16} />
            {whole ? "Hủy toàn chuỗi" : "Hủy " + label}
          </button>
        </div>
      </div>
    </CalendarDialog>
  );
}
