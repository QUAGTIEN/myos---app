import { z } from "zod";

export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, "Nhập tên công việc.")
  .max(200, "Tên công việc tối đa 200 ký tự.");
export const taskInputSchema = z
  .object({
    title: taskTitleSchema,
    dueDate: z.string().date("Deadline không hợp lệ.").nullable().default(null),
  })
  .strict();
export type TaskInput = z.infer<typeof taskInputSchema>;
export const taskSchema = z
  .object({
    id: z.string().uuid(),
    title: taskTitleSchema,
    dueDate: taskInputSchema.shape.dueDate,
    completed: z.boolean(),
    version: z.number().int().positive(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
  })
  .strict();
export type Task = z.infer<typeof taskSchema>;
export function taskError(cause: unknown) {
  return cause instanceof z.ZodError
    ? cause.issues[0].message
    : cause instanceof Error
      ? cause.message
      : "Không lưu được công việc. Vui lòng thử lại.";
}
