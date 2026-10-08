import { expect, test, type Page } from "@playwright/test";
import {
  emptyProjectInput,
  projectSchema,
  type Project,
} from "../../src/modules/projects/model";
import { emptyNoteInput, noteSchema } from "../../src/modules/notes/model";
import {
  blankEvent,
  defaultCalendarSettings,
} from "../../src/modules/calendar/model";
import {
  newCalendarEvent,
  editCalendarEvent,
} from "../../src/modules/calendar/service";

const at = "2026-10-06T17:30:00Z";
function fixture() {
  const item = (
    title: string,
    dueDate = "",
    kind: "task" | "milestone" = "task",
    completed = false,
  ) => ({
    id: crypto.randomUUID(),
    title,
    dueDate,
    kind,
    completed,
    description: "",
    countsTowardProgress: kind === "task",
  });
  const project = (title: string, extra: Partial<Project> = {}) =>
    projectSchema.parse({
      ...emptyProjectInput,
      id: crypto.randomUUID(),
      title,
      schemaVersion: 1,
      version: 1,
      createdAt: at,
      updatedAt: at,
      archivedAt: null,
      pinned: false,
      items: [],
      updates: [],
      relatedNoteIds: [],
      relatedEventIds: [],
      ...extra,
    });
  const active = project("MyOS Platform", {
    progressMode: "checklist",
    items: [
      item("Chuẩn bị cuộc họp", "2026-10-07"),
      item("Rà soát bản thiết kế", "2026-10-05"),
      item("Khởi tạo framework", "", "task", true),
      item("Bàn giao giao diện", "2026-10-08", "milestone"),
    ],
  });
  const projects = [
    active,
    project("Website Marketing", { manualProgress: 65, color: "blue" }),
    project("Kế hoạch cá nhân", {
      status: "paused",
      items: [item("Đọc tài liệu")],
    }),
    project("Dự án lưu trữ", {
      archivedAt: at,
      items: [item("Mục trong lưu trữ", "2026-10-04")],
    }),
    project("Dự án hoàn thành", {
      status: "completed",
      items: [item("Mục trong dự án hoàn thành")],
    }),
  ];
  const note = (
    title: string,
    pinned = false,
    trashedAt: string | null = null,
  ) =>
    noteSchema.parse({
      ...emptyNoteInput,
      id: crypto.randomUUID(),
      title,
      pinned,
      trashedAt,
      schemaVersion: 1,
      version: 1,
      createdAt: at,
      updatedAt: at,
      revisions: [],
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Nội dung được giữ từ ghi chú cá nhân." },
            ],
          },
        ],
      },
    });
  const notes = [
    note("Ý tưởng tính năng mới", true),
    note("Kế hoạch tuần"),
    note("Ghi chú đã xóa", false, at),
  ];
  const overnight = newCalendarEvent({
    ...blankEvent("2026-10-06", defaultCalendarSettings),
    title: "Học TypeScript",
    start: "2026-10-06T23:30",
    end: "2026-10-07T01:00",
    repeat: { weekdays: [2, 4], until: "2026-10-15" },
  });
  const moved = editCalendarEvent(
    overnight,
    {
      ...overnight,
      title: "Buổi học đổi giờ",
      start: "2026-10-07T10:00",
      end: "2026-10-07T11:00",
    },
    "2026-10-08T23:30",
  );
  const events = [
    moved,
    newCalendarEvent({
      ...blankEvent("2026-10-07", defaultCalendarSettings),
      title: "Ngày cá nhân",
      start: "2026-10-07",
      end: "2026-10-08",
      allDay: true,
    }),
    newCalendarEvent({
      ...blankEvent("2026-10-07", defaultCalendarSettings),
      title: "Họp nhóm sản phẩm",
      start: "2026-10-07T14:00",
      end: "2026-10-07T15:00",
      important: true,
    }),
    newCalendarEvent({
      ...blankEvent("2026-10-06", defaultCalendarSettings),
      title: "Kết thúc lúc nửa đêm",
      start: "2026-10-06T23:00",
      end: "2026-10-07T00:00",
    }),
    {
      ...newCalendarEvent({
        ...blankEvent("2026-10-07", defaultCalendarSettings),
        title: "Lịch đã hủy",
      }),
      cancelledAt: at,
    },
    newCalendarEvent({
      ...blankEvent("2026-10-08", defaultCalendarSettings),
      title: "Lịch ngày mai",
    }),
  ];
  return { projects, notes, events };
}
async function seed(page: Page, data = fixture()) {
  await page.clock.install({ time: new Date(at) });
  await page.goto("/login");
  await page.evaluate(async (data) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("myos-local", 3);
      request.onupgradeneeded = () => {
        for (const name of [
          "projects",
          "notes",
          "calendarEvents",
          "calendarSettings",
          "noteAttachments",
        ])
          request.result.createObjectStore(name, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(
        ["projects", "notes", "calendarEvents"],
        "readwrite",
      );
      for (const value of data.projects) tx.objectStore("projects").put(value);
      for (const value of data.notes) tx.objectStore("notes").put(value);
      for (const value of data.events)
        tx.objectStore("calendarEvents").put(value);
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  }, data);
  return data;
}
const metric = (page: Page, name: string, count: number | string) =>
  page.getByRole("link", { name: name + ": " + count, exact: true });

test.use({ timezoneId: "America/Los_Angeles" });

test("overview summarizes live data using Vietnam days, recurring exceptions and source progress", async ({
  page,
  isMobile,
}, info) => {
  const data = await seed(page);
  await page.goto("/dashboard");
  await expect(metric(page, "Lịch hôm nay", 4)).toBeVisible();
  await expect(metric(page, "Checklist cần làm", 3)).toBeVisible();
  await expect(metric(page, "Dự án đang làm", 2)).toBeVisible();
  await expect(metric(page, "Ghi chú", 2)).toBeVisible();
  const agenda = page.getByRole("region", { name: "Lịch trong ngày" });
  await expect(
    agenda.getByRole("button", { name: /Buổi học đổi giờ/ }),
  ).toBeVisible();
  await expect(agenda).not.toContainText("Lịch đã hủy");
  await expect(agenda).not.toContainText("Kết thúc lúc nửa đêm");
  const tasks = page.getByRole("region", { name: "Checklist cần làm" });
  await expect(tasks.getByRole("listitem").first()).toContainText(
    "Rà soát bản thiết kế",
  );
  await expect(tasks).not.toContainText("Mục trong lưu trữ");
  await expect(tasks).not.toContainText("Mục trong dự án hoàn thành");
  await expect(
    page.getByRole("progressbar", { name: "Tiến độ MyOS Platform" }),
  ).toHaveAttribute("aria-valuenow", "33");
  const notes = page.getByRole("region", { name: "Ghi chú", exact: true });
  await notes.getByRole("button", { name: "Đã ghim", exact: true }).click();
  await expect(
    notes.getByRole("link", { name: /Ý tưởng tính năng mới/ }),
  ).toBeVisible();
  await expect(notes).not.toContainText("Kế hoạch tuần");
  await page.getByRole("button", { name: "Ngày sau", exact: true }).click();
  await expect(agenda).toContainText("Lịch ngày mai");
  await expect(agenda).not.toContainText("Buổi học đổi giờ");
  await expect(metric(page, "Lịch hôm nay", 4)).toBeVisible();
  await page.getByRole("button", { name: "Hôm nay", exact: true }).click();
  await expect(agenda).toContainText("Buổi học đổi giờ");
  await notes.getByRole("button", { name: "Mới nhất", exact: true }).click();
  if (!isMobile) await page.setViewportSize({ width: 1920, height: 1080 });
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("dashboard-populated.png"),
    fullPage: true,
  });
  await page.clock.fastForward(24 * 60 * 60 * 1000);
  await expect(metric(page, "Lịch hôm nay", 1)).toBeVisible();
  await expect(agenda).toContainText("Lịch ngày mai");
  await notes.getByRole("link", { name: /Ý tưởng tính năng mới/ }).click();
  await expect(page).toHaveURL(new RegExp("/notes/" + data.notes[0].id + "$"));
});

