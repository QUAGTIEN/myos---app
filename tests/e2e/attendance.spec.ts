import { markAttendance } from "./calendar-helpers";
import { expect, test, type Page } from "@playwright/test";
import {
  attendanceMonthSchema,
  monthDays,
} from "../../src/modules/calendar/attendance-model";

async function openAttendance(page: Page) {
  await page.goto("/calendar");
  await page.getByRole("button", { name: "Chấm công", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Tạo công việc", exact: true }),
  ).toBeEnabled();
}
async function activity(page: Page, name: string) {
  await page
    .getByRole("button", { name: "Tạo công việc", exact: true })
    .click();
  const form = page.getByRole("dialog");
  await form.getByLabel("Tên công việc", { exact: true }).fill(name);
  await form
    .getByRole("button", { name: "Lưu công việc", exact: true })
    .click();
  await expect(form).not.toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Bảng chấm công" })
      .getByRole("heading", { name, exact: true }),
  ).toBeVisible();
  await page.getByLabel("Tháng chấm công").fill("2026-10");
}
test("month/week cells create dated notes and tasks; search and persisted content", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  if (info.project.name === "desktop")
    await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/calendar");
  await expect(page.locator(".schedule-workspace aside")).toHaveCount(0);
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-08");
  await page
    .getByRole("button", { name: "Thêm vào ngày 2026-10-08", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Thêm ghi chú" })
    .click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên ghi chú").fill("Chuẩn bị bài dạy");
  await dialog
    .getByLabel("Nội dung", { exact: true })
    .fill("Soạn bài thực hành cảm biến và kiểm tra linh kiện.");
  await expect(dialog.getByLabel("Bắt đầu", { exact: true })).toHaveValue(
    "2026-10-08",
  );
  await dialog
    .getByRole("button", { name: "Lưu ghi chú", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole("button", { name: "Tuần", exact: true }).click();
  await expect(page.locator(".fc-dayGridWeek-view")).toBeVisible();
  await page
    .getByRole("button", { name: "Thêm vào ngày 2026-10-09", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Thêm công việc" })
    .click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên công việc").fill("Kiểm tra kế hoạch");
  await expect(dialog.getByLabel("Bắt đầu", { exact: true })).toHaveValue(
    "2026-10-09",
  );
  await dialog
    .getByRole("button", { name: "Lưu công việc", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await page.getByLabel("Tìm lịch hẹn, ghi chú").fill("Chuẩn bị");
  await expect(
    page.locator(".fc-event").filter({ hasText: "Kiểm tra kế hoạch" }),
  ).toHaveCount(0);
  await expect(
    page.locator(".fc-event").filter({ hasText: "Chuẩn bị bài dạy" }),
  ).toBeVisible();
  await page.getByLabel("Tìm lịch hẹn, ghi chú").fill("");
  await page.getByRole("button", { name: "Tháng", exact: true }).click();
  if (!info.project.name.includes("mobile")) {
    await page.setViewportSize({ width: 1920, height: 1000 });
    const boxes = await Promise.all(
      [
        ".schedule-period",
        ".schedule-view-buttons",
        ".schedule-search",
        ".schedule-date-input",
        ".schedule-group-select",
        ".schedule-tools",
      ].map((selector) =>
        page.locator(".schedule-panel " + selector).boundingBox(),
      ),
    );
    const centers = boxes.map((box) => box!.y + box!.height / 2);
    expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(3);
    const header = await page.locator(".app-header").boundingBox();
    const tabs = await page.locator(".schedule-tabs").boundingBox();
    expect(tabs!.y - header!.y - header!.height).toBeLessThanOrEqual(12);
  }
  await page.screenshot({
    path: info.outputPath("calendar-redesign.png"),
    fullPage: true,
  });
  await page.reload();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-08");
  await page
    .locator(".fc-event")
    .filter({ hasText: "Chuẩn bị bài dạy" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Soạn bài thực hành cảm biến",
  );
  expect(errors).toEqual([]);
});

test("attendance notes autosave in a full-width board and persist independently", async ({
  page,
}, info) => {
  await openAttendance(page);
  await activity(page, "Đi dạy");
  await expect(page.locator(".attendance-workspace aside")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Lưu chấm công", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Mở ngày 2026-10-05", exact: true })
    .click();
  const editor = page.getByRole("form", {
    name: "Nội dung ngày 2026-10-05",
    exact: true,
  });
  await expect(editor.getByRole("combobox")).toHaveCount(0);
  await expect(editor).not.toContainText("Ghi chú");
  await editor.getByRole("textbox").fill("Lí 12");
  await expect(page.locator(".attendance-save-state")).toHaveText(
    "Đã lưu tự động.",
  );
  await editor.getByRole("button", { name: "Xong", exact: true }).click();
  const cell = page.locator('.attendance-cell[data-date="2026-10-05"]');
  await expect(cell).toContainText("Lí 12");
  await expect(cell).not.toContainText("Ghi chú");
  await expect(cell).toHaveClass(/has-content/);
  await markAttendance(page, "2026-10-08", "Anh 9");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: info.outputPath("attendance-notes.png"),
    fullPage: true,
  });
  await page.reload();
  await expect(cell).toContainText("Lí 12");
  await page.getByLabel("Tháng chấm công").fill("2026-11");
  await expect(page.locator(".attendance-cell.has-content")).toHaveCount(0);
  await page.getByLabel("Tháng chấm công").fill("2026-10");
  await expect(cell).toContainText("Lí 12");
  await activity(page, "Tập gym");
  await expect(page.locator(".attendance-cell.has-content")).toHaveCount(0);
  await page.getByRole("button", { name: "Đi dạy", exact: true }).click();
  await expect(cell).toContainText("Lí 12");
  await page
    .getByRole("button", { name: "Chấm công 2026-10-05", exact: true })
    .click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await editor.getByRole("button", { name: "Xóa", exact: true }).click();
  await expect(editor.getByRole("textbox")).toHaveValue("Lí 12");
  page.once("dialog", (dialog) => dialog.accept());
  await editor.getByRole("button", { name: "Xóa", exact: true }).click();
  await expect(page.locator(".attendance-save-state")).toHaveText(
    "Đã lưu tự động.",
  );
  await page.reload();
  await expect(cell).not.toHaveClass(/has-content/);
});

test("attendance autosave retries failed writes and retains offline drafts", async ({
  page,
}) => {
  await openAttendance(page);
  await activity(page, "Đi làm");
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      if (
        Reflect.get(window, "blockAttendance") &&
        args[1] === "readwrite" &&
        Array.from(typeof args[0] === "string" ? [args[0]] : args[0]).includes(
          "attendanceMonths",
        )
      )
        throw new DOMException("Storage denied", "SecurityError");
      return original.apply(this, args);
    };
    Reflect.set(window, "blockAttendance", true);
  });
  await page
    .getByRole("button", { name: "Chấm công 2026-10-05", exact: true })
    .click();
  const input = page.getByRole("textbox", {
    name: "Nội dung chấm công ngày 2026-10-05",
    exact: true,
  });
  await input.fill("Nháp chưa lưu");
  await expect(page.locator(".attendance-module [role=alert]")).toBeVisible();
  await expect(input).toHaveValue("Nháp chưa lưu");
  await page.evaluate(() => Reflect.set(window, "blockAttendance", false));
  await page.getByRole("button", { name: "Thử lưu lại", exact: true }).click();
  await expect(page.locator(".attendance-save-state")).toHaveText(
    "Đã lưu tự động.",
  );
  await input.fill("Nội dung mới");
  await expect(page.locator(".attendance-save-state")).toHaveText(
    "Đã lưu tự động.",
  );
  await page.reload();
  await expect(
    page.locator('.attendance-cell[data-date="2026-10-05"]'),
  ).toContainText("Nội dung mới");
});

test("attendance refuses stale drafts and deleted activities cannot be resurrected", async ({
  page,
  context,
}) => {
  await openAttendance(page);
  await activity(page, "Đi dạy");
  await markAttendance(page, "2026-10-05", "Bản đầu");
  const other = await context.newPage();
  await other.goto("/calendar");
  await other.getByRole("button", { name: "Chấm công", exact: true }).click();
  await other.getByLabel("Tháng chấm công").fill("2026-10");
  await other.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      if (
        Reflect.get(window, "blockAttendance") &&
        args[1] === "readwrite" &&
        Array.from(typeof args[0] === "string" ? [args[0]] : args[0]).includes(
          "attendanceMonths",
        )
      )
        throw new DOMException("Storage denied", "SecurityError");
      return original.apply(this, args);
    };
    Reflect.set(window, "blockAttendance", true);
  });
  await other
    .getByRole("button", { name: "Chấm công 2026-10-05", exact: true })
    .click();
  const draft = other.getByRole("textbox", {
    name: "Nội dung chấm công ngày 2026-10-05",
    exact: true,
  });
  await draft.fill("Nháp cũ");
  await expect(other.locator(".attendance-module [role=alert]")).toBeVisible();
  await markAttendance(page, "2026-10-05", "Bản mới");
  await other.evaluate(() => Reflect.set(window, "blockAttendance", false));
  const retry = other.getByRole("button", { name: "Thử lưu lại", exact: true });
  if (await retry.isVisible()) await retry.click();
  await expect(other.locator(".attendance-module [role=alert]")).toContainText(
    /thay đổi/,
  );
  await expect(draft).toHaveValue("Nháp cũ");
  other.once("dialog", (d) => d.accept());
  await other.getByRole("button", { name: "Tải bản mới", exact: true }).click();
  await expect(
    other.locator('.attendance-cell[data-date="2026-10-05"]'),
  ).toContainText("Bản mới");
  await page
    .getByRole("button", { name: "Sửa công việc", exact: true })
    .click();
  page.once("dialog", (d) => d.dismiss());
  await page
    .getByRole("button", { name: "Xóa công việc", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Xóa công việc", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Chưa có công việc", exact: true }),
  ).toBeVisible();
  await expect(
    other.getByRole("heading", { name: "Chưa có công việc", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Đi dạy", exact: true }),
  ).toHaveCount(0);
  await other.close();
});

