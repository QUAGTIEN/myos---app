import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NoteDetailScreen } from "@/modules/notes/components/note-detail-screen";
export const metadata: Metadata = { title: "Chi tiết ghi chú" };
export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      noteId,
    )
  )
    notFound();
  return <NoteDetailScreen noteId={noteId} />;
}
