import { expect, test } from "@playwright/test";
import ICAL from "ical.js";
import {
  addDays,
  blankEvent,
  defaultCalendarSettings,
  eventInputSchema,
  calendarColorSchema,
  calendarPalette,
  calendarTextColor,
  resolveCalendarColor,
  settingsSchema,
  localTime,
  type CalendarEvent,
} from "../../src/modules/calendar/model";
import {
  conflictingEvents,
  effectiveOccurrence,
  expandEvents,
  originalStarts,
} from "../../src/modules/calendar/recurrence";
import {
  editCalendarEvent,
  newCalendarEvent,
  occurrenceToInput,
} from "../../src/modules/calendar/service";
import { exportCalendarIcs } from "../../src/modules/calendar/ics";

test.beforeEach(({}, info) =>
  test.skip(info.project.name !== "desktop", "Pure domain checks run once."),
);
function series() {
  return newCalendarEvent({
    ...blankEvent("2026-10-06", defaultCalendarSettings),
    title: "Học TypeScript",
    start: "2026-10-06T23:30",
    end: "2026-10-07T01:00",
    repeat: { weekdays: [2, 4], until: "2026-10-15" },
  });
}
function importedOccurrences(content: string) {
  const root = new ICAL.Component(ICAL.parse(content));
  const zone = root.getFirstSubcomponent("vtimezone")!;
  ICAL.TimezoneService.register("Asia/Ho_Chi_Minh", new ICAL.Timezone(zone));
  const components = root.getAllSubcomponents("vevent");
  const masters = components.filter(
    (item) => !item.hasProperty("recurrence-id"),
  );
  const dates: {
    start: string;
    end: string;
    title: string;
    allDay: boolean;
  }[] = [];
  for (const component of masters) {
    const event = new ICAL.Event(component);
    for (const exception of components.filter(
      (item) =>
        item.hasProperty("recurrence-id") &&
        item.getFirstPropertyValue("uid") === event.uid,
    ))
      event.relateException(new ICAL.Event(exception));
    const iterator = event.iterator();
    let next: ICAL.Time | null;
    let count = 0;
    while ((next = iterator.next()) && count++ < 2000) {
      const occurrence = event.getOccurrenceDetails(next);
      dates.push({
        start: occurrence.startDate.toJSDate().toISOString(),
        end: occurrence.endDate.toJSDate().toISOString(),
        title: occurrence.item.summary,
        allDay: occurrence.startDate.isDate,
      });
      if (!event.isRecurring()) break;
    }
  }
  return dates.sort((a, b) => a.start.localeCompare(b.start));
}
test("calendar colors validate custom HEX, inherit legacy groups and preserve occurrence overrides", () => {
  const legacy = series();
  delete legacy.color;
  expect(eventInputSchema.parse(legacy).color).toBeUndefined();
  expect(calendarColorSchema.safeParse("#42A5F5").success).toBe(true);
  for (const invalid of ["red", "#abc", "#ffffff00", "url(example)", "#zzzzzz"])
    expect(calendarColorSchema.safeParse(invalid).success).toBe(false);
  const settings = settingsSchema.parse({
    ...defaultCalendarSettings,
    groups: [{ id: "personal", name: "Cá nhân", color: "#188038" }],
  });
  expect(resolveCalendarColor(settings.groups[0].color)).toBe("#188038");
  let event = editCalendarEvent(legacy, {
    ...eventInputSchema.parse(legacy),
    color: "blue",
  });
  const first = effectiveOccurrence(event, event.start)!;
  event = editCalendarEvent(
    event,
    { ...occurrenceToInput(first, event), color: "#c5221f" },
    first.originalStart,
  );
  event = editCalendarEvent(event, {
    ...eventInputSchema.parse(event),
    color: "violet",
  });
  expect(effectiveOccurrence(event, event.start)?.color).toBe("#c5221f");
  expect(effectiveOccurrence(event, "2026-10-08T23:30")?.color).toBe("violet");
  event = editCalendarEvent(
    event,
    {
      ...occurrenceToInput(effectiveOccurrence(event, event.start)!, event),
      color: null,
    },
    event.start,
  );
  expect(effectiveOccurrence(event, event.start)?.color).toBeNull();
  // Old events with no color and explicit inheritance must compare equally.
  const unchanged = editCalendarEvent(
    legacy,
    {
      ...occurrenceToInput(effectiveOccurrence(legacy, legacy.start)!, legacy),
      color: null,
    },
    legacy.start,
  );
  expect(unchanged.exceptions[0].fields).not.toContain("color");
});
test("calendar foregrounds meet text contrast for presets and custom light, dark and midtone colors", () => {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5].map((offset) => {
      const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  for (const color of [
    ...calendarPalette.map((item) => resolveCalendarColor(item.value)),
    "#ffffff",
    "#000000",
    "#808080",
    "#ffff00",
    "#42a5f5",
  ]) {
    const a = luminance(color),
      b = luminance(calendarTextColor(color));
    expect(
      (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
    ).toBeGreaterThanOrEqual(4.5);
  }
});
test("Vietnam weekly overnight sessions include starts before the window and exclusive ends", () => {
  const event = series();
  expect(originalStarts(event)).toEqual([
    "2026-10-06T23:30",
    "2026-10-08T23:30",
    "2026-10-13T23:30",
    "2026-10-15T23:30",
  ]);
  const sessions = expandEvents(
    [event],
    "2026-10-07T00:00",
    "2026-10-07T02:00",
  );
  expect(sessions).toHaveLength(1);
  expect(sessions[0].end).toBe("2026-10-07T01:00");
  expect(localTime(sessions[0].start).toUTC().toISO()).toBe(
    "2026-10-06T16:30:00.000Z",
  );
  expect(
    expandEvents([event], "2026-10-07T01:00", "2026-10-07T02:00"),
  ).toHaveLength(0);
});
test("moved occurrences keep their identities even outside the series window", () => {
  let event = series();
  const original = effectiveOccurrence(event, event.start)!;
  event = editCalendarEvent(
    event,
    {
      ...occurrenceToInput(original, event),
      start: "2026-09-01T09:00",
      end: "2026-09-01T10:00",
    },
    original.originalStart,
  );
  const moved = expandEvents([event], "2026-09-01", "2026-09-02");
  expect(moved).toHaveLength(1);
  expect(moved[0].originalStart).toBe("2026-10-06T23:30");
  expect(expandEvents([event], "2026-10-06", "2026-10-07")).toHaveLength(0);
  const conflict = newCalendarEvent({
    ...blankEvent("2026-09-01", defaultCalendarSettings),
    title: "Lịch trước chuỗi",
  });
  expect(conflictingEvents([conflict], event)).toHaveLength(1);
  const adjacent = {
    ...conflict,
    start: "2026-09-01T10:00",
    end: "2026-09-01T11:00",
  };
  expect(conflictingEvents([adjacent], event)).toHaveLength(0);
});
test("completion overrides only one field and survives a title change to the whole series", () => {
  let event = series();
  const occurrence = effectiveOccurrence(event, event.start)!;
  event = editCalendarEvent(
    event,
    { ...occurrenceToInput(occurrence, event), completed: true },
    occurrence.originalStart,
  );
  expect(event.exceptions[0].fields).toEqual(["completed"]);
  event = editCalendarEvent(event, { ...event, title: "Học Next.js" });
  expect(effectiveOccurrence(event, occurrence.originalStart)).toMatchObject({
    title: "Học Next.js",
    completed: true,
  });
  expect(effectiveOccurrence(event, "2026-10-08T23:30")?.completed).toBe(false);
  event = editCalendarEvent(event, {
    ...event,
    start: "2026-10-06T22:00",
    end: "2026-10-06T23:00",
  });
  expect(event.exceptions).toEqual([]);
});
test("calendar input rejects impossible dates, empty repeats and non-positive durations", () => {
  const input = blankEvent("2026-10-06", defaultCalendarSettings);
  for (const invalid of [
    { ...input, title: "" },
    { ...input, title: "a", start: "2026-02-30T09:00" },
    { ...input, title: "a", end: input.start },
    { ...input, title: "a", repeat: { weekdays: [], until: "2026-10-31" } },
    { ...input, title: "a", repeat: { weekdays: [1], until: "2026-10-31" } },
    { ...input, title: "a", repeat: { weekdays: [2], until: "2032-01-01" } },
  ])
    expect(eventInputSchema.safeParse(invalid).success).toBe(false);
  expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  expect(addDays("", 1)).toBe("");
});
test("RFC export parses weekly exceptions, cancellation, range/group filtering and UTF-8 folds", () => {
  let event = series();
  const first = effectiveOccurrence(event, event.start)!;
  event = editCalendarEvent(
    event,
    {
      ...occurrenceToInput(first, event),
      title: "Buổi đổi giờ — " + "Tiếng Việt rất rõ, ".repeat(3),
      start: "2026-10-07T00:15",
      end: "2026-10-07T01:45",
      groupId: "work",
    },
    first.originalStart,
  );
  // Title limit intentionally applies; use a long description to exercise folding.
  event = { ...event, description: "Tiếng Việt rất rõ, ".repeat(40) };
  event.exceptions.push({
    originalStart: "2026-10-08T23:30",
    cancelled: true,
    input: null,
    fields: [],
  });
  const exported = exportCalendarIcs(
    [event],
    defaultCalendarSettings,
    "2026-10-07",
    "2026-10-14",
  );
  expect(exported.count).toBe(2);
  expect(exported.content).toContain(`UID:${event.id}@myos.local`);
  expect(exported.content).toContain("RRULE:FREQ=WEEKLY");
  expect(exported.content).toContain(
    "RECURRENCE-ID;TZID=Asia/Ho_Chi_Minh:20261006T233000",
  );
  for (const line of exported.content.split("\r\n"))
    expect(Buffer.byteLength(line, "utf8")).toBeLessThanOrEqual(75);
  const imported = importedOccurrences(exported.content);
  expect(imported.map((item) => item.start)).toEqual([
    "2026-10-06T17:15:00.000Z",
    "2026-10-13T16:30:00.000Z",
  ]);
  expect(imported[0].end).toBe("2026-10-06T18:45:00.000Z");
  const onlyWork = exportCalendarIcs(
    [event],
    defaultCalendarSettings,
    "2026-10-07",
    "2026-10-14",
    "work",
  );
  expect(importedOccurrences(onlyWork.content)).toHaveLength(1);
  expect(() =>
    exportCalendarIcs(
      [event],
      defaultCalendarSettings,
      "2027-01-01",
      "2027-01-02",
    ),
  ).toThrow("Không có");
});
test("all-day weekly export preserves DATE values and exclusive DTEND", () => {
  const event: CalendarEvent = newCalendarEvent({
    ...blankEvent("2026-10-06", defaultCalendarSettings),
    title: "Nghỉ cả ngày",
    allDay: true,
    start: "2026-10-06",
    end: "2026-10-08",
    repeat: { weekdays: [2], until: "2026-10-20" },
  });
  const result = exportCalendarIcs(
    [event],
    defaultCalendarSettings,
    "2026-10-07",
    "2026-10-14",
  );
  expect(result.content).toContain("DTEND;VALUE=DATE:20261008");
  expect(result.content).toContain("UNTIL=20261020");
  const imported = importedOccurrences(result.content);
  expect(imported).toHaveLength(2);
  expect(imported.every((item) => item.allDay)).toBe(true);
  expect(expandEvents([event], "2026-10-08", "2026-10-09")).toHaveLength(0);
});
