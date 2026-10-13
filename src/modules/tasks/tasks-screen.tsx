"use client";

import { useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeading, PageSkeleton } from "@/components/page-ui";
import { useTasks } from "./use-tasks";
import type { Task } from "./model";
import "./tasks.css";

export function TasksScreen() {
  const data = useTasks();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [editing, setEditing] = useState<{ id: string; title: string } | null>(
    null,
  );
  const [deleting, setDeleting] = useState<Task | null>(null);
  const open = data.tasks.filter((task) => !task.completed);
  const done = data.tasks.filter((task) => task.completed);
  const matches = (task: Task) =>
    task.title
      .toLocaleLowerCase("vi")
      .includes(query.trim().toLocaleLowerCase("vi"));
  const activeTasks = open.filter(matches);
  const completedTasks = done.filter(matches);
  async function create(event: FormEvent) {
    event.preventDefault();
    const submitted = title;
    if (await data.create(submitted)) {
      setTitle((current) => (current === submitted ? "" : current));
      inputRef.current?.focus();
    }
  }
  function row(task: Task) {
    const busy = data.pending.includes(task.id);
    return (
      <li
        key={task.id}
        className={"task-row" + (task.completed ? " task-row-done" : "")}
        aria-busy={busy}
      >
        <input
          id={"task-" + task.id}
          type="checkbox"
          checked={task.completed}
          disabled={busy}
          aria-label={(task.completed ? "Mở lại " : "Hoàn thành ") + task.title}
          onChange={() => void data.toggle(task)}
        />
        {editing?.id === task.id ? (
          <form
            className="task-edit"
            onSubmit={async (event) => {
              event.preventDefault();
              if (await data.rename(task, editing.title)) setEditing(null);
            }}
          >
            <Input
              autoFocus
              aria-label="Tên công việc"
              maxLength={200}
              value={editing.title}
              onChange={(event) =>
                setEditing({ id: task.id, title: event.target.value })
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") setEditing(null);
              }}
              disabled={busy}
            />
            <Button
              type="submit"
              size="sm"
              disabled={busy || !editing.title.trim()}
            >
              {busy ? "Đang lưu…" : "Lưu"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => setEditing(null)}
            >
              Hủy
            </Button>
          </form>
        ) : (
          <>
            <label htmlFor={"task-" + task.id} className="task-title">
              {task.title}
            </label>
            <div className="task-actions">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                title="Sửa tên"
                aria-label={"Sửa " + task.title}
                disabled={busy}
                onClick={() => setEditing({ id: task.id, title: task.title })}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                title="Xóa công việc"
                aria-label={"Xóa " + task.title}
                disabled={busy}
                onClick={() => setDeleting(task)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </>
        )}
      </li>
    );
  }
  return (
    <div className="tasks-screen">
      <PageHeading title="Công việc" />
      <Card className="tasks-workspace">
        <div className="tasks-heading">
          <h2>Danh sách công việc</h2>
          <span aria-live="polite">
            {data.loading ? "Đang tải…" : open.length + " việc cần làm"}
          </span>
        </div>
        <form className="task-create" onSubmit={(event) => void create(event)}>
          <label className="sr-only" htmlFor="new-task">
            Công việc mới
          </label>
          <Input
            ref={inputRef}
            id="new-task"
            placeholder="Thêm việc cần nhớ…"
            value={title}
            maxLength={200}
            onChange={(event) => setTitle(event.target.value)}
            disabled={data.pending.includes("create")}
          />
          <Button
            type="submit"
            disabled={
              !data.ready || data.pending.includes("create") || !title.trim()
            }
          >
            {data.pending.includes("create") ? "Đang thêm…" : "Thêm việc"}
          </Button>
        </form>
        <div className="tasks-toolbar">
          <div
            className="tasks-filters"
            role="group"
            aria-label="Lọc công việc"
          >
            {(
              [
                ["all", "Tất cả"],
                ["open", "Cần làm"],
                ["done", "Đã xong"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                variant="ghost"
                size="sm"
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <Input
            className="task-search"
            aria-label="Tìm công việc"
            placeholder="Tìm công việc…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {data.error && (
          <div className="tasks-error" role="alert">
            <p>{data.error}</p>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={data.refresh}
            >
              Thử tải lại
            </Button>
          </div>
        )}
        {data.loading ? (
          <PageSkeleton variant="list" />
        ) : (
          <>
            {filter !== "done" && activeTasks.length > 0 && (
              <ul className="task-list">{activeTasks.map(row)}</ul>
            )}
            {filter !== "open" && completedTasks.length > 0 && (
              <div className="tasks-completed">
                {filter === "all" && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="tasks-completed-toggle"
                    aria-expanded={showCompleted || !!query.trim()}
                    aria-controls="completed-tasks"
                    onClick={() => setShowCompleted((value) => !value)}
                  >
                    <ChevronDown
                      size={16}
                      className={
                        showCompleted || query.trim() ? "expanded" : ""
                      }
                    />
                    Đã xong ({completedTasks.length})
                  </Button>
                )}
                <ul
                  id="completed-tasks"
                  className="task-list"
                  hidden={filter === "all" && !showCompleted && !query.trim()}
                >
                  {completedTasks.map(row)}
                </ul>
              </div>
            )}
            {!data.error &&
              ((filter === "done" && !completedTasks.length) ||
                (filter === "open" && !activeTasks.length) ||
                (filter === "all" &&
                  !activeTasks.length &&
                  !completedTasks.length)) && (
                <div className="tasks-empty">
                  <h3>
                    {query.trim()
                      ? "Không tìm thấy công việc"
                      : filter === "done"
                        ? "Chưa có việc đã xong"
                        : filter === "open"
                          ? "Bạn đã hoàn thành mọi việc"
                          : "Chưa có công việc"}
                  </h3>
                  <p>
                    {query.trim()
                      ? "Thử tìm bằng nội dung khác."
                      : "Ghi nhanh việc cần nhớ ở ô phía trên."}
                  </p>
                </div>
              )}
          </>
        )}
      </Card>
      <Dialog.Root
        open={!!deleting}
        onOpenChange={(value) => {
          if (!value && !data.pending.includes(deleting?.id ?? ""))
            setDeleting(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="task-dialog-overlay" />
          <Dialog.Content
            className="task-delete-dialog"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              inputRef.current?.focus();
            }}
          >
            <Dialog.Title>Xóa công việc?</Dialog.Title>
            <Dialog.Description>
              “{deleting?.title}” sẽ được xóa khỏi danh sách.
            </Dialog.Description>
            {data.error && (
              <p role="alert" className="tasks-error">
                {data.error}
              </p>
            )}
            <div className="task-dialog-actions">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={data.pending.includes(deleting?.id ?? "")}
                >
                  Hủy
                </Button>
              </Dialog.Close>
              <Button
                type="button"
                variant="destructive"
                disabled={data.pending.includes(deleting?.id ?? "")}
                onClick={async () => {
                  if (deleting && (await data.remove(deleting)))
                    setDeleting(null);
                }}
              >
                {data.pending.includes(deleting?.id ?? "")
                  ? "Đang xóa…"
                  : "Xóa công việc"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
