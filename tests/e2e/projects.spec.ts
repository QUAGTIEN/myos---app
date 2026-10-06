import { expect, test, type Page } from "@playwright/test";

async function createProject(
  page: Page,
  title: string,
  mode: "manual" | "checklist" = "manual",
) {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên dự án").fill(title);
  await dialog
    .getByLabel("Nội dung", { exact: true })
    .fill("Mục tiêu thực tế\nVà những bước cần làm.");
  await dialog.getByLabel("Ngày bắt đầu").fill("2026-10-01");
  await dialog.getByLabel("Hạn dự kiến").fill("2026-12-31");
  await dialog.getByLabel("Cách tính tiến độ").selectOption(mode);
  if (mode === "manual") await dialog.getByLabel("Tiến độ (%)").fill("35");
  await dialog.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole("heading", { name: title, exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: title, exact: true }),
  ).toBeVisible();
}

async function addItem(page: Page, title: string, milestone = false) {
  await page
    .getByRole("button", {
      name: milestone ? "Thêm cột mốc" : "Thêm mục",
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên mục").fill(title);
  await dialog.getByLabel("Hạn của mục").fill("2026-11-05");
  await dialog.getByRole("button", { name: "Lưu mục", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Hoàn thành " + title, exact: true }),
  ).toBeVisible();
}

test("project creation, edit, progress, pin, search, archive and restore persist", async ({
  page,
}, testInfo) => {
  await createProject(page, "Website cá nhân");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "35",
  );
  await page.getByRole("button", { name: "Sửa dự án", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên dự án").fill("Website cá nhân hoàn chỉnh");
  await dialog.getByLabel("Trạng thái").selectOption("paused");
  await dialog.getByLabel("Tiến độ (%)").fill("60");
  await dialog.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Website cá nhân hoàn chỉnh",
  );
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "60",
  );
  await page.getByRole("button", { name: "Ghim", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Bỏ ghim", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "60",
  );
  await page.getByRole("link", { name: "Tất cả dự án", exact: true }).click();
  await page.getByRole("button", { name: "Tạm dừng", exact: true }).click();
  await page.getByRole("textbox", { name: "Tìm dự án" }).fill("ca nhan");
  await expect(
    page.getByRole("heading", {
      name: "Website cá nhân hoàn chỉnh",
      exact: true,
    }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath("projects-populated.png"),
    fullPage: true,
  });
  page.once("dialog", (confirm) => confirm.accept());
  await page
    .getByRole("button", { name: "Lưu trữ Website cá nhân hoàn chỉnh" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Website cá nhân hoàn chỉnh",
      exact: true,
    }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "Lưu trữ", exact: true }).click();
  await page
    .getByRole("heading", { name: "Website cá nhân hoàn chỉnh", exact: true })
    .click();
  await expect(page.getByRole("button", { name: "Sửa dự án" })).toBeDisabled();
  await page.getByRole("button", { name: "Khôi phục", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sửa dự án" })).toBeEnabled();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Website cá nhân hoàn chỉnh",
  );
});

test("checklist excludes milestones, supports edit, order, removal and mode switching", async ({
  page,
}, testInfo) => {
  await createProject(page, "Học thiết kế sản phẩm", "checklist");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuetext",
    "Chưa có mục tính tiến độ",
  );
  await addItem(page, "Nghiên cứu người dùng");
  await addItem(page, "Bản thiết kế đầu tiên");
  await addItem(page, "Ngày ra mắt", true);
  await page
    .getByRole("checkbox", {
      name: "Hoàn thành Nghiên cứu người dùng",
      exact: true,
    })
    .click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "50",
  );
  await page
    .getByRole("checkbox", { name: "Hoàn thành Ngày ra mắt", exact: true })
    .click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "50",
  );
  await page
    .getByRole("button", { name: "Sửa Bản thiết kế đầu tiên", exact: true })
    .click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên mục").fill("Thiết kế giao diện");
  await dialog.getByRole("button", { name: "Lưu mục" }).click();
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole("button", { name: "Đưa lên Thiết kế giao diện" })
    .click();
  await expect(page.locator(".project-item").first()).toContainText(
    "Thiết kế giao diện",
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath("project-detail.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  page.once("dialog", (confirm) => confirm.accept());
  await page.getByRole("button", { name: "Xóa Thiết kế giao diện" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await page.getByRole("button", { name: "Sửa dự án" }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Cách tính tiến độ").selectOption("manual");
  await dialog.getByLabel("Tiến độ (%)").fill("25");
  await dialog.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "25",
  );
  await page.getByRole("button", { name: "Sửa dự án" }).click();
  await dialog.getByLabel("Cách tính tiến độ").selectOption("checklist");
  await dialog.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await page.getByRole("button", { name: "Sửa dự án" }).click();
  await dialog.getByLabel("Cách tính tiến độ").selectOption("manual");
  await expect(dialog.getByLabel("Tiến độ (%)")).toHaveValue("25");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await page.reload();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "25",
  );
});

test("validation, cancellation and save failure retain input", async ({
  page,
}, testInfo) => {
  await page.goto("/projects");
  const trigger = page.getByRole("button", { name: "Tạo dự án", exact: true });
  await trigger.click();
  let dialog = page.getByRole("dialog");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath("project-form.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên dự án").fill("   ");
  await dialog.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Vui lòng nhập tên dự án",
  );
  await dialog.getByLabel("Tên dự án").fill("Không mất bản nháp");
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function () {
      IDBObjectStore.prototype.add = original;
      throw new DOMException("Storage full", "QuotaExceededError");
    };
  });
  await dialog.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("không đủ dung lượng");
  await expect(dialog.getByLabel("Tên dự án")).toHaveValue(
    "Không mất bản nháp",
  );
  await dialog.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Không mất bản nháp" }),
  ).toBeVisible();
});

