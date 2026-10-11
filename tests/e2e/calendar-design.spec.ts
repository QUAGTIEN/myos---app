import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import {
  blankEvent,
  defaultCalendarSettings,
} from "../../src/modules/calendar/model";
import { newCalendarEvent } from "../../src/modules/calendar/service";
import { setCalendarDate } from "./calendar-helpers";

test.skip(({ isMobile }) => !isMobile, "Mobile design rollout verification.");
test.use({ deviceScaleFactor: 1 });

for (const [width, height] of [
  [390, 844],
  [375, 812],
  [320, 740],
]) {
  test(`calendar design is usable at ${width} × ${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/calendar");
    await expect(
      page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }),
    ).toBeVisible();
    // Test-owned browser storage only; the production UI contains no sample fixtures.
    const events = ["đi chơi", "IELTS", "KHTN"].map((title, index) =>
      newCalendarEvent({
        ...blankEvent("2026-10-11", defaultCalendarSettings),
        title,
        start: "2026-10-11",
        end: "2026-10-12",
        allDay: true,
        groupId: index === 0 ? "personal" : "work",
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
    await setCalendarDate(page, "2026-10-11");
    await page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }).click();
    await page.evaluate(async () => {
      await document.fonts.ready;
      const image = new Image();
      image.src = "/images/mobile-ocean.jpg";
      await image.decode();
    });
    const output = resolve("docs/mobile-refinements/calendar");
    mkdirSync(output, { recursive: true });
    const screenshots = async (state: string) =>
      page.screenshot({
        path: resolve(output, `${state}-${width}x${height}.png`),
      });
    const measurements = await page.evaluate(() => {
      const bounds = (selector: string) => {
        const e = document.querySelector(selector)!;
        const r = e.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };
      return {
        header: bounds(".app-header"),
        nav: bounds(".mobile-bottom-nav"),
        grid: bounds(".mobile-month-grid"),
        preview: bounds(".mobile-day-preview"),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(measurements.overflow).toBe(false);
    expect(measurements.header.height).toBe(64);
    if (width >= 375) expect(measurements.nav.height).toBe(56);
    if (width >= 375) {
      expect(measurements.grid.y).toBe(233);
      expect(measurements.preview.y).toBe(517);
    }
    await screenshots("month");
    await page.getByRole("button", { name: "Tuần", exact: true }).click();
    await screenshots("week");
    await page.getByRole("button", { name: "Tháng", exact: true }).click();
    await page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }).click();
    await screenshots("filters");
    await page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }).click();
    await page.getByRole("button", { name: "Chi tiết ngày được chọn" }).click();
    await page
      .getByRole("button", { name: "Xem lịch trong ngày", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator(".mobile-calendar-event")).toHaveCount(3);
    const box = (await dialog.boundingBox())!;
    expect(box.y + box.height / 2).toBeCloseTo(height / 2, 0);
    expect(box.x + box.width / 2).toBeCloseTo(width / 2, 0);
    await screenshots("day");
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Xem lịch trong ngày", exact: true }),
    ).toBeFocused();
    await page
      .getByRole("button", { name: "Thêm vào ngày 2026-10-11", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /^Tạo lịch hẹn/ })
      .click();
    await expect(
      page.getByLabel("Tên lịch hẹn", { exact: true }),
    ).toBeVisible();
    await screenshots("create");
    await page.locator(".schedule-form-fields").evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await page
      .getByRole("button", { name: "Lưu lịch hẹn", exact: true })
      .scrollIntoViewIfNeeded();
    await screenshots("create-bottom");
    const footer = (await page
      .getByRole("button", { name: "Lưu lịch hẹn", exact: true })
      .boundingBox())!;
    const close = (await page
      .getByRole("button", { name: "Đóng hộp thoại lịch" })
      .boundingBox())!;
    expect(footer.y + footer.height).toBeLessThanOrEqual(height - 12);
    expect(close.y).toBeGreaterThanOrEqual(12);
    const fields = (await page.locator(".schedule-form-fields").boundingBox())!;
    expect(fields.y + fields.height).toBeLessThanOrEqual(footer.y);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    expect(errors).toEqual([]);
    writeFileSync(
      resolve(output, `measurements-${width}.json`),
      JSON.stringify(
        {
          width,
          height,
          ...measurements,
          dialog: box,
          errors,
          fixture: "isolated test browser, three all-day events",
        },
        null,
        2,
      ),
    );
  });
}
