"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useSWR, { SWRConfig, useSWRConfig, unstable_serialize } from "swr";
import { announceLocalChange, isOwnLocalChange } from "./local-database";

export const repositoryEvents = {
  projects: "myos:projects-changed",
  notes: "myos:notes-changed",
  calendarEvents: "myos:calendar-changed",
  calendarSettings: "myos:calendar-changed",
  attendanceActivities: "myos:attendance-activities-changed",
  attendanceMonths: "myos:attendance-months-changed",
} as const;
export type RepositoryKind = keyof typeof repositoryEvents;
type SavedRecord = { id: string; [field: string]: unknown };
type RepositoryChange = {
  kind: RepositoryKind;
  id: string;
  value: SavedRecord | null;
};
const SessionActive = createContext(true);

// Only this window receives saved data. Other tabs get an invalidation signal.
export function announceRepositorySave(change: RepositoryChange) {
  announceLocalChange(repositoryEvents[change.kind], change);
}
export function announceSessionChange() {
  announceLocalChange("myos:session-ended");
}

export function RepositoryCacheProvider({ children }: { children: ReactNode }) {
  const [configuration] = useState(() => ({
    provider: () => new Map(),
    dedupingInterval: 30000,
    focusThrottleInterval: 5000,
    shouldRetryOnError: false,
  }));
  return (
    <SWRConfig value={configuration}>
      <RepositorySubscriptions>{children}</RepositorySubscriptions>
    </SWRConfig>
  );
}

function RepositorySubscriptions({ children }: { children: ReactNode }) {
  const { cache, mutate, unload } = useSWRConfig();
  const [active, setActive] = useState(true);
  useEffect(() => {
    const refresh = (eventName: string) => {
      void mutate(
        (key) =>
          Array.isArray(key) &&
          repositoryEvents[key[0] as RepositoryKind] === eventName,
      );
    };
    const save = (event: Event) => {
      if (!(event instanceof CustomEvent) || !event.detail) {
        refresh(event.type);
        return;
      }
      const { kind, id, value } = event.detail as RepositoryChange;
      if (kind === "calendarSettings") {
        void mutate([kind, ""], value, { revalidate: false });
        return;
      }
      const newest = (
        current: SavedRecord | null | undefined,
        next: SavedRecord | null,
      ) =>
        current && next && Number(current.version) > Number(next.version)
          ? current
          : next;
      void mutate<SavedRecord | null>(
        [kind, id],
        (current) => newest(current, value),
        { revalidate: false },
      );
      // Do not interrupt an initial list request before it has any data.
      if (cache.get(unstable_serialize([kind, ""]))?.data === undefined) return;
      void mutate(
        [kind, ""],
        (current: SavedRecord[] | undefined) => {
          if (!current) return current;
          const other = current.filter((record) => record.id !== id);
          const item =
            kind === "notes" && value ? { ...value, revisions: [] } : value;
          const saved = newest(
            current.find((record) => record.id === id),
            item,
          );
          return saved ? [...other, saved] : other;
        },
        { revalidate: false },
      );
    };
    const expire = () => {
      setActive(false);
      unload({ revalidate: false });
    };
    const channels: BroadcastChannel[] = [];
    const events = [...new Set(Object.values(repositoryEvents))];
    for (const eventName of events) {
      window.addEventListener(eventName, save);
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const channel = new BroadcastChannel(eventName);
          channel.addEventListener("message", (message) => {
            if (!isOwnLocalChange(message)) refresh(eventName);
          });
          channels.push(channel);
        }
      } catch {
        // SWR also refreshes on window focus when channels are unavailable.
      }
    }
    window.addEventListener("myos:session-ended", expire);
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const sessionChannel = new BroadcastChannel("myos:session-ended");
        sessionChannel.addEventListener("message", (message) => {
          if (!isOwnLocalChange(message)) expire();
        });
        channels.push(sessionChannel);
      }
    } catch {
      // API session checks still reject a logged-out or replaced session.
    }
    return () => {
      channels.forEach((channel) => channel.close());
      events.forEach((eventName) =>
        window.removeEventListener(eventName, save),
      );
      window.removeEventListener("myos:session-ended", expire);
    };
  }, [cache, mutate, unload]);
  return (
    <SessionActive.Provider value={active}>{children}</SessionActive.Provider>
  );
}

export function useRepositoryData<T>(
  kind: RepositoryKind,
  id: string | undefined,
  read: () => Promise<T>,
) {
  const active = useContext(SessionActive);
  const { data, error, isLoading, mutate } = useSWR<T>(
    active ? [kind, id ?? ""] : null,
    read,
  );
  return {
    data: active ? data : undefined,
    error: active
      ? error
      : new Error("Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại."),
    loading: active && isLoading && !error,
    refresh: () => {
      void mutate();
    },
  };
}
