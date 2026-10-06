import { expect, test, type Page } from "@playwright/test";

async function createNote(page: Page, title = "Ý tưởng cá nhân") {
  await page.goto("/notes");
  await page.getByRole("button", { name: "Tạo ghi chú", exact: true }).click();
  await expect(page.getByLabel("Tiêu đề ghi chú")).toBeVisible();
  await page.getByLabel("Tiêu đề ghi chú").fill(title);
  await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
}
async function save(page: Page) {
  await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
  await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
}
async function imageFile(page: Page) {
  const base64 = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 120;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#e6f7f5";
    ctx.fillRect(0, 0, 200, 120);
    ctx.fillStyle = "#007f78";
    ctx.fillRect(20, 20, 160, 80);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  return {
    name: "tham-khao.png",
    mimeType: "image/png",
    buffer: Buffer.from(base64, "base64"),
  };
}
async function assertImage(page: Page) {
  const img = page.locator(".note-document .note-image img");
  await expect(img).toBeVisible();
  await expect
    .poll(() => img.evaluate((node) => (node as HTMLImageElement).naturalWidth))
    .toBe(200);
}

test("rich text, checklist, autosave and organization persist", async ({
  page,
}, testInfo) => {
  await createNote(page);
  const editor = page.getByRole("textbox", { name: "Nội dung ghi chú" });
  await editor.fill("Những ý tưởng cho tuần mới");
  // Touch devices do not expose desktop Select All shortcuts; use native text selection.
  await editor.evaluate((element) => {
    (element as HTMLElement).focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  });
  await expect
    .poll(() => page.evaluate(() => window.getSelection()?.toString()))
    .toBe("Những ý tưởng cho tuần mới");
  await page.getByRole("button", { name: "Chữ đậm", exact: true }).click();
  await expect(editor.locator("strong")).toHaveText(
    "Những ý tưởng cho tuần mới",
  );
  await editor.press("End");
  await editor.press("Enter");
  await page.getByRole("button", { name: "Checklist", exact: true }).click();
  await editor.pressSequentially("Đọc sách mỗi ngày");
  await editor.locator('input[type="checkbox"]').click();
  await page.getByLabel("Thư mục", { exact: true }).fill("Cá nhân");
  await page.getByLabel("Nhãn", { exact: true }).fill("ý tưởng, tuần mới");
  await page.getByLabel("Tiêu đề ghi chú").fill("Kế hoạch cá nhân");
  // Debounced autosave, without clicking a save button.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Kế hoạch cá nhân",
  );
  await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
  await page.reload();
  await expect(editor.locator("strong").first()).toHaveText(
    "Những ý tưởng cho tuần mới",
  );
  await expect(editor.locator('input[type="checkbox"]')).toBeChecked();
  await expect(page.getByLabel("Nhãn", { exact: true })).toHaveValue(
    "ý tưởng, tuần mới",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath("note-editor.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Ghim", exact: true }).click();
  await expect(page.getByRole("button", { name: "Bỏ ghim" })).toBeVisible();
  await page.getByRole("link", { name: "Tất cả ghi chú", exact: true }).click();
  await page.getByRole("button", { name: "Đã ghim" }).click();
  await page.getByRole("button", { name: "Cá nhân", exact: true }).click();
  await page.getByRole("button", { name: "#ý tưởng", exact: true }).click();
  await page
    .getByRole("searchbox", { name: "Tìm ghi chú theo tiêu đề" })
    .fill("ca nhan");
  await expect(
    page.getByRole("heading", { name: "Kế hoạch cá nhân", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("note-library.png"),
    fullPage: true,
  });
});

