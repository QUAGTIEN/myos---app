import { expect, test, type Page } from "@playwright/test";

const appointment = (page: Page, title: string) =>
  page.locator(".fc-event").filter({ hasText: title });
async function calendar(page: Page) {
  await page.goto("/calendar");
  await page.getByRole("button", { name: "Công việc", exact: true }).click();
  await page.getByRole("button", { name: "Tháng", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tạo lịch hẹn", exact: true }),
  ).toBeEnabled();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await expect(
    page
      .getByRole("region", { name: "Bộ lịch", exact: true })
      .getByRole("heading", { level: 2 }),
  ).toContainText("2026");
}
async function create(page: Page, title: string, repeat = false) {
  await page.getByRole("button", { name: "Tạo lịch hẹn", exact: true }).click();
  const form = page.getByRole("dialog");
  await form.getByLabel("Tên lịch hẹn", { exact: true }).fill(title);
  await form.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-06T09:00");
  await form.getByLabel("Kết thúc", { exact: true }).fill("2026-10-06T10:00");
  if (repeat) {
    await form.getByLabel("Lặp hàng tuần", { exact: true }).check();
    await form
      .getByRole("group", { name: "Các thứ lặp" })
      .getByLabel("T5", { exact: true })
      .check();
    await form.getByLabel("Lặp đến hết ngày").fill("2026-10-15");
  }
  await form.getByRole("button", { name: "Lưu lịch hẹn", exact: true }).click();
  await expect(form).not.toBeVisible();
  await expect(appointment(page, title).first()).toBeVisible();
}
async function edit(page: Page, title: string, index = 0) {
  await appointment(page, title).nth(index).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Sửa lịch hẹn", exact: true })
    .click();
  return page.getByRole("dialog");
}

test("appointment CRUD, marks, four views and all-day overnight times persist", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await calendar(page);
  await create(page, "Cuộc hẹn cá nhân");
  let form = await edit(page, "Cuộc hẹn cá nhân");
  await form.getByLabel("Quan trọng", { exact: true }).check();
  await form
    .getByLabel("Nội dung", { exact: true })
    .fill("Chuẩn bị kế hoạch\nMang sổ ghi chú.");
  await form.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-06T23:30");
  await form.getByLabel("Kết thúc", { exact: true }).fill("2026-10-07T01:00");
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await page.reload();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  for (const name of ["Tuần", "Ngày", "Danh sách", "Tháng"]) {
    await page
      .getByRole("group", { name: "Chế độ xem lịch" })
      .getByRole("button", { name, exact: true })
      .click();
    await expect(appointment(page, "Cuộc hẹn cá nhân").first()).toBeVisible();
  }
  await page.screenshot({
    path: info.outputPath("calendar-month.png"),
    fullPage: true,
  });
  form = await edit(page, "Cuộc hẹn cá nhân");
  await form.getByLabel("Cả ngày", { exact: true }).check();
  await form.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-06");
  await form.getByLabel("Ngày cuối", { exact: true }).fill("2026-10-07");

  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await appointment(page, "Cuộc hẹn cá nhân").first().click();
  await expect(page.getByRole("dialog")).toContainText("Cả ngày");
  await page
    .getByRole("button", { name: "Hoàn thành buổi này", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await appointment(page, "Cuộc hẹn cá nhân").first().click();
  await expect(page.getByRole("dialog")).toContainText("Đã hoàn thành");
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Hủy lịch hẹn", exact: true })
    .click();
  await expect(appointment(page, "Cuộc hẹn cá nhân")).toHaveCount(0);
  await page.reload();
  await expect(appointment(page, "Cuộc hẹn cá nhân")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("weekly sessions support completion, cancellation and rescheduling independently", async ({
  page,
}, info) => {
  await calendar(page);
  await create(page, "Học Next.js", true);
  await page.getByRole("button", { name: "Danh sách", exact: true }).click();
  await expect(appointment(page, "Học Next.js")).toHaveCount(4);
  await appointment(page, "Học Next.js").first().click();
  await page.getByRole("button", { name: "Hoàn thành buổi này" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator(".fc-event.schedule-completed")).toHaveCount(1);
  await appointment(page, "Học Next.js").nth(1).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Hủy lịch hẹn", exact: true })
    .click();
  await expect(appointment(page, "Học Next.js")).toHaveCount(3);
  let form = await edit(page, "Học Next.js", 2);
  await expect(form.getByLabel("Phạm vi sửa")).toHaveValue("one");
  await form.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-16T13:00");
  await form.getByLabel("Kết thúc", { exact: true }).fill("2026-10-16T14:30");
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await expect(appointment(page, "Học Next.js")).toHaveCount(3);
  form = await edit(page, "Học Next.js", 1);
  await form.getByLabel("Phạm vi sửa").selectOption("series");
  await form.getByLabel("Tên lịch hẹn").fill("Học React mới");
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await expect(appointment(page, "Học React mới")).toHaveCount(3);
  await expect(page.locator(".fc-event.schedule-completed")).toHaveCount(1);
  await page.reload();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await page.getByRole("button", { name: "Danh sách", exact: true }).click();
  await expect(appointment(page, "Học React mới")).toHaveCount(3);
  await appointment(page, "Học React mới").last().click();
  await expect(page.getByRole("dialog")).toContainText("16/10/2026 · 13:00");
  await page.getByRole("button", { name: "Đóng hộp thoại lịch" }).click();
  await page.screenshot({
    path: info.outputPath("calendar-weekly-list.png"),
    fullPage: true,
  });
  await appointment(page, "Học React mới").first().click();
  await page
    .getByRole("dialog")
    .getByLabel("Hủy toàn chuỗi thay vì chỉ buổi này")
    .check();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Hủy toàn chuỗi", exact: true })
    .click();
  await expect(appointment(page, "Học React mới")).toHaveCount(0);
});

test("overlap warning requires acknowledgement and browser download is valid ICS", async ({
  page,
}) => {
  await calendar(page);
  await create(page, "Cuộc hẹn trước");
  await page.getByRole("button", { name: "Tạo lịch hẹn", exact: true }).click();
  const form = page.getByRole("dialog");
  await form.getByLabel("Tên lịch hẹn").fill("Cuộc hẹn trùng");
  await form.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-06T09:30");
  await form.getByLabel("Kết thúc", { exact: true }).fill("2026-10-06T10:30");
  await expect(form).toContainText("Trùng thời gian: Cuộc hẹn trước");
  page.once("dialog", (dialog) => dialog.dismiss());
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await page.getByLabel("Thao tác lịch", { exact: true }).click();
  await page.getByRole("button", { name: "Xuất .ics", exact: true }).click();
  await form.getByLabel("Từ ngày").fill("2026-10-06");
  await form.getByLabel("Đến hết ngày").fill("2026-10-06");
  const waiting = page.waitForEvent("download");
  await form.getByRole("button", { name: "Tải file .ics" }).click();
  const download = await waiting;
  expect(download.suggestedFilename()).toBe("myos-2026-10-06-2026-10-06.ics");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  expect(text).toContain("BEGIN:VCALENDAR\r\n");
  expect(text).toContain("DTSTART;TZID=Asia/Ho_Chi_Minh:20261006T090000");
  expect(text.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  await expect(form).toContainText("Đã xuất 2 buổi lịch");
});

test("two-tab conflict preserves the stale draft and storage failure rolls back", async ({
  page,
  context,
}) => {
  await calendar(page);
  await create(page, "Bản lịch gốc");
  const stale = await edit(page, "Bản lịch gốc");
  const other = await context.newPage();
  await calendar(other);
  const latest = await edit(other, "Bản lịch gốc");
  await latest.getByLabel("Tên lịch hẹn").fill("Bản mới từ tab hai");
  await latest.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(latest).not.toBeVisible();
  await stale.getByLabel("Tên lịch hẹn").fill("Nháp được giữ lại");
  await stale.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(stale.getByRole("alert")).toContainText("tab khác");
  await expect(stale.getByLabel("Tên lịch hẹn")).toHaveValue(
    "Nháp được giữ lại",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await stale.getByRole("button", { name: "Đóng", exact: true }).click();
  await other.close();
  await expect(appointment(page, "Bản mới từ tab hai")).toHaveCount(1);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "calendarEvents") {
        IDBObjectStore.prototype.put = original;
        throw new DOMException("Storage full", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
  });
  const form = await edit(page, "Bản mới từ tab hai");
  await form.getByLabel("Tên lịch hẹn").fill("Chưa được lưu");
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form.getByRole("alert")).toBeVisible();
  await expect(form.getByLabel("Tên lịch hẹn")).toHaveValue("Chưa được lưu");
  await expect(appointment(page, "Bản mới từ tab hai")).toHaveCount(1);
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await expect(appointment(page, "Chưa được lưu")).toHaveCount(1);
});

test("project milestone and note links round-trip without changing milestone due date", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await page.getByRole("dialog").getByLabel("Tên dự án").fill("Dự án có lịch");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Tạo dự án", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Dự án có lịch", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/[0-9a-f-]+$/);
  const projectUrl = page.url();
  await page.getByRole("button", { name: "Thêm cột mốc", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Tên mục")
    .fill("Bàn giao thiết kế");
  await page.getByRole("dialog").getByLabel("Hạn của mục").fill("2026-10-06");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Lưu mục" })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("link", { name: "Tạo lịch từ mốc Bàn giao thiết kế" })
    .click();
  let form = page.getByRole("dialog");
  await expect(form.getByLabel("Tên lịch hẹn")).toHaveValue(
    "Bàn giao thiết kế",
  );
  await expect(form.getByLabel("Cả ngày", { exact: true })).toBeChecked();
  await form.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-07");
  await form.getByLabel("Ngày cuối", { exact: true }).fill("2026-10-07");
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "projects") {
        IDBObjectStore.prototype.put = original;
        throw new DOMException("Storage full", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
  });
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form.getByRole("alert")).toContainText("hết dung lượng");
  const rolledBack = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("myos-local");
      request.onsuccess = () => resolve(request.result);
    });
    const values = await new Promise<{ events: number; links: number }>(
      (resolve) => {
        const tx = db.transaction(["calendarEvents", "projects"], "readonly");
        const events = tx.objectStore("calendarEvents").getAll();
        const projects = tx.objectStore("projects").getAll();
        tx.oncomplete = () =>
          resolve({
            events: events.result.length,
            links: projects.result[0].relatedEventIds.length,
          });
      },
    );
    db.close();
    return values;
  });
  expect(rolledBack).toEqual({ events: 0, links: 0 });
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await page.goto(projectUrl);
  await expect(page.locator(".project-item")).toContainText("06/10/2026");
  await expect(page.locator(".schedule-related")).toContainText(
    "Bàn giao thiết kế",
  );
  await page
    .locator(".schedule-related")
    .getByRole("link", { name: "Bàn giao thiết kế" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("07/10/2026");
  await page.getByRole("button", { name: "Đóng hộp thoại lịch" }).click();
  await page.goto("/notes");
  await page.getByRole("button", { name: "Tạo ghi chú", exact: true }).click();
  await page.getByLabel("Tiêu đề ghi chú").fill("Nội dung cuộc họp");
  await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
  await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
  const noteUrl = page.url();
  await page
    .locator(".schedule-related")
    .getByRole("link", { name: "Tạo lịch", exact: true })
    .click();
  form = page.getByRole("dialog");
  await form.getByLabel("Tên lịch hẹn").fill("Họp có ghi chú");
  await form.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-08T15:00");
  await form.getByLabel("Kết thúc", { exact: true }).fill("2026-10-08T16:00");
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await page.goto(noteUrl);
  await expect(page.locator(".schedule-related")).toContainText(
    "Họp có ghi chú",
  );
});

test("calendar settings and custom group persist and apply to new appointments", async ({
  page,
}, info) => {
  await page.goto("/settings");
  const panel = page.locator(".schedule-settings");
  await panel.getByLabel("Nhắc mặc định").selectOption("30");
  await panel.getByLabel("Giờ bắt đầu hiển thị").fill("07:00");
  await panel.getByRole("button", { name: "Thêm nhóm lịch" }).click();
  await panel.getByLabel("Tên nhóm 4").fill("Sức khỏe");
  await panel.getByLabel("Màu nhóm 4").selectOption("rose");
  await panel.getByRole("button", { name: "Lưu cài đặt lịch" }).click();
  await expect(panel).toContainText("Đã lưu cài đặt lịch");
  await page.reload();
  await expect(panel.getByLabel("Nhắc mặc định")).toHaveValue("30");
  await expect(panel.getByLabel("Tên nhóm 4")).toHaveValue("Sức khỏe");
  await page.screenshot({
    path: info.outputPath("calendar-settings.png"),
    fullPage: true,
  });
  await calendar(page);
  await page.getByRole("button", { name: "Tạo lịch hẹn", exact: true }).click();
  const form = page.getByRole("dialog");
  await expect(form.getByLabel("Nhắc trước")).toHaveValue("30");
  await form.getByLabel("Tên lịch hẹn").fill("Tập thể dục");
  await form.getByLabel("Nhóm lịch").selectOption({ label: "Sức khỏe" });
  await page.screenshot({
    path: info.outputPath("calendar-form.png"),
    fullPage: true,
  });
  await form.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(form).not.toBeVisible();
  await page.getByLabel("Bộ thời khóa biểu").selectOption("work");
  await expect(appointment(page, "Tập thể dục")).toHaveCount(0);
  await page
    .getByLabel("Bộ thời khóa biểu")
    .selectOption({ label: "Sức khỏe" });
  await expect(appointment(page, "Tập thể dục")).toHaveCount(1);
});

test("desktop drag saves the new date and reverts when storage fails", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "Touch editing is covered by the appointment form tests.",
  );
  await calendar(page);
  await create(page, "Lịch kéo thả");
  async function dragTo(date: string) {
    const event = await appointment(page, "Lịch kéo thả").boundingBox();
    const cell = await page
      .locator(`.fc-daygrid-day[data-date='${date}']`)
      .boundingBox();
    await page.mouse.move(
      event!.x + event!.width / 2,
      event!.y + event!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      cell!.x + cell!.width / 2,
      cell!.y + cell!.height / 2,
      { steps: 15 },
    );
    await page.mouse.up();
  }
  await dragTo("2026-10-07");
  await expect(page.getByRole("status")).toContainText("Đã cập nhật thời gian");
  await expect(
    page
      .locator(".fc-daygrid-day[data-date='2026-10-07']")
      .filter({ hasText: "Lịch kéo thả" }),
  ).toHaveCount(1);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "calendarEvents") {
        IDBObjectStore.prototype.put = original;
        throw new DOMException("Storage full", "QuotaExceededError");
      }
      return original.apply(this, args);
    };
  });
  await dragTo("2026-10-08");
  await expect(page.locator(".schedule-module .schedule-error")).toContainText(
    "Không lưu được",
  );
  await expect(
    page
      .locator(".fc-daygrid-day[data-date='2026-10-07']")
      .filter({ hasText: "Lịch kéo thả" }),
  ).toHaveCount(1);
  await page.reload();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await appointment(page, "Lịch kéo thả").click();
  await expect(page.getByRole("dialog")).toContainText("07/10/2026 · 09:00");
  await page.getByRole("button", { name: "Đóng hộp thoại lịch" }).click();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-07");
  await page
    .getByRole("group", { name: "Chế độ xem lịch" })
    .getByRole("button", { name: "Ngày", exact: true })
    .click();
  const resize = page.locator(".fc-timegrid-event .fc-event-resizer-end");
  // Keep the handle AND the destination inside the viewport while dragging.
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.locator(".fc-timegrid-event").hover();
  await expect(resize).toBeVisible();
  const handle = await resize.boundingBox();
  const slot = await page
    .locator(".fc-timegrid-slot[data-time='10:00:00']")
    .first()
    .boundingBox();
  await page.mouse.move(handle!.x + handle!.width / 2, handle!.y + 2);
  await page.mouse.down();
  await page.mouse.move(
    handle!.x + handle!.width / 2,
    handle!.y + 2 + slot!.height + 2,
    { steps: 10 },
  );
  await page.mouse.up();
  await expect(page.getByRole("status")).toContainText("Đã cập nhật thời gian");
  await appointment(page, "Lịch kéo thả").click();
  await expect(page.getByRole("dialog")).toContainText("07/10/2026 · 10:30");
});

