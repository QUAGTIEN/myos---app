import { projectSchema, type Project } from "./model";

export interface ProjectRepository {
  list(): Promise<Project[]>;
  get(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(
    id: string,
    expectedVersion: number,
    transform: (current: Project) => Project,
  ): Promise<Project>;
}

export const projectsChangedEvent = "myos:projects-changed";
const databaseName = "myos-local";
const storeName = "projects";
let connection: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (connection) return connection;
  connection = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(
        new Error(
          "Trình duyệt không hỗ trợ lưu dự án. Hãy dùng một trình duyệt có IndexedDB.",
        ),
      );
      return;
    }
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName))
        request.result.createObjectStore(storeName, { keyPath: "id" });
    };
    request.onerror = () =>
      reject(
        new Error(
          "Không mở được dữ liệu local. Kiểm tra quyền lưu trữ của trình duyệt.",
        ),
      );
    let abandoned = false;
    request.onblocked = () => {
      abandoned = true;
      reject(new Error("Đóng các tab MyOS cũ rồi thử mở lại dữ liệu."));
    };
    request.onsuccess = () => {
      const db = request.result;
      if (abandoned) {
        db.close();
        return;
      }
      db.onversionchange = () => {
        db.close();
        connection = undefined;
      };
      resolve(db);
    };
  }).catch((error) => {
    connection = undefined;
    throw error;
  });
  return connection;
}

function announceChange() {
  window.dispatchEvent(new Event(projectsChangedEvent));
  if (typeof BroadcastChannel !== "undefined") {
    // Cross-tab notification is best effort; it must not turn a committed write into a failure.
    try {
      const channel = new BroadcastChannel(projectsChangedEvent);
      channel.postMessage("changed");
      channel.close();
    } catch {
      /* Focus refresh remains available if broadcasting is restricted. */
    }
  }
}

async function read<T>(
  operation: (store: IDBObjectStore) => IDBRequest,
  decode: (value: unknown) => T,
): Promise<T> {
  const db = await openDatabase();
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
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      transaction.objectStore(storeName).add(validated);
      transaction.oncomplete = () => {
        announceChange();
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
  async update(id, expectedVersion, transform) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
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
        } catch (error) {
          failure = error;
          transaction.abort();
        }
      };
      transaction.oncomplete = () => {
        announceChange();
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
