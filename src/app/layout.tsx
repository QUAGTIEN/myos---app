import type { Metadata, Viewport } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MyOS — Không gian cá nhân", template: "%s | MyOS" },
  description: "Sắp xếp lịch, dự án và ghi chú trong một không gian cá nhân.",
  robots: { index: false, follow: false },
  applicationName: "MyOS",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "MyOS", statusBarStyle: "default" },
  // Next 15 emits the unprefixed tag; older iOS also needs Apple's name.
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#102f49",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
