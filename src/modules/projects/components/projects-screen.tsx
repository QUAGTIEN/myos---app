"use client";

import {
  Archive,
  MoreHorizontal,
  CalendarDays,
  FolderKanban,
  GripVertical,
  Pin,
  PinOff,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EmptyState, PageSkeleton } from "@/components/page-ui";

import { formatProjectDate, projectStatuses, type Project } from "../model";
import { projectService } from "../service";
import { useProjects } from "../use-projects";
import { ProjectDialog } from "./project-dialog";
import { ProgressIndicator } from "./progress-indicator";

const filters = {
  all: "Tất cả",
  active: "Đang làm",
  paused: "Tạm dừng",
  completed: "Hoàn thành",
  archived: "Lưu trữ",
} as const;
type Filter = keyof typeof filters;
const pageSize = 12;
function searchable(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replaceAll("đ", "d")
    .replaceAll("Đ", "D")
    .toLocaleLowerCase("vi");
}

function ProjectCardActions({
  project,
  pending,
  onPin,
  onArchive,
}: {
  project: Project;
  pending: boolean;
  onPin: () => void;
  onArchive: () => void;
}) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      const element = disclosure.current;
      if (
        element?.open &&
        event.target instanceof Node &&
        !element.contains(event.target)
      ) {
        element.open = false;
      }
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return (
    <details
      className="project-card-menu"
      ref={disclosure}
      onKeyDown={(event) => {
        if (event.key === "Escape" && disclosure.current?.open) {
          event.preventDefault();
          disclosure.current.open = false;
          disclosure.current.querySelector("summary")?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          event.currentTarget.open = false;
      }}
    >
      <summary className="icon-button" aria-label={"Thao tác " + project.title}>
        <MoreHorizontal size={18} aria-hidden="true" />
      </summary>
      <div className="project-card-menu-actions">
        <button
          type="button"
          disabled={pending}
          aria-label={(project.pinned ? "Bỏ ghim " : "Ghim ") + project.title}
          onClick={() => {
            if (disclosure.current) disclosure.current.open = false;
            disclosure.current?.querySelector("summary")?.focus();
            onPin();
          }}
        >
          {project.pinned ? <PinOff size={16} /> : <Pin size={16} />}
          {project.pinned ? "Bỏ ghim" : "Ghim dự án"}
        </button>
        <button
          type="button"
          disabled={pending}
          aria-label={
            (project.archivedAt ? "Khôi phục " : "Lưu trữ ") + project.title
          }
          onClick={() => {
            if (disclosure.current) disclosure.current.open = false;
            disclosure.current?.querySelector("summary")?.focus();
            onArchive();
          }}
        >
          <Archive size={16} />
          {project.archivedAt ? "Khôi phục" : "Lưu trữ"}
        </button>
      </div>
    </details>
  );
}