test("images survive history restoration, trash and permanent deletion", async ({
  page,
}, testInfo) => {
  await page.goto("/notes");
  await page
    .getByLabel("Tạo ghi chú từ ảnh")
    .setInputFiles(await imageFile(page));
  await expect(page.getByLabel("Tiêu đề ghi chú")).toHaveValue("tham-khao");
  const url = page.url();
  await assertImage(page);
  await page.reload();
  await assertImage(page);
  await page.getByRole("button", { name: "Gỡ ảnh tham-khao.png" }).click();
  await save(page);
  await expect(page.locator(".note-document .note-image")).toHaveCount(0);
  await page.getByRole("button", { name: "Lịch sử", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.locator(".note-image img")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("note-history.png") });
  page.once("dialog", (confirmation) => confirmation.accept());
  await dialog
    .getByRole("button", { name: "Khôi phục phiên bản", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await save(page);
  await assertImage(page);
  page.once("dialog", (confirmation) => confirmation.accept());
  await page.getByRole("button", { name: "Thùng rác", exact: true }).click();
  await expect(page.getByLabel("Tiêu đề ghi chú")).toBeDisabled();
  await page.getByRole("link", { name: "Tất cả ghi chú", exact: true }).click();
  await expect(page.locator(".note-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Thùng rác" }).click();
  await page.getByRole("heading", { name: "tham-khao", exact: true }).click();
  await page.getByRole("button", { name: "Khôi phục", exact: true }).click();
  await expect(page.getByLabel("Tiêu đề ghi chú")).toBeEnabled();
  await assertImage(page);
  page.once("dialog", (confirmation) => confirmation.accept());
  await page.getByRole("button", { name: "Thùng rác", exact: true }).click();
  page.once("dialog", (confirmation) => confirmation.accept());
  await page
    .getByRole("button", { name: "Xóa vĩnh viễn", exact: true })
    .click();
  await expect(page).toHaveURL(/\/notes$/);
  await page.goto(url);
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy ghi chú trên trình duyệt này",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open("myos-local");
        request.onsuccess = () => resolve(request.result);
      });
      const count = await new Promise<number>((resolve) => {
        const request = db
          .transaction("noteAttachments")
          .objectStore("noteAttachments")
          .count();
        request.onsuccess = () => resolve(request.result);
      });
      db.close();
      return count;
    }),
  ).toBe(0);
});

test("pasted images persist and unsupported files do not enter content", async ({
  page,
}) => {
  await createNote(page);
  const file = await imageFile(page);
  await page
    .getByRole("textbox", { name: "Nội dung ghi chú" })
    .evaluate((element, base64) => {
      const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      const clipboard = new DataTransfer();
      clipboard.items.add(
        new File([bytes], "anh-dan.png", { type: "image/png" }),
      );
      element.dispatchEvent(
        new ClipboardEvent("paste", {
          clipboardData: clipboard,
          bubbles: true,
          cancelable: true,
        }),
      );
    }, file.buffer.toString("base64"));
  await assertImage(page);
  await save(page);
  await page.reload();
  await assertImage(page);
  await page.getByLabel("Chọn ảnh ghi chú").setInputFiles({
    name: "invalid.png",
    mimeType: "image/png",
    buffer: Buffer.from("not an image"),
  });
  await expect(
    page.getByRole("alert").filter({ hasText: "Không đọc được ảnh" }),
  ).toBeVisible();
  await expect(page.locator(".note-document .note-image img")).toHaveCount(1);
});

test("quota aborts the entire image save and keeps a retryable draft", async ({
  page,
}) => {
  await createNote(page);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (
      ...args: Parameters<typeof original>
    ) {
      if (this.name === "notes") {
        IDBObjectStore.prototype.put = original;
        throw new DOMException("Full", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
  });
  await page
    .getByLabel("Chọn ảnh ghi chú")
    .setInputFiles(await imageFile(page));
  await assertImage(page);
  await expect(page.locator(".note-save-bar")).toContainText("Lưu lỗi");
  await expect(
    page.getByRole("alert").filter({ hasText: "Không đủ dung lượng" }),
  ).toBeVisible();
  expect(
    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open("myos-local");
        request.onsuccess = () => resolve(request.result);
      });
      const count = await new Promise<number>((resolve) => {
        const request = db
          .transaction("noteAttachments")
          .objectStore("noteAttachments")
          .count();
        request.onsuccess = () => resolve(request.result);
      });
      db.close();
      return count;
    }),
  ).toBe(0);
  await save(page);
  await page.reload();
  await assertImage(page);
});

