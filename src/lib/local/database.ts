// Shared database version: upgrading adds stores without touching existing projects.
let connection: Promise<IDBDatabase> | undefined;
export function openLocalDatabase(): Promise<IDBDatabase> {
  if (connection) return connection;
  connection = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("myos-local", 3);
    let abandoned = false;
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("projects"))
        db.createObjectStore("projects", { keyPath: "id" });
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

export function announceLocalChange(event: string) {
  window.dispatchEvent(new Event(event));
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(event);
      channel.postMessage("changed");
      channel.close();
    }
  } catch {
    /* Focus refresh still works when channels are restricted. */
  }
}

export function subscribeLocalChange(event: string, refresh: () => void) {
  let channel: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== "undefined")
      channel = new BroadcastChannel(event);
  } catch {
    /* The focus listener remains available. */
  }
  channel?.addEventListener("message", refresh);
  window.addEventListener(event, refresh);
  window.addEventListener("focus", refresh);
  return () => {
    channel?.close();
    window.removeEventListener(event, refresh);
    window.removeEventListener("focus", refresh);
  };
}
