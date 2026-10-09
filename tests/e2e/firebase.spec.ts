import { openAppointment, markAttendance } from "./calendar-helpers";
import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { randomUUID } from "node:crypto";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
  emptyProjectInput,
  projectSchema,
} from "../../src/modules/projects/model";
import {
  emptyNoteInput,
  noteSchema,
  type Note,
} from "../../src/modules/notes/model";
import {
  blankEvent,
  defaultCalendarSettings,
  eventSchema,
} from "../../src/modules/calendar/model";
import {
  newCalendarEvent,
  editCalendarEvent,
  occurrenceToInput,
} from "../../src/modules/calendar/service";
import { effectiveOccurrence } from "../../src/modules/calendar/recurrence";

const password = "MyOS-test-2026!";
test("calendar custom colors persist through cloud validation and recurring overrides", async ({
  page,
  context,
}) => {
  await account(context.request);
  const settings = {
    ...defaultCalendarSettings,
    groups: defaultCalendarSettings.groups.map((group) => ({
      ...group,
      color: "#188038",
    })),
  };
  const settingsCommand = {
    kind: "calendarSettings",
    operation: "save",
    id: "calendar",
    expectedVersion: 0,
    value: settings,
  };
  expect((await write(context.request, settingsCommand)).status()).toBe(200);
  expect(
    (
      await write(context.request, {
        ...settingsCommand,
        expectedVersion: 1,
        value: {
          ...settings,
          groups: [{ ...settings.groups[0], color: "red" }],
        },
      })
    ).status(),
  ).toBe(400);
  let event = newCalendarEvent({
    ...blankEvent("2026-10-06", defaultCalendarSettings),
    title: "Lịch màu cloud",
    repeat: { weekdays: [2, 4], until: "2026-10-15" },
  });
  const command = {
    kind: "calendarEvents",
    operation: "save",
    id: event.id,
    expectedVersion: 0,
    value: event,
  };
  expect((await write(context.request, command)).status()).toBe(200);
  const first = effectiveOccurrence(event, event.start)!;
  event = editCalendarEvent(
    event,
    { ...occurrenceToInput(first, event), color: "#c5221f" },
    first.originalStart,
  );
  expect(
    (
      await write(context.request, {
        ...command,
        expectedVersion: 1,
        value: event,
      })
    ).status(),
  ).toBe(200);
  expect(
    (
      await write(context.request, {
        ...command,
        expectedVersion: 2,
        value: { ...event, version: 3, color: "#fff" },
      })
    ).status(),
  ).toBe(400);
  const saved = eventSchema
    .array()
    .parse(
      (
        await (
          await context.request.get("/api/data?kind=calendarEvents")
        ).json()
      ).value,
    )[0];
  expect(effectiveOccurrence(saved, saved.start)?.color).toBe("#c5221f");
  expect(effectiveOccurrence(saved, "2026-10-08T09:00")?.color).toBeNull();
  await page.goto("/calendar");
  await page.getByLabel("Đến ngày", { exact: true }).fill("2026-10-06");
  const firstCell = page.locator(
    '.fc-daygrid-day[data-date="2026-10-06"] .fc-event',
  );
  const nextCell = page.locator(
    '.fc-daygrid-day[data-date="2026-10-08"] .fc-event',
  );
  await expect(firstCell).toHaveCSS("background-color", "rgb(197, 34, 31)");
  await expect(nextCell).toHaveCSS("background-color", "rgb(24, 128, 56)");
  await page.reload();
  await expect(firstCell).toHaveCSS("background-color", "rgb(197, 34, 31)");
});
test("attendance cloud stores atomic months, rejects stale/foreign records and keeps offline drafts", async ({
  page,
  context,
  playwright,
}) => {
  await account(context.request);
  const other = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:3101",
  });
  try {
    await account(other);
    const now = new Date().toISOString();
    const id = randomUUID();
    const activity = {
      id,
      name: "Đi dạy cloud",
      color: "turquoise",
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    expect(
      (
        await write(context.request, {
          kind: "attendanceActivities",
          operation: "save",
          id,
          expectedVersion: 0,
          value: activity,
        })
      ).status(),
    ).toBe(200);
    const month = {
      id: id + "_2026-10",
      activityId: id,
      month: "2026-10",
      entries: [
        {
          date: "2026-10-05",
          status: "done",
          start: "09:00",
          end: "11:00",
          note: "Lớp A",
        },
      ],
      version: 1,
      updatedAt: now,
    };
    const command = {
      kind: "attendanceMonths",
      operation: "save",
      id: month.id,
      expectedVersion: 0,
      value: month,
    };
    expect((await write(other, command)).status()).toBe(400);
    expect(
      (
        await other
          .get(`/api/data?kind=attendanceActivities&id=${id}`)
          .then((response) => response.json())
      ).value,
    ).toBeNull();
    expect((await write(context.request, command)).status()).toBe(200);
    expect((await write(context.request, command)).status()).toBe(409);
    const invalid = {
      ...command,
      expectedVersion: 1,
      value: {
        ...month,
        version: 2,
        entries: [...month.entries, ...month.entries],
      },
    };
    expect((await write(context.request, invalid)).status()).toBe(400);
    expect(
      (
        await other
          .get(`/api/data?kind=attendanceMonths&id=${month.id}`)
          .then((response) => response.json())
      ).value,
    ).toBeNull();
    expect(
      (await context.request.get("/api/data?kind=attendanceMonths")).status(),
    ).toBe(400);
    await page.goto("/calendar");
    await page.getByRole("tab", { name: "Chấm công", exact: true }).click();
    await page.getByLabel("Tháng chấm công").fill("2026-10");
    await expect(
      page.getByRole("button", {
        name: "Chấm công 2026-10-05",
        exact: true,
      }),
    ).toBeVisible();
    await markAttendance(page, "2026-10-08");
    await page
      .getByRole("button", {
        name: "Chấm công 2026-10-12",
        exact: true,
      })
      .click();
    const inline = page.getByRole("form", {
      name: "Nội dung ngày 2026-10-12",
      exact: true,
    });
    let fail = true;
    await page.route("**/api/data", (route) =>
      route.request().method() === "POST" && fail
        ? route.abort()
        : route.continue(),
    );
    await inline.getByRole("textbox").fill("Lí 12 cloud");
    await expect(page.locator(".attendance-module [role=alert]")).toContainText(
      "Bản nháp vẫn được giữ",
    );
    await expect(inline.getByRole("textbox")).toHaveValue("Lí 12 cloud");
    fail = false;
    await page
      .getByRole("button", { name: "Thử lưu lại", exact: true })
      .click();
    await expect(page.locator(".attendance-save-state")).toHaveText(
      "Đã lưu tự động.",
    );
    const stored = (
      await (
        await context.request.get(
          `/api/data?kind=attendanceMonths&id=${month.id}`,
        )
      ).json()
    ).value;
    expect(stored.version).toBe(3);
    expect(stored.entries.map((entry: { date: string }) => entry.date)).toEqual(
      ["2026-10-05", "2026-10-08", "2026-10-12"],
    );
    expect(stored.entries[0].note).toBe("Lớp A");
    expect(stored.entries[2]).toMatchObject({
      status: "done",
      start: "",
      end: "",
      note: "Lí 12 cloud",
    });
    await page.reload();
    await expect(
      page.locator('.attendance-cell[data-date="2026-10-12"]'),
    ).toContainText("Lí 12 cloud");
    await expect(
      page.getByRole("button", {
        name: "Chấm công 2026-10-08",
        exact: true,
      }),
    ).toBeVisible();
    // Deletion is version checked, hides all months, and cannot resurrect an activity.
    expect(
      (
        await write(other, {
          kind: "attendanceActivities",
          operation: "save",
          id,
          expectedVersion: 1,
          value: { ...activity, version: 2, deletedAt: now },
        })
      ).status(),
    ).toBe(409);
    await page
      .getByRole("button", { name: "Sửa công việc", exact: true })
      .click();
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("button", { name: "Xóa công việc", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Chưa có công việc", exact: true }),
    ).toBeVisible();
    expect(
      (
        await context.request.get(
          `/api/data?kind=attendanceMonths&id=${month.id}`,
        )
      ).status(),
    ).toBe(404);
    expect(
      (
        await write(context.request, {
          ...command,
          expectedVersion: 3,
          value: { ...stored, version: 4 },
        })
      ).status(),
    ).toBe(400);
    expect(
      (
        await write(context.request, {
          kind: "attendanceActivities",
          operation: "save",
          id,
          expectedVersion: 2,
          value: { ...activity, version: 3, deletedAt: null },
        })
      ).status(),
    ).toBe(404);
  } finally {
    await other.dispose();
  }
});
test("attendance autosave keeps edits typed during a pending cloud write", async ({
  page,
  context,
}) => {
  await account(context.request);
  await page.goto("/calendar");
  await page.getByRole("tab", { name: "Chấm công", exact: true }).click();
  await page
    .getByRole("button", { name: "Tạo công việc", exact: true })
    .click();
  await page.getByLabel("Tên công việc", { exact: true }).fill("Đi làm");
  await page
    .getByRole("button", { name: "Lưu công việc", exact: true })
    .click();
  await page.getByLabel("Tháng chấm công").fill("2026-10");
  let writes = 0;
  await page.route("**/api/data", async (route) => {
    if (
      route.request().method() === "POST" &&
      route.request().postDataJSON().kind === "attendanceMonths"
    ) {
      writes++;
      if (writes === 1)
        await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    await route.continue();
  });
  await page
    .getByRole("button", { name: "Chấm công 2026-10-05", exact: true })
    .click();
  const input = page.getByRole("textbox", {
    name: "Nội dung chấm công ngày 2026-10-05",
    exact: true,
  });
  await input.fill("Nội dung đầu");
  await expect(page.locator(".attendance-save-state")).toHaveText("Đang lưu…");
  await input.fill("Nội dung mới nhất");
  await expect.poll(() => writes).toBe(2);
  await expect(page.locator(".attendance-save-state")).toHaveText(
    "Đã lưu tự động.",
  );
  await expect(input).toHaveValue("Nội dung mới nhất");
  await page.reload();
  await expect(
    page.locator('.attendance-cell[data-date="2026-10-05"]'),
  ).toContainText("Nội dung mới nhất");
});

async function write(request: APIRequestContext, body: unknown) {
  const { csrfToken } = await (await request.get("/api/auth")).json();
  return request.post("/api/data", {
    headers: { Origin: "http://127.0.0.1:3101", "x-myos-csrf": csrfToken },
    data: body,
  });
}
async function account(request: APIRequestContext) {
  const email = `test-${randomUUID()}@example.com`;
  const signup = await request.post(
    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key",
    { data: { email, password, returnSecureToken: true } },
  );
  expect(signup.ok()).toBeTruthy();
  const { idToken, localId } = await signup.json();
  const { csrfToken } = await (await request.get("/api/auth")).json();
  const result = await request.post("/api/auth", {
    headers: { Origin: "http://127.0.0.1:3101", "x-myos-csrf": csrfToken },
    data: { idToken, remember: true },
  });
  expect(result.status()).toBe(200);
  return { email, uid: String(localId), idToken: String(idToken) };
}
async function register(page: Page, email: string) {
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Tiến thử nghiệm");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.getByLabel("Nhập lại mật khẩu").fill(password);
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  // The first Firestore request can include Emulator/server cold start.
  await expect(page).toHaveURL(/dashboard$/, { timeout: 15000 });
}

async function navigate(page: Page, label: string) {
  const menu = page.getByRole("button", { name: "Mở menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .getByRole("link", { name: label, exact: true })
    .click();
}

test("shared data survives navigation, deduplicates dialogs and updates only affected sources", async ({
  page,
  context,
}, info) => {
  await account(context.request);
  const reads: Record<string, number> = {};
  let csrfReads = 0;
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (request.method() !== "GET") return;
    if (url.pathname === "/api/auth") csrfReads++;
    if (url.pathname === "/api/data") {
      const key = url.searchParams.get("kind")!;
      reads[key] = (reads[key] ?? 0) + 1;
    }
  });
  await page.goto("/dashboard");
  await expect(page.locator(".dashboard-block-loading")).toHaveCount(0);
  await expect.poll(() => Object.keys(reads).length).toBe(4);
  await expect(page.locator(".dashboard-block-loading")).toHaveCount(0);
  const initial = { ...reads };
  expect(Object.values(initial)).toEqual([1, 1, 1, 1]);
  for (const [label, path, ready] of [
    ["Ghi chú", "/notes", "Tạo ghi chú"],
    ["Dự án", "/projects", "Tạo dự án"],
    ["Lịch", "/calendar", "Chấm công"],
  ]) {
    await navigate(page, label);
    await expect(page).toHaveURL(new RegExp(path + "$"));
    await expect(page.locator(".page-skeleton")).toHaveCount(0);
    await expect(
      page.getByRole(ready === "Chấm công" ? "tab" : "button", {
        name: ready,
        exact: true,
      }),
    ).toBeEnabled();
  }
  await openAppointment(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(reads).toEqual(initial);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Đóng hộp thoại lịch", exact: true })
    .click();
  await navigate(page, "Dự án");
  await page.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên dự án").fill("Cache IoT");
  await dialog.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cache IoT", exact: true }),
  ).toBeVisible();
  expect(reads).toEqual(initial);
  expect(csrfReads).toBe(1);

  // An old GET completes after a successful POST: it must not undo the save.
  let releaseRead!: () => void;
  let capturedRead!: () => void;
  const captured = new Promise<void>((resolve) => {
    capturedRead = resolve;
  });
  const release = new Promise<void>((resolve) => {
    releaseRead = resolve;
  });
  await page.route("**/api/data?kind=projects", async (route) => {
    const response = await route.fetch();
    capturedRead();
    await release;
    await route.fulfill({ response });
  });
  await page.evaluate(() =>
    window.dispatchEvent(new Event("myos:projects-changed")),
  );
  await captured;
  await page.getByLabel("Thao tác Cache IoT").click();
  await page
    .getByRole("button", { name: "Ghim Cache IoT", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Đã ghim");
  const readComplete = page.waitForResponse(
    (response) => new URL(response.url()).search === "?kind=projects",
  );
  releaseRead();
  await readComplete;
  await page.unroute("**/api/data?kind=projects");
  await page.getByLabel("Thao tác Cache IoT").click();
  await expect(
    page.getByRole("button", { name: "Bỏ ghim Cache IoT", exact: true }),
  ).toBeVisible();
  expect(csrfReads).toBe(1);
  expect(reads.notes).toBe(initial.notes);
  expect(reads.calendarEvents).toBe(initial.calendarEvents);

  // Cookie expiry is retried once, only after the server rejects CSRF pre-write.
  await context.clearCookies({ name: "myos-csrf" });
  await page
    .getByRole("button", { name: "Bỏ ghim Cache IoT", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Đã bỏ ghim");
  expect(csrfReads).toBe(2);
  const saved = projectSchema
    .array()
    .parse(
      (await (await context.request.get("/api/data?kind=projects")).json())
        .value,
    );
  expect(saved[0].version).toBe(3);
  await page.screenshot({
    path: info.outputPath("projects-cached.png"),
    fullPage: true,
  });
});

test("session optimization preserves disabled account and token revocation checks", async ({
  request,
  playwright,
}) => {
  expect(process.env.FIREBASE_AUTH_EMULATOR_HOST).toBe("127.0.0.1:9099");
  const app = initializeApp({ projectId: "demo-myos" }, randomUUID());
  const second = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:3101",
  });
  try {
    const revoked = await account(request);
    const disabled = await account(second);
    expect((await request.get("/api/data?kind=profile")).status()).toBe(200);
    await getAuth(app).updateUser(disabled.uid, { disabled: true });
    expect((await second.get("/api/data?kind=profile")).status()).toBe(401);
    // Auth tokens use seconds; revoke after the creation second has passed.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await getAuth(app).revokeRefreshTokens(revoked.uid);
    expect((await request.get("/api/data?kind=profile")).status()).toBe(401);
  } finally {
    await second.dispose();
    await deleteApp(app);
  }
});

test("logout clears cached data in another tab and a new account starts with its own cache", async ({
  page,
  context,
}) => {
  await account(context.request);
  const now = new Date().toISOString();
  const note = noteSchema.parse({
    ...emptyNoteInput,
    title: "Ghi chú tài khoản cũ",
    id: randomUUID(),
    schemaVersion: 1,
    version: 1,
    createdAt: now,
    updatedAt: now,
    pinned: false,
    trashedAt: null,
    revisions: [],
  });
  expect(
    (
      await write(context.request, {
        kind: "notes",
        operation: "save",
        id: note.id,
        expectedVersion: 0,
        value: note,
      })
    ).status(),
  ).toBe(200);
  const otherTab = await context.newPage();
  await otherTab.goto("/notes");
  await expect(
    otherTab.getByRole("heading", { name: note.title, exact: true }),
  ).toBeVisible();
  await page.goto("/settings");
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await expect(page).toHaveURL(/login$/);
  await expect(
    otherTab.getByRole("heading", { name: note.title, exact: true }),
  ).not.toBeVisible();
  await expect(
    otherTab
      .getByRole("alert")
      .filter({ hasText: "Phiên đăng nhập đã kết thúc" }),
  ).toContainText("Phiên đăng nhập đã kết thúc");
  await register(page, `new-cache-${randomUUID()}@example.com`);
  await navigate(page, "Ghi chú");
  await expect(
    page.getByRole("button", { name: "Tạo ghi chú", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("heading", { name: note.title, exact: true }),
  ).not.toBeVisible();
  await otherTab.close();
});

test("public signup, cloud CRUD, settings, logout and login on desktop/mobile", async ({
  page,
  context,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/projects");
  await expect(page).toHaveURL(/login$/);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: info.outputPath("login.png"), fullPage: true });
  const email = `ui-${randomUUID()}@example.com`;
  await register(page, email);
  await page.goto("/projects");
  await page.getByRole("button", { name: "Tạo dự án", exact: true }).click();
  await page.getByRole("dialog").getByLabel("Tên dự án").fill("IoT cloud");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Tạo dự án", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("heading", { name: "IoT cloud", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "IoT cloud", level: 1 }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "IoT cloud", level: 1 }),
  ).toBeVisible();
  await page.goto("/notes");
  await expect(
    page.getByRole("button", { name: "Từ ảnh", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Tạo ghi chú", exact: true }).click();
  await page.getByLabel("Tiêu đề ghi chú").fill("Ghi chú cloud");
  await page
    .getByRole("textbox", { name: "Nội dung ghi chú" })
    .fill("Nội dung được lưu trong Firestore.");
  await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
  await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
  await expect(
    page.getByRole("button", { name: "Thêm ảnh", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Nội dung ghi chú" }),
  ).toContainText("Nội dung được lưu");
  await page.route("**/api/data", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Không lưu được cloud. Bản nháp vẫn được giữ.",
          }),
        })
      : route.continue(),
  );
  await page
    .getByRole("textbox", { name: "Nội dung ghi chú" })
    .fill("Giữ bản nháp khi mất kết nối.");
  await expect(page.locator(".note-save-bar")).toContainText("Lưu lỗi");
  await expect(
    page.getByRole("textbox", { name: "Nội dung ghi chú" }),
  ).toContainText("Giữ bản nháp");
  await page.unroute("**/api/data");
  await page.getByRole("button", { name: "Lưu ngay", exact: true }).click();
  await expect(page.locator(".note-save-bar")).toContainText("Đã lưu");
  await page.goto("/calendar");
  await openAppointment(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Tên lịch hẹn", { exact: true }).fill("Lịch cloud");
  await dialog.getByLabel("Bắt đầu", { exact: true }).fill("2026-10-08T09:00");
  await dialog.getByLabel("Kết thúc", { exact: true }).fill("2026-10-08T10:00");
  await dialog
    .getByRole("button", { name: "Lưu lịch hẹn", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await page.goto("/settings");
  await page.getByLabel("Tên hiển thị").fill("Tiến cloud");
  await page.getByLabel("Ngày đầu tuần").selectOption("0");
  await page
    .getByRole("button", { name: "Lưu tài khoản", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Đã lưu cài đặt tài khoản",
  );
  await page.reload();
  await expect(page.getByLabel("Tên hiển thị")).toHaveValue("Tiến cloud");
  await expect(page.getByLabel("Ngày đầu tuần")).toHaveValue("0");
  await page.screenshot({
    path: info.outputPath("settings-cloud.png"),
    fullPage: true,
  });
  expect(
    (await context.cookies()).find((c) => c.name === "myos-session")?.httpOnly,
  ).toBe(true);
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await expect(page).toHaveURL(/login$/);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill("incorrect-password");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.locator(".auth-error")).toContainText(
    "Email hoặc mật khẩu chưa đúng",
  );
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/dashboard$/);
  await page.goto("/notes");
  await expect(
    page.getByRole("heading", { name: "Ghi chú cloud", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("two accounts: ownership, atomic links, versions, revisions and rules", async ({
  playwright,
  request,
}) => {
  const a = request;
  const b = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:3101",
  });
  try {
    const owner = await account(a);
    await account(b);
    const now = new Date().toISOString();
    const project = projectSchema.parse({
      ...emptyProjectInput,
      title: "Dự án A",
      id: randomUUID(),
      schemaVersion: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
      pinned: false,
      items: [],
      updates: [],
      relatedNoteIds: [],
      relatedEventIds: [],
      workspace: {},
    });
    expect(
      (
        await write(a, {
          kind: "projects",
          operation: "save",
          id: project.id,
          expectedVersion: 0,
          value: project,
        })
      ).status(),
    ).toBe(200);
    expect(
      (await (await b.get(`/api/data?kind=projects&id=${project.id}`)).json())
        .value,
    ).toBeNull();
    const note = noteSchema.parse({
      ...emptyNoteInput,
      title: "Ghi chú A",
      id: randomUUID(),
      schemaVersion: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      pinned: false,
      trashedAt: null,
      revisions: [],
      projectIds: [project.id],
    });
    expect(
      (
        await write(b, {
          kind: "notes",
          operation: "save",
          id: note.id,
          expectedVersion: 0,
          value: note,
        })
      ).status(),
    ).toBe(400);
    expect(
      (await (await b.get(`/api/data?kind=notes&id=${note.id}`)).json()).value,
    ).toBeNull();
    expect(
      (
        await write(a, {
          kind: "notes",
          operation: "save",
          id: note.id,
          expectedVersion: 0,
          value: note,
        })
      ).status(),
    ).toBe(200);
    let linked = projectSchema.parse(
      (await (await a.get(`/api/data?kind=projects&id=${project.id}`)).json())
        .value,
    );
    expect(linked.relatedNoteIds).toEqual([note.id]);
    expect(linked.version).toBe(2);
    expect(
      (
        await write(a, {
          kind: "projects",
          operation: "save",
          id: project.id,
          expectedVersion: 1,
          value: { ...project, version: 2 },
        })
      ).status(),
    ).toBe(409);
    const event = eventSchema.parse({
      ...blankEvent("2026-10-08", defaultCalendarSettings),
      id: randomUUID(),
      schemaVersion: 1,
      title: "Buổi IoT",
      version: 1,
      createdAt: now,
      updatedAt: now,
      cancelledAt: null,
      exceptions: [],
      sourceMilestone: null,
      projectIds: [project.id],
      noteIds: [note.id],
    });
    expect(
      (
        await write(a, {
          kind: "calendarEvents",
          operation: "save",
          id: event.id,
          expectedVersion: 0,
          value: event,
        })
      ).status(),
    ).toBe(200);
    linked = projectSchema.parse(
      (await (await a.get(`/api/data?kind=projects&id=${project.id}`)).json())
        .value,
    );
    expect(linked.relatedEventIds).toEqual([event.id]);
    expect(
      (
        await write(a, {
          kind: "calendarSettings",
          operation: "copy",
          id: "calendar",
          expectedVersion: 0,
          sourceId: event.groupId,
          name: "Bộ lịch bản sao",
        })
      ).status(),
    ).toBe(200);
    const copies = eventSchema
      .array()
      .parse(
        (await (await a.get("/api/data?kind=calendarEvents")).json()).value,
      );
    expect(copies.length).toBe(2);
    const copy = copies.find((item) => item.id !== event.id)!;
    expect(copy.projectIds).toEqual([]);
    expect(copy.noteIds).toEqual([]);
    expect(copy.groupId).not.toBe(event.groupId);
    expect(
      (
        await write(a, {
          kind: "calendarSettings",
          operation: "copy",
          id: "calendar",
          expectedVersion: 0,
          sourceId: event.groupId,
          name: "Không lưu",
        })
      ).status(),
    ).toBe(409);
    let latest: Note = note;
    for (let index = 0; index < 22; index++) {
      const result = await write(a, {
        kind: "notes",
        operation: "save",
        id: note.id,
        expectedVersion: latest.version,
        value: {
          ...latest,
          title: `Bản ${index}`,
          version: latest.version + 1,
          revisions: [],
        },
      });
      expect(result.status()).toBe(200);
      latest = noteSchema.parse((await result.json()).value);
    }
    expect(latest.revisions.length).toBe(20);
    const reload = noteSchema.parse(
      (await (await a.get(`/api/data?kind=notes&id=${note.id}`)).json()).value,
    );
    expect(reload.revisions).toEqual(latest.revisions);
    expect(
      (
        await write(a, {
          kind: "projects",
          operation: "save",
          id: project.id,
          expectedVersion: linked.version,
          value: { ...linked, version: linked.version + 1 },
          uid: owner.uid,
        })
      ).status(),
    ).toBe(400);
    expect(
      (await a.post("/api/data", { data: { kind: "notes" } })).status(),
    ).toBe(403);
    const denied = await a.get(
      `http://127.0.0.1:8080/v1/projects/demo-myos/databases/(default)/documents/users/${owner.uid}/projects/${project.id}`,
      { headers: { Authorization: `Bearer ${owner.idToken}` } },
    );
    expect(denied.status()).toBe(403);
    expect(
      (
        await write(a, {
          kind: "notes",
          operation: "remove",
          id: note.id,
          expectedVersion: latest.version,
        })
      ).status(),
    ).toBe(400);
    const trash = await write(a, {
      kind: "notes",
      operation: "save",
      id: note.id,
      expectedVersion: latest.version,
      value: {
        ...latest,
        revisions: [],
        version: latest.version + 1,
        trashedAt: now,
      },
    });
    expect(trash.status()).toBe(200);
    latest = noteSchema.parse((await trash.json()).value);
    expect(
      (
        await write(a, {
          kind: "notes",
          operation: "remove",
          id: note.id,
          expectedVersion: latest.version,
        })
      ).status(),
    ).toBe(200);
    linked = projectSchema.parse(
      (await (await a.get(`/api/data?kind=projects&id=${project.id}`)).json())
        .value,
    );
    expect(linked.relatedNoteIds).toEqual([]);
  } finally {
    await b.dispose();
  }
});

test("logout revokes a copied session; forgot password and network error preserve form", async ({
  page,
  playwright,
}) => {
  await page.goto("/forgot-password");
  await page
    .getByLabel("Email", { exact: true })
    .fill(`absent-${randomUUID()}@example.com`);
  await page.getByRole("button", { name: "Gửi liên kết đặt lại" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nếu email có tài khoản",
  );
  const a = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:3101",
  });
  const owner = await account(a);
  const otherDevice = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:3101",
  });
  const csrf = await (await otherDevice.get("/api/auth")).json();
  expect(
    (
      await otherDevice.post("/api/auth", {
        headers: {
          Origin: "http://127.0.0.1:3101",
          "x-myos-csrf": csrf.csrfToken,
        },
        data: { idToken: owner.idToken, remember: false },
      })
    ).status(),
  ).toBe(200);
  expect(
    (await otherDevice.storageState()).cookies.find(
      (c) => c.name === "myos-session",
    )?.expires,
  ).toBe(-1);
  const state = await a.storageState();
  const copied = await playwright.request.newContext({
    baseURL: "http://127.0.0.1:3101",
    storageState: state,
  });
  try {
    expect((await copied.get("/api/data?kind=profile")).status()).toBe(200);
    const { csrfToken } = await (await a.get("/api/auth")).json();
    expect(
      (
        await a.delete("/api/auth", {
          headers: {
            Origin: "http://127.0.0.1:3101",
            "x-myos-csrf": csrfToken,
          },
        })
      ).status(),
    ).toBe(200);
    expect((await copied.get("/api/data?kind=profile")).status()).toBe(401);
    expect((await otherDevice.get("/api/data?kind=profile")).status()).toBe(
      200,
    );
  } finally {
    await a.dispose();
    await copied.dispose();
    await otherDevice.dispose();
  }
  const email = `failure-${randomUUID()}@example.com`;
  await page.route("**/api/auth", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Không kết nối được Firebase phía server.",
          }),
        })
      : route.continue(),
  );
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("Bản nháp");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.getByLabel("Nhập lại mật khẩu").fill(password);
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(page.locator(".auth-error")).toContainText(
    "Tài khoản đã được tạo",
  );
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(email);
  await expect(
    page.getByRole("button", { name: "Thử đăng nhập lại" }),
  ).toBeEnabled();
});
