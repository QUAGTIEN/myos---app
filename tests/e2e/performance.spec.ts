import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("calendar switches from mobile to lazy desktop without losing selected date or controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const manifest = JSON.parse(
    readFileSync(resolve(".next/react-loadable-manifest.json"), "utf8"),
  ) as Record<string, { files: string[] }>;
  const desktopChunks = Object.entries(manifest).find(([name]) =>
    name.endsWith("-> ./desktop-calendar"),
  )![1].files;
  const requests: string[] = [];
  page.on("request", (request) =>
    requests.push(new URL(request.url()).pathname),
  );
  await page.goto("/calendar");
  await expect(page.locator(".mobile-month-grid")).toBeVisible();
  expect(await page.locator(".fc").count()).toBe(0);
  expect(
    desktopChunks.some((file) => requests.includes("/_next/" + file)),
  ).toBe(false);
  await page
    .getByRole("button", { name: "Tìm kiếm và lọc lịch", exact: true })
    .click();
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".fc-daygrid-body")).toBeVisible();
  expect(
    desktopChunks.every((file) => requests.includes("/_next/" + file)),
  ).toBe(true);
  await expect(page.getByLabel("Đến ngày", { exact: true })).toHaveValue(
    "2026-10-06",
  );
  await page.getByRole("button", { name: "Tháng sau", exact: true }).click();
  await expect(page.getByLabel("Đến ngày", { exact: true })).toHaveValue(
    "2026-11-01",
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator(".mobile-month-grid")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Xem ngày 2026-11-01/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Tuần", exact: true }).click();
  await expect(
    page.getByRole("group", { name: "Lịch tuần", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("mobile navigation gives feedback while a route response is delayed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/calendar?*", async (route) => {
    if (!route.request().url().includes("_rsc=")) return route.continue();
    await gate;
    await route.continue();
  });
  await page.goto("/dashboard");
  await expect(
    page.getByRole("group", { name: "Nội dung tổng quan" }),
  ).toBeVisible();
  const link = page
    .getByRole("navigation", { name: "Điều hướng mobile" })
    .getByRole("link", { name: "Lịch", exact: true });
  try {
    await link.click();
    await expect
      .poll(
        async () =>
          (await link.locator("[aria-busy=true]").isVisible()) ||
          (await page.locator(".page-skeleton").isVisible()),
      )
      .toBe(true);
  } finally {
    release();
  }
  await expect(page.locator(".mobile-month-grid")).toBeVisible();
  await expect(link.locator("[aria-busy=true]")).toHaveCount(0);
});
