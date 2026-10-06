"use client";
import { Link2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { emptyNoteInput, noteError } from "../model";
import { noteService } from "../service";
import { useNotes } from "../use-notes";

export function ProjectNotes({
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
      <p className="project-related-placeholder">
        Liên kết lịch sẽ được bổ sung ở G5.
      </p>
    </section>
  );
}
