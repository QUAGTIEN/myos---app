import type { Metadata } from "next";
import { AuthScreen } from "@/modules/auth/auth-screen";
export const metadata: Metadata = { title: "Đăng nhập" };
export default function Page() {
  return <AuthScreen mode="login" />;
}
