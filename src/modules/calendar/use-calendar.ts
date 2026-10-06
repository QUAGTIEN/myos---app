"use client";
import { useCallback, useEffect, useState } from "react";
import { subscribeLocalChange } from "@/lib/local/database";
import {
  calendarError,
  defaultCalendarSettings,
  type CalendarEvent,
} from "./model";
import { calendarChangedEvent, localCalendarRepository } from "./repository";

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState(defaultCalendarSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const refresh = useCallback(() => setRetry((value) => value + 1), []);
  useEffect(() => {
    let disposed = false;
    let generation = 0;
    const load = async () => {
      const current = ++generation;
      try {
        const [next, preferences] = await Promise.all([
          localCalendarRepository.list(),
          localCalendarRepository.settings(),
        ]);
        if (disposed || current !== generation) return;
        setEvents(next);
        setSettings(preferences);
        setError("");
      } catch (cause) {
        if (!disposed && current === generation) setError(calendarError(cause));
      } finally {
        if (!disposed && current === generation) setLoading(false);
      }
    };
    void load();
    const unsubscribe = subscribeLocalChange(
      calendarChangedEvent,
      () => void load(),
    );
    return () => {
      disposed = true;
      unsubscribe();
    };
  }, [retry]);
  return { events, settings, loading, error, refresh };
}
