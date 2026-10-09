import { DateTime } from "luxon";
import { z } from "zod";

export const calendarZone = "Asia/Ho_Chi_Minh";
export const occurrenceFields = [
  "entryKind",
  "title",
  "description",
  "start",
  "end",
  "allDay",
  "groupId",
  "color",
  "important",
  "completed",
  "reminderMinutes",
  "projectIds",
  "noteIds",
] as const;
export const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
export const calendarColors = {
  turquoise: "#007f78",
  blue: "#2463a0",
  amber: "#936000",
  rose: "#b14366",
  violet: "#7556a4",
};
export const calendarColorSchema = z.union([
  z.enum(["turquoise", "blue", "amber", "rose", "violet"]),
  z
    .string()
    .regex(
      /^#[0-9a-fA-F]{6}$/,
      "Màu phải là mã HEX gồm 6 ký tự, ví dụ #007F78.",
    ),
]);
export type CalendarColor = z.infer<typeof calendarColorSchema>;
export const calendarPalette: { value: CalendarColor; name: string }[] = [
  { value: "turquoise", name: "Xanh ngọc" },
  { value: "blue", name: "Xanh dương" },
  { value: "amber", name: "Hổ phách" },
  { value: "rose", name: "Hồng" },
  { value: "violet", name: "Tím" },
  { value: "#188038", name: "Xanh lá" },
  { value: "#c5221f", name: "Đỏ" },
  { value: "#c26401", name: "Cam" },
  { value: "#039be5", name: "Xanh trời" },
  { value: "#3f51b5", name: "Chàm" },
  { value: "#616161", name: "Xám" },
];
export function resolveCalendarColor(color: CalendarColor = "turquoise") {
  return color.startsWith("#")
    ? color.toLowerCase()
    : calendarColors[color as keyof typeof calendarColors];
}
// Pick the higher-contrast foreground for both preset and custom backgrounds.
export function calendarTextColor(color: string) {
  function luminance(hex: string) {
    const channels = [1, 3, 5].map((offset) => {
      const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  const background = luminance(color);
  const navy = luminance("#07334a");
  const whiteContrast = 1.05 / (background + 0.05);
  const navyContrast =
    (Math.max(background, navy) + 0.05) / (Math.min(background, navy) + 0.05);
  if (Math.max(whiteContrast, navyContrast) < 4.5) return "#000000";
  return whiteContrast >= navyContrast ? "#ffffff" : "#07334a";
}
export const dateSchema = z
  .string()
  .refine(
    (value) =>
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      DateTime.fromISO(value).isValid &&
      value >= "2000-01-01" &&
      value <= "2100-12-31",
    "Ngày phải hợp lệ trong khoảng 2000–2100.",
  );
const inputShape = {
  entryKind: z.enum(["appointment", "task", "note"]).default("appointment"),
  title: z.string().trim().min(1, "Nhập tên lịch hẹn.").max(120),
  description: z.string().max(10000),
  start: z.string(),
  end: z.string(),
  allDay: z.boolean(),
  groupId: z.string().min(1).max(60),
  color: calendarColorSchema.nullable().optional(),
  important: z.boolean(),
  completed: z.boolean(),
  reminderMinutes: z.number().int().min(0).max(10080).nullable(),
  projectIds: z.array(z.string().uuid()).max(20),
  noteIds: z.array(z.string().uuid()).max(20),
};
export const occurrenceInputSchema = z
  .object(inputShape)
  .superRefine(validateTimes);
export const eventInputSchema = z
  .object({
    ...inputShape,
    repeat: z
      .object({
        weekdays: z
          .array(z.number().int().min(0).max(6))
          .min(1, "Chọn ít nhất một thứ.")
          .max(7),
        until: dateSchema,
      })
      .nullable(),
  })
  .superRefine((input, ctx) => {
    validateTimes(input, ctx);
    if (!input.repeat) return;
    const start = localTime(input.start);
    if (
      input.repeat.until < input.start.slice(0, 10) ||
      input.repeat.until > start.plus({ years: 5 }).toISODate()!
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Ngày kết thúc chuỗi phải từ ngày bắt đầu đến tối đa 5 năm sau.",
      });
    if (!input.repeat.weekdays.includes(start.weekday % 7))
      ctx.addIssue({
        code: "custom",
        message: "Các thứ lặp cần bao gồm thứ của ngày bắt đầu.",
      });
    if (millis(input.end) - millis(input.start) > 7 * 86400000)
      ctx.addIssue({
        code: "custom",
        message: "Mỗi buổi lặp kéo dài tối đa 7 ngày.",
      });
    if (input.completed)
      ctx.addIssue({
        code: "custom",
        message: "Đánh dấu hoàn thành từng buổi sau khi tạo chuỗi.",
      });
  });
export const eventSchema = z
  .object({
    ...eventInputSchema.shape,
    id: z.string().uuid(),
    schemaVersion: z.literal(1),
    version: z.number().int().positive(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    cancelledAt: z.string().datetime().nullable(),
    exceptions: z
      .array(
        z.object({
          originalStart: z.string(),
          cancelled: z.boolean(),
          input: occurrenceInputSchema.nullable(),
          fields: z
            .array(z.enum(occurrenceFields))
            .max(occurrenceFields.length),
        }),
      )
      .max(2000),
    sourceMilestone: z
      .object({ projectId: z.string().uuid(), itemId: z.string().uuid() })
      .nullable(),
  })
  .superRefine((value, ctx) => {
    const result = eventInputSchema.safeParse(value);
    if (!result.success)
      for (const issue of result.error.issues)
        ctx.addIssue({ code: "custom", message: issue.message });
    if (
      new Set(value.exceptions.map((item) => item.originalStart)).size !==
      value.exceptions.length
    )
      ctx.addIssue({ code: "custom", message: "Ngoại lệ lịch bị trùng." });
  });
export const settingsSchema = z
  .object({
    id: z.literal("calendar"),
    version: z.number().int().nonnegative(),
    groups: z
      .array(
        z.object({
          id: z.string().min(1).max(60),
          name: z.string().trim().min(1).max(40),
          color: calendarColorSchema,
        }),
      )
      .min(1)
      .max(20),
    slotMinTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    slotMaxTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$|^24:00$/),
    defaultReminderMinutes: inputShape.reminderMinutes,
  })
  .refine(
    (value) => value.slotMinTime < value.slotMaxTime,
    "Giờ kết thúc phải sau giờ bắt đầu.",
  )
  .refine(
    (value) =>
      new Set(value.groups.map((group) => group.id)).size ===
      value.groups.length,
    "Nhóm lịch bị trùng.",
  );
export type EventInput = z.infer<typeof eventInputSchema>;
export type OccurrenceInput = z.infer<typeof occurrenceInputSchema>;
export type CalendarEvent = z.infer<typeof eventSchema>;
export type CalendarSettings = z.infer<typeof settingsSchema>;
export type Occurrence = OccurrenceInput & {
  eventId: string;
  originalStart: string;
  recurring: boolean;
};
export const defaultCalendarSettings: CalendarSettings = {
  id: "calendar",
  version: 0,
  groups: [
    { id: "personal", name: "Cá nhân", color: "turquoise" },
    { id: "work", name: "Công việc", color: "blue" },
    { id: "study", name: "Học tập", color: "amber" },
  ],
  slotMinTime: "00:00",
  slotMaxTime: "24:00",
  defaultReminderMinutes: 15,
};
export function localTime(value: string) {
  return DateTime.fromISO(value, { zone: calendarZone });
}
export function millis(value: string) {
  return localTime(value).toMillis();
}
export function addDays(date: string, days: number) {
  return localTime(date).plus({ days }).toISODate() ?? "";
}
export function wallTime(value: string | Date) {
  return (
    typeof value === "string"
      ? DateTime.fromISO(value, { zone: calendarZone })
      : DateTime.fromJSDate(value, { zone: calendarZone })
  ).toFormat("yyyy-MM-dd'T'HH:mm");
}
export function calendarError(cause: unknown) {
  if (cause instanceof DOMException)
    return cause.name === "QuotaExceededError"
      ? "Không lưu được lịch vì trình duyệt hết dung lượng. Nội dung đang nhập vẫn được giữ."
      : "Không truy cập được lịch local. Kiểm tra quyền lưu trữ rồi thử lại.";
  if (cause instanceof z.ZodError)
    return cause.issues[0]?.message ?? "Dữ liệu lịch chưa hợp lệ.";
  return cause instanceof Error
    ? cause.message
    : "Không lưu được lịch. Nội dung đang nhập vẫn được giữ.";
}
function validateTimes(input: OccurrenceInput, ctx: z.RefinementCtx) {
  const pattern = input.allDay
    ? /^\d{4}-\d{2}-\d{2}$/
    : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  for (const value of [input.start, input.end]) {
    if (
      !pattern.test(value) ||
      !localTime(value).isValid ||
      !dateSchema.safeParse(value.slice(0, 10)).success
    )
      ctx.addIssue({ code: "custom", message: "Ngày/giờ không hợp lệ." });
  }
  const duration = millis(input.end) - millis(input.start);
  if (!(duration > 0 && duration <= 31 * 86400000))
    ctx.addIssue({
      code: "custom",
      message: "Thời điểm kết thúc phải sau bắt đầu, tối đa 31 ngày.",
    });
}
export function blankEvent(
  date: string,
  settings: CalendarSettings,
): EventInput {
  return {
    entryKind: "appointment",
    title: "",
    description: "",
    start: date + "T09:00",
    end: date + "T10:00",
    allDay: false,
    groupId: settings.groups[0].id,
    color: null,
    important: false,
    completed: false,
    reminderMinutes: settings.defaultReminderMinutes,
    projectIds: [],
    noteIds: [],
    repeat: null,
  };
}
