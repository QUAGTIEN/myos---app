"use client";

import { useCallback, useState } from "react";
import { useRepositoryData } from "@/lib/repository-cache";
import { projectErrorMessage, type Project } from "./model";
import { projectRepository } from "./repository";

export function useProjects(projectId?: string) {
  const result = useRepositoryData<Project[] | Project | null>(
    "projects",
    projectId,
    () =>
      projectId ? projectRepository.get(projectId) : projectRepository.list(),
  );
  const [actionError, setActionError] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const run = useCallback(
    async (operation: () => Promise<Project>, success: string) => {
      setPending(true);
      setActionError("");
      setMessage("");
      try {
        await operation();
        setMessage(success);
      } catch (cause) {
        setActionError(projectErrorMessage(cause));
      } finally {
        setPending(false);
      }
    },
    [],
  );

  return {
    projects: Array.isArray(result.data) ? result.data : [],
    project: result.data && !Array.isArray(result.data) ? result.data : null,
    loading: result.loading,
    error:
      actionError || (result.error ? projectErrorMessage(result.error) : ""),
    pending,
    message,
    run,
    refresh: () => {
      setActionError("");
      result.refresh();
    },
  };
}
