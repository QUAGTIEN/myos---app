import "server-only";

import { randomUUID } from "node:crypto";
import {
  FieldPath,
  type DocumentReference,
  type Transaction,
} from "firebase-admin/firestore";
import type { UserRecord } from "firebase-admin/auth";
import { z } from "zod";
import { projectSchema, type Project } from "@/modules/projects/model";
import {
  imageIds,
  noteSchema,
  noteInput,
  noteFingerprint,
  type Note,
} from "@/modules/notes/model";
import {
  defaultCalendarSettings,
  eventSchema,
  settingsSchema,
  type CalendarEvent,
} from "@/modules/calendar/model";
import {
  effectiveOccurrence,
  isOriginalOccurrence,
} from "@/modules/calendar/recurrence";
import { database } from "./server";
import { HttpError } from "./session";
import { preferencesSchema, profileSchema } from "./profile";
import {
  activitySchema,
  attendanceId,
  attendanceMonthSchema,
} from "@/modules/calendar/attendance-model";

export const kindSchema = z.enum([
  "projects",
  "notes",
  "calendarEvents",
  "calendarSettings",
  "profile",
  "attendanceActivities",
  "attendanceMonths",
]);
type Kind = z.infer<typeof kindSchema>;
export const commandSchema = z
  .object({
    kind: kindSchema,
    operation: z.enum(["save", "remove", "copy"]),
    id: z.string().max(128),
    expectedVersion: z.number().int().nonnegative(),
    value: z.unknown().optional(),
    sourceId: z.string().max(60).optional(),
    name: z.string().trim().min(1).max(40).optional(),
  })
  .strict();
