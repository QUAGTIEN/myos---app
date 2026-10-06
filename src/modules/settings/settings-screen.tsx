import { Bell, Check, Cloud, Palette, UserRound } from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/page-ui";

import { CalendarSettingsPanel } from "@/modules/calendar/components/calendar-settings";

export function SettingsScreen() {
  return (
    <>
      <PageHeading title="Cài đặt" />
      <div className="settings-grid">
        <section className="panel settings-panel blue">
          <h2>
            <UserRound size={20} aria-hidden="true" />
            Tài khoản
          </h2>
          <div className="account-preview">
            <span className="avatar large">M</span>
            <div>
              <strong>Không gian cá nhân</strong>
              <p>Chưa đăng nhập tài khoản</p>
            </div>
          </div>
          <Link className="button secondary" href="/login">
            Xem trang đăng nhập
          </Link>
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
            <span className="status-pill">Chưa kết nối</span>
          </div>
        </section>
      </div>
    </>
  );
}
