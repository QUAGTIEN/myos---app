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
const mark = (page: Page, date: string, state: string) =>
  page.getByRole("button", {
    name: `Chấm công ${date}, ${state}`,
    exact: true,
  });
const save = (page: Page) =>
  page.getByRole("button", { name: "Lưu chấm công", exact: true });

test("month/week cells create dated notes and tasks; search and persisted content", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/calendar");
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

test("attendance batches days, hours and notes; each activity and month remains independent", async ({
  page,
  isMobile,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openAttendance(page);
  await activity(page, "Đi dạy");
  await markAttendance(page, "2026-10-05");
  await markAttendance(page, "2026-10-08");
  await page
    .getByRole("button", {
      name: "Chấm công 2026-10-05, Đã thực hiện",
      exact: true,
    })
    .click();
  let dialog = page.getByRole("form", {
    name: "Nội dung ngày 2026-10-05",
    exact: true,
  });
  await dialog.getByLabel("Giờ bắt đầu").fill("09:00");
  await dialog.getByLabel("Giờ kết thúc").fill("11:00");
  await dialog
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Dạy thực hành lớp A");
  await dialog.getByLabel("Giờ kết thúc").fill("08:00");
  await save(page).click();
  await expect(page.locator(".attendance-panel > [role=alert]")).toContainText(
    "giờ kết thúc",
  );
  await expect(dialog.getByLabel("Giờ kết thúc")).toHaveValue("08:00");
  await dialog.getByLabel("Giờ kết thúc").fill("11:00");
  await dialog.getByRole("button", { name: "Xong", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Chấm công 2026-10-09, Chưa chấm",
      exact: true,
    })
    .click();
  dialog = page.getByRole("form", {
    name: "Nội dung ngày 2026-10-09",
    exact: true,
  });
  await dialog
    .getByRole("combobox", { name: "Trạng thái", exact: true })
    .selectOption("rest");
  await dialog.getByRole("button", { name: "Xong", exact: true }).click();
  await mark(page, "2026-10-12", "Chưa chấm").click();
  const noteEditor = page.getByRole("form", {
    name: "Nội dung ngày 2026-10-12",
    exact: true,
  });
  await noteEditor
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Mang giáo trình mới\nChuẩn bị bài thực hành");
  await expect(
    noteEditor.getByRole("combobox", { name: "Trạng thái", exact: true }),
  ).toHaveValue("note");
  await expect(
    page.locator('.attendance-cell[data-date="2026-10-12"]'),
  ).toContainText("Ghi chú");
  // Notes alone do not count as attendance; empty cells contain no placeholder label.
  await expect(
    page.locator(".attendance-summary > div").filter({ hasText: "Chưa chấm" }),
  ).toContainText("28 ngày");
  await expect(
    page.locator('.attendance-cell[data-date="2026-10-13"]'),
  ).not.toContainText("Chưa chấm");
  await expect(
    page.locator('.attendance-cell[data-date="2026-10-13"] button'),
  ).toHaveCount(1);
  await expect(page.locator(".attendance-summary")).toContainText("2 giờ");
  // Applying days is a draft until the month is explicitly saved.
  expect(
    await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const r = indexedDB.open("myos-local");
        r.onsuccess = () => resolve(r.result);
      });
      const count = await new Promise<number>((resolve) => {
        const r = db
          .transaction("attendanceMonths")
          .objectStore("attendanceMonths")
          .count();
        r.onsuccess = () => resolve(r.result);
      });
      db.close();
      return count;
    }),
  ).toBe(0);
  await save(page).click();
  await expect(page.locator(".attendance-save-state")).toHaveText(
    "Đã lưu chấm công.",
  );
  await expect(noteEditor).not.toBeVisible();
  const green = await page
    .locator('.attendance-cell[data-date="2026-10-05"]')
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(
    await page
      .locator('.attendance-cell[data-date="2026-10-09"]')
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  ).toBe(green);
  expect(
    await page
      .locator('.attendance-cell[data-date="2026-10-12"]')
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  ).toBe(green);
  expect(
    await page
      .locator('.attendance-cell[data-date="2026-10-13"]')
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe(green);
  // Cancelling an inline edit restores saved content instead of erasing the day.
  await mark(page, "2026-10-12", "Ghi chú").click();
  await noteEditor
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Bản nháp không giữ");
  await noteEditor
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .press("Escape");
  await expect(save(page)).toBeDisabled();
  await expect(
    page.locator('.attendance-cell[data-date="2026-10-12"]'),
  ).toContainText("Mang giáo trình mới");
  if (!isMobile) await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({
    path: info.outputPath("attendance-redesign.png"),
    fullPage: true,
  });
  if (isMobile) {
    await page.setViewportSize({ width: 320, height: 900 });
    await expect(save(page)).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath("attendance-narrow.png"),
      fullPage: true,
    });
  }
  await activity(page, "Tập gym");
  await expect(mark(page, "2026-10-05", "Chưa chấm")).toBeVisible();
  await markAttendance(page, "2026-10-06");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Tháng sau", exact: true }).click();
  await expect(page.getByLabel("Tháng chấm công")).toHaveValue("2026-10");
  await save(page).click();
  await expect(save(page)).toBeDisabled();
  await page.getByRole("button", { name: "Tháng sau", exact: true }).click();
  await expect(page.getByLabel("Tháng chấm công")).toHaveValue("2026-11");
  await page.getByLabel("Tháng chấm công").fill("2026-10");
  await page
    .getByRole("group", { name: "Loại công việc", exact: true })
    .getByRole("button", { name: /Đi dạy/ })
    .click();
  await expect(mark(page, "2026-10-05", "Đã thực hiện")).toBeVisible();
  await expect(mark(page, "2026-10-09", "Nghỉ")).toBeVisible();
  await page.reload();
  await page
    .getByRole("group", { name: "Loại công việc", exact: true })
    .getByRole("button", { name: /Đi dạy/ })
    .click();
  await page.getByLabel("Tháng chấm công").fill("2026-10");
  await page
    .getByRole("button", {
      name: "Chấm công 2026-10-05, Đã thực hiện",
      exact: true,
    })
    .click();
  await expect(
    page
      .getByRole("form", { name: "Nội dung ngày 2026-10-05", exact: true })
      .getByRole("textbox", { name: "Ghi chú", exact: true }),
  ).toHaveValue("Dạy thực hành lớp A");
  await page
    .getByRole("form", { name: "Nội dung ngày 2026-10-05", exact: true })
    .getByRole("button", { name: "Xong", exact: true })
    .click();
  await mark(page, "2026-10-12", "Ghi chú").click();
  await expect(
    noteEditor.getByRole("textbox", { name: "Ghi chú", exact: true }),
  ).toHaveValue("Mang giáo trình mới\nChuẩn bị bài thực hành");
  await expect(
    noteEditor.getByRole("combobox", { name: "Trạng thái", exact: true }),
  ).toHaveValue("note");
  await noteEditor
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Đã sửa trực tiếp trong ô ngày");
  await page.screenshot({
    path: info.outputPath("attendance-inline-editor.png"),
    fullPage: true,
  });
  await save(page).click();
  await expect(noteEditor).not.toBeVisible();
  await mark(page, "2026-10-12", "Ghi chú").click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await noteEditor.getByRole("button", { name: "Xóa", exact: true }).click();
  await expect(noteEditor).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await noteEditor.getByRole("button", { name: "Xóa", exact: true }).click();
  await expect(mark(page, "2026-10-12", "Chưa chấm")).toBeVisible();
  await save(page).click();
  await expect(save(page)).toBeDisabled();
  expect(errors).toEqual([]);
});

