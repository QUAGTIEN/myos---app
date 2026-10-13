import { z } from "zod";

export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, "Nhập tên công việc.")
  .max(200, "Tên công việc tối đa 200 ký tự.");
export const taskSchema = z
  .object({
    id: z.string().uuid(),
    title: taskTitleSchema,
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