test("version 2 upgrade retains notes, image blobs and projects; denied storage is recoverable", async ({
  page,
  context,
}) => {
  // Start on a route that does not open IndexedDB before seeding the older version.
  await page.goto("/login");
  const ids = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("myos-local", 2);
      request.onupgradeneeded = () => {
        for (const name of ["projects", "notes"])
          request.result.createObjectStore(name, { keyPath: "id" });
        request.result
          .createObjectStore("noteAttachments", { keyPath: "id" })
          .createIndex("noteId", "noteId");
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const projectId = crypto.randomUUID(),
      noteId = crypto.randomUUID(),
      imageId = crypto.randomUUID();
    const at = new Date().toISOString();
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 20;
    canvas.getContext("2d")!.fillRect(0, 0, 32, 20);
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), "image/png"),
    );
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        ["projects", "notes", "noteAttachments"],
        "readwrite",
      );
      tx.objectStore("projects").put({
        id: projectId,
        title: "Dự án từ bản cũ",
        description: "Nội dung cần giữ",
        schemaVersion: 1,
        version: 1,
        status: "active",
        color: "turquoise",
        startDate: "",
        dueDate: "",
        progressMode: "manual",
        manualProgress: 45,
        pinned: true,
        archivedAt: null,
        createdAt: at,
        updatedAt: at,
        items: [],
        updates: [],
        relatedNoteIds: [noteId],
        relatedEventIds: [],
      });
      tx.objectStore("notes").put({
        id: noteId,
        title: "Ghi chú và ảnh bản cũ",
        schemaVersion: 1,
        version: 1,
        content: {
          type: "doc",
          content: [
            {
              type: "localImage",
              attrs: { attachmentId: imageId, name: "goc.png" },
            },
            { type: "paragraph" },
          ],
        },
        folder: "Cá nhân",
        tags: ["cũ"],
        projectIds: [projectId],
        pinned: true,
        trashedAt: null,
        createdAt: at,
        updatedAt: at,
        revisions: [],
      });
      tx.objectStore("noteAttachments").put({
        id: imageId,
        noteId,
        name: "goc.png",
        blob,
      });
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
    return { projectId, noteId };
  });
  await calendar(page);
  const version = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("myos-local");
      request.onsuccess = () => resolve(request.result);
    });
    const version = db.version;
    db.close();
    return version;
  });
  expect(version).toBe(4);
  await page.goto("/projects/" + ids.projectId);
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "45",
  );
  await page.goto("/notes/" + ids.noteId);
  await expect(page.getByLabel("Tiêu đề ghi chú")).toHaveValue(
    "Ghi chú và ảnh bản cũ",
  );
  const image = page.locator(".note-document .note-image img");
  await expect
    .poll(() =>
      image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBe(32);
  const denied = await context.newPage();
  await denied.addInitScript(() =>
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    }),
  );
  await denied.goto("/calendar");
  await denied.getByRole("button", { name: "Công việc", exact: true }).click();
  await expect(denied.locator(".schedule-error")).toContainText(
    "quyền lưu trữ",
  );
  await expect(
    denied.getByRole("button", { name: "Tạo lịch hẹn", exact: true }),
  ).toBeDisabled();
  await denied.close();
});
