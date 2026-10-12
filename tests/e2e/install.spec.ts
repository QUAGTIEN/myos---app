import { expect, test } from "@playwright/test";

test("home screen launch metadata requests standalone within MyOS", async ({
  page,
  request,
}) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain(
    "application/manifest+json",
  );
  expect(await response.json()).toMatchObject({
    id: "/",
    scope: "/",
    start_url: "/dashboard",
    display: "standalone",
    short_name: "MyOS",
  });
  await page.goto("/dashboard");
  await expect(
    page.locator('meta[name="apple-mobile-web-app-capable"]'),
  ).toHaveAttribute("content", "yes");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    /viewport-fit=cover/,
  );
});

for (const size of [
  { width: 390, height: 844 },
  { width: 375, height: 812 },
]) {
  test(`shared navigation clears the home indicator at ${size.width}`, async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(!isMobile, "Mobile navigation only");
    await page.setViewportSize(size);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of [
      "dashboard",
      "calendar",
      "notes",
      "projects",
      "settings",
    ]) {
      await page.goto(`/${route}`);
      const nav = page.getByRole("navigation", { name: "Điều hướng mobile" });
      await expect(nav).toBeVisible();
      for (const safeBottom of [0, 34]) {
        // Synthetic safe area checks CSS geometry, not native iOS launch mode.
        await page.evaluate(
          (value) =>
            document.documentElement.style.setProperty(
              "--mobile-safe-bottom",
              `${value}px`,
            ),
          safeBottom,
        );
        await expect
          .poll(async () => {
            const bounds = await nav.boundingBox();
            return bounds
              ? Math.round(size.height - bounds.y - bounds.height)
              : -1;
          })
          .toBe(Math.max(8, safeBottom));
        const bounds = (await nav.boundingBox())!;
        expect(bounds.height).toBe(52);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        for (const link of await nav.getByRole("link").all()) {
          expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        }
        expect(
          await page
            .locator(".main-content")
            .evaluate((element) =>
              parseFloat(getComputedStyle(element).paddingBottom),
            ),
        ).toBeGreaterThanOrEqual(bounds.height + Math.max(8, safeBottom) + 16);
        if (route === "dashboard" || route === "calendar") {
          await page.evaluate(() => document.fonts.ready);
          await page.screenshot({
            path: testInfo.outputPath(`${route}-${safeBottom}.png`),
          });
        }
      }
    }
    expect(errors).toEqual([]);
  });
}
