import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { openAppointment } from "./calendar-helpers";

test.skip(({ isMobile }) => !isMobile, "Mobile refinements only");
test.use({ deviceScaleFactor: 1 });

async function readableFields(page: Page) {
  const fields = page.locator(
    'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="range"]):not([type="color"]), textarea, select, [contenteditable="true"]',
  );
  for (const field of await fields.all()) {
    if (await field.isVisible()) {
      expect(
        await field.evaluate((element) =>
          parseFloat(getComputedStyle(element).fontSize),
        ),
      ).toBeGreaterThanOrEqual(16);
    }
  }
  await expect(page.locator('meta[name="viewport"]')).not.toHaveAttribute(
    "content",
    /user-scalable=no|maximum-scale=1(?:,|$)/,
  );
}

for (const [width, height] of [
  [390, 844],
  [375, 812],
  [320, 740],
]) {
  test(`header, overview, calendar disclosure and compact forms at ${width}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const output = info.outputPath("mobile-refinements");
    mkdirSync(output, { recursive: true });
    const capture = async (name: string) => {
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({ path: resolve(output, `${name}-${width}.png`) });
    };

    await page.goto("/dashboard");
    const tabs = page.getByRole("group", { name: "Nội dung tổng quan" });
    const agenda = page
      .locator(".dashboard-panel")
      .filter({ has: page.getByRole("heading", { name: "Lịch trong ngày" }) });
    const tabsBox = (await tabs.boundingBox())!;
    expect(
      (await agenda.boundingBox())!.y - tabsBox.y - tabsBox.height,
    ).toBeGreaterThanOrEqual(16);
    await capture("overview");
    await tabs.getByRole("button", { name: "Checklist" }).click();
    await expect(agenda).not.toBeVisible();
    await tabs.getByRole("button", { name: "Lịch hôm nay" }).click();
    await expect(agenda).toBeVisible();

    // A long test-owned surface exercises scroll direction without personal data.
    await page.locator("main").evaluate((element) => {
      element.style.minHeight = "1800px";
    });
    const header = page.locator(".app-header");
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveAttribute("data-scroll-hidden", "true");
    await expect
      .poll(
        async () =>
          (await header.boundingBox())!.y +
          (await header.boundingBox())!.height,
      )
      .toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollTo(0, 300));
    await expect(header).toHaveAttribute("data-scroll-hidden", "false");
    await expect
      .poll(async () => (await header.boundingBox())!.y)
      .toBeGreaterThanOrEqual(0);
    await page.evaluate(() => window.scrollTo(0, 306));
    await expect(header).toHaveAttribute("data-scroll-hidden", "false");
    await page.locator(".header-avatar").focus();
    await expect(header).toHaveAttribute("data-scroll-hidden", "false");
    await page.goto("/calendar");
    await expect(page.locator(".app-header")).toHaveAttribute(
      "data-scroll-hidden",
      "false",
    );
    const disclosure = page.getByRole("button", {
      name: "Chi tiết ngày được chọn",
    });
    const openDay = page.getByRole("button", {
      name: "Xem lịch trong ngày",
      exact: true,
    });
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await expect(openDay).not.toBeVisible();
    await capture("calendar-collapsed");
    await disclosure.focus();
    await page.keyboard.press("Enter");
    await expect(openDay).toBeVisible();
    await capture("calendar-expanded");
    await disclosure.click();
    await expect(openDay).not.toBeVisible();
    await openAppointment(page);
    const calendarDialog = page.getByRole("dialog");
    await readableFields(page);
    await expect
      .poll(async () => {
        const b = (await calendarDialog.boundingBox())!;
        return Math.round(b.y + b.height);
      })
      .toBe(height);
    const box = (await calendarDialog.boundingBox())!;
    expect(box.height).toBeLessThanOrEqual(height * 0.72 + 1);
    expect(box.width).toBeLessThanOrEqual(width);
    expect(box.y + box.height).toBeCloseTo(height, 0);
    await capture("calendar-create");
    await page.setViewportSize({ width, height: 480 });
    const calendarKeyboardBox = (await calendarDialog.boundingBox())!;
    expect(calendarKeyboardBox.y).toBeGreaterThanOrEqual(0);
    expect(
      calendarKeyboardBox.y + calendarKeyboardBox.height,
    ).toBeLessThanOrEqual(480);
    await page
      .getByLabel("Tên lịch hẹn", { exact: true })
      .fill("Kiểm tra form gọn");
    await page
      .getByRole("button", { name: "Lưu lịch hẹn", exact: true })
      .click();
    await expect(calendarDialog).not.toBeVisible();
    await page.setViewportSize({ width, height });

    await page.goto("/projects");
    await page.getByRole("button", { name: "Tạo dự án", exact: true }).click();
    const projectDialog = page.getByRole("dialog");
    await readableFields(page);
    await expect
      .poll(async () => {
        const b = (await projectDialog.boundingBox())!;
        return Math.round(b.y + b.height);
      })
      .toBe(height);
    const projectBox = (await projectDialog.boundingBox())!;
    expect(projectBox.height).toBeLessThanOrEqual(height * 0.72 + 1);
    expect(projectBox.y + projectBox.height).toBeCloseTo(height, 0);
    await capture("project-create");
    await projectDialog.getByLabel("Tên dự án").fill("Dự án kiểm tra mobile");
    await page.setViewportSize({ width, height: 480 });
    const keyboardBox = (await projectDialog.boundingBox())!;
    expect(keyboardBox.y).toBeGreaterThanOrEqual(0);
    expect(keyboardBox.y + keyboardBox.height).toBeLessThanOrEqual(480);
    await projectDialog
      .getByRole("button", { name: "Tạo dự án", exact: true })
      .click();
    await expect(projectDialog).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Dự án kiểm tra mobile", exact: true }),
    ).toBeVisible();
    await page.setViewportSize({ width, height });
    await page.goto("/notes");
    await page
      .getByRole("button", { name: "Tạo ghi chú", exact: true })
      .click();
    await expect(page.getByLabel("Tiêu đề ghi chú")).toBeVisible();
    await expect(page.locator('[contenteditable="true"]')).toBeVisible();
    await readableFields(page);
    await page.getByLabel("Tiêu đề ghi chú").fill("Ghi chú kiểm tra mobile");
    await page.locator('[contenteditable="true"]').fill("Nội dung tiếng Việt");
    await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
    await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
    await page.goto("/login");
    await readableFields(page);
    await capture("login");
    await page.setViewportSize({ width: 844, height: 390 });
    await readableFields(page);
    for (const route of ["/register", "/forgot-password"]) {
      await page.goto(route);
      await readableFields(page);
    }
    expect(errors).toEqual([]);
  });
}
