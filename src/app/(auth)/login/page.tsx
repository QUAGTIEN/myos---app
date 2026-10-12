import type { Metadata } from "next";
import { AuthScreen } from "@/modules/auth/auth-screen";
import { redirect } from "next/navigation";
import {
  authenticatedUser,
  cloudMode,
  HttpError,
} from "@/lib/firebase/session";
export const metadata: Metadata = { title: "Đăng nhập" };
export default async function Page() {
  if (cloudMode()) {
    try {
      await authenticatedUser();
    } catch (cause) {
      if (cause instanceof HttpError && cause.status === 401)
        return <AuthScreen mode="login" />;
      throw cause;
    }
    redirect("/dashboard");
  }
  return <AuthScreen mode="login" />;
}
