"use client";
import { Button } from "@/components/ui/button";
import { createContext, useContext, useState, type ReactNode } from "react";
import { signOut } from "firebase/auth";
import { browserAuth } from "@/lib/firebase/client";
import { authenticatedFetch } from "@/lib/firebase/cloud-client";
import type { AccountProfile } from "@/lib/firebase/profile";
import { RepositoryCacheProvider } from "@/lib/repository-cache";
const AccountContext = createContext<{
  profile: AccountProfile;
  setProfile: (profile: AccountProfile) => void;
} | null>(null);
export function AccountProvider({
  initial,
  children,
}: {
  initial: AccountProfile;
  children: ReactNode;
}) {
  const [profile, setProfile] = useState(initial);
  return (
    <AccountContext.Provider value={{ profile, setProfile }}>
      <RepositoryCacheProvider key={initial.uid}>
        {children}
      </RepositoryCacheProvider>
    </AccountContext.Provider>
  );
}
export const useAccount = () => useContext(AccountContext);
export function LogoutButton() {
  const account = useAccount();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  if (!account) return null;
  async function logout() {
    setPending(true);
    setError("");
    try {
      await authenticatedFetch("/api/auth", undefined, "DELETE");
      await signOut(browserAuth());
      window.location.replace("/login");
    } catch {
      setError("Chưa đăng xuất được. Vui lòng thử lại.");
      setPending(false);
    }
  }
  return (
    <div className="account-session-actions">
      <Button
        variant="outline"
        size="default"
        className="button secondary"
        type="button"
        disabled={pending}
        onClick={() => void logout()}
      >
        {pending ? "Đang đăng xuất…" : "Đăng xuất"}
      </Button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
