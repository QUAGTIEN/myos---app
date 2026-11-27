import { z } from "zod";
import { dateSchema, localTime, calendarColors } from "@/modules/calendar/model";

export const attendanceMonthKey = z
  .string()
  .regex(/^\d{4}-\d{2}$/)
  .refine(
    (value) => dateSchema.safeParse(value + "-01").success,
    "Tháng không hợp lệ.",
  );

export const attendanceId = z
  .string()
  .regex(/^[0-9a-f-]{36}_\d{4}-\d{2}$/)
  .refine(
    (value) =>
      z.string().uuid().safeParse(value.slice(0, 36)).success &&
      attendanceMonthKey.safeParse(value.slice(37)).success,
    "Mã bảng chấm công không hợp lệ.",
  );

export const activityInputSchema = z.object({
  name: z.string().trim().min(1, "Nhập tên bảng công.").max(80),
  color: z.enum(
    Object.keys(calendarColors) as [
      keyof typeof calendarColors,
      ...Array<keyof typeof calendarColors>,
    ],
  ),
});

export const activitySchema = activityInputSchema.extend({
  id: z.string().uuid(),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().default(null),
});

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const attendanceEntrySchema = z
  .object({
    date: dateSchema,
    status: z.enum(["done", "rest", "note"]),
    start: time.or(z.literal("")),
    end: time.or(z.literal("")),
    note: z.string().max(2000).default(""),
    lesson: z.string().max(2000).optional(),
    evaluation: z.string().max(2000).optional(),
  })
  .superRefine((entry, ctx) => {
    if (entry.status !== "done" && (entry.start || entry.end))
      ctx.addIssue({
        code: "custom",
        message: "Chỉ ngày đã thực hiện mới có giờ chấm công.",
      });
    if (
      entry.status === "note" &&
      !entry.note.trim() &&
      !(entry.lesson ?? "").trim() &&
      !(entry.evaluation ?? "").trim()
    )
      ctx.addIssue({ code: "custom", message: "Nhập ghi chú cho ngày này." });
    if (
      entry.status === "done" &&
      (!!entry.start !== !!entry.end ||
        (entry.start && entry.end <= entry.start))
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Nhập đủ giờ bắt đầu/kết thúc; giờ kết thúc phải sau giờ bắt đầu trong cùng ngày.",
      });
  });

export const attendanceMonthSchema = z
  .object({
    id: attendanceId,
    activityId: z.string().uuid(),
    month: attendanceMonthKey,
    entries: z.array(attendanceEntrySchema).max(31),
    version: z.number().int().positive(),
    updatedAt: z.string().datetime(),
  })
  .superRefine((value, ctx) => {
    if (
      value.id !== value.activityId + "_" + value.month ||
      new Set(value.entries.map((entry) => entry.date)).size !==
        value.entries.length ||
      value.entries.some((entry) => entry.date.slice(0, 7) !== value.month)
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Mỗi ngày chỉ được chấm một lần trong đúng công việc và tháng.",
      });
  });

export type AttendanceActivity = z.infer<typeof activitySchema>;
export type AttendanceEntry = z.infer<typeof attendanceEntrySchema>;
export type AttendanceMonth = z.infer<typeof attendanceMonthSchema>;

export function monthDays(month: string, firstDay: number) {
  const start = localTime(month + "-01");
  const leading = ((start.weekday % 7) - firstDay + 7) % 7;
  const size = Math.ceil((leading + start.daysInMonth!) / 7) * 7;
  return Array.from({ length: size }, (_, index) =>
    start.plus({ days: index - leading }).toISODate()!,
  );
}

// Tương thích ngược: dữ liệu cũ lưu trong `note` sẽ tự hiển thị ở ô Bài học.
export function attendanceLesson(entry: AttendanceEntry) {
  return entry.lesson !== undefined ? entry.lesson : entry.note;
}

export function attendanceEvaluation(entry: AttendanceEntry) {
  return entry.evaluation ?? "";
}

export function isAttendanceMarked(entry: AttendanceEntry) {
  return (
    entry.status === "done" ||
    !!attendanceLesson(entry).trim() ||
    !!attendanceEvaluation(entry).trim()
  );
}
