"use client";

import { useCallback, useEffect, useState } from "react";
import { projectErrorMessage, type Project } from "./model";
import { projectRepository, projectsChangedEvent } from "./repository";

export function useProjects(projectId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let disposed = false;
    let generation = 0;
    const load = async () => {
      const request = ++generation;
      try {
        const data = projectId
          ? await projectRepository.get(projectId)
          : await projectRepository.list();
        if (disposed || request !== generation) return;
        if (Array.isArray(data)) setProjects(data);
        else setProject(data);
        setError("");
      } catch (cause) {
        if (!disposed && request === generation)
          setError(projectErrorMessage(cause));
      } finally {
        if (!disposed && request === generation) setLoading(false);
      }
    };
    void load();
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined")
        channel = new BroadcastChannel(projectsChangedEvent);
    } catch {
      // Some browsers restrict channels; the focus listener still refreshes data.
    }
    channel?.addEventListener("message", load);
    window.addEventListener(projectsChangedEvent, load);
    window.addEventListener("focus", load);
    return () => {
      disposed = true;
      channel?.close();
      window.removeEventListener(projectsChangedEvent, load);
      window.removeEventListener("focus", load);
    };
  }, [projectId, retry]);

  const run = useCallback(
    async (operation: () => Promise<Project>, success: string) => {
      setPending(true);
      setError("");
      setMessage("");
      try {
        await operation();
        setMessage(success);
      } catch (cause) {
        setError(projectErrorMessage(cause));
      } finally {
        setPending(false);
      }
    },
    [],
  );

  return {
    projects,
    project,
    loading,
    error,
    pending,
    message,
    run,
    refresh: () => setRetry((value) => value + 1),
  };
}
