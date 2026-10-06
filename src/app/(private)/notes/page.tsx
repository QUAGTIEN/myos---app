import type { Metadata } from "next";
import { NotesScreen } from "@/modules/notes/components/notes-screen";
export const metadata: Metadata = { title: "Ghi chú" };
export default function NotesPage() {
  return <NotesScreen />;
}
