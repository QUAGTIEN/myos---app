"use client";
import { Button } from "@/components/ui/button";

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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAccount } from "@/modules/auth/account-context";
const navigation = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/calendar", label: "Lịch", icon: CalendarDays },
  { href: "/notes", label: "Ghi chú", icon: NotebookPen },
  { href: "/projects", label: "Dự án", icon: FolderKanban },
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
  const account = useAccount();
  const router = useRouter();
  const initial =
    account?.profile.displayName.trim().charAt(0).toUpperCase() || "M";
  return (
    <>
      <Brand />
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
              onPointerEnter={() => router.prefetch(href)}
              onFocus={() => router.prefetch(href)}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
              {active && <span className="active-dot" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <Link
          href="/settings"
          className="workspace-footer"
          onClick={onNavigate}
        >
          <span className="avatar">{initial}</span>
          <div>
            <strong>{account?.profile.displayName ?? "Cá nhân"}</strong>
          </div>
        </Link>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const account = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const calendarDesign = pathname === "/calendar";
  useEffect(() => {
    if (!navRef.current) return;
    const shell = shellRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.borderBoxSize[0]?.blockSize)
          shell?.style.setProperty(
            entry.target === navRef.current
              ? "--mobile-nav-height"
              : "--mobile-header-height",
            `${entry.borderBoxSize[0].blockSize}px`,
          );
      }
    });
    observer.observe(navRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    return () => {
      observer.disconnect();
      shell?.style.removeProperty("--mobile-nav-height");
      shell?.style.removeProperty("--mobile-header-height");
    };
  }, []);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const nav = navRef.current;
    const mobile = window.matchMedia("(max-width: 700px)");
    let previous = Math.max(0, window.scrollY);
    let travel = 0;
    let frame = 0;
    const reveal = () => {
      header.dataset.scrollHidden = "false";
      if (nav) nav.dataset.scrollHidden = "false";
      header.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
      travel = 0;
    };
    const update = () => {
      frame = 0;
      const next = Math.max(0, window.scrollY);
      header.dataset.scrolled = next > 8 ? "true" : "false";
      const delta = next - previous;
      previous = next;
      // Focus/keyboard scrolling must not dismiss controls the user is using.
      const editing = document.activeElement?.matches(
        "input, textarea, select, [contenteditable='true']",
      );
      if (
        !mobile.matches ||
        next < header.offsetHeight ||
        editing ||
        header.contains(document.activeElement) ||
        nav?.querySelector(":focus-visible") ||
        document.querySelector('[role="dialog"]')
      ) {
        reveal();
        return;
      }
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (Math.abs(travel) >= 18) {
        header.dataset.scrollHidden = travel > 0 ? "true" : "false";
        if (nav) nav.dataset.scrollHidden = travel > 0 ? "true" : "false";
        travel = 0;
      }
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    reveal();
    window.addEventListener("scroll", scroll, { passive: true });
    mobile.addEventListener("change", reveal);
    header.addEventListener("focusin", reveal);
    nav?.addEventListener("focusin", reveal);
    return () => {
      window.removeEventListener("scroll", scroll);
      mobile.removeEventListener("change", reveal);
      header.removeEventListener("focusin", reveal);
      nav?.removeEventListener("focusin", reveal);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
  const current = navigation.find(
    ({ href }) => pathname === href || pathname.startsWith(href + "/"),
  );

  return (
    <div
      ref={shellRef}
      data-module={current?.href.slice(1)}
      className={
        "app-shell" +
        (pathname === "/dashboard" ? " overview-shell" : "") +
        (calendarDesign ? " calendar-design-shell" : "")
      }
    >
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <aside className="desktop-sidebar">
        <SidebarContent pathname={pathname} />
      </aside>
      <div className="app-workspace">
        <header ref={headerRef} className="app-header">
          <div className="header-location">
            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="icon-button mobile-menu"
                  type="button"
                  aria-label="Mở menu"
                >
                  <Menu size={21} />
                </Button>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-button drawer-close"
                      type="button"
                      aria-label="Đóng menu"
                    >
                      <X size={20} />
                    </Button>
                  </Dialog.Close>
                  <SidebarContent
                    pathname={pathname}
                    onNavigate={() => setMenuOpen(false)}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <span className="header-current">{current?.label ?? "MyOS"}</span>
            <Link
              href="/dashboard"
              className="mobile-brand"
              aria-label="MyOS — Tổng quan"
            >
              myos.
            </Link>
          </div>
          <div className="header-right">
            <div id="mobile-header-actions" className="mobile-header-actions" />
            <Link
              href="/settings"
              className="header-avatar"
              aria-label="Mở cài đặt không gian"
            >
              {account?.profile.displayName.trim().charAt(0).toUpperCase() ||
                "M"}
            </Link>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className={
            "main-content" +
            (pathname === "/calendar" ? " calendar-content" : "")
          }
        >
          {children}
        </main>
      </div>
      <nav
        ref={navRef}
        className="mobile-bottom-nav"
        aria-label="Điều hướng mobile"
      >
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                active ? "mobile-bottom-link active" : "mobile-bottom-link"
              }
              onFocus={() => router.prefetch(href)}
              onPointerEnter={() => router.prefetch(href)}
            >
              <span className="mobile-bottom-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
