import {
  ArrowUpRight,
  CalendarDays,
  FolderKanban,
  NotebookPen,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";

const sections = [
  {
    href: "/calendar",
    label: "Lịch của bạn",
    icon: CalendarDays,
    title: "Hôm nay còn rộng mở",
    description: "Lịch hẹn và thời khóa biểu sẽ xuất hiện ở đây.",
    tone: "mint",
  },
  {
    href: "/projects",
    label: "Dự án đang làm",
    icon: FolderKanban,
    title: "Dành chỗ cho mục tiêu mới",
    description: "Theo dõi những điều bạn muốn hoàn thành.",
    tone: "peach",
  },
  {
    href: "/notes",
    label: "Ghi chú gần đây",
    icon: NotebookPen,
    title: "Ý tưởng bắt đầu từ một dòng",
    description: "Một nơi để giữ lại nội dung và hình ảnh của bạn.",
    tone: "blue",
  },
];

export function OverviewScreen() {
  return (
    <>
      <PageHeading
        eyebrow="KHÔNG GIAN CỦA BẠN"
        title="Một nơi cho những điều quan trọng."
        description="Sắp xếp hôm nay, theo dõi mục tiêu và giữ lại những ý tưởng."
      />
      <section className="welcome-panel">
        <div>
          <span className="welcome-label">
            <Sprout size={17} aria-hidden="true" />
            Bắt đầu thật nhẹ nhàng
          </span>
          <h2>
            Mọi thứ gọn gàng,
            <br />
            theo cách của bạn.
          </h2>
          <p>
            Đi từ một lịch hẹn, một dự án nhỏ
            <br className="desktop-break" /> hay một ghi chú bạn muốn giữ lại.
          </p>
          <Link href="/calendar" className="button primary">
            Khám phá lịch
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="welcome-guide">
          <span className="guide-number">01 — 03</span>
          <Link href="/calendar">
            <CalendarDays size={22} aria-hidden="true" />
            <div>
              <strong>Sắp xếp thời gian</strong>
              <span>Cho một ngày chủ động hơn</span>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/projects">
            <FolderKanban size={22} aria-hidden="true" />
            <div>
              <strong>Theo dõi mục tiêu</strong>
              <span>Từng bước, từng tiến độ</span>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/notes">
            <NotebookPen size={22} aria-hidden="true" />
            <div>
              <strong>Giữ lại ý tưởng</strong>
              <span>Để điều hay không trôi mất</span>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <div className="section-heading">
        <h2>Góc nhìn nhanh</h2>
        <span>Chưa có dữ liệu cá nhân</span>
      </div>
      <div className="overview-grid">
        {sections.map(
          ({ href, label, icon: Icon, title, description, tone }) => (
            <section key={href} className={"overview-card " + tone}>
              <div className="card-heading">
                <span>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </span>
                <Link
                  href={href}
                  className="icon-button"
                  aria-label={"Mở " + label.toLowerCase()}
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <EmptyState
                compact
                icon={Icon}
                title={title}
                description={description}
              />
            </section>
          ),
        )}
      </div>
      <p className="shell-caption">
        Đây là bản khung giao diện. Các thao tác tạo và lưu sẽ được kết nối
        trong những bước tiếp theo.
      </p>
    </>
  );
}
