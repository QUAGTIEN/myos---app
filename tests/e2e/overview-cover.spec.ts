import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

test("overview cover is mobile-only and honors motion, scroll and resize", async ({
  page,
  isMobile,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/dashboard");
  const cover = page.locator(".dashboard-cover");
  const photo = page.locator(".dashboard-cover-photo");
  await expect(page.locator(".overview-shell")).toHaveAttribute(
    "data-overview-cover",
    "ready",
  );
  if (!isMobile) {
    await expect(cover).not.toBeVisible();
    await expect(cover).toHaveAttribute("data-motion", "paused");
    expect(errors).toEqual([]);
    return;
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    const image = new Image();
    image.src = "/images/overview-canopy.webp";
    await image.decode();
  });
  await expect(cover).toHaveAttribute("data-motion", "running");
  await expect(photo).toHaveCSS("animation-play-state", "running");
  const content = page.locator(".dashboard-metrics");
  const initialBox = (await content.boundingBox())!;
  const animationTime = await photo.evaluate(
    (element) => element.getAnimations()[0]?.currentTime,
  );
  await expect
    .poll(async () =>
      photo.evaluate((element) => element.getAnimations()[0]?.currentTime),
    )
    .not.toBe(animationTime);
  expect(await content.boundingBox()).toEqual(initialBox);
  const output = resolve("docs/overview-cover");
  mkdirSync(output, { recursive: true });
  for (const [width, height] of [
    [390, 844],
    [375, 812],
    [320, 740],
  ]) {
    await page.setViewportSize({ width, height });
    await expect
      .poll(async () => {
        const box = (await cover.boundingBox())!;
        return Math.round(box.y);
      })
      .toBe(0);
    const coverBox = (await cover.boundingBox())!;
    const summaryBox = (await page
      .locator(".dashboard-summary")
      .boundingBox())!;
    expect(coverBox.x).toBe(0);
    expect(coverBox.width).toBe(width);
    expect(coverBox.y + coverBox.height).toBeCloseTo(
      summaryBox.y + summaryBox.height,
      0,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: resolve(output, `overview-${width}.png`),
      animations: "disabled",
    });
    await page.screenshot({
      path: resolve(output, `hero-${width}.png`),
      clip: { x: 0, y: 0, width, height: Math.ceil(coverBox.height) },
      animations: "disabled",
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cover).toHaveAttribute("data-motion", "paused");
  await expect(photo).toHaveCSS("animation-name", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(cover).toHaveAttribute("data-motion", "running");

  // Simulate document visibility because headless tabs do not reproduce iOS backgrounding.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(cover).toHaveAttribute("data-motion", "paused");
  await page.evaluate(() => {
    delete (document as Document & { hidden?: boolean }).hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(cover).toHaveAttribute("data-motion", "running");
  await page.locator("main").evaluate((element) => {
    element.style.minHeight = "1800px";
  });
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(cover).toHaveAttribute("data-motion", "paused");
  const header = page.locator(".app-header");
  await expect(header).toHaveAttribute("data-scroll-hidden", "true");
  await page.evaluate(() => window.scrollTo(0, 320));
  await expect(header).toHaveAttribute("data-scroll-hidden", "false");
  await expect(header).toHaveCSS("background-color", "rgb(16, 47, 73)");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(cover).toHaveAttribute("data-motion", "running");
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await page
    .getByRole("navigation", { name: "Điều hướng mobile" })
    .getByRole("link", { name: "Lịch", exact: true })
    .click();
  await expect(cover).toHaveCount(0);
  await expect(page.locator(".app-shell")).not.toHaveAttribute(
    "data-overview-cover",
    "ready",
  );
  expect(errors).toEqual([]);
  await testInfo.attach("motion-limits", {
    body: "Visibility and viewport are simulated; real iPhone backgrounding remains unverified.",
    contentType: "text/plain",
  });
});
