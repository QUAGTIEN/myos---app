"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  CalendarDays,
  FolderKanban,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Settings2,
  Sprout,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
const navigation = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/calendar", label: "Lịch", icon: CalendarDays },
  { href: "/projects", label: "Dự án", icon: FolderKanban },
  { href: "/notes", label: "Ghi chú", icon: NotebookPen },
  { href: "/settings", label: "Cài đặt", icon: Settings2 },
] as const;

function Brand() {
  return (
    <Link href="/dashboard" className="brand" aria-label="MyOS — Tổng quan">
      <span className="brand-symbol">
        <Sprout aria-hidden="true" />
      </span>
      <span>
        myos<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <Brand />
      <div className="workspace-label">
        <span className="workspace-dot" />
        Không gian cá nhân
      </div>
      <p className="nav-caption">KHÔNG GIAN CỦA BẠN</p>
      <nav aria-label="Điều hướng chính" className="main-nav">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={active ? "nav-link active" : "nav-link"}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
              {active && <span className="active-dot" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <Sprout size={19} aria-hidden="true" />
          <p>
            Một chút ngăn nắp.
            <br />
            <strong>Nhiều khoảng thảnh thơi.</strong>
          </p>
        </div>
        <div className="workspace-footer">
          <span className="avatar">M</span>
          <div>
            <strong>Không gian MyOS</strong>
            <span>Bản khung giao diện</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = navigation.find(
    ({ href }) => pathname === href || pathname.startsWith(href + "/"),
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <aside className="desktop-sidebar">
        <SidebarContent pathname={pathname} />
      </aside>
      <div className="app-workspace">
        <header className="app-header">
          <div className="header-location">
            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger asChild>
                <button
                  className="icon-button mobile-menu"
                  type="button"
                  aria-label="Mở menu"
                >
                  <Menu size={21} />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="drawer-overlay" />
                <Dialog.Content
                  className="mobile-sidebar"
                  aria-describedby={undefined}
                >
                  <Dialog.Title className="sr-only">
                    Điều hướng MyOS
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="icon-button drawer-close"
                      type="button"
                      aria-label="Đóng menu"
                    >
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                  <SidebarContent
                    pathname={pathname}
                    onNavigate={() => setMenuOpen(false)}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <span className="header-workspace">Không gian cá nhân</span>
            <span className="breadcrumb-divider">/</span>
            <span className="header-current">{current?.label ?? "MyOS"}</span>
          </div>
          <div className="header-right">
            <span className="preview-tag">
              <span />
              Bản khung
            </span>
            <Link
              href="/settings"
              className="header-avatar"
              aria-label="Mở cài đặt không gian"
            >
              M
            </Link>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="main-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>MyOS · Không gian cho cuộc sống của bạn</span>
          <span>
            <CalendarDays size={14} aria-hidden="true" />
            Asia/Ho_Chi_Minh
          </span>
        </footer>
      </div>
    </div>
  );
}
