import {
  addDays,
  localTime,
  millis,
  occurrenceInputSchema,
  type CalendarEvent,
  type Occurrence,
} from "./model";

// Identity uses the original wall-clock start, even after an individual session moves.
export function baseOccurrence(
  event: CalendarEvent,
  originalStart: string,
): Occurrence {
  const duration = millis(event.end) - millis(event.start);
  const end = localTime(originalStart).plus({ milliseconds: duration });
  return {
    ...occurrenceInputSchema.parse(event),
    eventId: event.id,
    originalStart,
    start: originalStart,
    end: event.allDay ? end.toISODate()! : end.toFormat("yyyy-MM-dd'T'HH:mm"),
    recurring: !!event.repeat,
  };
}
export function isOriginalOccurrence(
  event: CalendarEvent,
  originalStart: string,
) {
  if (!event.repeat) return originalStart === event.start;
  return (
    originalStart.slice(10) === event.start.slice(10) &&
    originalStart >= event.start &&
    originalStart.slice(0, 10) <= event.repeat.until &&
    event.repeat.weekdays.includes(localTime(originalStart).weekday % 7)
  );
}
export function originalStarts(
  event: CalendarEvent,
  from = event.start.slice(0, 10),
  until = event.repeat?.until ?? event.start.slice(0, 10),
) {
  if (!event.repeat) return [event.start];
  const starts: string[] = [];
  let date = from < event.start.slice(0, 10) ? event.start.slice(0, 10) : from;
  const last = until < event.repeat.until ? until : event.repeat.until;
  for (; date <= last; date = addDays(date, 1)) {
    const start = date + event.start.slice(10);
    if (isOriginalOccurrence(event, start)) starts.push(start);
  }
  return starts;
}
export function effectiveOccurrence(
  event: CalendarEvent,
  originalStart: string,
): Occurrence | null {
  if (event.cancelledAt || !isOriginalOccurrence(event, originalStart))
    return null;
  const exception = event.exceptions.find(
    (item) => item.originalStart === originalStart,
  );
  if (exception?.cancelled) return null;
  const base = baseOccurrence(event, originalStart);
  if (!exception?.input) return base;
  const overrides = Object.fromEntries(
    exception.fields.map((field) => [field, exception.input![field]]),
  );
  return { ...base, ...overrides };
}
export function overlaps(
  input: { start: string; end: string },
  from: string,
  until: string,
) {
  return (
    millis(input.start) < millis(until) && millis(input.end) > millis(from)
  );
}
export function allOccurrences(event: CalendarEvent) {
  return originalStarts(event)
    .flatMap((key) => {
      const occurrence = effectiveOccurrence(event, key);
      return occurrence ? [occurrence] : [];
    })
    .sort((a, b) => a.start.localeCompare(b.start));
}
export function expandEvents(
  events: CalendarEvent[],
  from: string,
  until: string,
): Occurrence[] {
  const output: Occurrence[] = [];
  for (const event of events) {
    if (event.cancelledAt) continue;
    // Look behind the window to retain long/overnight events. Also inspect moved exceptions
    // whose ORIGINAL dates lie outside this window.
    const keys = new Set([
      ...originalStarts(
        event,
        addDays(from.slice(0, 10), -31),
        until.slice(0, 10),
      ),
      ...event.exceptions.map((item) => item.originalStart),
    ]);
    for (const key of keys) {
      const occurrence = effectiveOccurrence(event, key);
      if (occurrence && overlaps(occurrence, from, until))
        output.push(occurrence);
    }
  }
  return output.sort(
    (a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title),
  );
}

// Index the visible days once; disclosures must not parse every event per cell.
export function occurrencesByDay(
  occurrences: Occurrence[],
  from: string,
  until: string,
) {
  const days: { date: string; start: number; end: number }[] = [];
  for (let day = localTime(from); day.toISODate()! < until;) {
    const next = day.plus({ days: 1 });
    days.push({
      date: day.toISODate()!,
      start: day.toMillis(),
      end: next.toMillis(),
    });
    day = next;
  }
  const indexed = new Map(days.map(({ date }) => [date, [] as Occurrence[]]));
  for (const occurrence of occurrences) {
    const start = millis(occurrence.start);
    const end = millis(occurrence.end);
    for (const day of days)
      if (start < day.end && end > day.start)
        indexed.get(day.date)!.push(occurrence);
  }
  return indexed;
}
export function conflictingEvents(
  events: CalendarEvent[],
  candidate: CalendarEvent,
): Occurrence[] {
  const proposed = allOccurrences(candidate).filter(
    (item) => item.entryKind !== "note",
  );
  if (!proposed.length) return [];
  const from = proposed.reduce(
    (min, item) => (item.start < min ? item.start : min),
    proposed[0].start,
  );
  const until = proposed.reduce(
    (max, item) => (item.end > max ? item.end : max),
    proposed[0].end,
  );
  const existing = expandEvents(
    events.filter((item) => item.id !== candidate.id),
    from,
    until,
  ).filter((item) => item.entryKind !== "note");
  const ranges = proposed
    .map((item, index) => ({
      start: millis(item.start),
      end: millis(item.end),
      index,
    }))
    .sort((a, b) => a.start - b.start);
  const maxEnds: number[] = [];
  for (const range of ranges)
    maxEnds.push(Math.max(range.end, maxEnds.at(-1) ?? -Infinity));
  const external = existing.filter((item) => {
    const start = millis(item.start),
      end = millis(item.end);
    let low = 0;
    let high = ranges.length;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (ranges[middle].start < end) low = middle + 1;
      else high = middle;
    }
    return low > 0 && maxEnds[low - 1] > start;
  });
  const conflictingIndices = new Set<number>();
  ranges.forEach((range, index) => {
    if (
      (index > 0 && maxEnds[index - 1] > range.start) ||
      (index + 1 < ranges.length && ranges[index + 1].start < range.end)
    )
      conflictingIndices.add(range.index);
  });
  const internal = proposed.filter((_, index) => conflictingIndices.has(index));
  return [...external, ...internal];
}
