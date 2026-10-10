import { expect, test } from "@playwright/test";
import {
  blankEvent,
  defaultCalendarSettings,
} from "../../src/modules/calendar/model";
import { newCalendarEvent } from "../../src/modules/calendar/service";
import { setCalendarDate } from "./calendar-helpers";

test.skip(
  ({ isMobile }) => !isMobile,
  "Mobile interaction and compact layout coverage.",
);

test("day sheets create dated notes and tasks, filter them and retain their full contents", async ({
  page,
}) => {
  await page.goto("/calendar");
  for (const [date, action, field, title] of [
    ["2026-10-08", "Thêm ghi chú", "Tên ghi chú", "Chuẩn bị bài dạy"],
    ["2026-10-09", "Thêm công việc", "Tên công việc", "Kiểm tra kế hoạch"],
  ]) {
    await setCalendarDate(page, date);
    await page
      .getByRole("button", { name: "Thêm vào ngày " + date, exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: action })
      .click();
    const sheet = page.getByRole("dialog");
    await sheet.getByLabel(field, { exact: true }).fill(title);
    await expect(sheet.getByLabel("Bắt đầu", { exact: true })).toHaveValue(
      date,
    );
    await sheet
      .getByLabel("Nội dung", { exact: true })
      .fill("Nội dung cần giữ đầy đủ khi mở lại.");
    await sheet
      .getByRole("button", { name: /^Lưu (ghi chú|công việc)$/ })
      .click();
    await expect(sheet).not.toBeVisible();
    await expect(page.locator(".mobile-day-preview")).toContainText(title);
  }
  await page.getByLabel("Tìm lịch hẹn, ghi chú").fill("Chuẩn bị");
  await expect(
    page.getByRole("button", { name: "Xem ngày 2026-10-09", exact: true }),
  ).toBeVisible();
  await page.reload();
  await setCalendarDate(page, "2026-10-08");
  await page
    .locator(".mobile-day-preview")
    .getByRole("button", { name: /Chuẩn bị bài dạy/ })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Nội dung cần giữ đầy đủ khi mở lại.",
  );
});

test("compact calendar exposes all entries, overnight boundaries, week navigation and editable day sheets", async ({
  page,
}, info) => {
  await page.goto("/calendar");
  await expect(
    page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }),
  ).toBeVisible();
  const events = Array.from({ length: 6 }, (_, i) =>
    newCalendarEvent({
      ...blankEvent("2026-10-06", defaultCalendarSettings),
      title: `Công việc ${i + 1} — nội dung tiếng Việt`,
      start: `2026-10-06T${String(9 + i).padStart(2, "0")}:00`,
      end: `2026-10-06T${String(10 + i).padStart(2, "0")}:00`,
    }),
  );
  events.push(
    newCalendarEvent({
      ...blankEvent("2026-10-05", defaultCalendarSettings),
      title: "Qua nửa đêm",
      start: "2026-10-05T23:30",
      end: "2026-10-06T01:00",
    }),
  );
  events.push(
    newCalendarEvent({
      ...blankEvent("2026-10-05", defaultCalendarSettings),
      title: "Kết thúc nửa đêm",
      start: "2026-10-05T23:00",
      end: "2026-10-06T00:00",
    }),
  );
  await page.evaluate(async (events) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("myos-local");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("calendarEvents", "readwrite");
      for (const event of events) tx.objectStore("calendarEvents").put(event);
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  }, events);
  await page.reload();
  await page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }).click();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }).click();
  for (const view of ["Tháng", "Tuần"]) {
    await page.getByRole("button", { name: view, exact: true }).click();
    await page
      .getByRole("button", { name: "Xem ngày 2026-10-06, 7 mục", exact: true })
      .click();
    const sheet = page.getByRole("dialog");
    await expect(sheet.locator(".mobile-calendar-event")).toHaveCount(7);
    await expect(sheet).toContainText("Công việc 6");
    await expect(sheet).toContainText("Qua nửa đêm");
    await expect(sheet).not.toContainText("Kết thúc nửa đêm");
    const box = (await sheet.boundingBox())!;
    expect(box.y + box.height).toBeCloseTo(page.viewportSize()!.height, 0);
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", {
        name: "Xem ngày 2026-10-06, 7 mục",
        exact: true,
      }),
    ).toBeFocused();
  }
  await page.getByRole("button", { name: "Tuần sau", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /^Xem ngày 2026-10-13/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tuần trước", exact: true }).click();
  await page.getByRole("button", { name: "Tháng", exact: true }).click();
  await page.screenshot({
    path: info.outputPath("calendar-mobile.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Xem lịch trong ngày" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Công việc 6/ })
    .click();
  await page.getByRole("button", { name: "Sửa lịch hẹn", exact: true }).click();
  await page
    .getByLabel("Tên lịch hẹn", { exact: true })
    .fill("Nội dung đã chỉnh");
  await page.getByRole("button", { name: "Lưu lịch hẹn", exact: true }).click();
  await page.getByRole("button", { name: "Xem lịch trong ngày" }).click();
  await expect(page.getByRole("dialog")).toContainText("Nội dung đã chỉnh");
});

test("attendance sheet retains long text after close, autosaves and stays usable at 320px", async ({
  page,
}, info) => {
  await page.goto("/calendar");
  await page.getByRole("tab", { name: "Chấm công", exact: true }).click();
  await page
    .getByRole("button", { name: "Tạo công việc", exact: true })
    .click();
  await page.getByLabel("Tên công việc", { exact: true }).fill("Đi dạy");
  await page
    .getByRole("button", { name: "Lưu công việc", exact: true })
    .click();
  await page.getByLabel("Tháng chấm công").fill("2026-10");
  const day = page.getByRole("button", {
    name: "Chấm công 2026-10-05",
    exact: true,
  });
  const text =
    "Lí 12 — thực hành cảm biến, kiểm tra linh kiện và ôn tập chương trình.";
  await day.click();
  await page.getByRole("dialog").getByRole("textbox").fill(text);
  await page.getByRole("button", { name: "Đóng hộp thoại lịch" }).click();
  await expect(day).toContainText(text);
  await expect(
    page.locator('.attendance-cell[data-date="2026-10-05"]'),
  ).toHaveClass(/has-content/);
  await expect(page.locator(".attendance-save-state:visible")).toHaveText(
    "Đã lưu tự động.",
  );
  await page.reload();
  await day.click();
  await expect(page.getByRole("dialog").getByRole("textbox")).toHaveValue(text);
  await page.getByRole("button", { name: "Xong", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("attendance-mobile.png"),
    fullPage: true,
  });
  await page
    .getByRole("navigation", { name: "Điều hướng mobile" })
    .getByRole("link", { name: "Cài đặt", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Lịch & thời gian", exact: true })
    .click();
  const start = page.getByLabel("Giờ bắt đầu hiển thị", { exact: true });
  await start.fill("06:30");
  await page
    .getByRole("button", { name: "Lịch & thời gian", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Lịch & thời gian", exact: true })
    .click();
  await expect(start).toHaveValue("06:30");
});
