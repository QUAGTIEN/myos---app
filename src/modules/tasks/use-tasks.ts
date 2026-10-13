"use client";

import { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import { useRepositoryData } from "@/lib/repository-cache";
import { taskError, type Task, type TaskInput } from "./model";
import { taskRepository } from "./repository";
import { taskService } from "./service";

export function useTasks() {
  const result = useRepositoryData("tasks", undefined, taskRepository.list);
  const { mutate } = useSWRConfig();
  const inFlight = useRef(new Set<string>());
  const [pending, setPending] = useState<string[]>([]);
  const [optimistic, setOptimistic] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState("");
  async function run(
    key: string,
    operation: () => Promise<Task>,
    completed?: boolean,
  ) {
    if (inFlight.current.has(key)) return false;
    inFlight.current.add(key);
    setPending([...inFlight.current]);
    setActionError("");
    if (completed !== undefined)
      setOptimistic((current) => ({ ...current, [key]: completed }));
    try {
      const saved = await operation();
      await mutate<Task[]>(
        ["tasks", ""],
        (current) => {
          const existing = current?.find((task) => task.id === saved.id);
          if (existing && existing.version > saved.version) return current;
          const other = (current ?? []).filter((task) => task.id !== saved.id);
          return saved.deletedAt ? other : [...other, saved];
        },
        { revalidate: false },
      );
      return true;
    } catch (cause) {
      setActionError(taskError(cause));
      result.refresh();
      return false;
    } finally {
      inFlight.current.delete(key);
      setPending([...inFlight.current]);
      setOptimistic((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  }
  const tasks = (result.data ?? [])
    .map((task) =>
      optimistic[task.id] === undefined
        ? task
        : { ...task, completed: optimistic[task.id] },
    )
    .sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
    );
  return {
    tasks,
    pending,
    loading: result.loading,
    ready: result.data !== undefined && !result.error,
    error: actionError || (result.error ? taskError(result.error) : ""),
    refresh: () => {
      setActionError("");
      result.refresh();
    },
    create: (input: TaskInput) =>
      run("create", () => taskService.create(input)),
    toggle: (task: Task) =>
      run(task.id, () => taskService.toggle(task), !task.completed),
    edit: (task: Task, input: TaskInput) =>
      run(task.id, () => taskService.edit(task, input)),
    remove: (task: Task) => run(task.id, () => taskService.remove(task)),
  };
}
