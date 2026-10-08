import type { Page } from "@playwright/test";

export async function openAppointment(page: Page) {
  const date = await page.getByLabel("Đến ngày", { exact: true }).inputValue();
  await page
    .getByRole("button", { name: "Thêm vào ngày " + date, exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^Tạo lịch hẹn/ })
    .click();
}

export async function markAttendance(
  page: Page,
  date: string,
  note = "Đã chấm",
) {
  await page
    .getByRole("button", { name: `Chấm công ${date}`, exact: true })
    .click();
  const editor = page.getByRole("form", {
    name: "Nội dung ngày " + date,
    exact: true,
  });
  await editor.getByRole("textbox").fill(note);
  await editor.getByRole("button", { name: "Xong", exact: true }).click();
  await editor.waitFor({ state: "hidden" });
}
