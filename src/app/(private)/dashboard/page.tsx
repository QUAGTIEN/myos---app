import type { Metadata } from "next";
import { OverviewScreen } from "@/modules/overview/components/overview-screen";
export const metadata: Metadata = { title: "Tổng quan" };
export default function DashboardPage() {
  return <OverviewScreen />;
}
