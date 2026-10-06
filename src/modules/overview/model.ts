import { addDays, type CalendarEvent } from "@/modules/calendar/model";
import { expandEvents } from "@/modules/calendar/recurrence";
import type { Note } from "@/modules/notes/model";
import type { Project } from "@/modules/projects/model";

export function selectOverview(
  projects: Project[],
  notes: Note[],
  events: CalendarEvent[],
  today: string,
  day = today,
) {
  const unfinished = projects.filter(
    (project) => !project.archivedAt && project.status !== "completed",
  );
  const tasks = unfinished.flatMap((project) =>
    project.items
      .filter((item) => item.kind === "task" && !item.completed)
      .map((item) => ({ project, item })),
  );
  const milestones = unfinished.flatMap((project) =>
    project.items
      .filter(
        (item) => item.kind === "milestone" && !item.completed && item.dueDate,
      )
      .map((item) => ({ project, item })),
  );
  const byDueDate = (a: (typeof tasks)[number], b: (typeof tasks)[number]) =>
    (a.item.dueDate || "9999").localeCompare(b.item.dueDate || "9999") ||
    a.item.title.localeCompare(b.item.title, "vi") ||
    a.item.id.localeCompare(b.item.id);
  tasks.sort(byDueDate);
  milestones.sort(byDueDate);
  const activeProjects = unfinished
    .filter((project) => project.status === "active")
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        (a.dueDate || "9999").localeCompare(b.dueDate || "9999") ||
        b.updatedAt.localeCompare(a.updatedAt) ||
        a.id.localeCompare(b.id),
    );
  const liveNotes = notes
    .filter((note) => !note.trashedAt)
    .sort(
      (a, b) =>
        b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id),
    );
  const todayEvents = expandEvents(events, today, addDays(today, 1));
  const dayEvents =
    day === today ? todayEvents : expandEvents(events, day, addDays(day, 1));
  return {
    tasks,
    milestones,
    activeProjects,
    liveNotes,
    todayEvents,
    dayEvents,
    overdueTasks: tasks.filter(
      ({ item }) => item.dueDate && item.dueDate < today,
    ).length,
  };
}