const identifier = z.string().uuid();
function reference(uid: string, kind: Kind, id: string) {
  if (kind === "profile") return database().doc(`users/${uid}`);
  if (kind === "calendarSettings") {
    if (id !== "calendar") throw new HttpError(400, "Sai mã cài đặt lịch.");
  } else if (kind === "attendanceMonths") attendanceId.parse(id);
  else identifier.parse(id);
  return database().doc(`users/${uid}/${kind}/${id}`);
}
function unpack(snapshot: {
  exists: boolean;
  get: (field: string) => unknown;
}) {
  return snapshot.exists
    ? z
        .record(z.string(), z.unknown())
        .parse(JSON.parse(z.string().parse(snapshot.get("payload"))))
    : null;
}
function pack(value: unknown) {
  const payload = JSON.stringify(value);
  if (Buffer.byteLength(payload, "utf8") > 800000)
    throw new HttpError(
      400,
      "Nội dung quá lớn để lưu trong một mục. Hãy giảm hoặc chia nội dung trước khi lưu.",
    );
  return { payload };
}
function same(a: unknown, b: unknown) {
  return noteFingerprint(a) === noteFingerprint(b);
}
function conflict(actual: number, expected: number) {
  if (actual !== expected)
    throw new HttpError(
      409,
      "Dữ liệu đã thay đổi ở tab hoặc thiết bị khác. Bản nháp vẫn được giữ; tải bản mới trước khi lưu.",
    );
}
function links(event: CalendarEvent | null, kind: "projectIds" | "noteIds") {
  if (!event || event.cancelledAt) return [];
  return [
    ...new Set([
      ...event[kind],
      ...event.exceptions
        .filter((e) => !e.cancelled)
        .flatMap(
          (e) => effectiveOccurrence(event, e.originalStart)?.[kind] ?? [],
        ),
    ]),
  ];
}
function history(
  project: Project,
  field: "relatedNoteIds" | "relatedEventIds",
  ids: string[],
) {
  if (same([...project[field]].sort(), [...ids].sort())) return project;
  const now = new Date().toISOString();
  return projectSchema.parse({
    ...project,
    [field]: ids,
    version: project.version + 1,
    updatedAt: now,
    updates: [
      { id: randomUUID(), at: now, message: "Đã cập nhật liên kết." },
      ...project.updates,
    ].slice(0, 100),
  });
}
async function noteInTransaction(
  tx: Transaction,
  ref: DocumentReference,
): Promise<Note | null> {
  const base = unpack(await tx.get(ref));
  if (!base) return null;
  const parsed = noteSchema.parse({ ...base, revisions: [] });
  const ids = z
    .array(identifier)
    .max(20)
    .parse(base.revisionIds ?? []);
  const revisions = ids.length
    ? await tx.getAll(...ids.map((id) => ref.collection("revisions").doc(id)))
    : [];
  return noteSchema.parse({
    ...parsed,
    revisions: revisions.map(unpack).filter(Boolean),
  });
}
export async function ensureProfile(user: UserRecord) {
  const ref = reference(user.uid, "profile", "profile");
  const existing = unpack(await ref.get());
  if (existing) return profileSchema.parse(existing);
  return database().runTransaction(async (tx) => {
    const stored = unpack(await tx.get(ref));
    if (stored) return profileSchema.parse(stored);
    const now = new Date().toISOString();
    const profile = profileSchema.parse({
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName || user.email?.split("@")[0] || "Cá nhân",
      timezone: "Asia/Ho_Chi_Minh",
      firstDay: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    tx.create(ref, pack(profile));
    return profile;
  });
}
export async function readData(user: UserRecord, kind: Kind, id?: string) {
  if (kind === "profile") return ensureProfile(user);
  if (kind === "calendarSettings")
    return settingsSchema.parse(
      unpack(await reference(user.uid, kind, "calendar").get()) ??
        defaultCalendarSettings,
    );
  if (id) {
    const ref = reference(user.uid, kind, id);
    if (kind === "notes")
      return database().runTransaction((tx) => noteInTransaction(tx, ref));
    const value = unpack(await ref.get());
    return value
      ? (kind === "attendanceActivities"
          ? activitySchema
          : kind === "attendanceMonths"
            ? attendanceMonthSchema
            : kind === "projects"
              ? projectSchema
              : eventSchema
        ).parse(value)
      : null;
  }
  if (kind === "attendanceMonths")
    throw new HttpError(400, "Chọn công việc và tháng để đọc chấm công.");
  // Read bounded pages, with a hard ceiling rather than silently omitting records.
  const collection = database().collection(`users/${user.uid}/${kind}`);
  const result: unknown[] = [];
  let bytes = 0;
  let cursor: string | undefined;
  for (;;) {
    let query = collection.orderBy(FieldPath.documentId()).limit(250);
    if (cursor) query = query.startAfter(cursor);
    const page = await query.get();
    if (result.length + page.size > 5000)
      throw new HttpError(
        400,
        "Danh sách vượt 5.000 mục; cần bổ sung truy vấn theo khoảng trước khi tải toàn bộ.",
      );
    result.push(
      ...page.docs.map((doc) => {
        const value = unpack(doc);
        return kind === "attendanceActivities"
          ? activitySchema.parse(value)
          : kind === "projects"
            ? projectSchema.parse(value)
            : kind === "notes"
              ? noteSchema.parse({ ...value, revisions: [] })
              : eventSchema.parse(value);
      }),
    );
    if (page.size)
      bytes += Buffer.byteLength(
        JSON.stringify(result.slice(-page.size)),
        "utf8",
      );
    if (bytes > 3000000)
      throw new HttpError(
        400,
        "Danh sách vượt 3 MB; cần bổ sung tải theo trang trước khi đọc toàn bộ.",
      );
    if (page.size < 250) break;
    cursor = page.docs.at(-1)!.id;
  }
  return result;
}
export async function writeData(user: UserRecord, raw: unknown) {
  const command = commandSchema.parse(raw);
  const { kind, operation, id, expectedVersion } = command;
  const uid = user.uid;
  const ref = reference(uid, kind, id);
  if (operation === "copy") {
    if (kind !== "calendarSettings" || !command.sourceId || !command.name)
      throw new HttpError(400, "Yêu cầu sao chép không hợp lệ.");
    return copyTimetable(uid, expectedVersion, command.sourceId, command.name);
  }
  if (operation === "remove" && kind !== "notes")
    throw new HttpError(400, "Thao tác xóa chưa được hỗ trợ.");
  return database().runTransaction(async (tx) => {
    const previous =
      kind === "notes"
        ? await noteInTransaction(tx, ref)
        : unpack(await tx.get(ref));
    conflict(
      z
        .number()
        .int()
        .nonnegative()
        .parse(previous?.version ?? 0),
      expectedVersion,
    );
    const now = new Date().toISOString();
    if (kind === "attendanceActivities" || kind === "attendanceMonths") {
      const schema =
        kind === "attendanceActivities"
          ? activitySchema
          : attendanceMonthSchema;
      const input = schema.parse(command.value);
      if (input.id !== id || input.version !== expectedVersion + 1)
        throw new HttpError(400, "Sai phiên bản chấm công.");
      if (kind === "attendanceActivities" && !previous) {
        const activities = await tx.get(
          database().collection(`users/${uid}/attendanceActivities`).limit(50),
        );
        if (activities.size >= 50)
          throw new HttpError(400, "Tối đa 50 loại công việc.");
      }
      if (kind === "attendanceMonths") {
        const month = attendanceMonthSchema.parse(input);
        const activity = unpack(
          await tx.get(
            reference(uid, "attendanceActivities", month.activityId),
          ),
        );
        if (!activity)
          throw new HttpError(
            400,
            "Công việc không tồn tại hoặc không thuộc tài khoản.",
          );
      }
      const saved = schema.parse({
        ...input,
        updatedAt: now,
        ...(kind === "attendanceActivities"
          ? { createdAt: previous?.createdAt ?? now }
          : {}),
      });
      tx.set(ref, pack(saved));
      return saved;
    }
    if (kind === "profile") {
      if (!previous) throw new HttpError(404, "Không tìm thấy hồ sơ.");
      const saved = profileSchema.parse({
        ...previous,
        ...preferencesSchema.parse(command.value),
        uid,
        email: user.email ?? "",
        version: expectedVersion + 1,
        updatedAt: now,
      });
      tx.set(ref, pack(saved));
      return saved;
    }
    if (kind === "calendarSettings") {
      const saved = settingsSchema.parse({
        ...settingsSchema.parse(command.value),
        id: "calendar",
        version: expectedVersion + 1,
      });
      const old = settingsSchema.parse(previous ?? defaultCalendarSettings);
      const removed = old.groups.filter(
        (group) => !saved.groups.some((item) => item.id === group.id),
      );
      if (removed.length) {
        const events = await tx.get(
          database().collection(`users/${uid}/calendarEvents`).limit(5001),
        );
        if (events.size > 5000)
          throw new HttpError(
            400,
            "Quá nhiều lịch để kiểm tra xóa nhóm một lần.",
          );
        if (
          events.docs.some((doc) => {
            const event = eventSchema.parse(unpack(doc));
            return (
              !event.cancelledAt &&
              [
                event,
                ...event.exceptions.flatMap((e) => (e.input ? [e.input] : [])),
              ].some((e) => removed.some((g) => g.id === e.groupId))
            );
          })
        )
          throw new HttpError(
            400,
            "Bộ lịch còn sự kiện; không thể xóa nhóm đang dùng.",
          );
      }
      tx.set(ref, pack(saved));
      return saved;
    }
    if (kind === "projects") {
      const input = projectSchema.parse(command.value);
      if (input.id !== id || input.version !== expectedVersion + 1)
        throw new HttpError(400, "Sai phiên bản dự án.");
      if (input.workspace.attachments.length)
        throw new HttpError(400, "Tệp cloud sẽ được triển khai sau.");
      const current = previous ? projectSchema.parse(previous) : null;
      if (current?.archivedAt) {
        const editable = (value: Project) => {
          const { pinned, archivedAt, version, updatedAt, updates, ...rest } =
            value;
          void pinned;
          void archivedAt;
          void version;
          void updatedAt;
          void updates;
          return rest;
        };
        if (!same(editable(current), editable(input)))
          throw new HttpError(400, "Khôi phục dự án trước khi chỉnh sửa.");
      }
      const saved = projectSchema.parse({
        ...input,
        createdAt: current?.createdAt ?? now,
        updatedAt: now,
        relatedNoteIds: current?.relatedNoteIds ?? [],
        relatedEventIds: current?.relatedEventIds ?? [],
      });
      tx.set(ref, pack(saved));
      return saved;
    }
    if (kind === "notes") {
      const current = previous as Note | null;
      if (operation === "remove" && !current?.trashedAt)
        throw new HttpError(400, "Chuyển ghi chú vào thùng rác trước khi xóa.");
      let saved: Note | null = null;
      if (operation !== "remove") {
        const input = noteSchema.parse(command.value);
        if (input.id !== id || input.version !== expectedVersion + 1)
          throw new HttpError(400, "Sai phiên bản ghi chú.");
        if (imageIds(input.content).length)
          throw new HttpError(400, "Ảnh cloud sẽ được triển khai sau.");
        if (current?.trashedAt && !same(noteInput(current), noteInput(input)))
          throw new HttpError(400, "Khôi phục ghi chú trước khi chỉnh sửa.");
        const changed = current && !same(noteInput(current), noteInput(input));
        let revisions = changed
          ? [
              {
                ...noteInput(current),
                id: randomUUID(),
                at: current.updatedAt,
              },
              ...current.revisions,
            ].slice(0, 20)
          : (current?.revisions ?? []);
        while (
          Buffer.byteLength(JSON.stringify({ ...input, revisions }), "utf8") >
            2500000 &&
          revisions.length
        )
          revisions = revisions.slice(0, -1);
        saved = noteSchema.parse({
          ...input,
          revisions,
          createdAt: current?.createdAt ?? now,
          updatedAt: now,
        });
      }
      const projectIds = [
        ...new Set([
          ...(current?.projectIds ?? []),
          ...(saved?.projectIds ?? []),
        ]),
      ];
      const projectRefs = projectIds.map((projectId) =>
        reference(uid, "projects", projectId),
      );
      const projects = projectRefs.length
        ? await tx.getAll(...projectRefs)
        : [];
      const writes: [DocumentReference, Project][] = [];
      for (let index = 0; index < projects.length; index++) {
        const data = unpack(projects[index]);
        const wasLinked = !!current?.projectIds.includes(projectIds[index]);
        const linked = !!saved?.projectIds.includes(projectIds[index]);
        if (!data && linked)
          throw new HttpError(
            400,
            "Dự án liên kết không còn tồn tại hoặc không thuộc tài khoản.",
          );
        if (!data) continue;
        const project = projectSchema.parse(data);
        if (project.archivedAt && linked && !wasLinked)
          throw new HttpError(400, "Khôi phục dự án trước khi gắn ghi chú.");
        if (linked !== wasLinked)
          writes.push([
            projectRefs[index],
            history(project, "relatedNoteIds", [
              ...project.relatedNoteIds.filter((value) => value !== id),
              ...(linked ? [id] : []),
            ]),
          ]);
      }
      for (const [target, value] of writes) tx.set(target, pack(value));
      const retained = new Set(saved?.revisions.map((r) => r.id) ?? []);
      for (const revision of current?.revisions ?? [])
        if (!retained.has(revision.id))
          tx.delete(ref.collection("revisions").doc(revision.id));
      if (saved) {
        for (const revision of saved.revisions)
          if (!current?.revisions.some((r) => r.id === revision.id))
            tx.set(
              ref.collection("revisions").doc(revision.id),
              pack(revision),
            );
        tx.set(
          ref,
          pack({
            ...saved,
            revisions: [],
            revisionIds: saved.revisions.map((r) => r.id),
          }),
        );
      } else tx.delete(ref);
      return saved;
    }
    const current = previous ? eventSchema.parse(previous) : null;
    const input = eventSchema.parse(command.value);
    if (input.id !== id || input.version !== expectedVersion + 1)
      throw new HttpError(400, "Sai phiên bản lịch.");
    if (current?.cancelledAt) throw new HttpError(400, "Lịch đã bị hủy.");
    if (current && !same(current.sourceMilestone, input.sourceMilestone))
      throw new HttpError(400, "Không đổi nguồn mốc của lịch đã tạo.");
    for (const exception of input.exceptions)
      if (!isOriginalOccurrence(input, exception.originalStart))
        throw new HttpError(400, "Ngoại lệ không thuộc chuỗi lịch.");
    const saved = eventSchema.parse({
      ...input,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    });
    const settings = settingsSchema.parse(
      unpack(await tx.get(reference(uid, "calendarSettings", "calendar"))) ??
        defaultCalendarSettings,
    );
    if (
      [
        saved,
        ...saved.exceptions.flatMap((e) => (e.input ? [e.input] : [])),
      ].some((e) => !settings.groups.some((g) => g.id === e.groupId))
    )
      throw new HttpError(400, "Nhóm lịch không còn tồn tại.");
    const oldProjects = links(current, "projectIds");
    const newProjects = links(saved, "projectIds");
    const ids = [
      ...new Set([
        ...oldProjects,
        ...newProjects,
        ...(saved.sourceMilestone ? [saved.sourceMilestone.projectId] : []),
      ]),
    ];
    const refs = ids.map((value) => reference(uid, "projects", value));
    const projects = refs.length ? await tx.getAll(...refs) : [];
    const writes: [DocumentReference, Project][] = [];
    for (let index = 0; index < projects.length; index++) {
      const data = unpack(projects[index]);
      const linked = newProjects.includes(ids[index]);
      if (!data && (linked || saved.sourceMilestone?.projectId === ids[index]))
        throw new HttpError(
          400,
          "Dự án không tồn tại hoặc không thuộc tài khoản.",
        );
      if (!data) continue;
      const project = projectSchema.parse(data);
      if (project.archivedAt && linked && !oldProjects.includes(project.id))
        throw new HttpError(400, "Khôi phục dự án trước khi gắn lịch.");
      if (
        saved.sourceMilestone?.projectId === project.id &&
        !current?.sourceMilestone &&
        (project.archivedAt ||
          !project.items.some(
            (item) =>
              item.id === saved.sourceMilestone!.itemId &&
              item.kind === "milestone",
          ))
      )
        throw new HttpError(400, "Mốc dự án không còn khả dụng.");
      const changed = history(project, "relatedEventIds", [
        ...project.relatedEventIds.filter((value) => value !== id),
        ...(linked ? [id] : []),
      ]);
      if (changed !== project) writes.push([refs[index], changed]);
    }
    const noteIds = links(saved, "noteIds").filter(
      (value) => !links(current, "noteIds").includes(value),
    );
    const notes = noteIds.length
      ? await tx.getAll(
          ...noteIds.map((value) => reference(uid, "notes", value)),
        )
      : [];
    if (
      notes.some((doc) => {
        const data = unpack(doc);
        return !data || noteSchema.parse(data).trashedAt;
      })
    )
      throw new HttpError(
        400,
        "Ghi chú không tồn tại, đã xóa hoặc không thuộc tài khoản.",
      );
    for (const [target, value] of writes) tx.set(target, pack(value));
    tx.set(ref, pack(saved));
    return saved;
  });
}
async function copyTimetable(
  uid: string,
  version: number,
  sourceId: string,
  name: string,
) {
  const ref = reference(uid, "calendarSettings", "calendar");
  return database().runTransaction(async (tx) => {
    const settings = settingsSchema.parse(
      unpack(await tx.get(ref)) ?? defaultCalendarSettings,
    );
    conflict(settings.version, version);
    const group = settings.groups.find((item) => item.id === sourceId);
    if (!group) throw new HttpError(400, "Bộ lịch không tồn tại.");
    const all = await tx.get(
      database().collection(`users/${uid}/calendarEvents`).limit(5001),
    );
    if (all.size > 5000)
      throw new HttpError(400, "Quá nhiều lịch để sao chép một lần.");
    const originals = all.docs
      .map((doc) => eventSchema.parse(unpack(doc)))
      .filter((e) => e.groupId === sourceId && !e.cancelledAt);
    if (originals.length > 400)
      throw new HttpError(400, "Một lần sao chép hỗ trợ tối đa 400 lịch.");
    const groupId = randomUUID();
    const now = new Date().toISOString();
    const clones = originals.map((event) =>
      eventSchema.parse({
        ...event,
        id: randomUUID(),
        version: 1,
        createdAt: now,
        updatedAt: now,
        groupId,
        completed: false,
        projectIds: [],
        noteIds: [],
        sourceMilestone: null,
        exceptions: event.exceptions.map((exception) => ({
          ...exception,
          input: exception.input
            ? {
                ...exception.input,
                groupId,
                completed: false,
                projectIds: [],
                noteIds: [],
              }
            : null,
          fields: exception.input
            ? [
                ...new Set([
                  ...exception.fields,
                  "groupId" as const,
                  "completed" as const,
                  "projectIds" as const,
                  "noteIds" as const,
                ]),
              ]
            : [],
        })),
      }),
    );
    const next = settingsSchema.parse({
      ...settings,
      version: version + 1,
      groups: [...settings.groups, { ...group, id: groupId, name }],
    });
    const documents = clones.map(
      (event) =>
        [reference(uid, "calendarEvents", event.id), pack(event)] as const,
    );
    tx.set(ref, pack(next));
    for (const [target, value] of documents) tx.create(target, value);
    return groupId;
  });
}
