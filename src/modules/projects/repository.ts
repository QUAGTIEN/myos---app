import { firebaseEnabled } from "@/lib/firebase/client";
import { cloudProjectRepository } from "@/lib/firebase/cloud-client";
import { openLocalDatabase } from "@/lib/local-database";
import { announceRepositorySave } from "@/lib/repository-cache";
import { projectSchema, type Project } from "./model";

export interface ProjectRepository {
  list(): Promise<Project[]>;
  get(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(
    id: string,
    expectedVersion: number,
    transform: (current: Project) => Project,
    attachment?: { add?: { id: string; blob: Blob }; remove?: string },
    baseline?: Project,
  ): Promise<Project>;
}

export const projectsChangedEvent = "myos:projects-changed";
const storeName = "projects";

async function read<T>(
  operation: (store: IDBObjectStore) => IDBRequest,
  decode: (value: unknown) => T,
): Promise<T> {
  const db = await openLocalDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const request = operation(transaction.objectStore(storeName));
    let value: T;
    let failure: unknown;
    request.onsuccess = () => {
      try {
        value = decode(request.result);
      } catch {
        failure = new Error(
          "Dữ liệu dự án không đúng phiên bản. Dữ liệu gốc vẫn được giữ; hãy kiểm tra trước khi tiếp tục.",
        );
        transaction.abort();
      }
    };
    transaction.oncomplete = () => resolve(value);
    transaction.onabort = () =>
      reject(failure ?? new Error("Không đọc được dự án. Vui lòng thử lại."));
    transaction.onerror = () =>
      reject(new Error("Không đọc được dự án. Vui lòng thử lại."));
  });
}

export const localProjectRepository: ProjectRepository = {
  list: () =>
    read(
      (store) => store.getAll(),
      (value) => projectSchema.array().parse(value),
    ),
  get: (id) =>
    read(
      (store) => store.get(id),
      (value) => (value ? projectSchema.parse(value) : null),
    ),
  async create(project) {
    const validated = projectSchema.parse(project);
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      transaction.objectStore(storeName).add(validated);
      transaction.oncomplete = () => {
        announceRepositorySave({
          kind: "projects",
          id: validated.id,
          value: validated,
        });
        resolve(validated);
      };
      transaction.onabort = () =>
        reject(
          new Error(
            "Không lưu được dự án. Kiểm tra dung lượng và quyền lưu trữ, rồi thử lại.",
          ),
        );
      transaction.onerror = () =>
        reject(
          new Error("Không lưu được dự án. Nội dung đang nhập vẫn được giữ."),
        );
    });
  },
  async update(id, expectedVersion, transform, attachment) {
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(
        attachment ? [storeName, "projectAttachments"] : storeName,
        "readwrite",
      );
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      let saved: Project;
      let failure: unknown;
      // Read/version check/write stay in one active transaction; never await external work here.
      request.onsuccess = () => {
        try {
          if (!request.result)
            throw new Error("Dự án không còn tồn tại trên trình duyệt này.");
          const current = projectSchema.parse(request.result);
          if (current.version !== expectedVersion)
            throw new Error(
              "Dự án đã thay đổi ở tab khác. Giữ lại nội dung đang nhập, đóng form và mở lại bản mới trước khi lưu.",
            );
          saved = projectSchema.parse(transform(current));
          if (saved.id !== id || saved.version !== current.version + 1)
            throw new Error("Phiên bản cập nhật không hợp lệ.");
          store.put(saved);
          if (attachment?.add) {
            if (
              !saved.workspace.attachments.some(
                (file) => file.id === attachment.add!.id,
              )
            )
              throw new Error("Tệp chưa có thông tin dự án.");
            transaction
              .objectStore("projectAttachments")
              .add({ ...attachment.add, projectId: id });
          }
          if (attachment?.remove)
            transaction
              .objectStore("projectAttachments")
              .delete(attachment.remove);
        } catch (error) {
          failure = error;
          transaction.abort();
        }
      };
      transaction.oncomplete = () => {
        announceRepositorySave({ kind: "projects", id, value: saved });
        resolve(saved);
      };
      transaction.onabort = () =>
        reject(
          failure ??
            new Error(
              "Không lưu được thay đổi. Nội dung đang nhập vẫn được giữ.",
            ),
        );
      transaction.onerror = () =>
        reject(new Error("Không lưu được thay đổi. Vui lòng thử lại."));
    });
  },
};

export async function readProjectAttachment(
  projectId: string,
  id: string,
): Promise<Blob> {
  if (firebaseEnabled) throw new Error("Tệp cloud sẽ được triển khai sau.");
  const db = await openLocalDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("projectAttachments", "readonly");
    const request = tx.objectStore("projectAttachments").get(id);
    let result: Blob | undefined;
    request.onsuccess = () => {
      if (
        request.result?.projectId === projectId &&
        request.result.blob instanceof Blob
      )
        result = request.result.blob;
    };
    tx.oncomplete = () =>
      result
        ? resolve(result)
        : reject(new Error("Không tìm thấy tệp của dự án."));
    tx.onabort = () => reject(tx.error ?? new Error("Không đọc được tệp."));
  });
}

export const projectRepository: ProjectRepository = firebaseEnabled
  ? cloudProjectRepository
  : localProjectRepository;