test("overview checklist commits progress, preserves failed changes and refreshes across tabs", async ({
  page,
  context,
}) => {
  const data = await seed(page);
  await page.goto("/dashboard");
  await expect(metric(page, "Checklist cần làm", 3)).toBeVisible();
  await page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      const tx = original.apply(this, args);
      if (
        args[1] === "readwrite" &&
        (typeof args[0] === "string"
          ? [args[0]]
          : Array.from(args[0])
        ).includes("projects")
      )
        queueMicrotask(() => tx.abort());
      return tx;
    };
    Object.defineProperty(window, "restoreDashboardTransaction", {
      value: () => {
        IDBDatabase.prototype.transaction = original;
      },
    });
  });
  await page
    .getByRole("checkbox", {
      name: "Hoàn thành Chuẩn bị cuộc họp",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("region", { name: "Checklist cần làm" }).getByRole("alert"),
  ).toBeVisible();
  await expect(metric(page, "Checklist cần làm", 3)).toBeVisible();
  await page.evaluate(() =>
    Reflect.get(window, "restoreDashboardTransaction")(),
  );
  await page
    .getByRole("checkbox", {
      name: "Hoàn thành Chuẩn bị cuộc họp",
      exact: true,
    })
    .click();
  await expect(metric(page, "Checklist cần làm", 2)).toBeVisible();
  await expect(
    page.getByRole("progressbar", { name: "Tiến độ MyOS Platform" }),
  ).toHaveAttribute("aria-valuenow", "67");
  const other = await context.newPage();
  await other.goto("/login");
  await other.evaluate(async (note) => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("myos-local");
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("notes", "readwrite");
      tx.objectStore("notes").put({
        ...note,
        title: "Cập nhật từ tab khác",
        version: note.version + 1,
      });
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
    const channel = new BroadcastChannel("myos:notes-changed");
    channel.postMessage("changed");
    channel.close();
  }, data.notes[0]);
  await expect(
    page.getByRole("link", { name: /Cập nhật từ tab khác/ }),
  ).toBeVisible();
  await page.reload();
  await expect(metric(page, "Checklist cần làm", 2)).toBeVisible();
  await page
    .getByRole("region", { name: "Tiến độ dự án" })
    .getByRole("link", { name: /MyOS Platform/ })
    .click();
  await expect(
    page.getByRole("checkbox", {
      name: "Hoàn thành Chuẩn bị cuộc họp",
      exact: true,
    }),
  ).toBeChecked();
  await other.close();
});

