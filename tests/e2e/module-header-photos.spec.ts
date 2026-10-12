import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const modules = [
  {
    route: "calendar",
    title: "Lịch",
    asset: "calendar-aurora.webp",
    height: 64,
  },
  { route: "notes", title: "Ghi chú", asset: "notes-fjord.webp", height: 72 },
  {
    route: "projects",
    title: "Dự án",
    asset: "projects-waterfront.webp",
    height: 72,
  },
];

test("selected module photos stay inside mobile headers and preserve their controls", async ({
  page,
  isMobile,
  request,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const output = info.outputPath("module-header-photos");
  mkdirSync(output, { recursive: true });
  for (const screen of modules) {
    const response = await request.get(`/images/${screen.asset}`);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
    expect((await response.body()).length).toBeLessThan(150 * 1024);
    for (const [width, height] of isMobile
      ? [
          [390, 844],
          [375, 812],
          [320, 740],
        ]
      : [[1440, 1000]]) {
      await page.setViewportSize({ width, height });
      await page.goto(`/${screen.route}`);
      const header = page.locator(".app-header");
      await expect(page.locator(".app-shell")).toHaveAttribute(
        "data-module",
        screen.route,
      );
      await expect(
        page.getByRole("heading", { name: screen.title, level: 1 }),
      ).toBeVisible();
      if (!isMobile) {
        await expect(header).toHaveCSS("background-image", "none");
        continue;
      }
      await page.evaluate(async (asset) => {
        await document.fonts.ready;
        const image = new Image();
        image.src = `/images/${asset}`;
        await image.decode();
      }, screen.asset);
      await expect(header).toHaveCSS(
        "background-image",
        new RegExp(screen.asset),
      );
      await expect(header).toHaveCSS("background-color", "rgb(16, 47, 73)");
      const box = (await header.boundingBox())!;
      expect(box.height).toBe(screen.height);
      expect(
        (await page.locator("main").boundingBox())!.y,
      ).toBeGreaterThanOrEqual(box.height);
      await expect(page.locator("main")).toHaveCSS("background-image", "none");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (screen.route !== "calendar") {
        const create = header.getByRole("button", {
          name: screen.route === "notes" ? "Tạo ghi chú" : "Tạo dự án",
          exact: true,
        });
        await expect(create).toBeEnabled();
        expect((await create.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      await page.screenshot({
        path: resolve(output, `${screen.route}-${width}.png`),
        animations: "disabled",
      });
      await page.screenshot({
        path: resolve(output, `${screen.route}-header-${width}.png`),
        clip: { x: 0, y: 0, width, height: screen.height },
        animations: "disabled",
      });
    }
  }
  expect(errors).toEqual([]);
});
