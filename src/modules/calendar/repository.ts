import { announceLocalChange, openLocalDatabase } from "@/lib/local-database";
import { projectSchema, type Project } from "@/modules/projects/model";
import { projectsChangedEvent } from "@/modules/projects/repository";
import { noteSchema } from "@/modules/notes/model";
import {
  defaultCalendarSettings,
  eventSchema,
  settingsSchema,
  type CalendarEvent,
  type CalendarSettings,
} from "./model";
import { effectiveOccurrence, isOriginalOccurrence } from "./recurrence";

export const calendarChangedEvent = "myos:calendar-changed";
export interface CalendarRepository {
  list(): Promise<CalendarEvent[]>;
  settings(): Promise<CalendarSettings>;
  commit(
    previous: CalendarEvent | null,
    next: CalendarEvent,
  ): Promise<CalendarEvent>;
  saveSettings(settings: CalendarSettings): Promise<CalendarSettings>;
}
export function eventLinks(
  event: CalendarEvent | null,
  kind: "projectIds" | "noteIds",
) {
  if (!event || event.cancelledAt) return [];
  return [
    ...new Set([
      ...event[kind],
      ...event.exceptions
        .filter((item) => !item.cancelled)
        .flatMap(
          (item) =>
            effectiveOccurrence(event, item.originalStart)?.[kind] ?? [],
        ),
    ]),
  ];
}
async function read<T>(
  name: string,
  operation: (store: IDBObjectStore) => IDBRequest,
  decode: (value: unknown) => T,
): Promise<T> {
  const db = await openLocalDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(name, "readonly");
    const request = operation(tx.objectStore(name));
    let result: T;
    let error: unknown;
    request.onsuccess = () => {
      try {
        result = decode(request.result);
      } catch {
        error = new Error(
          "Dữ liệu lịch không đúng phiên bản. Dữ liệu gốc vẫn được giữ.",
        );
        tx.abort();
      }
    };
    tx.oncomplete = () => resolve(result);
    tx.onabort = () =>
      reject(error ?? tx.error ?? new Error("Không đọc được lịch local."));
  });
}
export const localCalendarRepository: CalendarRepository = {
  list: () =>
    read(
      "calendarEvents",
      (store) => store.getAll(),
      (value) => eventSchema.array().parse(value),
    ),
  settings: () =>
    read(
      "calendarSettings",
      (store) => store.get("calendar"),
      (value) =>
        value
          ? settingsSchema.parse(value)
          : structuredClone(defaultCalendarSettings),
    ),
  async commit(previous, next) {
    const parsed = eventSchema.parse(next);
    if (
      parsed.version !== (previous?.version ?? 0) + 1 ||
      (previous && parsed.id !== previous.id)
    )
      throw new Error("Phiên bản lịch không hợp lệ.");
    if (
      parsed.exceptions.some(
        (exception) => !isOriginalOccurrence(parsed, exception.originalStart),
      )
    )
      throw new Error("Ngoại lệ không thuộc chuỗi lịch này.");
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        ["calendarEvents", "calendarSettings", "projects", "notes"],
        "readwrite",
      );
      let failure: unknown;
      const fail = (cause: unknown) => {
        failure = cause;
        tx.abort();
      };
      const request = tx.objectStore("calendarEvents").get(parsed.id);
      request.onsuccess = () => {
        try {
          const current = request.result
            ? eventSchema.parse(request.result)
            : null;
          if ((current?.version ?? 0) !== (previous?.version ?? 0))
            throw new Error(
              "Lịch đã thay đổi ở tab khác. Nội dung đang nhập vẫn được giữ; đóng form và mở lại bản mới trước khi lưu.",
            );
          const settingsRequest = tx
            .objectStore("calendarSettings")
            .get("calendar");
          settingsRequest.onsuccess = () => {
            try {
              const settings = settingsRequest.result
                ? settingsSchema.parse(settingsRequest.result)
                : defaultCalendarSettings;
              if (
                [
                  parsed,
                  ...parsed.exceptions.flatMap((item) =>
                    item.input ? [item.input] : [],
                  ),
                ].some(
                  (item) =>
                    !settings.groups.some((group) => group.id === item.groupId),
                )
              )
                throw new Error("Nhóm lịch không còn tồn tại. Chọn nhóm khác.");
              tx.objectStore("calendarEvents").put(parsed);
            } catch (cause) {
              fail(cause);
            }
          };
          const oldProjects = eventLinks(current, "projectIds");
          const newProjects = eventLinks(parsed, "projectIds");
          for (const id of new Set([...oldProjects, ...newProjects])) {
            const projectRequest = tx.objectStore("projects").get(id);
            projectRequest.onsuccess = () => {
              try {
                if (!projectRequest.result) {
                  if (newProjects.includes(id) && !oldProjects.includes(id))
                    throw new Error("Dự án liên kết không còn tồn tại.");
                  return;
                }
                const project = projectSchema.parse(projectRequest.result);
                if (
                  project.archivedAt &&
                  newProjects.includes(id) &&
                  !oldProjects.includes(id)
                )
                  throw new Error("Khôi phục dự án trước khi gắn lịch mới.");
                const ids = [
                  ...project.relatedEventIds.filter(
                    (eventId) => eventId !== parsed.id,
                  ),
                  ...(newProjects.includes(id) ? [parsed.id] : []),
                ];
                if (
                  JSON.stringify([...ids].sort()) ===
                  JSON.stringify([...project.relatedEventIds].sort())
                )
                  return;
                const updated: Project = {
                  ...project,
                  relatedEventIds: ids,
                  version: project.version + 1,
                  updatedAt: parsed.updatedAt,
                  updates: [
                    {
                      id: crypto.randomUUID(),
                      at: parsed.updatedAt,
                      message: "Đã cập nhật liên kết lịch.",
                    },
                    ...project.updates,
                  ].slice(0, 100),
                };
                tx.objectStore("projects").put(projectSchema.parse(updated));
              } catch (cause) {
                fail(cause);
              }
            };
          }
          const oldNotes = eventLinks(current, "noteIds");
          for (const id of eventLinks(parsed, "noteIds").filter(
            (id) => !oldNotes.includes(id),
          )) {
            const noteRequest = tx.objectStore("notes").get(id);
            noteRequest.onsuccess = () => {
              try {
                if (
                  !noteRequest.result ||
                  noteSchema.parse(noteRequest.result).trashedAt
                )
                  throw new Error("Ghi chú liên kết không còn khả dụng.");
              } catch (cause) {
                fail(cause);
              }
            };
          }
          if (parsed.sourceMilestone && !current?.sourceMilestone) {
            const source = parsed.sourceMilestone;
            const sourceRequest = tx
              .objectStore("projects")
              .get(source.projectId);
            sourceRequest.onsuccess = () => {
              try {
                const project = projectSchema.parse(sourceRequest.result);
                if (
                  project.archivedAt ||
                  !project.items.some(
                    (item) =>
                      item.id === source.itemId && item.kind === "milestone",
                  )
                )
                  throw new Error("Mốc dự án không còn khả dụng.");
              } catch (cause) {
                fail(cause);
              }
            };
          }
        } catch (cause) {
          fail(cause);
        }
      };
      tx.oncomplete = () => {
        announceLocalChange(calendarChangedEvent);
        announceLocalChange(projectsChangedEvent);
        resolve(parsed);
      };
      tx.onabort = () =>
        reject(
          failure ??
            new Error(
              "Không lưu được lịch. Kiểm tra dung lượng/quyền lưu trữ rồi thử lại; nội dung đang nhập vẫn được giữ.",
            ),
        );
    });
  },
  async saveSettings(settings) {
    const parsed = settingsSchema.parse({
      ...settings,
      version: settings.version + 1,
    });
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("calendarSettings", "readwrite");
      const store = tx.objectStore("calendarSettings");
      let failure: unknown;
      const request = store.get("calendar");
      request.onsuccess = () => {
        try {
          const version = request.result
            ? settingsSchema.parse(request.result).version
            : 0;
          if (version !== settings.version)
            throw new Error(
              "Cài đặt đã thay đổi ở tab khác. Tải lại trang trước khi lưu.",
            );
          store.put(parsed);
        } catch (cause) {
          failure = cause;
          tx.abort();
        }
      };
      tx.oncomplete = () => {
        announceLocalChange(calendarChangedEvent);
        resolve(parsed);
      };
      tx.onabort = () =>
        reject(failure ?? new Error("Không lưu được cài đặt lịch."));
    });
  },
};
