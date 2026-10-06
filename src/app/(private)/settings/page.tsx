import type { Metadata } from "next";
import { SettingsScreen } from "@/modules/settings/components/settings-screen";
export const metadata: Metadata = { title: "Cài đặt" };
export default function SettingsPage() {
  return <SettingsScreen />;
}
