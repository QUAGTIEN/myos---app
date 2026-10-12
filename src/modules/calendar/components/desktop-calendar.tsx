"use client";

import { useMemo, type RefObject } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import viLocale from "@fullcalendar/core/locales/vi";
import type { CalendarOptions } from "@fullcalendar/core";
import {
  calendarTextColor,
  calendarZone,
  localTime,
  resolveCalendarColor,
  type CalendarSettings,
  type Occurrence,
} from "../model";

const plugins = [dayGridPlugin, interactionPlugin, luxonPlugin];

export function DesktopCalendar({
  calendarRef,
  occurrences,
  settings,
  ...options
}: Omit<CalendarOptions, "events" | "plugins" | "locale" | "timeZone"> & {
  calendarRef: RefObject<FullCalendar | null>;
  occurrences: Occurrence[];
  settings: CalendarSettings;
}) {
  const events = useMemo(
    () =>
      occurrences.map((occurrence) => {
        const color = resolveCalendarColor(
          occurrence.color ??
            settings.groups.find((group) => group.id === occurrence.groupId)
              ?.color ??
            "turquoise",
        );
        return {
          id: occurrence.eventId + ":" + occurrence.originalStart,
          title: occurrence.title,
          start: occurrence.allDay
            ? occurrence.start
            : localTime(occurrence.start).toISO()!,
          end: occurrence.allDay
            ? occurrence.end
            : localTime(occurrence.end).toISO()!,
          allDay: occurrence.allDay,
          display: "block",
          backgroundColor: color,
          textColor: calendarTextColor(color),
          borderColor: "transparent",
          classNames: occurrence.completed ? ["schedule-completed"] : [],
          extendedProps: { occurrence },
        };
      }),
    [occurrences, settings.groups],
  );
  return (
    <FullCalendar
      {...options}
      ref={calendarRef}
      plugins={plugins}
      locale={viLocale}
      timeZone={calendarZone}
      events={events}
    />
  );
}