test("attendance storage failure keeps batch; stale tab cannot overwrite saved days", async ({
  page,
  context,
}) => {
  await openAttendance(page);
  await activity(page, "Đi làm");
  const other = await context.newPage();
  await openAttendance(other);
  await other.getByLabel("Tháng chấm công").fill("2026-10");
  await markAttendance(other, "2026-10-07");
  await markAttendance(page, "2026-10-05");
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (
      ...args: Parameters<IDBDatabase["transaction"]>
    ) {
      const tx = original.apply(this, args);
      if (
        args[1] === "readwrite" &&
        Array.from(tx.objectStoreNames).includes("attendanceMonths")
      ) {
        IDBDatabase.prototype.transaction = original;
        tx.abort();
      }
      return tx;
    };
  });
  await save(page).click();
  await expect(page.locator(".attendance-module [role=alert]")).toBeVisible();
  await expect(mark(page, "2026-10-05", "Đã thực hiện")).toBeVisible();
  await save(page).click();
  await expect(page.locator(".attendance-save-state")).toHaveText(
    "Đã lưu chấm công.",
  );
  await expect(other.locator(".attendance-module [role=alert]")).toContainText(
    "Dữ liệu đã thay đổi",
  );
  await save(other).click();
  await expect(other.locator(".attendance-module [role=alert]")).toContainText(
    "Bản nháp vẫn được giữ",
  );
  await expect(mark(other, "2026-10-07", "Đã thực hiện")).toBeVisible();
  other.once("dialog", (dialog) => dialog.accept());
  await other.getByRole("button", { name: "Tải bản mới", exact: true }).click();
  await expect(mark(other, "2026-10-05", "Đã thực hiện")).toBeVisible();
  await expect(mark(other, "2026-10-07", "Chưa chấm")).toBeVisible();
  await mark(other, "2026-10-05", "Đã thực hiện").click();
  const cleanEditor = other.getByRole("form", {
    name: "Nội dung ngày 2026-10-05",
    exact: true,
  });
  await mark(page, "2026-10-05", "Đã thực hiện").click();
  await page
    .getByRole("form", { name: "Nội dung ngày 2026-10-05", exact: true })
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Nội dung mới từ tab thứ nhất");
  await save(page).click();
  await expect(
    cleanEditor.getByRole("textbox", { name: "Ghi chú", exact: true }),
  ).toHaveValue("Nội dung mới từ tab thứ nhất");
  await cleanEditor
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .press("Escape");
  await expect(save(other)).toBeDisabled();
  await expect(
    other.locator('.attendance-cell[data-date="2026-10-05"]'),
  ).toContainText("Nội dung mới từ tab thứ nhất");
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
