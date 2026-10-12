import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import {
  blankEvent,
  defaultCalendarSettings,
} from "../../src/modules/calendar/model";
import { newCalendarEvent } from "../../src/modules/calendar/service";
import { setCalendarDate } from "./calendar-helpers";

test.skip(({ isMobile }) => !isMobile, "Document changes target mobile");
test.use({ deviceScaleFactor: 1 });
for (const [width, height] of [
  [390, 844],
  [375, 812],
  [320, 740],
]) {
  test(`document requirements retain navigation and content at ${width}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const output = info.outputPath("mobile-document-update");
    mkdirSync(output, { recursive: true });
    const capture = async (name: string) => {
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: resolve(output, `${name}-${width}.png`),
        animations: "disabled",
      });
    };
    await page.goto("/dashboard");
    const tabs = page.getByRole("group", { name: "Nội dung tổng quan" });
    for (const name of ["Lịch hôm nay", "Checklist", "Dự án"]) {
      const button = tabs.getByRole("button", { name, exact: true });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(button).toHaveCSS("background-color", "rgb(0, 127, 120)");
    }
    await tabs.getByRole("button", { name: "Lịch hôm nay" }).click();
    const nav = page.getByRole("navigation", { name: "Điều hướng mobile" });
    expect((await nav.boundingBox())!.height).toBe(52);
    expect((await nav.boundingBox())!.width).toBeLessThan(width - 24);
    for (const link of await nav.getByRole("link").all())
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await capture("overview");
    await page.locator("main").evaluate((element) => {
      element.style.minHeight = "1800px";
    });
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(nav).toHaveAttribute("data-scroll-hidden", "true");
    await expect
      .poll(async () => (await nav.boundingBox())!.y)
      .toBeGreaterThanOrEqual(height);
    await nav.getByRole("link", { name: "Lịch", exact: true }).focus();
    await expect(nav).toHaveAttribute("data-scroll-hidden", "false");
    await page.evaluate(() => window.scrollTo(0, 300));
    await expect(nav).toHaveAttribute("data-scroll-hidden", "false");

    await page.goto("/calendar");
    await expect(
      page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }),
    ).toBeVisible();
    const events = Array.from({ length: 4 }, (_, index) => index + 1).flatMap(
      (count) =>
        Array.from({ length: count }, (_, index) =>
          newCalendarEvent({
            ...blankEvent(`2026-10-${10 + count}`, defaultCalendarSettings),
            title: `Nội dung ${count}-${index + 1}`,
            allDay: true,
            start: `2026-10-${10 + count}`,
            end: `2026-10-${11 + count}`,
          }),
        ),
    );
    await page.evaluate(async (events) => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const r = indexedDB.open("myos-local");
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("calendarEvents", "readwrite");
        events.forEach((e) => tx.objectStore("calendarEvents").put(e));
        tx.oncomplete = () => resolve();
        tx.onabort = () => reject(tx.error);
      });
      db.close();
    }, events);
    await page.reload();
    await setCalendarDate(page, "2026-10-12");
    await page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }).click();
    const colors = [
      "rgb(255, 255, 255)",
      "rgb(230, 247, 245)",
      "rgb(180, 232, 226)",
      "rgb(85, 189, 178)",
      "rgb(0, 127, 120)",
    ];
    for (let count = 0; count <= 4; count++) {
      const day = page.getByRole("button", {
        name: new RegExp(`^Xem ngày 2026-10-${10 + count}(?:,|$)`),
      });
      await expect(day).toHaveAttribute("data-load", String(count));
      await expect(day.locator("span").first()).toHaveCSS(
        "background-color",
        colors[count],
      );
      await expect(day.locator("span").first()).toHaveCSS(
        "border-radius",
        "50%",
      );
    }
    await capture("calendar-load");
    await page
      .getByRole("button", { name: "Xem ngày 2026-10-14, 4 mục", exact: true })
      .click();
    await expect(
      page.getByRole("dialog").locator(".mobile-calendar-event"),
    ).toHaveCount(4);
    await page.keyboard.press("Escape");

    for (const title of [
      "Chuẩn bị bài dạy với tiêu đề tiếng Việt dài để kiểm tra một dòng",
      "Kế hoạch tuần",
    ]) {
      await page.goto("/notes");
      const create = page.getByRole("button", {
        name: "Tạo ghi chú",
        exact: true,
      });
      expect(
        await create.evaluate((element) => !!element.closest("header")),
      ).toBe(true);
      await create.click();
      await page.getByLabel("Tiêu đề ghi chú").fill(title);
      await page
        .locator('[contenteditable="true"]')
        .fill("Nội dung đầy đủ vẫn được lưu khi danh sách hiển thị một dòng.");
      await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
      await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
      if (title === "Kế hoạch tuần")
        await page.getByRole("button", { name: "Ghim", exact: true }).click();
    }
    await page.goto("/notes");
    await expect(page.locator(".note-card")).toHaveCount(2);
    await expect(page.locator(".note-library-workspace")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    for (const row of await page.locator(".note-card").all())
      expect((await row.boundingBox())!.height).toBeLessThanOrEqual(60);
    await page.getByRole("button", { name: /^Đã ghim/ }).click();
    await expect(page.locator(".note-card")).toHaveCount(1);
    await page.getByRole("button", { name: /^Thùng rác/ }).click();
    await expect(page.locator(".note-card")).toHaveCount(0);
    await page.getByRole("button", { name: /^Tất cả/ }).click();
    await capture("notes-list");
    await page
      .getByRole("heading", { name: "Kế hoạch tuần", exact: true })
      .click();
    await expect(page.locator('[contenteditable="true"]')).toContainText(
      "Nội dung đầy đủ vẫn được lưu",
    );

    await page.goto("/projects");
    const createProject = page.getByRole("button", {
      name: "Tạo dự án",
      exact: true,
    });
    expect(
      await createProject.evaluate((element) => !!element.closest("header")),
    ).toBe(true);
    await expect(
      page.getByRole("tablist", { name: "Hiển thị dự án" }),
    ).toHaveCount(0);
    await expect(page.locator(".project-library-workspace")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await createProject.click();
    await page.getByLabel("Tên dự án").fill("Đồ án Capstone 1");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Tạo dự án", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Tạm dừng", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Đồ án Capstone 1", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Tất cả", exact: true }).click();
    await capture("projects-list");
    expect(errors).toEqual([]);
  });
}
