import { expect, test } from "@playwright/test";

const screens = [
  {
    path: "/dashboard",
    label: "Tổng quan",
    heading: "Tổng quan",
  },
  { path: "/calendar", label: "Lịch", heading: "Lịch" },
  { path: "/projects", label: "Dự án", heading: "Dự án" },
  { path: "/notes", label: "Ghi chú", heading: "Ghi chú" },
  { path: "/settings", label: "Cài đặt", heading: "Cài đặt" },
];

test("calendar and project tabs support keyboard selection and named panels", async ({
  page,
}) => {
  await page.goto("/calendar");
  const calendarTabs = page.getByRole("tablist", { name: "Phân mục lịch" });
  await calendarTabs.getByRole("tab", { name: "Lịch", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    calendarTabs.getByRole("tab", { name: "Chấm công" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Tạo công việc");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tabpanel")).toContainText("Tháng");
  await page.goto("/projects");
  const projectTabs = page.getByRole("tablist", { name: "Hiển thị dự án" });
  await projectTabs.getByRole("tab", { name: "Thẻ", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    projectTabs.getByRole("tab", { name: "Kanban" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page
      .getByRole("tabpanel")
      .getByRole("region", { name: "Kanban Đang làm", exact: true }),
  ).toBeVisible();
});

test("navigate all five modules without overflow or browser errors", async ({
  page,
  isMobile,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard$/);

  for (const screen of screens) {
    const link = page
      .getByRole("navigation", {
        name: isMobile ? "Điều hướng mobile" : "Điều hướng chính",
      })
      .getByRole("link", { name: screen.label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp(screen.path + "$"));
    await expect(
      page.getByRole("heading", { name: screen.heading, level: 1 }),
    ).toBeVisible();
    await expect(link).toHaveAttribute("aria-current", "page");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: testInfo.outputPath(screen.path.slice(1) + ".png"),
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("calendar controls change months and return to today", async ({
  page,
  isMobile,
}) => {
  await page.goto("/calendar");
  const title = page
    .getByRole("region", { name: "Bộ lịch", exact: true })
    .getByRole("heading", { level: 2 });
  const original = await title.textContent();
  await page.getByRole("button", { name: "Tháng sau", exact: true }).click();
  await expect(title).not.toHaveText(original!);
  await page.getByRole("button", { name: "Tháng trước", exact: true }).click();
  await expect(title).toHaveText(original!);
  await page.getByRole("button", { name: "Tháng trước", exact: true }).click();
  const originalDate = await page.evaluate(() =>
    new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(
      new Date(),
    ),
  );
  if (isMobile)
    await page.getByRole("button", { name: "Tìm kiếm và lọc lịch" }).click();
  await page.getByLabel("Đến ngày", { exact: true }).fill(originalDate);
  await expect(title).toHaveText(original!);
  await expect(page.getByRole("button", { name: "Tạo lịch hẹn" })).toHaveCount(
    0,
  );
});

test("unimplemented mutations and login are clearly unavailable", async ({
  page,
  isMobile,
}) => {
  await page.goto("/settings");
  if (isMobile)
    await page.getByRole("button", { name: "Tài khoản", exact: true }).click();
  await page.getByRole("link", { name: "Xem trang đăng nhập" }).click();
  await expect(page.getByLabel("Email", { exact: true })).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Đăng nhập", exact: true }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Về Tổng quan" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("unknown pages and nonexistent resources return 404", async ({ page }) => {
  for (const path of [
    "/does-not-exist",
    "/projects/missing",
    "/notes/missing",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Trang này chưa có ở đây" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Về Tổng quan" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  }
});

test("Vietnamese font loads and dashboard screenshot is captured", async ({
  page,
}, testInfo) => {
  await page.goto("/dashboard");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() =>
      document.fonts.check('400 14px "Be Vietnam Pro"'),
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("dashboard.png"),
    fullPage: true,
  });
});

test("keyboard navigation and narrow viewport stay usable", async ({
  page,
  isMobile,
}) => {
  await page.goto("/dashboard");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Đến nội dung chính" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  if (isMobile) {
    const navigation = page.getByRole("navigation", {
      name: "Điều hướng mobile",
    });
    await navigation.getByRole("link", { name: "Lịch", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/calendar$/);
  }
  await page.setViewportSize({ width: 320, height: 740 });
  for (const screen of screens) {
    await page.goto(screen.path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
