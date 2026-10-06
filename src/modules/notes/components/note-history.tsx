"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { noteTime, type Note, type Revision } from "../model";
import { RichEditor } from "./rich-editor";

export function NoteHistory({
  note,
  onRestore,
  onClose,
}: {
  note: Note;
  onRestore: (revision: Revision) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(note.revisions[0]);
  const [returnFocus] = useState(() =>
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="note-modal-overlay" />
        <Dialog.Content
          className="note-history-modal"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus?.focus();
          }}
        >
          <div className="note-history-heading">
            <div>
              <Dialog.Title>Lịch sử phiên bản</Dialog.Title>
              <Dialog.Description className="sr-only">
                Giữ 20 phiên bản trước gần nhất, gồm nội dung và ảnh.
              </Dialog.Description>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="Đóng lịch sử"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          {!selected ? (
            <p>
              Chưa có phiên bản trước. Lịch sử xuất hiện khi nội dung được lưu
              thay đổi.
            </p>
          ) : (
            <>
              <label htmlFor="note-revision">Chọn phiên bản</label>
              <select
                id="note-revision"
                value={selected.id}
                onChange={(event) =>
                  setSelected(
                    note.revisions.find(
                      (revision) => revision.id === event.target.value,
                    )!,
                  )
                }
              >
                {note.revisions.map((revision, index) => (
                  <option value={revision.id} key={revision.id}>
                    {index + 1}. {noteTime(revision.at)} · {revision.title}
                  </option>
                ))}
              </select>
              <section className="note-history-preview">
                <h2>{selected.title}</h2>
                <RichEditor
                  key={selected.id}
                  noteId={note.id}
                  content={selected.content}
                  readOnly
                />
              </section>
              <button
                className="button primary"
                type="button"
                disabled={!!note.trashedAt}
                onClick={() => {
                  if (
                    window.confirm(
                      "Khôi phục phiên bản này? Nội dung hiện tại sẽ được giữ trong lịch sử sau khi lưu.",
                    )
                  )
                    onRestore(selected);
                }}
              >
                Khôi phục phiên bản
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
