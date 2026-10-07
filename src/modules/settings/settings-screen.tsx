"use client";
import { useState, type FormEvent } from "react";
import { useAccount, LogoutButton } from "@/modules/auth/account-context";
import { cloudWrite } from "@/lib/firebase/cloud-client";
import { profileSchema } from "@/lib/firebase/profile";
import { Bell, Check, Cloud, Palette, UserRound } from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/page-ui";

import { CalendarSettingsPanel } from "@/modules/calendar/components/calendar-settings";

function AccountSettings() {
  const account = useAccount();
  const [name, setName] = useState(account?.profile.displayName ?? "");
  const [firstDay, setFirstDay] = useState<0 | 1>(
    account?.profile.firstDay ?? 1,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  if (!account)
    return (
      <>
        <p>Chưa đăng nhập tài khoản</p>
        <Link className="button secondary" href="/login">
          Xem trang đăng nhập
        </Link>
      </>
    );
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!account || pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const value = await cloudWrite({
        kind: "profile",
        operation: "save",
        id: "profile",
        expectedVersion: account.profile.version,
        value: { displayName: name, firstDay, timezone: "Asia/Ho_Chi_Minh" },
      });
      account.setProfile(profileSchema.parse(value));
      setMessage("Đã lưu cài đặt tài khoản.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Không lưu được cài đặt.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <p className="account-email">{account.profile.email}</p>
      <form className="schedule-form" onSubmit={(event) => void save(event)}>
        <fieldset disabled={pending}>
          <label>
            Tên hiển thị
            <input
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Ngày đầu tuần
            <select
              value={firstDay}
              onChange={(e) => setFirstDay(Number(e.target.value) as 0 | 1)}
            >
              <option value={1}>Thứ Hai</option>
              <option value={0}>Chủ Nhật</option>
            </select>
          </label>
          <div className="setting-row">
            <span>Múi giờ</span>
            <strong>Việt Nam (UTC+7)</strong>
          </div>
          <button className="button primary" type="submit">
            {pending ? "Đang lưu…" : "Lưu tài khoản"}
          </button>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
      </form>
      <LogoutButton />
    </>
  );
}
export function SettingsScreen() {
  const account = useAccount();
  return (
    <>
      <PageHeading title="Cài đặt" />
      <div className="settings-grid">
        <section className="panel settings-panel blue">
          <h2>
            <UserRound size={20} aria-hidden="true" />
            Tài khoản
          </h2>
          <AccountSettings />
        </section>
        <section className="panel settings-panel lavender">
          <h2>
            <Palette size={20} aria-hidden="true" />
            Giao diện
          </h2>
          <div className="theme-preview">
            <div className="theme-sample">
              <span />
              <div>
                <i />
                <i />
                <i />
              </div>
            </div>
            <div>
              <strong>Giao diện sáng</strong>
            </div>
            <Check size={19} aria-label="Đang áp dụng" />
          </div>
          <div className="setting-row">
            <span>Phông chữ</span>
            <strong>Be Vietnam Pro</strong>
          </div>
        </section>
        <CalendarSettingsPanel />
        <section className="panel settings-panel peach">
          <h2>
            <Bell size={20} aria-hidden="true" />
            Thông báo & dữ liệu
          </h2>
          <div className="setting-row">
            <span>Nhắc qua Zalo</span>
            <span className="status-pill">Chưa kết nối</span>
          </div>
          <div className="setting-row">
            <span>
              <Cloud size={16} aria-hidden="true" />
              Đồng bộ dữ liệu
            </span>
            <span className="status-pill">
              {account ? "Firestore" : "Local"}
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
