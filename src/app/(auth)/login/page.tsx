import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Sprout } from "lucide-react";

export const metadata: Metadata = { title: "Đăng nhập" };
export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <span className="login-brand">
          <Sprout size={26} aria-hidden="true" />
          myos.
        </span>
        <p className="eyebrow">KHÔNG GIAN RIÊNG CỦA BẠN</p>
        <h1>Chào mừng trở lại.</h1>
        <p>Lịch, dự án và những ý tưởng — cùng một nơi.</p>
        <fieldset disabled className="login-form">
          <legend className="sr-only">Đăng nhập chưa được kết nối</legend>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="ban@example.com"
          />
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
          />
          <button type="button" className="button primary">
            <LockKeyhole size={17} aria-hidden="true" />
            Đăng nhập
          </button>
        </fieldset>
        <p className="form-help">
          Đăng nhập sẽ được kết nối ở bước tiếp theo. Bản khung hiện chưa lưu dữ
          liệu cá nhân.
        </p>
        <Link href="/dashboard" className="text-link">
          Xem khung giao diện
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
      <p className="login-footer">
        Nhẹ nhàng sắp xếp. Tập trung điều quan trọng.
      </p>
    </main>
  );
}
