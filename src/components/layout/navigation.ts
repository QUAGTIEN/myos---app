import {
  CalendarDays,
  FolderKanban,
  LayoutDashboard,
  NotebookPen,
  Settings2,
} from "lucide-react";

export const navigation = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/calendar", label: "Lịch", icon: CalendarDays },
  { href: "/projects", label: "Dự án", icon: FolderKanban },
  { href: "/notes", label: "Ghi chú", icon: NotebookPen },
  { href: "/settings", label: "Cài đặt", icon: Settings2 },
] as const;
