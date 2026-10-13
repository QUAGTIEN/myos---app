import type { Metadata } from "next";
import { TasksScreen } from "@/modules/tasks/tasks-screen";

export const metadata: Metadata = { title: "Công việc" };
export default function TasksPage() {
  return <TasksScreen />;
}
