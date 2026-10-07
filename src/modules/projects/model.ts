import { z } from "zod";

export const projectStatuses = {
  active: "Đang làm",
  paused: "Tạm dừng",
  completed: "Hoàn thành",
} as const;
export const projectColors = {
  turquoise: "Xanh ngọc",
  blue: "Xanh dương",
  amber: "Vàng ấm",
  rose: "Hồng",
} as const;

const dateOnly = z.string().refine((value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T12:00:00Z");
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}, "Ngày không hợp lệ.");

export const projectInputSchema = z
  .object({
    title: z.string().trim().min(1, "Vui lòng nhập tên dự án.").max(120),
    description: z.string().max(20000, "Nội dung tối đa 20.000 ký tự."),
    status: z.enum(["active", "paused", "completed"]),
    color: z.enum(["turquoise", "blue", "amber", "rose"]),
    startDate: dateOnly,
    dueDate: dateOnly,
    progressMode: z.enum(["manual", "checklist"]),
    manualProgress: z.number().int().min(0).max(100),
  })
  .refine(
    (input) =>
      !input.startDate || !input.dueDate || input.startDate <= input.dueDate,
    {
      message: "Hạn dự kiến phải bằng hoặc sau ngày bắt đầu.",
      path: ["dueDate"],
    },
  );

export const itemInputSchema = z.object({
  title: z.string().trim().min(1, "Vui lòng nhập tên mục.").max(160),
  description: z.string().max(2000),
  kind: z.enum(["task", "milestone"]),
  dueDate: dateOnly,
  countsTowardProgress: z.boolean(),
});

const itemSchema = itemInputSchema.extend({
  id: z.string().uuid(),
  completed: z.boolean(),
});
const updateSchema = z.object({
  id: z.string().uuid(),
  message: z.string().max(300),
  at: z.string().datetime(),
});
export const workspaceSchema = z.object({
  goal: z.string().max(20000).default(""),
  documents: z
    .array(
      z.object({
        id: z.string().uuid(),
        title: z.string().trim().min(1).max(120),
        content: z.string().max(40000),
      }),
    )
    .max(50)
    .default([]),
  resources: z
    .array(
      z.object({
        id: z.string().uuid(),
        title: z.string().trim().min(1).max(120),
        url: z
          .string()
          .url()
          .max(2000)
          .refine(
            (value) => /^https?:\/\//i.test(value),
            "Chỉ dùng liên kết HTTP hoặc HTTPS.",
          ),
      }),
    )
    .max(100)
    .default([]),
  hardwareEnabled: z.boolean().default(false),
  hardware: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string().trim().min(1).max(120),
        specification: z.string().max(2000),
        quantity: z.number().int().min(1).max(100000),
        unitPrice: z.number().min(0).max(1e12),
      }),
    )
    .max(100)
    .default([]),
  journal: z
    .array(
      z.object({
        id: z.string().uuid(),
        title: z.string().trim().min(1).max(120),
        content: z.string().max(20000),
        result: z.enum(["log", "passed", "failed"]),
        at: z.string().datetime(),
      }),
    )
    .max(200)
    .default([]),
  attachments: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255),
        size: z
          .number()
          .int()
          .min(0)
          .max(20 * 1024 * 1024),
        type: z.string().max(255),
      }),
    )
    .max(50)
    .default([]),
});
export type ProjectWorkspace = z.infer<typeof workspaceSchema>;
export const projectSchema = z
  .object({
    ...projectInputSchema.shape,
    id: z.string().uuid(),
    schemaVersion: z.literal(1),
    version: z.number().int().positive(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    archivedAt: z.string().datetime().nullable(),
    pinned: z.boolean(),
    items: z.array(itemSchema).max(200),
    updates: z.array(updateSchema).max(100),
    relatedNoteIds: z.array(z.string()),
    relatedEventIds: z.array(z.string()),
    workspace: workspaceSchema.default(() => workspaceSchema.parse({})),
  })
  .refine(
    (project) =>
      !project.startDate ||
      !project.dueDate ||
      project.startDate <= project.dueDate,
    {
      message: "Ngày dự án không hợp lệ.",
    },
  );

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ItemInput = z.infer<typeof itemInputSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectItem = Project["items"][number];

export const emptyProjectInput: ProjectInput = {
  title: "",
  description: "",
  status: "active",
  color: "turquoise",
  startDate: "",
  dueDate: "",
  progressMode: "manual",
  manualProgress: 0,
};

export function getProjectProgress(
  project: Pick<Project, "progressMode" | "manualProgress" | "items">,
): number | null {
  if (project.progressMode === "manual") return project.manualProgress;
  const counted = project.items.filter((item) => item.countsTowardProgress);
  return counted.length
    ? Math.round(
        (counted.filter((item) => item.completed).length / counted.length) *
          100,
      )
    : null;
}

export function formatProjectDate(value: string): string {
  if (!value) return "Chưa đặt";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value + "T12:00:00Z"));
}

export function projectErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    return error.name === "QuotaExceededError"
      ? "Trình duyệt không đủ dung lượng để lưu. Nội dung đang nhập vẫn được giữ."
      : "Không truy cập được dữ liệu local. Kiểm tra quyền lưu trữ rồi thử lại.";
  }
  if (error instanceof z.ZodError)
    return error.issues[0]?.message ?? "Dữ liệu không hợp lệ.";
  return error instanceof Error
    ? error.message
    : "Chưa thể lưu dữ liệu. Vui lòng thử lại.";
}
