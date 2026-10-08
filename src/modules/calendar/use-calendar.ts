"use client";
import { useRepositoryData } from "@/lib/repository-cache";
import {
  calendarError,
  defaultCalendarSettings,
  type CalendarEvent,
} from "./model";
import { calendarRepository } from "./repository";

export function useCalendar() {
  const events = useRepositoryData<CalendarEvent[]>(
    "calendarEvents",
    undefined,
    () => calendarRepository.list(),
  );
  const settings = useRepositoryData("calendarSettings", undefined, () =>
    calendarRepository.settings(),
  );
  const error = events.error || settings.error;
  return {
    events: events.data ?? [],
    settings: settings.data ?? defaultCalendarSettings,
    loading: (events.loading || settings.loading) && !error,
    error: error ? calendarError(error) : "",
    refresh: () => {
      events.refresh();
      settings.refresh();
    },
  };
}
