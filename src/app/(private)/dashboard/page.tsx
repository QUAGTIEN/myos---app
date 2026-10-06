import type { Metadata } from "next";
import { OverviewScreen } from "@/modules/overview/overview-screen";
export const metadata: Metadata = { title: "Tổng quan" };
export default function DashboardPage() {
  return <OverviewScreen />;
}
