"use client";

import { z } from "zod";
import { announceLocalChange } from "@/lib/local-database";
import type { ProjectRepository } from "@/modules/projects/repository";
import type { NoteRepository } from "@/modules/notes/repository";
import type { CalendarRepository } from "@/modules/calendar/repository";
import { projectSchema } from "@/modules/projects/model";
import { noteSchema, notesChangedEvent } from "@/modules/notes/model";
import {
  eventSchema,
  settingsSchema,
  type CalendarSettings,
} from "@/modules/calendar/model";

async function request(url: string, options: RequestInit) {
  return fetch(url, options).catch(() => {
    throw new Error(
      "Không kết nối được MyOS. Kiểm tra mạng rồi thử lại. Bản nháp vẫn được giữ.",
    );
  });
}
async function json(response: Response) {
  const body = z
    .object({
      error: z.string().optional(),
      value: z.unknown().optional(),
      csrfToken: z
        .string()
        .regex(/^[a-f0-9]{64}$/)
        .optional(),
    })
    .passthrough()
    .safeParse(await response.json().catch(() => null));
  if (!body.success)
    throw new Error("Không đọc được phản hồi MyOS. Bản nháp vẫn được giữ.");
  const result = body.data;
  if (!response.ok)
    throw new Error(
      result.error || "Không kết nối được MyOS. Bản nháp vẫn được giữ.",
    );
  return result;
}
export async function csrfToken() {
  return (await json(await request("/api/auth", { cache: "no-store" })))
    .csrfToken as string;
}
export async function authenticatedFetch(
  url: string,
  body: unknown,
  method = "POST",
) {
  return json(
    await request(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-myos-csrf": await csrfToken(),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    }),
  );
}
export async function cloudRead(kind: string, id?: string): Promise<unknown> {
  const search = new URLSearchParams({ kind, ...(id ? { id } : {}) });
  return (
    await json(await request("/api/data?" + search, { cache: "no-store" }))
  ).value;
}
export async function cloudWrite(body: unknown): Promise<unknown> {
  const value = (await authenticatedFetch("/api/data", body)).value;
  for (const event of [
    "myos:projects-changed",
    notesChangedEvent,
    "myos:calendar-changed",
  ])
    announceLocalChange(event);
  return value;
}
export const cloudProjectRepository: ProjectRepository = {
  async list() {
    return projectSchema.array().parse(await cloudRead("projects"));
  },
  async get(id) {
    const value = await cloudRead("projects", id);
    return value ? projectSchema.parse(value) : null;
  },
  async create(project) {
    return projectSchema.parse(
      await cloudWrite({
        kind: "projects",
        operation: "save",
        id: project.id,
        expectedVersion: 0,
        value: project,
      }),
    );
  },
  async update(id, expectedVersion, transform, attachment) {
    if (attachment)
      throw new Error(
        "Tệp cloud sẽ được triển khai sau. Tệp local cũ vẫn được giữ.",
      );
    const current = await this.get(id);
    if (!current) throw new Error("Không tìm thấy dự án.");
    if (current.version !== expectedVersion)
      throw new Error(
        "Dự án đã thay đổi ở thiết bị khác. Tải lại bản mới trước khi lưu.",
      );
    return projectSchema.parse(
      await cloudWrite({
        kind: "projects",
        operation: "save",
        id,
        expectedVersion,
        value: transform(current),
      }),
    );
  },
};
export const cloudNoteRepository: NoteRepository = {
  async list() {
    return noteSchema.array().parse(await cloudRead("notes"));
  },
  async get(id) {
    const value = await cloudRead("notes", id);
    return value ? noteSchema.parse(value) : null;
  },
  async attachment() {
    return null;
  },
  async commit(previous, next, attachments = []) {
    if (attachments.length)
      throw new Error(
        "Ảnh cloud sẽ được triển khai sau. Ảnh local cũ vẫn được giữ.",
      );
    if (!previous && !next) throw new Error("Thiếu ghi chú.");
    const value = await cloudWrite({
      kind: "notes",
      operation: next ? "save" : "remove",
      id: (next ?? previous)!.id,
      expectedVersion: previous?.version ?? 0,
      ...(next ? { value: { ...next, revisions: [] } } : {}),
    });
    return value ? noteSchema.parse(value) : null;
  },
};
export const cloudCalendarRepository: CalendarRepository = {
  async list() {
    return eventSchema.array().parse(await cloudRead("calendarEvents"));
  },
  async settings() {
    return settingsSchema.parse(await cloudRead("calendarSettings"));
  },
  async commit(previous, next) {
    return eventSchema.parse(
      await cloudWrite({
        kind: "calendarEvents",
        operation: "save",
        id: next.id,
        expectedVersion: previous?.version ?? 0,
        value: next,
      }),
    );
  },
  async saveSettings(settings) {
    return settingsSchema.parse(
      await cloudWrite({
        kind: "calendarSettings",
        operation: "save",
        id: "calendar",
        expectedVersion: settings.version,
        value: settings,
      }),
    );
  },
};
export async function cloudCopyCalendarGroup(
  settings: CalendarSettings,
  sourceId: string,
  name: string,
) {
  return String(
    await cloudWrite({
      kind: "calendarSettings",
      operation: "copy",
      id: "calendar",
      expectedVersion: settings.version,
      sourceId,
      name,
    }),
  );
}
