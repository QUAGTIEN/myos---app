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
        <h1>Đăng nhập</h1>
        <p>Chưa bật xác thực</p>
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
        <Link href="/dashboard" className="text-link">
          Về Tổng quan
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
