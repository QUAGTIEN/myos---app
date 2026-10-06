import {
  ArrowUpRight,
  CalendarDays,
  FolderKanban,
  NotebookPen,
} from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/page-ui";

const sections = [
  {
    href: "/calendar",
    label: "Lịch",
    action: "Mở lịch",
    icon: CalendarDays,
    tone: "blue",
  },
  {
    href: "/projects",
    label: "Dự án",
    action: "Xem dự án",
    icon: FolderKanban,
    tone: "peach",
  },
  {
    href: "/notes",
    label: "Ghi chú",
    action: "Mở ghi chú",
    icon: NotebookPen,
    tone: "lavender",
  },
] as const;

export function OverviewScreen() {
  return (
    <>
      <PageHeading title="Tổng quan" />
      <div className="overview-grid">
        {sections.map(({ href, label, action, icon: Icon, tone }) => (
          <Link key={href} href={href} className={"overview-card " + tone}>
            <span className="overview-icon">
              <Icon size={28} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <h2>{label}</h2>
            <span className="overview-action">
              {action}
              <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
