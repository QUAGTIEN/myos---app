import { z } from "zod";

export const preferencesSchema = z
  .object({
    displayName: z.string().trim().min(1, "Nhập tên hiển thị.").max(80),
    timezone: z.literal("Asia/Ho_Chi_Minh"),
    firstDay: z.union([z.literal(0), z.literal(1)]),
  })
  .strict();
export const profileSchema = preferencesSchema.extend({
  uid: z.string().min(1).max(128),
  email: z.string(),
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type AccountProfile = z.infer<typeof profileSchema>;
