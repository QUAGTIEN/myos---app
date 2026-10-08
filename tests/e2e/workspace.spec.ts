import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { emptyProjectInput } from "../../src/modules/projects/model";

async function createProject(page: Page) {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên dự án").fill("IoT giám sát môi trường");
  await dialog.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole("heading", { name: "IoT giám sát môi trường", exact: true })
    .click();
  await expect(page.getByRole("region", { name: "Hồ sơ dự án" })).toBeVisible();
}
async function editWorkspace(page: Page, tab: string) {
  const panel = page.getByRole("region", { name: "Hồ sơ dự án" });
  await panel.getByRole("button", { name: tab, exact: true }).click();
  await panel
    .getByRole("button", { name: "Chỉnh sửa hồ sơ", exact: true })
    .click();
  return panel;
}
async function saveWorkspace(page: Page) {
  const panel = page.getByRole("region", { name: "Hồ sơ dự án" });
  await panel.getByRole("button", { name: "Lưu hồ sơ", exact: true }).click();
  await expect(
    panel.getByRole("button", { name: "Lưu hồ sơ", exact: true }),
  ).not.toBeVisible();
}

test("calendar book navigates year/day; independent timetables persist and copy atomically", async ({
  page,
  isMobile,
}, info) => {
  await page.goto("/calendar");
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await page.getByRole("button", { name: "Năm", exact: true }).click();
  await expect(page.getByLabel("Lịch năm 2026")).toBeVisible();
  await expect(page.locator(".calendar-year-month")).toHaveCount(12);
  await expect(
    page.getByRole("button", { name: "Ngày 29 tháng 2 năm 2026", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Năm sau", exact: true }).click();
  await expect(page.getByLabel("Lịch năm 2027")).toBeVisible();
  await page.screenshot({
    path: info.outputPath("calendar-year.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Ngày 6 tháng 10 năm 2027", exact: true })
    .click();
  await page.getByRole("button", { name: "Ngày", exact: true }).click();
  await expect(page.locator(".fc-timeGridDay-view")).toBeVisible();
  await page.getByRole("button", { name: "Công việc", exact: true }).click();
  const tools = page.getByLabel("Thao tác lịch", { exact: true });
  await expect(
    page.getByRole("button", { name: "Tạo lịch hẹn", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Tạo bộ lịch", exact: true }),
  ).not.toBeVisible();
  await tools.focus();
  await tools.press("Enter");
  await expect(
    page.getByRole("button", { name: "Tạo bộ lịch", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sửa bộ lịch", exact: true }),
  ).toHaveCount(0);
  await tools.press("Escape");
  await expect(tools).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Tạo bộ lịch", exact: true }),
  ).not.toBeVisible();
  await tools.click();
  await page.locator(".schedule-period h2").click();
  await expect(
    page.getByRole("button", { name: "Tạo bộ lịch", exact: true }),
  ).not.toBeVisible();
  await tools.click();
  await page.getByRole("button", { name: "Tạo bộ lịch", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên bộ lịch").fill("Học kỳ IoT");
  await dialog.getByLabel("Màu bộ lịch").selectOption("violet");
  await dialog
    .getByRole("button", { name: "Lưu bộ lịch", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(tools).toBeFocused();
  const sourceId = await page.getByLabel("Bộ thời khóa biểu").inputValue();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await page.getByRole("button", { name: "Tạo lịch hẹn", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Tên lịch hẹn", { exact: true })
    .fill("Thực hành cảm biến");
  await dialog.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-06T09:00");
  await dialog.getByLabel("Kết thúc", { exact: true }).fill("2026-10-06T10:00");
  await dialog.getByLabel("Lặp hàng tuần", { exact: true }).check();
  await dialog.getByLabel("Lặp đến hết ngày").fill("2026-10-27");
  await dialog
    .getByRole("button", { name: "Lưu lịch hẹn", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await tools.click();
  await page
    .getByRole("button", { name: "Sao chép bộ lịch", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên bộ lịch").fill("Bộ học riêng");
  await page.evaluate(() => {
    sessionStorage.setItem("test-copy-failure", "1");
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (
      ...args: Parameters<IDBDatabase["transaction"]>
    ) {
      const tx = original.apply(this, args);
      if (
        sessionStorage.getItem("test-copy-failure") &&
        args[1] === "readwrite" &&
        Array.from(tx.objectStoreNames).includes("calendarSettings") &&
        Array.from(tx.objectStoreNames).includes("calendarEvents")
      )
        tx.abort();
      return tx;
    };
  });
  await dialog
    .getByRole("button", { name: "Lưu bộ lịch", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toBeVisible();
  await expect(dialog.getByLabel("Tên bộ lịch")).toHaveValue("Bộ học riêng");
  expect(
    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const request = indexedDB.open("myos-local");
        request.onsuccess = () => resolve(request.result);
      });
      const state = await new Promise<{ groups: number; events: number }>(
        (resolve, reject) => {
          const tx = db.transaction(["calendarSettings", "calendarEvents"]);
          let groups = 0,
            events = 0;
          const settings = tx.objectStore("calendarSettings").get("calendar");
          settings.onsuccess = () => {
            groups = settings.result.groups.length;
          };
          const count = tx.objectStore("calendarEvents").count();
          count.onsuccess = () => {
            events = count.result;
          };
          tx.oncomplete = () => resolve({ groups, events });
          tx.onabort = () => reject(tx.error);
        },
      );
      db.close();
      return state;
    }),
  ).toEqual({ groups: 4, events: 1 });
  await page.evaluate(() => sessionStorage.removeItem("test-copy-failure"));
  await dialog
    .getByRole("button", { name: "Lưu bộ lịch", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  const copyId = await page.getByLabel("Bộ thời khóa biểu").inputValue();
  expect(copyId).not.toBe(sourceId);
  await page.getByRole("button", { name: "Tháng", exact: true }).click();
  await expect(
    page.locator(".fc-event").filter({ hasText: "Thực hành cảm biến" }),
  ).toHaveCount(4);
  await tools.click();
  await page.getByRole("button", { name: "Sửa bộ lịch", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên bộ lịch").fill("Bộ học tại nhà");
  await dialog
    .getByRole("button", { name: "Lưu bộ lịch", exact: true })
    .click();
  await page.reload();
  await page.getByLabel("Bộ thời khóa biểu").selectOption(copyId);
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await page.getByRole("button", { name: "Tháng", exact: true }).click();
  await expect(
    page.getByLabel("Bộ thời khóa biểu").locator("option:checked"),
  ).toHaveText("Bộ học tại nhà");
  await expect(
    page.locator(".fc-event").filter({ hasText: "Thực hành cảm biến" }),
  ).toHaveCount(4);
  if (!isMobile) await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({
    path: info.outputPath("timetable.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  if (isMobile) {
    await page.setViewportSize({ width: 320, height: 900 });
    await tools.click();
    await expect(
      page.getByRole("button", { name: "Sửa bộ lịch", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath("calendar-tools-narrow.png"),
      fullPage: true,
    });
    await tools.press("Escape");
  }
  const state = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("myos-local");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const events = await new Promise<Record<string, unknown>[]>(
      (resolve, reject) => {
        const request = db
          .transaction("calendarEvents")
          .objectStore("calendarEvents")
          .getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      },
    );
    db.close();
    return events;
  });
  expect(state).toHaveLength(2);
  expect(new Set(state.map((event) => event.id)).size).toBe(2);
  expect(new Set(state.map((event) => event.groupId)).size).toBe(2);
  await page
    .getByRole("group", { name: "Phân mục lịch" })
    .getByRole("button", { name: "Lịch", exact: true })
    .click();
  await page.getByRole("button", { name: "Năm", exact: true }).click();
  await expect(page.locator(".schedule-footer")).toContainText("8 lịch");
  await tools.click();
  await page.getByRole("button", { name: "Xuất .ics", exact: true }).click();
  await expect(
    page.getByRole("dialog").getByLabel("Từ ngày", { exact: true }),
  ).toHaveValue("2026-01-01");
  await expect(
    page.getByRole("dialog").getByLabel("Đến hết ngày", { exact: true }),
  ).toHaveValue("2026-12-31");
});

test("project dossier saves documents, safe links, IoT hardware, journal and files; kanban changes status", async ({
  page,
  isMobile,
}, info) => {
  await createProject(page);
  const url = page.url();
  let panel = await editWorkspace(page, "Mục tiêu");
  await panel
    .getByLabel("Mục tiêu và kết quả mong muốn")
    .fill("Đo nhiệt độ, gửi dữ liệu về dashboard.");
  await saveWorkspace(page);
  panel = await editWorkspace(page, "Tài liệu");
  await panel
    .getByRole("button", { name: "Thêm tài liệu", exact: true })
    .click();
  await panel.getByLabel("Tên tài liệu").fill("Thiết kế hệ thống");
  await panel
    .getByLabel("Nội dung tài liệu")
    .fill("ESP32 → MQTT → dịch vụ thu thập.");
  await saveWorkspace(page);
  panel = await editWorkspace(page, "Tài nguyên");
  await panel
    .getByRole("button", { name: "Thêm liên kết", exact: true })
    .click();
  await panel.getByLabel("Tên liên kết").fill("Source GitHub");
  await panel.getByLabel("Địa chỉ liên kết").fill("javascript:alert(1)");
  await panel.getByRole("button", { name: "Lưu hồ sơ", exact: true }).click();
  await expect(panel.getByRole("alert")).toBeVisible();
  await panel
    .getByLabel("Địa chỉ liên kết")
    .fill("https://github.com/QUAGTIEN/myos---app");
  await saveWorkspace(page);
  await expect(
    panel.getByRole("link", { name: /Source GitHub/ }),
  ).toHaveAttribute("rel", "noopener noreferrer");
  panel = await editWorkspace(page, "Phần cứng");
  await panel.getByLabel("Bật quản lý phần cứng").check();
  await panel
    .getByRole("button", { name: "Thêm linh kiện", exact: true })
    .click();
  await panel.getByLabel("Tên linh kiện").fill("ESP32");
  await panel.getByLabel("Thông số").fill("Wi-Fi, nguồn 5V");
  await panel.getByLabel("Số lượng").fill("2");
  await panel.getByLabel("Đơn giá (VND)").fill("120000");
  await saveWorkspace(page);
  await expect(panel.locator(".workspace-total")).toContainText("240.000");
  panel = await editWorkspace(page, "Nhật ký & kiểm thử");
  await panel
    .getByRole("button", { name: "Thêm bản ghi", exact: true })
    .click();
  await panel.getByLabel("Tên bản ghi").fill("Kiểm thử MQTT");
  await panel.getByLabel("Loại bản ghi").selectOption("passed");
  await panel.getByLabel("Nội dung nhật ký").fill("Nhận đủ 100 bản tin.");
  await saveWorkspace(page);
  await panel
    .getByRole("button", { name: "Tệp đính kèm", exact: true })
    .click();
  await panel.getByLabel("Thêm tệp dự án").setInputFiles({
    name: "firmware.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("ESP32 firmware sample"),
  });
  await expect(panel.getByText("firmware.txt", { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await panel
    .getByRole("button", { name: "Tải firmware.txt", exact: true })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("firmware.txt");
  expect(await readFile((await download.path())!, "utf8")).toBe(
    "ESP32 firmware sample",
  );
  await page.reload();
  panel = page.getByRole("region", { name: "Hồ sơ dự án" });
  await expect(panel).toContainText("Đo nhiệt độ");
  await panel.getByRole("button", { name: "Phần cứng", exact: true }).click();
  await expect(panel).toContainText("ESP32");
  if (!isMobile) await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({
    path: info.outputPath("project-dossier.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/projects");
  await page.getByRole("button", { name: "Kanban", exact: true }).click();
  if (isMobile)
    await page
      .getByLabel("Trạng thái IoT giám sát môi trường")
      .selectOption("completed");
  else
    await page
      .locator(".kanban-handle")
      .dragTo(
        page.getByRole("region", { name: "Kanban Hoàn thành", exact: true }),
      );
  await expect(
    page.getByRole("region", { name: "Kanban Hoàn thành", exact: true }),
  ).toContainText("IoT giám sát môi trường");
  await page.screenshot({
    path: info.outputPath("project-kanban.png"),
    fullPage: true,
  });
  await page.goto(url);
  await expect(page.locator(".project-detail-labels")).toContainText(
    "Hoàn thành",
  );
});

test("legacy version 3 project gains empty dossier; attachment rollback leaves no metadata or blob", async ({
  page,
}) => {
  await page.goto("/login");
  const id = await page.evaluate(async (input) => {
    const id = crypto.randomUUID();
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("myos-local", 3);
      request.onupgradeneeded = () =>
        request.result.createObjectStore("projects", { keyPath: "id" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("projects", "readwrite");
      const at = new Date().toISOString();
      tx.objectStore("projects").put({
        ...input,
        id,
        schemaVersion: 1,
        version: 1,
        createdAt: at,
        updatedAt: at,
        archivedAt: null,
        pinned: false,
        items: [],
        updates: [],
        relatedNoteIds: [],
        relatedEventIds: [],
        title: "Dự án cũ",
      });
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
    return id;
  }, emptyProjectInput);
  await page.goto("/projects/" + id);
  const panel = page.getByRole("region", { name: "Hồ sơ dự án" });
  await expect(panel).toContainText("Chưa có mục tiêu");
  await panel
    .getByRole("button", { name: "Tệp đính kèm", exact: true })
    .click();
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (
      ...args: Parameters<IDBDatabase["transaction"]>
    ) {
      const tx = original.apply(this, args);
      if (
        args[1] === "readwrite" &&
        Array.from(tx.objectStoreNames).includes("projectAttachments")
      )
        tx.abort();
      return tx;
    };
  });
  await panel.getByLabel("Thêm tệp dự án").setInputFiles({
    name: "failed.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("must roll back"),
  });
  await expect(panel.getByRole("alert")).toBeVisible();
  await expect(panel.getByText("failed.txt", { exact: true })).toHaveCount(0);
  await page.reload();
  await panel
    .getByRole("button", { name: "Tệp đính kèm", exact: true })
    .click();
  await panel.getByLabel("Thêm tệp dự án").setInputFiles({
    name: "success.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("stored"),
  });
  await expect(panel.getByText("success.txt", { exact: true })).toBeVisible();
  const state = await page.evaluate(async (id) => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open("myos-local");
      r.onsuccess = () => resolve(r.result);
    });
    const version = db.version;
    const count = await new Promise<number>((resolve) => {
      const r = db
        .transaction("projectAttachments")
        .objectStore("projectAttachments")
        .count();
      r.onsuccess = () => resolve(r.result);
    });
    const project = await new Promise<{
      workspace: { attachments: unknown[] };
    }>((resolve) => {
      const r = db.transaction("projects").objectStore("projects").get(id);
      r.onsuccess = () => resolve(r.result);
    });
    db.close();
    return { version, count, metadata: project.workspace.attachments.length };
  }, id);
  expect(state).toEqual({ version: 4, count: 1, metadata: 1 });
  page.once("dialog", (dialog) => dialog.accept());
  await panel
    .getByRole("button", { name: "Xóa success.txt", exact: true })
    .click();
  await expect(panel.getByText("success.txt", { exact: true })).toHaveCount(0);
});

test("dossier conflicts preserve draft and archived projects reject editing", async ({
  page,
  context,
}) => {
  await createProject(page);
  const second = await context.newPage();
  await second.goto(page.url());
  const firstPanel = await editWorkspace(page, "Mục tiêu");
  const secondPanel = await editWorkspace(second, "Mục tiêu");
  await firstPanel
    .getByLabel("Mục tiêu và kết quả mong muốn")
    .fill("Bản thứ nhất");
  await secondPanel
    .getByLabel("Mục tiêu và kết quả mong muốn")
    .fill("Nháp cần giữ");
  await saveWorkspace(page);
  await secondPanel
    .getByRole("button", { name: "Lưu hồ sơ", exact: true })
    .click();
  await expect(secondPanel.getByRole("alert")).toContainText("tab khác");
  await expect(
    secondPanel.getByLabel("Mục tiêu và kết quả mong muốn"),
  ).toHaveValue("Nháp cần giữ");
  second.once("dialog", (dialog) => dialog.accept());
  await secondPanel
    .getByRole("button", { name: "Hủy chỉnh sửa", exact: true })
    .click();
  await expect(secondPanel).toContainText("Bản thứ nhất");
  await second.close();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Lưu trữ", exact: true }).click();
  await expect(
    firstPanel.getByRole("button", { name: "Chỉnh sửa hồ sơ", exact: true }),
  ).toBeDisabled();
  await firstPanel
    .getByRole("button", { name: "Tệp đính kèm", exact: true })
    .click();
  await expect(firstPanel.getByLabel("Thêm tệp dự án")).toBeDisabled();
});
