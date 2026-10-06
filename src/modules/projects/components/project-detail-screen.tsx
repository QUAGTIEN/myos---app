"use client";
import { useNotes } from "@/modules/notes/hooks";
import { emptyNoteInput, noteError } from "@/modules/notes/model";
import { noteService } from "@/modules/notes/service";
import { RelatedCalendar } from "@/modules/calendar/components/related-calendar";

import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarDays,
  Flag,
  FolderKanban,
  Link2,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState, FeatureNotice, PageSkeleton } from "@/components/page-ui";

import {
  formatProjectDate,
  projectStatuses,
  type ItemInput,
  type Project,
  type ProjectItem,
} from "../model";
import { projectService } from "../service";
import { useProjects } from "../use-projects";
import { ItemDialog } from "./item-dialog";
import { ProjectDialog } from "./project-dialog";
import { ProgressIndicator } from "./progress-indicator";

export function ProjectDetailScreen({ projectId }: { projectId: string }) {
  const { project, loading, error, message, pending, run, refresh } =
    useProjects(projectId);
  const [editing, setEditing] = useState<Project | null>(null);
  const [itemDialog, setItemDialog] = useState<{
    project: Project;
    item?: ProjectItem;
    kind: ItemInput["kind"];
  } | null>(null);

  if (loading) return <PageSkeleton />;
  if (!project)
    return (
      <div className="projects-module">
        <section className="panel">
          <EmptyState
            icon={FolderKanban}
            title={
              error
                ? "Chưa thể mở dự án"
                : "Không tìm thấy dự án trên trình duyệt này"
            }
            description={
              error ||
              "Dự án có thể được lưu ở trình duyệt hoặc địa chỉ khác. Dữ liệu local chưa đồng bộ tài khoản."
            }
          >
            <Link className="button secondary" href="/projects">
              Về Dự án
            </Link>
            {error && (
              <button
                className="button secondary"
                type="button"
                onClick={refresh}
              >
                Thử lại
              </button>
            )}
          </EmptyState>
        </section>
      </div>
    );
  const archived = !!project.archivedAt;
  function archive() {
    if (!project) return;
    if (
      !archived &&
      !window.confirm(
        "Lưu trữ dự án này? Nội dung và checklist vẫn được giữ để khôi phục sau.",
      )
    )
      return;
    void run(
      () => projectService.toggleArchive(project),
      archived ? "Đã khôi phục dự án." : "Đã lưu trữ dự án.",
    );
  }
  function removeItem(item: ProjectItem) {
    if (
      !project ||
      !window.confirm(
        "Xóa mục “" + item.title + "”? Tiến độ checklist sẽ được tính lại.",
      )
    )
      return;
    void run(() => projectService.removeItem(project, item.id), "Đã xóa mục.");
  }
  return (
    <div className="projects-module">
      <Link className="project-back" href="/projects">
        <ArrowLeft size={17} aria-hidden="true" />
        Tất cả dự án
      </Link>
      <div className="project-detail-heading">
        <div>
          <p className="eyebrow">TỪNG BƯỚC, TỪNG TIẾN ĐỘ</p>
          <h1>{project.title}</h1>
          <div className="project-detail-labels">
            <span className={"project-status status-" + project.status}>
              {archived ? "Lưu trữ" : projectStatuses[project.status]}
            </span>
            <span>
              <CalendarDays size={15} aria-hidden="true" />
              Hạn: {formatProjectDate(project.dueDate)}
            </span>
          </div>
        </div>
        <div className="project-detail-actions">
          <button
            type="button"
            className="button secondary small"
            disabled={pending}
            onClick={() =>
              void run(
                () => projectService.togglePin(project),
                project.pinned ? "Đã bỏ ghim." : "Đã ghim dự án.",
              )
            }
          >
            {project.pinned ? <PinOff size={16} /> : <Pin size={16} />}
            {project.pinned ? "Bỏ ghim" : "Ghim"}
          </button>
          <button
            type="button"
            className="button secondary small"
            onClick={archive}
            disabled={pending}
          >
            <Archive size={16} />
            {archived ? "Khôi phục" : "Lưu trữ"}
          </button>
          <button
            type="button"
            className="button primary small"
            disabled={pending || archived}
            onClick={() => setEditing(project)}
          >
            <Pencil size={16} aria-hidden="true" />
            Sửa dự án
          </button>
        </div>
      </div>
      <FeatureNotice>
        {archived
          ? "Dự án đang lưu trữ. Khôi phục để chỉnh nội dung và checklist."
          : "Đã lưu trên trình duyệt này. Chưa đồng bộ tài khoản hoặc thiết bị."}
      </FeatureNotice>
      {error && (
        <div className="project-alert error" role="alert">
          <span>{error}</span>
          <button type="button" className="text-link" onClick={refresh}>
            Tải bản mới
          </button>
        </div>
      )}
      {message && (
        <p className="project-alert success" role="status">
          {message}
        </p>
      )}
      <div className="project-detail-grid">
        <div className="project-detail-main">
          <section className="panel project-content-panel">
            <div className="project-section-heading">
              <h2>Nội dung dự án</h2>
            </div>
            <p className="project-description-full">
              {project.description ||
                "Chưa có nội dung. Sửa dự án để thêm mục tiêu và ý tưởng."}
            </p>
          </section>
          <section className="panel project-checklist-panel">
            <div className="project-section-heading">
              <h2>Checklist & cột mốc</h2>
              <div>
                <button
                  type="button"
                  className="button secondary small"
                  disabled={pending || archived || project.items.length >= 200}
                  onClick={() => setItemDialog({ project, kind: "milestone" })}
                >
                  <Flag size={15} />
                  Thêm cột mốc
                </button>
                <button
                  type="button"
                  className="button primary small"
                  disabled={pending || archived || project.items.length >= 200}
                  onClick={() => setItemDialog({ project, kind: "task" })}
                >
                  <Plus size={15} />
                  Thêm mục
                </button>
              </div>
            </div>
            {!project.items.length ? (
              <div className="project-checklist-empty">
                <Flag size={25} aria-hidden="true" />
                <p>Chia mục tiêu thành những bước nhỏ.</p>
                <span>
                  Checklist tính tiến độ; cột mốc mặc định không tính để tránh
                  đếm hai lần.
                </span>
              </div>
            ) : (
              <ul className="project-item-list">
                {project.items.map((item, index) => (
                  <li
                    key={item.id}
                    className={
                      item.completed ? "project-item completed" : "project-item"
                    }
                  >
                    <input
                      aria-label={"Hoàn thành " + item.title}
                      type="checkbox"
                      checked={item.completed}
                      disabled={pending || archived}
                      onChange={() =>
                        void run(
                          () => projectService.toggleItem(project, item.id),
                          item.completed
                            ? "Đã mở lại mục."
                            : "Đã hoàn thành mục.",
                        )
                      }
                    />
                    <div className="project-item-text">
                      <strong>
                        {item.kind === "milestone" && (
                          <Flag size={14} aria-label="Cột mốc" />
                        )}
                        {item.title}
                      </strong>
                      {item.description && <p>{item.description}</p>}
                      <div>
                        <span>
                          {item.countsTowardProgress
                            ? "Tính tiến độ"
                            : "Không tính tiến độ"}
                        </span>
                        {item.dueDate && (
                          <span>Hạn {formatProjectDate(item.dueDate)}</span>
                        )}
                      </div>
                    </div>
                    <div className="project-item-actions">
                      {item.kind === "milestone" && !archived && (
                        <Link
                          className="icon-button"
                          aria-label={"Tạo lịch từ mốc " + item.title}
                          href={`/calendar?projectId=${project.id}&milestoneId=${item.id}`}
                        >
                          <CalendarDays size={15} />
                        </Link>
                      )}
                      <button
                        type="button"
                        className="icon-button"
                        disabled={pending || archived || index === 0}
                        aria-label={"Đưa lên " + item.title}
                        onClick={() =>
                          void run(
                            () => projectService.moveItem(project, item.id, -1),
                            "Đã đổi thứ tự.",
                          )
                        }
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        disabled={
                          pending ||
                          archived ||
                          index === project.items.length - 1
                        }
                        aria-label={"Đưa xuống " + item.title}
                        onClick={() =>
                          void run(
                            () => projectService.moveItem(project, item.id, 1),
                            "Đã đổi thứ tự.",
                          )
                        }
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        disabled={pending || archived}
                        aria-label={"Sửa " + item.title}
                        onClick={() =>
                          setItemDialog({ project, item, kind: item.kind })
                        }
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        disabled={pending || archived}
                        aria-label={"Xóa " + item.title}
                        onClick={() => removeItem(item)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <ProjectNotes projectId={project.id} archived={archived} />
          <RelatedCalendar kind="project" id={project.id} readonly={archived} />
        </div>
        <aside className="project-detail-side">
          <section className="panel project-side-panel">
            <h2>Tiến độ</h2>
            <ProgressIndicator project={project} />
            <dl>
              <div>
                <dt>Ngày bắt đầu</dt>
                <dd>{formatProjectDate(project.startDate)}</dd>
              </div>
              <div>
                <dt>Hạn dự kiến</dt>
                <dd>{formatProjectDate(project.dueDate)}</dd>
              </div>
              <div>
                <dt>Checklist & mốc</dt>
                <dd>{project.items.length} mục</dd>
              </div>
            </dl>
          </section>
          <section className="panel project-side-panel">
            <h2>Cập nhật gần đây</h2>
            <p className="project-history-caption">
              Giữ tối đa 100 cập nhật gần nhất.
            </p>
            <ol className="project-history">
              {project.updates.map((update) => (
                <li key={update.id}>
                  <p>{update.message}</p>
                  <time dateTime={update.at}>
                    {new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                      timeZone: "Asia/Ho_Chi_Minh",
                    }).format(new Date(update.at))}
                  </time>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
      {editing && (
        <ProjectDialog
          project={editing}
          onClose={() => setEditing(null)}
          onSave={(input) => projectService.edit(editing, input)}
        />
      )}
      {itemDialog && (
        <ItemDialog
          item={itemDialog.item}
          kind={itemDialog.kind}
          onClose={() => setItemDialog(null)}
          onSave={(input) =>
            itemDialog.item
              ? projectService.editItem(
                  itemDialog.project,
                  itemDialog.item.id,
                  input,
                )
              : projectService.addItem(itemDialog.project, input)
          }
        />
      )}
    </div>
  );
}

function ProjectNotes({
  projectId,
  archived,
}: {
  projectId: string;
  archived: boolean;
}) {
  const { notes, loading, error, refresh } = useNotes();
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const router = useRouter();
  const linked = notes.filter(
    (note) => !note.trashedAt && note.projectIds.includes(projectId),
  );
  async function create() {
    setPending(true);
    setActionError("");
    try {
      const note = await noteService.create({
        ...emptyNoteInput,
        projectIds: [projectId],
      });
      router.push("/notes/" + note.id);
    } catch (cause) {
      setActionError(noteError(cause));
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="panel project-content-panel">
      <div className="project-section-heading">
        <h2>
          <Link2 size={17} />
          Ghi chú liên quan
        </h2>
        <button
          type="button"
          className="button secondary small"
          disabled={loading || pending || archived || !!error}
          onClick={() => {
            void create();
          }}
        >
          <Plus size={16} />
          Tạo ghi chú
        </button>
      </div>
      {(error || actionError) && (
        <p role="alert">
          {error || actionError}{" "}
          <button className="text-link" type="button" onClick={refresh}>
            Thử lại
          </button>
        </p>
      )}
      {loading ? (
        <p>Đang tải ghi chú…</p>
      ) : linked.length ? (
        <ul className="project-note-links">
          {linked.map((note) => (
            <li key={note.id}>
              <Link href={"/notes/" + note.id}>{note.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="project-related-placeholder">
          Chưa có ghi chú liên quan. Tạo ở đây hoặc gắn dự án trong trang Ghi
          chú.
        </p>
      )}
    </section>
  );
}
