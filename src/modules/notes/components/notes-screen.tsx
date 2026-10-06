"use client";
import {
  ImagePlus,
  NotebookPen,
  Pin,
  Search,
  Trash2,
  Folder,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { FeatureNotice } from "@/components/ui/feature-notice";
import { PageHeading } from "@/components/ui/page-heading";
import { PageSkeleton } from "@/components/ui/skeleton";
import {
  emptyNoteInput,
  imageIds,
  noteError,
  noteTime,
  plainText,
} from "../model";
import { noteService } from "../service";
import { useNotes } from "../use-notes";

function searchText(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replaceAll("đ", "d")
    .replaceAll("Đ", "D")
    .toLocaleLowerCase("vi");
}
export function NotesScreen() {
  const { notes, loading, error, refresh } = useNotes();
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("all");
  const [folder, setFolder] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const imageInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const live = notes.filter((note) => !note.trashedAt);
  const folders = [
    ...new Set(live.map((note) => note.folder).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "vi"));
  const tags = [...new Set(live.flatMap((note) => note.tags))].sort((a, b) =>
    a.localeCompare(b, "vi"),
  );
  const filtered = notes
    .filter((note) => {
      if (collection === "trash" ? !note.trashedAt : !!note.trashedAt)
        return false;
      return (
        (collection !== "pinned" || note.pinned) &&
        (!folder || note.folder === folder) &&
        (!tag || note.tags.includes(tag)) &&
        searchText(note.title).includes(searchText(query))
      );
    })
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.updatedAt.localeCompare(a.updatedAt) ||
        a.id.localeCompare(b.id),
    );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pageCount);
  async function create(files: File[] = []) {
    if (pending) return;
    setPending(true);
    setActionError("");
    setSelectedFiles(files);
    try {
      const note = await noteService.create(
        {
          ...emptyNoteInput,
          title: files.length
            ? files[0].name.replace(/\.[^.]+$/, "").slice(0, 120) ||
              "Ghi chú từ ảnh"
            : emptyNoteInput.title,
          folder,
          tags: tag ? [tag] : [],
        },
        files,
      );
      setSelectedFiles([]);
      router.push("/notes/" + note.id);
    } catch (cause) {
      setActionError(noteError(cause));
    } finally {
      setPending(false);
    }
  }
  function selectCollection(value: string) {
    setCollection(value);
    setFolder("");
    setTag("");
    setPage(1);
  }
  return (
    <div className="notes-module">
      <PageHeading
        eyebrow="ĐỪNG ĐỂ Ý TƯỞNG TRÔI MẤT"
        title="Ghi chú"
        description="Giữ lại một suy nghĩ, một tấm hình hay điều bạn muốn nhớ."
        action={
          <button
            className="button primary"
            type="button"
            disabled={loading || !!error || pending}
            onClick={() => {
              void create();
            }}
          >
            <Plus size={18} />
            {pending ? "Đang tạo…" : "Tạo ghi chú"}
          </button>
        }
      />
      <FeatureNotice>
        Nội dung và ảnh lưu trên trình duyệt này, chưa đồng bộ Firebase. Xóa dữ
        liệu trình duyệt sẽ mất ghi chú.
      </FeatureNotice>
      {(error || actionError) && (
        <div className="note-error" role="alert">
          <p>{error || actionError}</p>
          <button
            type="button"
            className="text-link"
            disabled={pending}
            onClick={() => {
              if (selectedFiles.length) void create(selectedFiles);
              else {
                setActionError("");
                refresh();
              }
            }}
          >
            Thử lại
          </button>
        </div>
      )}
      {loading ? (
        <PageSkeleton />
      ) : (
        <div className="note-library">
          <aside
            className="panel note-library-sidebar"
            aria-label="Thư viện ghi chú"
          >
            <h2>Thư viện</h2>
            <button
              type="button"
              className={collection === "all" ? "selected" : ""}
              onClick={() => selectCollection("all")}
            >
              <NotebookPen size={17} />
              Tất cả ghi chú<span>{live.length}</span>
            </button>
            <button
              type="button"
              className={collection === "pinned" ? "selected" : ""}
              onClick={() => selectCollection("pinned")}
            >
              <Pin size={17} />
              Đã ghim<span>{live.filter((note) => note.pinned).length}</span>
            </button>
            <button
              type="button"
              className={collection === "trash" ? "selected" : ""}
              onClick={() => selectCollection("trash")}
            >
              <Trash2 size={17} />
              Thùng rác<span>{notes.length - live.length}</span>
            </button>
            <h3>Thư mục</h3>
            {folders.length ? (
              folders.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={folder === name ? "selected" : ""}
                  onClick={() => {
                    setCollection("all");
                    setFolder(name);
                    setPage(1);
                  }}
                >
                  <Folder size={16} />
                  <span className="note-folder-name">{name}</span>
                </button>
              ))
            ) : (
              <p>Đặt tên thư mục khi mở ghi chú.</p>
            )}
            <h3>Nhãn</h3>
            <div className="note-tag-filter">
              {tags.map((name) => (
                <button
                  type="button"
                  key={name}
                  className={tag === name ? "selected" : ""}
                  onClick={() => {
                    setTag(tag === name ? "" : name);
                    setPage(1);
                  }}
                >
                  #{name}
                </button>
              ))}
              {!tags.length && <p>Thêm nhãn để tìm lại dễ hơn.</p>}
            </div>
          </aside>
          <section className="note-library-main" aria-label="Danh sách ghi chú">
            <div className="note-list-toolbar">
              <label className="note-search">
                <Search size={18} />
                <input
                  type="search"
                  aria-label="Tìm ghi chú theo tiêu đề"
                  placeholder="Tìm theo tiêu đề…"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                />
              </label>
              <button
                className="button secondary"
                type="button"
                disabled={pending || !!error}
                onClick={() => imageInput.current?.click()}
              >
                <ImagePlus size={17} />
                Từ ảnh
              </button>
              <input
                className="sr-only"
                ref={imageInput}
                type="file"
                aria-label="Tạo ghi chú từ ảnh"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                onChange={(event) => {
                  void create(Array.from(event.target.files ?? []));
                }}
              />
            </div>
            <div className="note-list-caption">
              <span>
                {collection === "trash"
                  ? "Thùng rác"
                  : collection === "pinned"
                    ? "Đã ghim"
                    : folder || "Tất cả ghi chú"}
                {tag ? " · #" + tag : ""}
              </span>
              <span>{filtered.length} ghi chú</span>
            </div>
            {!filtered.length ? (
              <section className="panel">
                <EmptyState
                  icon={NotebookPen}
                  title={
                    collection === "trash"
                      ? "Thùng rác đang trống"
                      : "Một trang mới, nhiều điều để viết"
                  }
                  description={
                    query || tag || folder
                      ? "Thử thay bộ lọc hoặc tìm theo tiêu đề khác."
                      : "Tạo ghi chú để giữ nội dung, hình ảnh và những điều bạn muốn nhớ."
                  }
                />
              </section>
            ) : (
              <div className="note-card-grid">
                {filtered
                  .slice((currentPage - 1) * 12, currentPage * 12)
                  .map((note) => (
                    <Link
                      href={"/notes/" + note.id}
                      className="panel note-card"
                      key={note.id}
                    >
                      <div className="note-card-top">
                        <span>{note.folder || "Chưa phân thư mục"}</span>
                        {note.pinned && <Pin size={15} aria-label="Đã ghim" />}
                      </div>
                      <h2>{note.title}</h2>
                      <p className="note-card-preview">
                        {plainText(note.content) || "Chưa có nội dung."}
                      </p>
                      <div className="note-card-tags">
                        {note.tags.map((name) => (
                          <span key={name}>#{name}</span>
                        ))}
                      </div>
                      <div className="note-card-bottom">
                        <time dateTime={note.updatedAt}>
                          {noteTime(note.updatedAt)}
                        </time>
                        {imageIds(note.content).length > 0 && (
                          <span>{imageIds(note.content).length} ảnh</span>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>
            )}
            {pageCount > 1 && (
              <div className="note-pagination">
                <span>
                  Trang {currentPage}/{pageCount}
                </span>
                <button
                  className="button secondary small"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Trước
                </button>
                <button
                  className="button secondary small"
                  type="button"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Sau
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