export function ProjectsScreen() {
  const { projects, loading, error, pending, message, run, refresh } =
    useProjects();
  const [layout, setLayout] = useState<"cards" | "kanban">("cards");
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const visible = projects
    .filter((project) => {
      const matchesStatus =
        filter === "archived"
          ? !!project.archivedAt
          : !project.archivedAt &&
            (filter === "all" || project.status === filter);
      return (
        matchesStatus &&
        (!pinnedOnly || project.pinned) &&
        searchable(project.title + " " + project.description).includes(
          searchable(query),
        )
      );
    })
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.updatedAt.localeCompare(a.updatedAt) ||
        a.id.localeCompare(b.id),
    );
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const listed = visible.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const activeProjects = projects.filter((project) => !project.archivedAt);

  function archive(project: Project) {
    if (
      !project.archivedAt &&
      !window.confirm(
        "Lưu trữ dự án này? Nội dung và checklist vẫn được giữ để khôi phục sau.",
      )
    )
      return;
    void run(
      () => projectService.toggleArchive(project),
      project.archivedAt ? "Đã khôi phục dự án." : "Đã lưu trữ dự án.",
    );
  }

  function renderCard(project: Project) {
    return (
      <article
        key={project.id}
        draggable={layout === "kanban" && !pending && !project.archivedAt}
        onDragStart={(event) =>
          event.dataTransfer.setData("text/myos-project", project.id)
        }
        className={"panel project-card project-color-" + project.color}
      >
        <div className="project-card-top">
          {layout === "kanban" && !project.archivedAt && (
            <span
              className="kanban-handle"
              draggable={!pending}
              aria-label={"Kéo " + project.title}
              title="Kéo để đổi trạng thái"
            >
              <GripVertical size={18} />
            </span>
          )}
          {project.pinned && <Pin size={15} aria-label="Đã ghim" />}
          <ProjectCardActions
            project={project}
            pending={pending}
            onPin={() =>
              void run(
                () => projectService.togglePin(project),
                project.pinned ? "Đã bỏ ghim." : "Đã ghim dự án.",
              )
            }
            onArchive={() => archive(project)}
          />
        </div>
        <Link className="project-card-main" href={"/projects/" + project.id}>
          <h2>{project.title}</h2>
          <span className={"project-status status-" + project.status}>
            {project.archivedAt ? "Lưu trữ" : projectStatuses[project.status]}
          </span>
          <p>{project.description || "Chưa có nội dung"}</p>
        </Link>
        {layout === "kanban" && (
          <label className="kanban-status-label">
            Trạng thái
            <select
              aria-label={"Trạng thái " + project.title}
              value={project.status}
              disabled={pending || !!project.archivedAt}
              onChange={(event) =>
                void run(
                  () =>
                    projectService.setStatus(
                      project,
                      event.target.value as Project["status"],
                    ),
                  "Đã chuyển dự án.",
                )
              }
            >
              {Object.entries(projectStatuses).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
        <ProgressIndicator project={project} compact />
        <div className="project-card-footer">
          <span>
            <CalendarDays size={15} aria-hidden="true" />
            {project.dueDate
              ? formatProjectDate(project.dueDate)
              : "Chưa đặt hạn"}
          </span>
        </div>
      </article>
    );
  }
  return (
    <div className="projects-module">
      <h1 className="sr-only">Dự án</h1>
      {error && (
        <div className="project-alert error" role="alert">
          <span>{error}</span>
          <button type="button" className="text-link" onClick={refresh}>
            Thử tải lại
          </button>
        </div>
      )}
      {message && (
        <p className="project-alert success" role="status">
          {message}
        </p>
      )}
      <div className="project-library-workspace">
        <div className="project-search-row">
          <label className="project-search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Tìm dự án"
              placeholder="Tìm dự án…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <button
            className="button primary"
            type="button"
            onClick={() => setCreating(true)}
            disabled={loading || !!error}
          >
            <Plus size={18} aria-hidden="true" />
            Tạo dự án
          </button>
        </div>
        {loading ? (
          <PageSkeleton />
        ) : (
          <>
            <div className="project-summary" aria-label="Thống kê dự án">
              {[
                {
                  label: "Đang làm",
                  count: activeProjects.filter(
                    (project) => project.status === "active",
                  ).length,
                },
                {
                  label: "Hoàn thành",
                  count: activeProjects.filter(
                    (project) => project.status === "completed",
                  ).length,
                },
                {
                  label: "Đã ghim",
                  count: activeProjects.filter((project) => project.pinned)
                    .length,
                },
              ].map(({ label, count }) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
            <div className="project-toolbar">
              <div
                className="project-filters"
                role="group"
                aria-label="Lọc trạng thái"
              >
                {Object.entries(filters).map(([value, label]) => (
                  <button
                    key={value}
                    className={
                      filter === value
                        ? "project-filter selected"
                        : "project-filter"
                    }
                    aria-pressed={filter === value}
                    type="button"
                    onClick={() => {
                      setFilter(value as Filter);
                      setPage(1);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="project-view-controls">
                <div
                  className="project-layout-buttons"
                  role="group"
                  aria-label="Hiển thị dự án"
                >
                  <button
                    type="button"
                    className="button secondary small"
                    aria-pressed={layout === "cards"}
                    onClick={() => setLayout("cards")}
                  >
                    Thẻ
                  </button>
                  <button
                    type="button"
                    className="button secondary small"
                    aria-pressed={layout === "kanban"}
                    onClick={() => setLayout("kanban")}
                  >
                    Kanban
                  </button>
                </div>

                <button
                  type="button"
                  className={
                    pinnedOnly
                      ? "button secondary small selected"
                      : "button secondary small"
                  }
                  aria-pressed={pinnedOnly}
                  onClick={() => {
                    setPinnedOnly(!pinnedOnly);
                    setPage(1);
                  }}
                >
                  <Pin size={15} aria-hidden="true" />
                  Đã ghim
                </button>
              </div>
            </div>
            <p className="project-list-caption">{visible.length} dự án</p>
            {layout === "kanban" ? (
              <div className="project-kanban">
                {Object.entries(projectStatuses).map(([status, label]) => {
                  const column = visible.filter(
                    (project) => project.status === status,
                  );
                  return (
                    <section
                      className="kanban-column"
                      key={status}
                      aria-label={"Kanban " + label}
                      onDragOver={(event) => {
                        if (
                          event.dataTransfer.types.includes("text/myos-project")
                        )
                          event.preventDefault();
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        const project = visible.find(
                          (item) =>
                            item.id ===
                            event.dataTransfer.getData("text/myos-project"),
                        );
                        if (
                          project &&
                          !pending &&
                          !project.archivedAt &&
                          project.status !== status
                        )
                          void run(
                            () =>
                              projectService.setStatus(
                                project,
                                status as Project["status"],
                              ),
                            "Đã chuyển dự án.",
                          );
                      }}
                    >
                      <h2>
                        {label}
                        <span>{column.length}</span>
                      </h2>
                      {column.map(renderCard)}
                      {!column.length && (
                        <p className="kanban-empty">Chưa có dự án</p>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : listed.length ? (
              <div className="project-card-grid">{listed.map(renderCard)}</div>
            ) : (
              !error && (
                <section className="large-empty">
                  <EmptyState
                    icon={FolderKanban}
                    title={
                      projects.length
                        ? "Không có dự án phù hợp"
                        : "Chưa có dự án"
                    }
                  >
                    {!projects.length && (
                      <button
                        type="button"
                        className="button primary"
                        onClick={() => setCreating(true)}
                      >
                        <Plus size={17} aria-hidden="true" />
                        Tạo dự án đầu tiên
                      </button>
                    )}
                  </EmptyState>
                </section>
              )
            )}
            {layout === "cards" && pageCount > 1 && (
              <div className="project-pagination">
                <span>
                  {visible.length} dự án · Trang {currentPage}/{pageCount}
                </span>
                <div>
                  <button
                    type="button"
                    className="button secondary small"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    Trước
                  </button>
                  <button
                    type="button"
                    className="button secondary small"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {creating && (
        <ProjectDialog
          onClose={() => setCreating(false)}
          onSave={projectService.create}
        />
      )}
    </div>
  );
}
