"use client";
import {
  ArrowLeft,
  Check,
  Clock3,
  Copy,
  History,
  Link2,
  Pin,
  PinOff,
  RotateCcw,
  Save,
  Trash2,
  NotebookPen,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PageSkeleton, EmptyState } from "@/components/page-ui";

import { useProjects } from "@/modules/projects/use-projects";
import {
  noteError,
  noteTime,
  plainText,
  type Note,
  type Revision,
} from "../model";
import { noteService } from "../service";
import { useNotes, useNoteDraft } from "../hooks";

import { RichEditor } from "./rich-editor";
import { NoteHistory } from "./note-history";
import { RelatedCalendar } from "@/modules/calendar/components/related-calendar";

export function NoteDetailScreen({ noteId }: { noteId: string }) {
  const { note, loading, error, refresh } = useNotes(noteId);
  const lastNote = useRef<Note | null>(null);
  if (note) lastNote.current = note;
  if (loading) return <PageSkeleton />;
  if (!note && lastNote.current)
    return (
      <NoteWorkspace
        key={lastNote.current.id}
        note={lastNote.current}
        readError={
          error ||
          "Ghi chú đã bị xóa ở tab khác. Bản nháp đang mở vẫn được giữ; sao chép nội dung trước khi rời trang."
        }
      />
    );
  if (!note)
    return (
      <section className="panel">
        <EmptyState
          icon={NotebookPen}
          title={
            error
              ? "Chưa thể mở ghi chú"
              : "Không tìm thấy ghi chú trên trình duyệt này"
          }
          description={
            error ||
            "Ghi chú có thể nằm ở trình duyệt hoặc địa chỉ khác, chưa đồng bộ tài khoản."
          }
        >
          <Link className="button secondary" href="/notes">
            Về Ghi chú
          </Link>
          {error && (
            <button
              type="button"
              className="button secondary"
              onClick={refresh}
            >
              Thử lại
            </button>
          )}
        </EmptyState>
      </section>
    );
  return <NoteWorkspace key={note.id} note={note} readError={error} />;
}
function NoteWorkspace({ note, readError }: { note: Note; readError: string }) {
  const session = useNoteDraft(note);
  const { draft, base, change, status } = session;
  const { projects, error: projectError } = useProjects();
  const { notes } = useNotes();
  const [showHistory, setShowHistory] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionPending, setActionPending] = useState(false);
  const [tagText, setTagText] = useState(draft.tags.join(", "));
  const tagInput = useRef<HTMLInputElement>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const router = useRouter();
  const readonly = !!base.trashedAt;
  const locked = session.busy || actionPending;
  useEffect(() => {
    if (document.activeElement !== tagInput.current)
      setTagText(draft.tags.join(", "));
  }, [draft.tags]);
  async function run(action: "pin" | "trash" | "delete") {
    if (locked) return;
    if (
      action === "delete" &&
      !window.confirm(
        "Xóa vĩnh viễn ghi chú, ảnh và toàn bộ lịch sử? Không thể khôi phục.",
      )
    )
      return;
    if (
      action === "trash" &&
      !readonly &&
      !window.confirm(
        "Chuyển ghi chú vào thùng rác? Nội dung và ảnh vẫn được giữ để khôi phục.",
      )
    )
      return;
    setActionPending(true);
    setActionError("");
    try {
      const saved = readonly ? base : await session.save();
      if (action === "delete") {
        await noteService.remove(saved);
        router.push("/notes");
      } else
        session.accept(
          await (action === "pin"
            ? noteService.togglePin(saved)
            : noteService.toggleTrash(saved)),
        );
    } catch (cause) {
      setActionError(noteError(cause));
    } finally {
      setActionPending(false);
    }
  }
  async function restore(revision: Revision) {
    setActionPending(true);
    setActionError("");
    try {
      await session.save();
      change({
        title: revision.title,
        content: revision.content,
        folder: revision.folder,
        tags: revision.tags,
        projectIds: revision.projectIds,
      });
      setShowHistory(false);
    } catch (cause) {
      setActionError(noteError(cause));
    } finally {
      setActionPending(false);
    }
  }
  const errors = session.error || actionError || readError;
  return (
    <div className="notes-module">
      <Link className="note-back" href="/notes">
        <ArrowLeft size={17} />
        Tất cả ghi chú
      </Link>
      <div className="note-workspace-heading">
        <div>
          <h1>{base.title}</h1>
          {readonly && <p className="note-local-caption">Trong thùng rác</p>}
        </div>
        <div className="note-document-actions">
          <button
            className="button secondary small"
            type="button"
            disabled={locked || readonly}
            onClick={() => {
              void run("pin");
            }}
          >
            {base.pinned ? <PinOff size={16} /> : <Pin size={16} />}
            {base.pinned ? "Bỏ ghim" : "Ghim"}
          </button>
          <button
            className="button secondary small"
            type="button"
            disabled={locked}
            onClick={() => setShowHistory(true)}
          >
            <History size={16} />
            Lịch sử
          </button>
          <button
            className="button secondary small"
            type="button"
            disabled={locked}
            onClick={() => {
              void run("trash");
            }}
          >
            {readonly ? <RotateCcw size={16} /> : <Trash2 size={16} />}
            {readonly ? "Khôi phục" : "Thùng rác"}
          </button>
          {readonly && (
            <button
              className="button secondary small note-danger"
              type="button"
              disabled={locked}
              onClick={() => {
                void run("delete");
              }}
            >
              Xóa vĩnh viễn
            </button>
          )}
        </div>
      </div>
      {errors && (
        <div className="note-error" role="alert">
          <p>{errors}</p>
          <div className="note-error-actions">
            <button
              type="button"
              className="button secondary small"
              disabled={locked}
              onClick={() => {
                session.reload(note);
                setActionError("");
              }}
            >
              Tải bản mới
            </button>
            <button
              type="button"
              className="button secondary small"
              onClick={() => {
                void navigator.clipboard
                  .writeText(draft.title + "\n\n" + plainText(draft.content))
                  .then(
                    () => setCopyMessage("Đã sao chép văn bản bản nháp."),
                    () =>
                      setCopyMessage(
                        "Không sao chép được. Hãy chọn nội dung và sao chép thủ công.",
                      ),
                  );
              }}
            >
              <Copy size={15} />
              Sao chép bản nháp
            </button>
          </div>
          {copyMessage && <p role="status">{copyMessage}</p>}
        </div>
      )}
      <div className="note-workspace-grid">
        <section className="panel note-document">
          <div className="note-save-bar">
            <span
              role="status"
              className={status === "Lưu lỗi" ? "note-save-error" : ""}
            >
              {status === "Đã lưu" ? <Check size={16} /> : <Clock3 size={16} />}
              {readonly ? "Chỉ đọc" : status}
            </span>
            {!readonly && (
              <button
                className="button secondary small"
                type="button"
                disabled={locked}
                onClick={() => {
                  void session.save().catch(() => {});
                }}
              >
                <Save size={15} />
                Lưu ngay
              </button>
            )}
          </div>
          <label htmlFor="note-title" className="sr-only">
            Tiêu đề ghi chú
          </label>
          <input
            id="note-title"
            className="note-title-input"
            maxLength={120}
            disabled={readonly || actionPending}
            value={draft.title}
            onChange={(event) =>
              change({ ...draft, title: event.target.value })
            }
            placeholder="Tiêu đề ghi chú"
          />
          <RichEditor
            noteId={base.id}
            content={draft.content}
            onChange={(content) => change({ ...draft, content })}
            onUpload={session.upload}
            assets={session.assets}
            readOnly={readonly || actionPending}
          />
          <div className="note-document-footer">
            <span>{plainText(draft.content).length} ký tự văn bản</span>
            <span>Cập nhật {noteTime(base.updatedAt)}</span>
          </div>
        </section>
        <aside className="note-properties">
          <section className="panel note-property-panel">
            <h2>Tổ chức ghi chú</h2>
            <label htmlFor="note-folder">Thư mục</label>
            <input
              id="note-folder"
              maxLength={60}
              list="note-folders"
              disabled={readonly || actionPending}
              value={draft.folder}
              placeholder="Ví dụ: Cá nhân"
              onChange={(event) =>
                change({ ...draft, folder: event.target.value })
              }
            />
            <datalist id="note-folders">
              {[
                ...new Set(notes.map((item) => item.folder).filter(Boolean)),
              ].map((folder) => (
                <option value={folder} key={folder} />
              ))}
            </datalist>
            <label htmlFor="note-tags">Nhãn</label>
            <input
              ref={tagInput}
              id="note-tags"
              disabled={readonly || actionPending}
              value={tagText}
              placeholder="ý tưởng, học tập"
              onChange={(event) => {
                setTagText(event.target.value);
                change({
                  ...draft,
                  tags: [
                    ...new Set(
                      event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    ),
                  ],
                });
              }}
            />
          </section>
          <section className="panel note-property-panel">
            <h2>
              <Link2 size={17} />
              Dự án liên quan
            </h2>
            {projectError ? (
              <p className="note-field-hint">{projectError}</p>
            ) : !projects.length ? (
              <p className="note-field-hint">Chưa có dự án.</p>
            ) : (
              <div className="note-project-options">
                {projects
                  .filter(
                    (project) =>
                      !project.archivedAt ||
                      draft.projectIds.includes(project.id),
                  )
                  .map((project) => (
                    <div key={project.id}>
                      <label>
                        <input
                          type="checkbox"
                          disabled={readonly || actionPending}
                          checked={draft.projectIds.includes(project.id)}
                          onChange={(event) =>
                            change({
                              ...draft,
                              projectIds: event.target.checked
                                ? [...draft.projectIds, project.id]
                                : draft.projectIds.filter(
                                    (id) => id !== project.id,
                                  ),
                            })
                          }
                        />
                        {project.title}
                        {project.archivedAt ? " (lưu trữ)" : ""}
                      </label>
                      <Link
                        href={"/projects/" + project.id}
                        aria-label={"Mở dự án " + project.title}
                      >
                        Mở
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </section>
          <RelatedCalendar kind="note" id={base.id} readonly={readonly} />
        </aside>
      </div>
      {showHistory && (
        <NoteHistory
          note={base}
          onClose={() => setShowHistory(false)}
          onRestore={(revision) => {
            void restore(revision);
          }}
        />
      )}
    </div>
  );
}
