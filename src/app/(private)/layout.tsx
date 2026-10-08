import { AppShell } from "@/components/app-shell";
import { cloudMode, requirePageUser } from "@/lib/firebase/session";
import { ensureProfile } from "@/lib/firebase/data";
import { AccountProvider } from "@/modules/auth/account-context";
import { RepositoryCacheProvider } from "@/lib/repository-cache";
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!cloudMode())
    return (
      <RepositoryCacheProvider>
        <AppShell>{children}</AppShell>
      </RepositoryCacheProvider>
    );
  const profile = await ensureProfile(await requirePageUser());
  return (
    <AccountProvider key={profile.uid} initial={profile}>
      <AppShell>{children}</AppShell>
    </AccountProvider>
  );
}
