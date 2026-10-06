import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProjectDetailScreen } from "@/modules/projects/components/project-detail-screen";

export const metadata: Metadata = { title: "Chi tiết dự án" };

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      projectId,
    )
  )
    notFound();
  return <ProjectDetailScreen projectId={projectId} />;
}
