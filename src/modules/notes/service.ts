import {
  emptyNoteInput,
  imageIds,
  noteInput,
  noteFingerprint,
  noteInputSchema,
  type Note,
  type NoteInput,
  type Attachment,
} from "./model";
import { localNoteRepository, type NoteRepository } from "./repository";

export async function prepareImages(
  files: File[],
  noteId: string,
): Promise<Attachment[]> {
  if (!files.length || files.length > 20)
    throw new Error("Chọn từ 1 đến 20 ảnh.");
  const attachments: Attachment[] = [];
  for (const file of files) {
    if (
      !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        file.type,
      ) ||
      file.size === 0 ||
      file.size > 5 * 1024 * 1024
    )
      throw new Error(
        "Chỉ nhận PNG, JPEG, WebP hoặc GIF, tối đa 5 MB mỗi ảnh.",
      );
    try {
      const bitmap = await createImageBitmap(file);
      bitmap.close();
    } catch {
      throw new Error(
        "Không đọc được ảnh “" + file.name + "”. Hãy chọn tệp ảnh hợp lệ.",
      );
    }
    attachments.push({
      id: crypto.randomUUID(),
      noteId,
      name: file.name.slice(0, 200),
      blob: file,
    });
  }
  return attachments;
}
export function contentWithImages(
  input: NoteInput,
  attachments: Attachment[],
): NoteInput {
  if (imageIds(input.content).length + attachments.length > 20)
    throw new Error("Một ghi chú hỗ trợ tối đa 20 ảnh.");
  return {
    ...input,
    content: {
      type: "doc",
      content: [
        ...(input.content.content ?? []),
        ...attachments.map((asset) => ({
          type: "localImage",
          attrs: { attachmentId: asset.id, name: asset.name },
        })),
        { type: "paragraph" },
      ],
    },
  };
}
export function createNoteService(repository: NoteRepository) {
  async function write(
    note: Note,
    input: NoteInput,
    changes: Partial<Pick<Note, "pinned" | "trashedAt">> = {},
    attachments: Attachment[] = [],
  ) {
    const parsed = noteInputSchema.parse(input);
    const changed =
      noteFingerprint(noteInput(note)) !== noteFingerprint(parsed);
    const at = new Date().toISOString();
    const revisions = changed
      ? [
          { ...noteInput(note), id: crypto.randomUUID(), at: note.updatedAt },
          ...note.revisions,
        ].slice(0, 20)
      : note.revisions;
    const next: Note = {
      ...note,
      ...parsed,
      ...changes,
      version: note.version + 1,
      updatedAt: at,
      revisions,
    };
    await repository.commit(note, next, attachments);
    return next;
  }
  return {
    async create(input: NoteInput = emptyNoteInput, files: File[] = []) {
      const id = crypto.randomUUID();
      const attachments = files.length ? await prepareImages(files, id) : [];
      const parsed = noteInputSchema.parse(
        attachments.length ? contentWithImages(input, attachments) : input,
      );
      const at = new Date().toISOString();
      const note: Note = {
        ...parsed,
        id,
        schemaVersion: 1,
        version: 1,
        pinned: false,
        trashedAt: null,
        createdAt: at,
        updatedAt: at,
        revisions: [],
      };
      await repository.commit(null, note, attachments);
      return note;
    },
    save(note: Note, input: NoteInput, attachments: Attachment[] = []) {
      if (note.trashedAt)
        throw new Error("Khôi phục ghi chú trước khi chỉnh sửa.");
      return write(note, input, {}, attachments);
    },
    togglePin: (note: Note) =>
      write(note, noteInput(note), { pinned: !note.pinned }),
    toggleTrash: (note: Note) =>
      write(note, noteInput(note), {
        trashedAt: note.trashedAt ? null : new Date().toISOString(),
      }),
    async remove(note: Note) {
      if (!note.trashedAt)
        throw new Error(
          "Chuyển ghi chú vào thùng rác trước khi xóa vĩnh viễn.",
        );
      await repository.commit(note, null);
    },
  };
}
export const noteService = createNoteService(localNoteRepository);
