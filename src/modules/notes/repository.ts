import { firebaseEnabled } from "@/lib/firebase/client";
import { cloudNoteRepository } from "@/lib/firebase/cloud-client";
import { openLocalDatabase, announceLocalChange } from "@/lib/local-database";
import { projectSchema, type Project } from "@/modules/projects/model";
import { projectsChangedEvent } from "@/modules/projects/repository";
import {
  imageIds,
  noteSchema,
  notesChangedEvent,
  type Note,
  type Attachment,
} from "./model";

export interface NoteRepository {
  list(): Promise<Note[]>;
  get(id: string): Promise<Note | null>;
  attachment(id: string, noteId: string): Promise<Attachment | null>;
  commit(
    previous: Note | null,
    next: Note | null,
    attachments?: Attachment[],
  ): Promise<Note | null>;
}
async function read<T>(
  storeName: string,
  request: (store: IDBObjectStore) => IDBRequest,
  decode: (value: unknown) => T,
): Promise<T> {
  const db = await openLocalDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const operation = request(tx.objectStore(storeName));
    let result: T;
    let failure: unknown;
    operation.onsuccess = () => {
      try {
        result = decode(operation.result);
      } catch {
        failure = new Error(
          "Dữ liệu ghi chú không đúng phiên bản. Dữ liệu gốc vẫn được giữ.",
        );
        tx.abort();
      }
    };
    tx.oncomplete = () => resolve(result);
    tx.onabort = () =>
      reject(failure ?? tx.error ?? new Error("Không đọc được dữ liệu local."));
  });
}

export const localNoteRepository: NoteRepository = {
  list: () =>
    read(
      "notes",
      (store) => store.getAll(),
      (value) => noteSchema.array().parse(value),
    ),
  get: (id) =>
    read(
      "notes",
      (store) => store.get(id),
      (value) => (value ? noteSchema.parse(value) : null),
    ),
  attachment: (id, noteId) =>
    read(
      "noteAttachments",
      (store) => store.get(id),
      (value) => {
        const record = value as Attachment | undefined;
        if (!record) return null;
        if (record.noteId !== noteId || !(record.blob instanceof Blob))
          throw new Error("Ảnh không hợp lệ.");
        return record;
      },
    ),
  async commit(previous, next, attachments = []) {
    if (!previous && !next) throw new Error("Thiếu ghi chú.");
    if (next) noteSchema.parse(next);
    const id = next?.id ?? previous!.id;
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        ["notes", "noteAttachments", "projects"],
        "readwrite",
      );
      const notes = tx.objectStore("notes");
      const assets = tx.objectStore("noteAttachments");
      const projects = tx.objectStore("projects");
      let failure: unknown;
      const abort = (cause: unknown) => {
        failure = cause;
        tx.abort();
      };
      const currentRequest = notes.get(id);
      currentRequest.onsuccess = () => {
        try {
          const current = currentRequest.result
            ? noteSchema.parse(currentRequest.result)
            : null;
          if (current?.version !== previous?.version)
            throw new Error(
              "Ghi chú đã thay đổi ở tab khác. Bản nháp vẫn được giữ; sao chép nội dung hoặc tải bản mới trước khi tiếp tục.",
            );
          if (
            next &&
            (next.id !== id || next.version !== (current?.version ?? 0) + 1)
          )
            throw new Error("Phiên bản ghi chú không hợp lệ.");
          const projectIds = [
            ...new Set([
              ...(current?.projectIds ?? []),
              ...(next?.projectIds ?? []),
            ]),
          ];
          const linkedProjects = new Map<string, Project>();
          let ownedAssets: Attachment[] = [];
          let outstanding = projectIds.length + 1;
          const finishRead = () => {
            if (--outstanding !== 0) return;
            try {
              const retainedIds = new Set(
                next
                  ? [
                      next.content,
                      ...next.revisions.map((revision) => revision.content),
                    ].flatMap(imageIds)
                  : [],
              );
              const available = new Set(
                [...ownedAssets, ...attachments].map((asset) => asset.id),
              );
              for (const assetId of retainedIds)
                if (!available.has(assetId))
                  throw new Error(
                    "Ảnh chưa được lưu hoặc không thuộc ghi chú này. Bản nháp vẫn được giữ.",
                  );
              for (const asset of attachments) {
                if (
                  asset.noteId !== id ||
                  !/^[0-9a-f-]{36}$/i.test(asset.id) ||
                  !(asset.blob instanceof Blob) ||
                  asset.blob.size > 5 * 1024 * 1024 ||
                  ![
                    "image/png",
                    "image/jpeg",
                    "image/webp",
                    "image/gif",
                  ].includes(asset.blob.type)
                )
                  throw new Error("Tệp ảnh không hợp lệ.");
                if (retainedIds.has(asset.id)) assets.put(asset);
              }
              for (const asset of ownedAssets)
                if (!retainedIds.has(asset.id)) assets.delete(asset.id);
              for (const projectId of projectIds) {
                const project = linkedProjects.get(projectId);
                const wasLinked = !!current?.projectIds.includes(projectId);
                const isLinked = !!next?.projectIds.includes(projectId);
                if (!project && isLinked)
                  throw new Error("Dự án liên kết không còn tồn tại.");
                if (project?.archivedAt && isLinked && !wasLinked)
                  throw new Error("Khôi phục dự án trước khi gắn ghi chú mới.");
                if (!project || wasLinked === isLinked) continue;
                projects.put(
                  projectSchema.parse({
                    ...project,
                    relatedNoteIds: isLinked
                      ? [...new Set([...project.relatedNoteIds, id])]
                      : project.relatedNoteIds.filter(
                          (noteId) => noteId !== id,
                        ),
                    version: project.version + 1,
                    updatedAt: new Date().toISOString(),
                    updates: [
                      {
                        id: crypto.randomUUID(),
                        at: new Date().toISOString(),
                        message: isLinked
                          ? "Đã gắn ghi chú vào dự án."
                          : "Đã gỡ liên kết ghi chú.",
                      },
                      ...project.updates,
                    ].slice(0, 100),
                  }),
                );
              }
              if (next) notes.put(next);
              else notes.delete(id);
            } catch (cause) {
              abort(cause);
            }
          };
          const assetRequest = assets.index("noteId").getAll(id);
          assetRequest.onsuccess = () => {
            ownedAssets = assetRequest.result;
            finishRead();
          };
          for (const projectId of projectIds) {
            const projectRequest = projects.get(projectId);
            projectRequest.onsuccess = () => {
              try {
                if (projectRequest.result)
                  linkedProjects.set(
                    projectId,
                    projectSchema.parse(projectRequest.result),
                  );
                finishRead();
              } catch (cause) {
                abort(cause);
              }
            };
          }
        } catch (cause) {
          abort(cause);
        }
      };
      tx.oncomplete = () => {
        announceLocalChange(notesChangedEvent);
        announceLocalChange(projectsChangedEvent);
        resolve(next);
      };
      tx.onabort = () =>
        reject(
          failure ??
            tx.error ??
            new Error("Không lưu được ghi chú. Bản nháp vẫn được giữ."),
        );
    });
  },
};

export const noteRepository: NoteRepository = firebaseEnabled
  ? cloudNoteRepository
  : localNoteRepository;
