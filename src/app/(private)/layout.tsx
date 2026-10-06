import { AppShell } from "@/components/app-shell";

// Route group only: Firebase session guards will be added in G2.
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
