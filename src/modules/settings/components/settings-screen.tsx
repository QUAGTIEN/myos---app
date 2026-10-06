import {
  Bell,
  CalendarDays,
  Check,
  Cloud,
  Palette,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FeatureNotice } from "@/components/ui/feature-notice";
import { PageHeading } from "@/components/ui/page-heading";

export function SettingsScreen() {
  return (
    <>
      <PageHeading
        eyebrow="THEO CÁCH CỦA BẠN"
        title="Cài đặt"
        description="Tinh chỉnh không gian để phù hợp với thói quen của bạn."
      />
      <FeatureNotice>
        Đây là cấu hình hiển thị của bản khung. Hồ sơ và tùy chọn cá nhân chưa
        được lưu.
      </FeatureNotice>
      <div className="settings-grid">
        <section className="panel settings-panel">
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
        <section className="panel settings-panel">
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
              <p>Nhẹ mắt, rõ ràng và tập trung.</p>
            </div>
            <Check size={19} aria-label="Đang áp dụng" />
          </div>
          <div className="setting-row">
            <span>Phông chữ</span>
            <strong>Be Vietnam Pro</strong>
          </div>
        </section>
        <section className="panel settings-panel">
          <h2>
            <CalendarDays size={20} aria-hidden="true" />
            Lịch & thời gian
          </h2>
          <div className="setting-row">
            <span>Múi giờ mặc định</span>
            <strong>Việt Nam · UTC+7</strong>
          </div>
          <div className="setting-row">
            <span>Ngày đầu tuần</span>
            <strong>Thứ Hai</strong>
          </div>
          <div className="setting-row">
            <span>Ngôn ngữ</span>
            <strong>Tiếng Việt</strong>
          </div>
        </section>
        <section className="panel settings-panel">
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
          <p className="setting-help">
            Tùy chọn nhắc lịch và đồng bộ sẽ xuất hiện khi các tính năng được
            kết nối.
          </p>
        </section>
      </div>
    </>
  );
}