test("overview omits quick creation and existing calendar details remain editable", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/dashboard");
  for (const name of ["Tạo dự án", "Tạo lịch hẹn", "Tạo ghi chú"])
    await expect(page.getByRole("button", { name, exact: true })).toHaveCount(
      0,
    );
  await expect(
    page.getByRole("region", { name: "Lịch trong ngày" }),
  ).toBeVisible();
  await page
    .getByRole("region", { name: "Lịch trong ngày" })
    .getByRole("button", { name: /Buổi học đổi giờ/ })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Sửa lịch hẹn", exact: true }).click();
  await expect(page.getByLabel("Tên lịch hẹn", { exact: true })).toBeVisible();
});

test("a failed source has its own retry and does not hide healthy overview panels", async ({
  page,
}) => {
  await seed(page);
  await page.addInitScript(() => {
    Reflect.set(window, "dashboardBlockNotes", true);
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      if (
        Reflect.get(window, "dashboardBlockNotes") &&
        (typeof args[0] === "string"
          ? [args[0]]
          : Array.from(args[0])
        ).includes("notes")
      )
        throw new DOMException("Storage denied", "SecurityError");
      return original.apply(this, args);
    };
  });
  await page.goto("/dashboard");
  await expect(metric(page, "Ghi chú", "không khả dụng")).toBeVisible();
  await expect(metric(page, "Lịch hôm nay", 4)).toBeVisible();
  await expect(metric(page, "Dự án đang làm", 2)).toBeVisible();
  const notes = page.getByRole("region", { name: "Ghi chú", exact: true });
  await expect(notes.getByRole("alert")).toBeVisible();
  await page.evaluate(() => Reflect.set(window, "dashboardBlockNotes", false));
  await notes.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(metric(page, "Ghi chú", 2)).toBeVisible();
  await expect(notes.getByRole("alert")).not.toBeVisible();
});