test("two tabs preserve unsaved content and reject stale autosave", async ({
  page,
  context,
}) => {
  // Install before the application schedules timers; replacing active timers is undefined.
  await page.clock.install({ time: new Date("2026-10-06T12:00:00Z") });
  await createNote(page, "Bản chung");
  const second = await context.newPage();
  await second.goto(page.url());
  await expect(second.getByLabel("Tiêu đề ghi chú")).toHaveValue("Bản chung");
  // Pause debounce before editing, then manually commit the second tab first.
  await page.clock.pauseAt(new Date("2026-10-06T12:01:00Z"));
  await page.getByLabel("Tiêu đề ghi chú").fill("Bản nháp cần giữ");
  await second.getByLabel("Tiêu đề ghi chú").fill("Bản mới từ tab hai");
  await save(second);
  await expect(
    page.getByRole("alert").filter({ hasText: "tab khác" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
  await expect(page.getByLabel("Tiêu đề ghi chú")).toHaveValue(
    "Bản nháp cần giữ",
  );
  await second.reload();
  await expect(second.getByLabel("Tiêu đề ghi chú")).toHaveValue(
    "Bản mới từ tab hai",
  );
  page.once("dialog", (confirmation) => confirmation.accept());
  await page.getByRole("button", { name: "Tải bản mới", exact: true }).click();
  await expect(page.getByLabel("Tiêu đề ghi chú")).toHaveValue(
    "Bản mới từ tab hai",
  );
  await second.close();
});

test("project links are reciprocal and removed on permanent deletion", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Tên dự án")
    .fill("Dự án có ghi chú");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Tạo dự án", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Dự án có ghi chú", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/[0-9a-f-]+$/);
  const projectUrl = page.url();
  await page.getByRole("button", { name: "Tạo ghi chú", exact: true }).click();
  await page.getByLabel("Tiêu đề ghi chú").fill("Tài liệu dự án");
  await save(page);
  await expect(
    page.getByRole("checkbox", { name: "Dự án có ghi chú", exact: true }),
  ).toBeChecked();
  const noteUrl = page.url();
  await page.getByRole("link", { name: "Mở dự án Dự án có ghi chú" }).click();
  await expect(
    page.getByRole("link", { name: "Tài liệu dự án", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Tài liệu dự án", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Dự án có ghi chú", exact: true })
    .click();
  await save(page);
  await page.goto(projectUrl);
  await expect(
    page.getByRole("link", { name: "Tài liệu dự án", exact: true }),
  ).not.toBeVisible();
  await page.goto(noteUrl);
  await page
    .getByRole("checkbox", { name: "Dự án có ghi chú", exact: true })
    .click();
  await save(page);
  page.once("dialog", (confirmation) => confirmation.accept());
  await page.getByRole("button", { name: "Thùng rác", exact: true }).click();
  page.once("dialog", (confirmation) => confirmation.accept());
  await page
    .getByRole("button", { name: "Xóa vĩnh viễn", exact: true })
    .click();
  await expect(page).toHaveURL(/\/notes$/);
  expect(
    await page.evaluate(async (id) => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open("myos-local");
        request.onsuccess = () => resolve(request.result);
      });
      const project = await new Promise<{ relatedNoteIds: string[] }>(
        (resolve) => {
          const request = db
            .transaction("projects")
            .objectStore("projects")
            .get(id);
          request.onsuccess = () => resolve(request.result);
        },
      );
      db.close();
      return project.relatedNoteIds;
    }, projectUrl.split("/").pop()!),
  ).toEqual([]);
});

