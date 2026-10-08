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

export async function markAttendance(page: Page, date: string) {
  await page
    .getByRole("button", { name: `Chấm công ${date}, Chưa chấm`, exact: true })
    .click();
  const editor = page.getByRole("form", {
    name: "Nội dung ngày " + date,
    exact: true,
  });
  await editor
    .getByRole("combobox", { name: "Trạng thái", exact: true })
    .selectOption("done");
  await editor.getByRole("button", { name: "Xong", exact: true }).click();
}