test("attendance validates leap days, unique dates, month ownership and same-day times", ({
  isMobile,
}) => {
  test.skip(isMobile, "Pure schema rules run once.");
  const activityId = "00000000-0000-4000-8000-000000000001";
  const day = {
    date: "2028-02-29",
    status: "done",
    start: "09:00",
    end: "11:00",
    note: "",
  };
  const value = {
    id: activityId + "_2028-02",
    activityId,
    month: "2028-02",
    entries: [day],
    version: 1,
    updatedAt: new Date().toISOString(),
  };
  expect(attendanceMonthSchema.safeParse(value).success).toBe(true);
  expect(
    attendanceMonthSchema.safeParse({
      ...value,
      entries: [
        { ...day, status: "note", start: "", end: "", note: "Chỉ ghi chú" },
      ],
    }).success,
  ).toBe(true);
  for (const entries of [
    [day, day],
    [{ ...day, date: "2028-03-01" }],
    [{ ...day, date: "2027-02-29" }],
    [{ ...day, end: "08:00" }],
    [{ ...day, status: "rest" }],
    [{ ...day, status: "note" }],
    [{ ...day, status: "note", start: "", end: "", note: "   " }],
  ])
    expect(attendanceMonthSchema.safeParse({ ...value, entries }).success).toBe(
      false,
    );
  expect(monthDays("2028-02", 1)).toContain("2028-02-29");
  expect(monthDays("2028-02", 0)[0]).toBe("2028-01-30");
});