test("database upgrade preserves G3 projects and missing or blocked notes recover", async ({
  page,
  context,
}) => {
  // Start on a route that does not open IndexedDB before seeding the older version.
  await page.goto("/login");
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("myos-local", 1);
      request.onupgradeneeded = () =>
        request.result.createObjectStore("projects", { keyPath: "id" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve) => {
      const tx = db.transaction("projects", "readwrite");
      const at = new Date().toISOString();
      tx.objectStore("projects").add({
        id: crypto.randomUUID(),
        schemaVersion: 1,
        version: 1,
        title: "Dự án G3 cần giữ",
        description: "Nội dung gốc",
        status: "active",
        color: "turquoise",
        startDate: "",
        dueDate: "",
        progressMode: "manual",
        manualProgress: 45,
        createdAt: at,
        updatedAt: at,
        archivedAt: null,
        pinned: true,
        items: [],
        updates: [],
        relatedNoteIds: [],
        relatedEventIds: [],
      });
      tx.oncomplete = () => resolve();
    });
    db.close();
  });
  await page.goto("/notes");
  await expect(
    page.getByRole("button", { name: "Tạo ghi chú", exact: true }),
  ).toBeEnabled();
  await page.goto("/projects");
  await expect(
    page.getByRole("heading", { name: "Dự án G3 cần giữ", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "45",
  );
  await page.goto("/notes/12345678-1234-4123-8123-123456789abc");
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy ghi chú trên trình duyệt này",
    }),
  ).toBeVisible();
  const restricted = await context.newPage();
  await restricted.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  await restricted.goto("/notes");
  await expect(
    restricted.getByRole("alert").filter({ hasText: "quyền lưu trữ" }),
  ).toBeVisible();
  await expect(
    restricted.getByRole("button", { name: "Tạo ghi chú", exact: true }),
  ).toBeDisabled();
  await restricted.close();
});

test("revision retention releases orphan images and list pagination filters correctly", async ({
  page,
}) => {
  await page.goto("/notes");
  await page
    .getByLabel("Tạo ghi chú từ ảnh")
    .setInputFiles(await imageFile(page));
  await assertImage(page);
  await page.getByRole("button", { name: "Gỡ ảnh tham-khao.png" }).click();
  await save(page);
  for (let index = 1; index <= 20; index++) {
    await page.getByLabel("Tiêu đề ghi chú").fill("Phiên bản " + index);
    await save(page);
  }
  expect(
    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open("myos-local");
        request.onsuccess = () => resolve(request.result);
      });
      const result = await new Promise<{ revisions: number; assets: number }>(
        (resolve) => {
          const tx = db.transaction(["notes", "noteAttachments"]);
          const notes = tx.objectStore("notes").getAll();
          const assets = tx.objectStore("noteAttachments").count();
          tx.oncomplete = () =>
            resolve({
              revisions: notes.result[0].revisions.length,
              assets: assets.result,
            });
        },
      );
      db.close();
      return result;
    }),
  ).toEqual({ revisions: 20, assets: 0 });
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("myos-local");
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>((resolve) => {
      const tx = db.transaction("notes", "readwrite");
      for (let index = 0; index < 13; index++) {
        const at = new Date().toISOString();
        tx.objectStore("notes").add({
          id: crypto.randomUUID(),
          schemaVersion: 1,
          version: 1,
          title: "Ghi chú " + index,
          content: { type: "doc", content: [{ type: "paragraph" }] },
          folder: "",
          tags: [],
          projectIds: [],
          pinned: index === 0,
          trashedAt: null,
          createdAt: at,
          updatedAt: at,
          revisions: [],
        });
      }
      tx.oncomplete = () => resolve();
    });
    db.close();
  });
  await page.goto("/notes");
  await expect(page.locator(".note-card")).toHaveCount(12);
  await expect(page.locator(".note-card").first()).toContainText("Ghi chú 0");
  await page.getByRole("button", { name: "Sau", exact: true }).click();
  await expect(page.locator(".note-card")).toHaveCount(2);
  await page
    .getByRole("searchbox", { name: "Tìm ghi chú theo tiêu đề" })
    .fill("ghi chu 12");
  await expect(page.locator(".note-card")).toHaveCount(1);
});
