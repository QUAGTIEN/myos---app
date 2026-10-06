"use client";

import {
  Archive,
  ArrowRight,
  CalendarDays,
  FolderKanban,
  Pin,
  PinOff,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  EmptyState,
  FeatureNotice,
  PageHeading,
  PageSkeleton,
} from "@/components/page-ui";

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

export function ProjectsScreen() {
  const { projects, loading, error, pending, message, run, refresh } =
    useProjects();
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

  return (
    <div className="projects-module">
      <PageHeading
        eyebrow="TỪ Ý TƯỞNG ĐẾN KẾT QUẢ"
        title="Dự án"
        description="Một góc riêng cho mục tiêu, nội dung và những bước tiến của bạn."
        action={
          <button
            className="button primary"
            type="button"
            onClick={() => setCreating(true)}
            disabled={loading || !!error}
          >
            <Plus size={18} aria-hidden="true" />
            Tạo dự án
          </button>
        }
      />
      <FeatureNotice>
        Dự án được lưu trên trình duyệt này, chưa đồng bộ tài khoản. Xóa dữ liệu
        trình duyệt sẽ xóa dữ liệu local.
      </FeatureNotice>
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
          {listed.length ? (
            <div className="project-card-grid">
              {listed.map((project) => (
                <article
                  key={project.id}
                  className={
                    "panel project-card project-color-" + project.color
                  }
                >
                  <div className="project-card-top">
                    <span className={"project-status status-" + project.status}>
                      {project.archivedAt
                        ? "Lưu trữ"
                        : projectStatuses[project.status]}
                    </span>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={
                        project.pinned
                          ? "Bỏ ghim " + project.title
                          : "Ghim " + project.title
                      }
                      aria-pressed={project.pinned}
                      disabled={pending}
                      onClick={() =>
                        void run(
                          () => projectService.togglePin(project),
                          project.pinned ? "Đã bỏ ghim." : "Đã ghim dự án.",
                        )
                      }
                    >
                      {project.pinned ? (
                        <PinOff size={17} />
                      ) : (
                        <Pin size={17} />
                      )}
                    </button>
                  </div>
                  <Link
                    className="project-card-main"
                    href={"/projects/" + project.id}
                  >
                    <h2>{project.title}</h2>
                    <p>
                      {project.description ||
                        "Chưa có nội dung. Thêm mục tiêu và những điều cần lưu ý."}
                    </p>
                  </Link>
                  <ProgressIndicator project={project} />
                  <div className="project-card-footer">
                    <span>
                      <CalendarDays size={15} aria-hidden="true" />
                      {project.dueDate
                        ? formatProjectDate(project.dueDate)
                        : "Chưa đặt hạn"}
                    </span>
                    <button
                      type="button"
                      className="icon-button"
                      disabled={pending}
                      aria-label={
                        (project.archivedAt ? "Khôi phục " : "Lưu trữ ") +
                        project.title
                      }
                      onClick={() => archive(project)}
                    >
                      <Archive size={16} />
                    </button>
                  </div>
                  <Link
                    href={"/projects/" + project.id}
                    className="project-card-link"
                  >
                    Mở dự án
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            !error && (
              <section className="panel large-empty">
                <EmptyState
                  icon={FolderKanban}
                  title={
                    projects.length
                      ? "Không có dự án phù hợp"
                      : "Mục tiêu tiếp theo của bạn là gì?"
                  }
                  description={
                    projects.length
                      ? "Thử đổi bộ lọc hoặc từ khóa để tìm lại dự án."
                      : "Bắt đầu một dự án, thêm nội dung và theo dõi tiến độ từng bước."
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
        </>
      )}
      {creating && (
        <ProjectDialog
          onClose={() => setCreating(false)}
          onSave={projectService.create}
        />
      )}
    </div>
  );
}