test("two tabs reject stale saves instead of overwriting newer content", async ({
  page,
  context,
}) => {
  await createProject(page, "Bản gốc");
  const url = page.url();
  await page.getByRole("button", { name: "Sửa dự án" }).click();
  const oldForm = page.getByRole("dialog");
  await oldForm.getByLabel("Tên dự án").fill("Bản nháp chưa lưu");
  const second = await context.newPage();
  await second.goto(url);
  await second.getByRole("button", { name: "Sửa dự án" }).click();
  await second
    .getByRole("dialog")
    .getByLabel("Tên dự án")
    .fill("Bản mới từ tab khác");
  await second.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(second.getByRole("heading", { level: 1 })).toHaveText(
    "Bản mới từ tab khác",
  );
  await page.bringToFront();
  await oldForm.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(oldForm.getByRole("alert")).toContainText(
    "đã thay đổi ở tab khác",
  );
  await expect(oldForm.getByLabel("Tên dự án")).toHaveValue(
    "Bản nháp chưa lưu",
  );
  page.once("dialog", (confirm) => confirm.accept());
  await oldForm.getByRole("button", { name: "Hủy", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Bản mới từ tab khác",
  );
  await second.close();
});

test("search resets pagination and pinned projects sort first", async ({
  page,
}) => {
  await page.goto("/projects");
  await expect(
    page.getByRole("button", { name: "Tạo dự án", exact: true }),
  ).toBeEnabled();
  // A small dataset exercises the page boundary without spending time entering 13 identical forms.
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("myos-local", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("projects", "readwrite");
      for (let index = 0; index < 13; index++) {
        const now = new Date().toISOString();
        tx.objectStore("projects").add({
          id: crypto.randomUUID(),
          schemaVersion: 1,
          version: 1,
          title: "Dự án " + index,
          description: "",
          status: "active",
          color: "turquoise",
          startDate: "",
          dueDate: "",
          progressMode: "manual",
          manualProgress: 0,
          createdAt: now,
          updatedAt: now,
          archivedAt: null,
          pinned: index === 0,
          items: [],
          updates: [],
          relatedNoteIds: [],
          relatedEventIds: [],
        });
      }
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload();
  await expect(page.locator(".project-card")).toHaveCount(12);
  await expect(page.locator(".project-card").first()).toContainText("Dự án 0");
  await page.getByRole("button", { name: "Sau", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Tìm dự án" }).fill("Dự án 12");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-pagination")).toContainText("Trang 1/1");
});

test("blocked storage and missing local IDs show recoverable states", async ({
  page,
  context,
}) => {
  const missing = "12345678-1234-4123-8123-123456789abc";
  await page.goto("/projects/" + missing);
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy dự án trên trình duyệt này",
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
  await restricted.goto("/projects");
  await expect(
    restricted.getByRole("alert").filter({ hasText: "quyền lưu trữ" }),
  ).toContainText("quyền lưu trữ");
  await expect(
    restricted.getByRole("button", { name: "Tạo dự án", exact: true }),
  ).toBeDisabled();
  await restricted.close();
});
