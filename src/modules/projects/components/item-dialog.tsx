"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  itemInputSchema,
  projectErrorMessage,
  type ItemInput,
  type ProjectItem,
} from "../model";

export function ItemDialog({
  item,
  kind,
  onSave,
  onClose,
}: {
  item?: ProjectItem;
  kind: ItemInput["kind"];
  onSave: (input: ItemInput) => Promise<unknown>;
  onClose: () => void;
}) {
  const initial: ItemInput = {
    title: item?.title ?? "",
    description: item?.description ?? "",
    kind: item?.kind ?? kind,
    dueDate: item?.dueDate ?? "",
    countsTowardProgress: item?.countsTowardProgress ?? kind === "task",
  };
  const [input, setInput] = useState(initial);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [returnFocus] = useState(() =>
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  function close() {
    if (
      !pending &&
      (JSON.stringify(initial) === JSON.stringify(input) ||
        window.confirm("Bỏ các thay đổi chưa lưu?"))
    )
      onClose();
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await onSave(itemInputSchema.parse(input));
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
              <Dialog.Title>
                {item
                  ? "Sửa mục"
                  : kind === "task"
                    ? "Thêm mục checklist"
                    : "Thêm cột mốc"}
              </Dialog.Title>
              <Dialog.Description>
                Mốc không tính vào tiến độ trừ khi bạn chọn rõ.
              </Dialog.Description>
            </div>
            <button
              type="button"
              className="icon-button"
              onClick={close}
              disabled={pending}
              aria-label="Đóng form mục"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={submit}>
            <fieldset disabled={pending} className="project-form-fields">
              <label htmlFor="item-title">
                Tên mục <span>*</span>
              </label>
              <input
                id="item-title"
                required
                maxLength={160}
                autoFocus
                value={input.title}
                onChange={(event) =>
                  setInput({ ...input, title: event.target.value })
                }
              />
              <label htmlFor="item-description">Nội dung mục</label>
              <textarea
                id="item-description"
                rows={3}
                maxLength={2000}
                value={input.description}
                onChange={(event) =>
                  setInput({ ...input, description: event.target.value })
                }
              />
              <label htmlFor="item-due">Hạn của mục</label>
              <input
                id="item-due"
                type="date"
                value={input.dueDate}
                onChange={(event) =>
                  setInput({ ...input, dueDate: event.target.value })
                }
              />
              <label className="project-checkbox-label">
                <input
                  type="checkbox"
                  checked={input.countsTowardProgress}
                  onChange={(event) =>
                    setInput({
                      ...input,
                      countsTowardProgress: event.target.checked,
                    })
                  }
                />
                Tính mục này vào tiến độ
              </label>
            </fieldset>
            {error && (
              <p className="project-alert error" role="alert">
                {error}
              </p>
            )}
            <div className="project-modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={close}
                disabled={pending}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="button primary"
                disabled={pending}
              >
                {pending ? "Đang lưu…" : "Lưu mục"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
