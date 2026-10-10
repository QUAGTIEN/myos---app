"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";
import { useAccount, LogoutButton } from "@/modules/auth/account-context";
import { cloudWrite } from "@/lib/firebase/cloud-client";
import { profileSchema } from "@/lib/firebase/profile";
import { SettingsSection } from "@/components/settings-section";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import "./settings.css";
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
      <form
        className="schedule-form account-settings-form"
        onSubmit={(event) => void save(event)}
      >
        <fieldset disabled={pending} className="account-settings-fields">
          <label>
            Tên hiển thị
            <Input
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Ngày đầu tuần
            <NativeSelect
              value={firstDay}
              onChange={(e) => setFirstDay(Number(e.target.value) as 0 | 1)}
            >
              <option value={1}>Thứ Hai</option>
              <option value={0}>Chủ Nhật</option>
            </NativeSelect>
          </label>
          <div className="setting-row">
            <span>Múi giờ</span>
            <strong>Việt Nam (UTC+7)</strong>
          </div>
          <Button
            variant="default"
            size="default"
            className="button primary"
            type="submit"
          >
            {pending ? "Đang lưu…" : "Lưu tài khoản"}
          </Button>
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
        <SettingsSection title="Tài khoản">
          <AccountSettings />
        </SettingsSection>
        <CalendarSettingsPanel />
        <SettingsSection title="Giao diện">
          <div className="setting-row">
            <span>Chế độ hiển thị</span>
            <strong>Giao diện sáng</strong>
          </div>
          <div className="setting-row">
            <span>Phông chữ</span>
            <strong>Be Vietnam Pro</strong>
          </div>
        </SettingsSection>
        <SettingsSection title="Thông báo & dữ liệu">
          <div className="setting-row">
            <span>Nhắc qua Zalo</span>
            <Badge variant="secondary">Chưa kết nối</Badge>
          </div>
          <div className="setting-row">
            <span>Đồng bộ dữ liệu</span>
            <Badge variant="secondary">{account ? "Firestore" : "Local"}</Badge>
          </div>
        </SettingsSection>
      </div>
    </>
  );
}
