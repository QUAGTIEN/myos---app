"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import * as Dialog from "@radix-ui/react-dialog";
import { LoaderCircle, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  emptyProjectInput,
  projectColors,
  projectErrorMessage,
  projectInputSchema,
  projectStatuses,
  type Project,
  type ProjectInput,
} from "../model";

export function ProjectDialog({
  project,
  onSave,
  onClose,
}: {
  project?: Project;
  onSave: (input: ProjectInput) => Promise<unknown>;
  onClose: () => void;
}) {
  const initial: ProjectInput = project
    ? {
        title: project.title,
        description: project.description,
        status: project.status,
        color: project.color,
        startDate: project.startDate,
        dueDate: project.dueDate,
        progressMode: project.progressMode,
        manualProgress: project.manualProgress,
      }
    : { ...emptyProjectInput };
  const [input, setInput] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [returnFocus] = useState(() =>
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const dirty = JSON.stringify(input) !== JSON.stringify(initial);
  function close() {
    if (!pending && (!dirty || window.confirm("Bỏ các thay đổi chưa lưu?")))
      onClose();
  }
  function field<K extends keyof ProjectInput>(
    name: K,
    value: ProjectInput[K],
  ) {
    setInput((current) => ({ ...current, [name]: value }));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);
    try {
      await onSave(projectInputSchema.parse(input));
      onClose();
    } catch (cause) {
      setError(projectErrorMessage(cause));
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="project-modal-overlay" />
        <Dialog.Content
          className="project-modal"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus?.focus();
          }}
          onEscapeKeyDown={(event) => {
            if (pending) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (pending) event.preventDefault();
          }}
        >
          <div className="project-modal-heading">
            <div>
              <Dialog.Title>{project ? "Sửa dự án" : "Tạo dự án"}</Dialog.Title>
              <Dialog.Description className="sr-only">
                Một mục tiêu rõ ràng, từng bước tiến cụ thể.
              </Dialog.Description>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="icon-button"
              onClick={close}
              disabled={pending}
              aria-label="Đóng form dự án"
            >
              <X size={20} />
            </Button>
          </div>
          <form onSubmit={submit}>
            <fieldset disabled={pending} className="project-form-fields">
              <label htmlFor="project-title">
                Tên dự án <span>*</span>
              </label>
              <Input
                id="project-title"
                required
                maxLength={120}
                value={input.title}
                onChange={(event) => field("title", event.target.value)}
                placeholder="Ví dụ: Hoàn thiện website cá nhân"
                autoFocus
              />
              <label htmlFor="project-description">Nội dung</label>
              <Textarea
                id="project-description"
                rows={4}
                maxLength={20000}
                value={input.description}
                onChange={(event) => field("description", event.target.value)}
                placeholder="Mục tiêu, ý tưởng và những điều cần lưu ý…"
              />
              <div className="project-form-grid">
                <div>
                  <label htmlFor="project-status">Trạng thái</label>
                  <select
                    id="project-status"
                    value={input.status}
                    onChange={(event) =>
                      field(
                        "status",
                        event.target.value as ProjectInput["status"],
                      )
                    }
                  >
                    {Object.entries(projectStatuses).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="project-color">Màu đánh dấu</label>
                  <select
                    id="project-color"
                    value={input.color}
                    onChange={(event) =>
                      field(
                        "color",
                        event.target.value as ProjectInput["color"],
                      )
                    }
                  >
                    {Object.entries(projectColors).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="project-start">Ngày bắt đầu</label>
                  <Input
                    id="project-start"
                    type="date"
                    value={input.startDate}
                    onChange={(event) => field("startDate", event.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="project-due">Hạn dự kiến</label>
                  <Input
                    id="project-due"
                    type="date"
                    min={input.startDate || undefined}
                    value={input.dueDate}
                    onChange={(event) => field("dueDate", event.target.value)}
                  />
                </div>
              </div>
              <label htmlFor="project-mode">Cách tính tiến độ</label>
              <select
                id="project-mode"
                value={input.progressMode}
                onChange={(event) =>
                  field(
                    "progressMode",
                    event.target.value as ProjectInput["progressMode"],
                  )
                }
              >
                <option value="manual">Nhập thủ công</option>
                <option value="checklist">Theo checklist</option>
              </select>
              {input.progressMode === "manual" && (
                <>
                  <label htmlFor="project-progress">Tiến độ (%)</label>
                  <Input
                    id="project-progress"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    required
                    value={
                      Number.isNaN(input.manualProgress)
                        ? ""
                        : input.manualProgress
                    }
                    onChange={(event) =>
                      field(
                        "manualProgress",
                        event.target.value === ""
                          ? NaN
                          : Number(event.target.value),
                      )
                    }
                  />
                </>
              )}
            </fieldset>
            {error && (
              <p className="project-alert error" role="alert">
                {error}
              </p>
            )}
            <div className="project-modal-actions">
              <Button
                variant="outline"
                size="default"
                type="button"
                className="button secondary"
                onClick={close}
                disabled={pending}
              >
                Hủy
              </Button>
              <Button
                variant="default"
                size="default"
                type="submit"
                className="button primary"
                disabled={pending}
              >
                {pending && (
                  <LoaderCircle
                    size={17}
                    className="project-spinner"
                    aria-hidden="true"
                  />
                )}
                {pending ? "Đang lưu…" : project ? "Lưu thay đổi" : "Tạo dự án"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
