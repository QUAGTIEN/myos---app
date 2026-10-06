import {
  addDays,
  calendarZone,
  dateSchema,
  localTime,
  type CalendarEvent,
  type CalendarSettings,
  type OccurrenceInput,
} from "./model";
import { effectiveOccurrence, originalStarts, overlaps } from "./recurrence";

function text(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
function stamp(value: string) {
  return localTime(value).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
}
function dateProperty(name: string, value: string, allDay: boolean) {
  return allDay
    ? `${name};VALUE=DATE:${value.replaceAll("-", "")}`
    : `${name};TZID=${calendarZone}:${localTime(value).toFormat("yyyyMMdd'T'HHmmss")}`;
}
// RFC 5545: physical lines are at most 75 OCTETS; never split a UTF-8 character.
export function foldIcsLine(line: string) {
  const encoder = new TextEncoder();
  let result = "",
    bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      result += "\r\n ";
      bytes = 1;
    }
    result += character;
    bytes += size;
  }
  return result;
}
function eventLines(
  event: CalendarEvent,
  input: OccurrenceInput,
  settings: CalendarSettings,
  originalStart?: string,
) {
  return [
    "BEGIN:VEVENT",
    `UID:${event.id}@myos.local`,
    `DTSTAMP:${stamp(event.updatedAt)}`,
    `SEQUENCE:${event.version}`,
    ...(originalStart
      ? [dateProperty("RECURRENCE-ID", originalStart, event.allDay)]
      : []),
    dateProperty("DTSTART", input.start, input.allDay),
    dateProperty("DTEND", input.end, input.allDay),
    `SUMMARY:${text(input.title)}`,
    `DESCRIPTION:${text(input.description)}`,
    `CATEGORIES:${text(settings.groups.find((group) => group.id === input.groupId)?.name ?? input.groupId)}`,
    "STATUS:CONFIRMED",
    `PRIORITY:${input.important ? 1 : 0}`,
    `X-MYOS-COMPLETED:${input.completed ? "TRUE" : "FALSE"}`,
    ...(input.reminderMinutes === null
      ? []
      : [`X-MYOS-REMINDER-MINUTES:${input.reminderMinutes}`]),
  ];
}
export function exportCalendarIcs(
  events: CalendarEvent[],
  settings: CalendarSettings,
  from: string,
  through: string,
  groupId = "",
) {
  dateSchema.parse(from);
  dateSchema.parse(through);
  if (
    from > through ||
    localTime(through).diff(localTime(from), "days").days > 366
  )
    throw new Error("Chọn khoảng xuất từ 1 đến 367 ngày.");
  const until = addDays(through, 1);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MyOS//Personal Calendar//VI",
    "CALSCALE:GREGORIAN",
    `X-WR-TIMEZONE:${calendarZone}`,
    "BEGIN:VTIMEZONE",
    `TZID:${calendarZone}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0700",
    "TZOFFSETTO:+0700",
    "TZNAME:ICT",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];
  let count = 0;
  for (const event of events) {
    if (event.cancelledAt) continue;
    const starts = originalStarts(event);
    const included = starts.filter((start) => {
      const occurrence = effectiveOccurrence(event, start);
      return (
        occurrence &&
        (!groupId || occurrence.groupId === groupId) &&
        overlaps(occurrence, from, until)
      );
    });
    if (!included.length) continue;
    count += included.length;
    const master = eventLines(event, event, settings);
    if (event.repeat) {
      const dayCodes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      const end = event.allDay
        ? event.repeat.until.replaceAll("-", "")
        : stamp(event.repeat.until + "T23:59");
      master.push(
        `RRULE:FREQ=WEEKLY;BYDAY=${[...new Set(event.repeat.weekdays)]
          .sort()
          .map((day) => dayCodes[day])
          .join(",")};UNTIL=${end}`,
      );
      // Retain the original master/UID and exclude occurrences outside the selected
      // window (or group), rather than shifting DTSTART and breaking exception identities.
      const excluded = starts.filter((start) => !included.includes(start));
      if (excluded.length)
        master.push(
          dateProperty("EXDATE", excluded[0], event.allDay)
            .split(":")
            .slice(0, -1)
            .join(":") +
            ":" +
            excluded
              .map((start) =>
                event.allDay
                  ? start.replaceAll("-", "")
                  : localTime(start).toFormat("yyyyMMdd'T'HHmmss"),
              )
              .join(","),
        );
    }
    lines.push(...master, "END:VEVENT");
    if (event.repeat)
      for (const start of included) {
        const exception = event.exceptions.find(
          (item) => item.originalStart === start,
        );
        if (exception?.input)
          lines.push(
            ...eventLines(
              event,
              effectiveOccurrence(event, start)!,
              settings,
              start,
            ),
            "END:VEVENT",
          );
      }
  }
  if (!count)
    throw new Error("Không có lịch hẹn trong khoảng ngày/nhóm đã chọn.");
  lines.push("END:VCALENDAR");
  return { content: lines.map(foldIcsLine).join("\r\n") + "\r\n", count };
}
