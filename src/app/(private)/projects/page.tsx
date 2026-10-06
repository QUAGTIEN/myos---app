import type { Metadata } from "next";
import { ProjectsScreen } from "@/modules/projects/components/projects-screen";
export const metadata: Metadata = { title: "Dự án" };
export default function ProjectsPage() {
  return <ProjectsScreen />;
}
