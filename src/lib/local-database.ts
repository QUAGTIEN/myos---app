// Shared database version: upgrading adds stores without touching existing projects.
let connection: Promise<IDBDatabase> | undefined;
export function openLocalDatabase(): Promise<IDBDatabase> {
  if (connection) return connection;
  connection = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("myos-local", 4);
    let abandoned = false;
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("projects"))
        db.createObjectStore("projects", { keyPath: "id" });
      if (!db.objectStoreNames.contains("projectAttachments"))
        db.createObjectStore("projectAttachments", { keyPath: "id" });
      if (!db.objectStoreNames.contains("notes"))
        db.createObjectStore("notes", { keyPath: "id" });
      if (!db.objectStoreNames.contains("calendarEvents"))
        db.createObjectStore("calendarEvents", { keyPath: "id" });
      if (!db.objectStoreNames.contains("calendarSettings"))
        db.createObjectStore("calendarSettings", { keyPath: "id" });
      if (!db.objectStoreNames.contains("noteAttachments"))
        db.createObjectStore("noteAttachments", { keyPath: "id" }).createIndex(
          "noteId",
          "noteId",
        );
    };
    request.onerror = () =>
      reject(request.error ?? new Error("Không mở được dữ liệu local."));
    request.onblocked = () => {
      abandoned = true;
      reject(
        new Error("Đóng các tab MyOS cũ rồi thử tải lại để nâng cấp dữ liệu."),
      );
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

let windowId: string | undefined;
function currentWindowId() {
  return (windowId ??= crypto.randomUUID());
}
export function isOwnLocalChange(event: MessageEvent) {
  return event.data?.source === currentWindowId();
}
export function announceLocalChange(event: string, detail?: unknown) {
  window.dispatchEvent(
    detail ? new CustomEvent(event, { detail }) : new Event(event),
  );
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(event);
      channel.postMessage({ source: currentWindowId() });
      channel.close();
    }
  } catch {
    /* Focus refresh still works when channels are restricted. */
  }
}
