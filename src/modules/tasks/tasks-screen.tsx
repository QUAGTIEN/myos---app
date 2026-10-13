"use client";

import { useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeading, PageSkeleton } from "@/components/page-ui";
import { useTasks } from "./use-tasks";
import type { Task, TaskInput } from "./model";
import "./tasks.css";

export function TasksScreen() {
  const data = useTasks();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"open" | "done">("open");
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const open = data.tasks.filter((task) => !task.completed);
  const done = data.tasks.filter((task) => task.completed);
  const matches = (task: Task) =>
    task.title
      .toLocaleLowerCase("vi")
      .includes(query.trim().toLocaleLowerCase("vi"));
  const activeTasks = open.filter(matches);
  const completedTasks = done.filter(matches);
  const visibleTasks = filter === "open" ? activeTasks : completedTasks;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  function closeCreate() {
    setCreating(false);
    requestAnimationFrame(() => addButtonRef.current?.focus());
  }
  function closeEdit(id: string) {
    setEditing(null);
    requestAnimationFrame(() =>
      document.getElementById("edit-task-" + id)?.focus(),
    );
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
          disabled={busy || editing?.id === task.id}
          aria-label={(task.completed ? "Mở lại " : "Hoàn thành ") + task.title}
          onChange={() => void data.toggle(task)}
        />
        {editing?.id === task.id ? (
          <TaskForm
            key={task.id}
            task={editing}
            busy={busy}
            onCancel={() => closeEdit(task.id)}
            onSave={async (input) => {
              if (await data.edit(editing, input)) closeEdit(task.id);
            }}
          />
        ) : (
          <>
            <div className="task-content">
              <label htmlFor={"task-" + task.id} className="task-title">
                {task.title}
              </label>
              {task.dueDate && (
                <time
                  dateTime={task.dueDate}
                  className={
                    "task-deadline" +
                    (!task.completed && task.dueDate < today ? " overdue" : "")
                  }
                >
                  {!task.completed && task.dueDate < today
                    ? "Quá hạn · "
                    : "Hạn "}
                  {task.dueDate.split("-").reverse().join("/")}
                </time>
              )}
            </div>
            <div className="task-actions">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                id={"edit-task-" + task.id}
                title="Sửa công việc và deadline"
                aria-label={"Sửa " + task.title}
                onClick={() => setEditing(task)}
                disabled={busy || !!editing || creating}
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
          <div className="tasks-heading-actions">
            <span aria-live="polite">
              {data.loading ? "Đang tải…" : open.length + " việc cần làm"}
            </span>
            <Button
              ref={addButtonRef}
              type="button"
              disabled={!data.ready || creating || !!editing}
              onClick={() => {
                setCreating(true);
                setFilter("open");
                setQuery("");
              }}
            >
              Thêm việc
            </Button>
          </div>
        </div>
        {creating && (
          <TaskForm
            busy={data.pending.includes("create")}
            onCancel={closeCreate}
            onSave={async (input) => {
              if (await data.create(input)) {
                closeCreate();
                setFilter("open");
                setQuery("");
              }
            }}
          />
        )}
        <div className="tasks-toolbar">
          <div
            className="tasks-filters"
            role="group"
            aria-label="Lọc công việc"
          >
            {(
              [
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
                disabled={!!editing}
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
            disabled={!!editing}
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
            {visibleTasks.length > 0 && (
              <ul className="task-list">{visibleTasks.map(row)}</ul>
            )}
            {!data.error && !visibleTasks.length && !creating && (
              <div className="tasks-empty">
                <h3>
                  {query.trim()
                    ? "Không tìm thấy công việc"
                    : filter === "done"
                      ? "Chưa có việc đã xong"
                      : done.length
                        ? "Bạn đã hoàn thành mọi việc"
                        : "Chưa có công việc"}
                </h3>
                <p>
                  {query.trim()
                    ? "Thử tìm bằng nội dung khác."
                    : "Bấm Thêm việc để nhập công việc mới."}
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
              addButtonRef.current?.focus();
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

function TaskForm({
  task,
  busy,
  onSave,
  onCancel,
}: {
  task?: Task;
  busy: boolean;
  onSave: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const prefix = task?.id ?? "new-task";
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!busy && title.trim())
      await onSave({ title, dueDate: dueDate || null });
  }
  return (
    <form
      className="task-form"
      onSubmit={(event) => void submit(event)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !busy) {
          event.preventDefault();
          onCancel();
        }
      }}
      aria-label={task ? "Sửa công việc" : "Thêm công việc"}
    >
      <div className="task-form-fields">
        <label htmlFor={prefix + "-title"}>
          Tên công việc
          <Input
            autoFocus
            id={prefix + "-title"}
            placeholder="Nhập việc cần nhớ…"
            maxLength={200}
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={busy}
          />
        </label>
        <label htmlFor={prefix + "-deadline"}>
          Deadline (tùy chọn)
          <Input
            id={prefix + "-deadline"}
            type="date"
            min="0001-01-01"
            max="9999-12-31"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={busy}
          />
        </label>
      </div>
      <div className="task-form-actions">
        {dueDate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => setDueDate("")}
          >
            Bỏ deadline
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button type="submit" size="sm" disabled={busy || !title.trim()}>
          {busy ? "Đang lưu…" : "Lưu"}
        </Button>
      </div>
    </form>
  );
}
