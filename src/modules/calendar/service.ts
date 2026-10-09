import {
  eventInputSchema,
  eventSchema,
  occurrenceInputSchema,
  occurrenceFields,
  type CalendarEvent,
  type EventInput,
  type Occurrence,
  type OccurrenceInput,
} from "./model";
import { baseOccurrence, isOriginalOccurrence } from "./recurrence";
import { calendarRepository, type CalendarRepository } from "./repository";

export function newCalendarEvent(
  input: EventInput,
  sourceMilestone: CalendarEvent["sourceMilestone"] = null,
): CalendarEvent {
  const now = new Date().toISOString();
  return eventSchema.parse({
    ...eventInputSchema.parse(input),
    id: crypto.randomUUID(),
    schemaVersion: 1,
    version: 1,
    createdAt: now,
    updatedAt: now,
    cancelledAt: null,
    exceptions: [],
    sourceMilestone,
  });
}
export function editCalendarEvent(
  event: CalendarEvent,
  input: EventInput,
  originalStart?: string,
): CalendarEvent {
  if (event.cancelledAt) throw new Error("Lịch này đã bị hủy.");
  if (originalStart && event.repeat) {
    if (event.allDay !== input.allDay)
      throw new Error("Đổi chế độ cả ngày bằng thao tác sửa toàn chuỗi.");
    if (!isOriginalOccurrence(event, originalStart))
      throw new Error("Buổi lịch không còn thuộc chuỗi.");
    const parsed = occurrenceInputSchema.parse(input);
    const base = baseOccurrence(event, originalStart);
    const exception = {
      originalStart,
      cancelled: false,
      input: parsed,
      fields: occurrenceFields.filter(
        (field) =>
          JSON.stringify(parsed[field] ?? null) !==
          JSON.stringify(base[field] ?? null),
      ),
    };
    return eventSchema.parse({
      ...event,
      version: event.version + 1,
      updatedAt: new Date().toISOString(),
      exceptions: [
        ...event.exceptions.filter(
          (item) => item.originalStart !== originalStart,
        ),
        exception,
      ],
    });
  }
  const parsed = eventInputSchema.parse(input);
  const changedSchedule =
    event.start !== parsed.start ||
    event.end !== parsed.end ||
    event.allDay !== parsed.allDay ||
    JSON.stringify(event.repeat) !== JSON.stringify(parsed.repeat);
  return eventSchema.parse({
    ...event,
    ...parsed,
    version: event.version + 1,
    updatedAt: new Date().toISOString(),
    exceptions: changedSchedule ? [] : event.exceptions,
  });
}
export function occurrenceToInput(
  occurrence: Occurrence,
  event: CalendarEvent,
): EventInput {
  return { ...occurrenceInputSchema.parse(occurrence), repeat: event.repeat };
}
export function createCalendarService(repository: CalendarRepository) {
  return {
    create(input: EventInput, source?: CalendarEvent["sourceMilestone"]) {
      return repository.commit(null, newCalendarEvent(input, source));
    },
    save(event: CalendarEvent, input: EventInput, originalStart?: string) {
      return repository.commit(
        event,
        editCalendarEvent(event, input, originalStart),
      );
    },
    cancel(event: CalendarEvent, originalStart?: string) {
      const now = new Date().toISOString();
      if (
        originalStart &&
        event.repeat &&
        !isOriginalOccurrence(event, originalStart)
      )
        throw new Error("Buổi lịch không còn thuộc chuỗi.");
      const next = eventSchema.parse({
        ...event,
        version: event.version + 1,
        updatedAt: now,
        cancelledAt: originalStart && event.repeat ? null : now,
        exceptions:
          originalStart && event.repeat
            ? [
                ...event.exceptions.filter(
                  (item) => item.originalStart !== originalStart,
                ),
                { originalStart, cancelled: true, input: null, fields: [] },
              ]
            : event.exceptions,
      });
      return repository.commit(event, next);
    },
    complete(event: CalendarEvent, occurrence: Occurrence) {
      const input: OccurrenceInput = {
        ...occurrenceInputSchema.parse(occurrence),
        completed: !occurrence.completed,
      };
      return repository.commit(
        event,
        editCalendarEvent(
          event,
          { ...input, repeat: event.repeat },
          event.repeat ? occurrence.originalStart : undefined,
        ),
      );
    },
  };
}
export const calendarService = createCalendarService(calendarRepository);
