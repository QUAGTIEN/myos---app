import { firebaseEnabled } from "@/lib/firebase/client";
import { cloudRead, cloudWrite } from "@/lib/firebase/cloud-client";
import { openLocalDatabase } from "@/lib/local-database";
import { announceRepositorySave } from "@/lib/repository-cache";
import { taskSchema, type Task } from "./model";

export interface TaskRepository {
  list(): Promise<Task[]>;
  commit(previous: Task | null, next: Task): Promise<Task>;
}

export const taskRepository: TaskRepository = {
  async list() {
    if (firebaseEnabled)
      return taskSchema.array().parse(await cloudRead("tasks"));
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("tasks", "readonly");
      const request = tx.objectStore("tasks").getAll();
      let tasks: Task[] = [];
      let failure: unknown;
      request.onsuccess = () => {
        try {
          tasks = taskSchema
            .array()
            .parse(request.result)
            .filter((task) => !task.deletedAt);
        } catch (cause) {
          failure = cause;
          tx.abort();
        }
      };
      tx.oncomplete = () => resolve(tasks);
      tx.onabort = () =>
        reject(failure ?? new Error("Không đọc được danh sách công việc."));
      tx.onerror = () =>
        reject(new Error("Không đọc được danh sách công việc."));
    });
  },
  async commit(previous, next) {
    const input = taskSchema.parse(next);
    if (firebaseEnabled)
      return taskSchema.parse(
        await cloudWrite({
          kind: "tasks",
          operation: "save",
          id: input.id,
          expectedVersion: previous?.version ?? 0,
          value: input,
        }),
      );
    const db = await openLocalDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("tasks", "readwrite");
      const store = tx.objectStore("tasks");
      const request = store.get(input.id);
      let failure: unknown;
      request.onsuccess = () => {
        try {
          const current = request.result
            ? taskSchema.parse(request.result)
            : null;
          if (current?.deletedAt) throw new Error("Công việc đã bị xóa.");
          if ((current?.version ?? 0) !== (previous?.version ?? 0))
            throw new Error(
              "Công việc đã thay đổi ở tab khác. Tải lại bản mới trước khi lưu.",
            );
          if (input.version !== (current?.version ?? 0) + 1)
            throw new Error("Phiên bản công việc không hợp lệ.");
          store.put(input);
        } catch (cause) {
          failure = cause;
          tx.abort();
        }
      };
      tx.oncomplete = () => {
        announceRepositorySave({
          kind: "tasks",
          id: input.id,
          value: input.deletedAt ? null : input,
        });
        resolve(input);
      };
      tx.onabort = () =>
        reject(
          failure ??
            new Error(
              "Không lưu được công việc. Nội dung đang nhập vẫn được giữ.",
            ),
        );
      tx.onerror = () => reject(new Error("Không lưu được công việc."));
    });
  },
};
