import { z } from "zod";

export type RichNode = {
  type: string;
  text?: string;
  attrs?: Record<string, string | number | boolean | null>;
  marks?: { type: string }[];
  content?: RichNode[];
};
const nodeTypes = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "taskList",
  "taskItem",
  "blockquote",
  "codeBlock",
  "hardBreak",
  "horizontalRule",
  "localImage",
]);
const markTypes = new Set(["bold", "italic", "strike", "underline", "code"]);
const richNodeSchema: z.ZodType<RichNode> = z.lazy(() =>
  z
    .object({
      type: z
        .string()
        .refine(
          (type) => nodeTypes.has(type),
          "Định dạng nội dung chưa được hỗ trợ.",
        ),
      text: z.string().max(100000).optional(),
      attrs: z
        .record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean(), z.null()]),
        )
        .optional(),
      marks: z
        .array(
          z.object({ type: z.string().refine((type) => markTypes.has(type)) }),
        )
        .optional(),
      content: z.array(richNodeSchema).optional(),
    })
    .strict(),
);
export const emptyDocument: RichNode = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
// ProseMirror and Zod serialize object keys in different orders; compare values, not key order.
export function noteFingerprint(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? Object.fromEntries(
          Object.entries(item).sort(([first], [second]) =>
            first.localeCompare(second),
          ),
        )
      : item,
  );
}
export function imageIds(node: RichNode): string[] {
  return [
    ...new Set([
      ...(node.type === "localImage" &&
      typeof node.attrs?.attachmentId === "string"
        ? [node.attrs.attachmentId]
        : []),
      ...(node.content ?? []).flatMap(imageIds),
    ]),
  ];
}
export function plainText(node: RichNode): string {
  if (node.type === "localImage") return "[Ảnh]";
  if (node.text) return node.text;
  return (node.content ?? [])
    .map(plainText)
    .join(node.type === "paragraph" || node.type === "heading" ? "" : " ");
}
const contentSchema = richNodeSchema.refine(
  (node) =>
    node.type === "doc" &&
    JSON.stringify(node).length <= 300000 &&
    imageIds(node).length <= 20,
  "Nội dung tối đa 300.000 ký tự và 20 ảnh.",
);
export const noteInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tên ghi chú không được để trống.")
    .max(120, "Tên ghi chú tối đa 120 ký tự."),
  content: contentSchema,
  folder: z.string().trim().max(60, "Tên thư mục tối đa 60 ký tự."),
  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(10, "Tối đa 10 nhãn, mỗi nhãn 30 ký tự."),
  projectIds: z.array(z.string().uuid()).max(20),
});
export const revisionSchema = noteInputSchema.extend({
  id: z.string().uuid(),
  at: z.string().datetime(),
});
export const noteSchema = noteInputSchema.extend({
  id: z.string().uuid(),
  schemaVersion: z.literal(1),
  version: z.number().int().positive(),
  pinned: z.boolean(),
  trashedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  revisions: z.array(revisionSchema).max(20),
});
export type NoteInput = z.infer<typeof noteInputSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Revision = z.infer<typeof revisionSchema>;
export type Attachment = {
  id: string;
  noteId: string;
  name: string;
  blob: Blob;
};
export const notesChangedEvent = "myos:notes-changed";
export const emptyNoteInput: NoteInput = {
  title: "Ghi chú mới",
  content: emptyDocument,
  folder: "",
  tags: [],
  projectIds: [],
};
export function noteInput(note: Note): NoteInput {
  const { title, content, folder, tags, projectIds } = note;
  return { title, content, folder, tags, projectIds };
}
export function noteError(error: unknown): string {
  if (error instanceof DOMException)
    return error.name === "QuotaExceededError"
      ? "Không đủ dung lượng lưu. Bản nháp vẫn được giữ; thử lại hoặc sao chép nội dung."
      : "Không truy cập được dữ liệu local. Kiểm tra quyền lưu trữ của trình duyệt.";
  if (error instanceof z.ZodError)
    return error.issues[0]?.message ?? "Nội dung không hợp lệ.";
  return error instanceof Error
    ? error.message
    : "Chưa lưu được ghi chú. Bản nháp vẫn được giữ.";
}
export function noteTime(at: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(at));
}
