"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import {
  calendarColorSchema,
  calendarColors,
  calendarPalette,
  calendarTextColor,
  resolveCalendarColor,
  type CalendarColor,
} from "../model";

export function CalendarColorPicker({
  label,
  value,
  onChange,
  inheritedColor,
}: {
  label: string;
  value: CalendarColor | null;
  onChange: (color: CalendarColor | null) => void;
  inheritedColor?: CalendarColor;
}) {
  const id = useId();
  const valid = value === null || calendarColorSchema.safeParse(value).success;
  const background = resolveCalendarColor(
    valid ? (value ?? inheritedColor ?? "turquoise") : "turquoise",
  );
  const options = inheritedColor
    ? [{ value: null, name: "Theo bộ lịch" }, ...calendarPalette]
    : calendarPalette;
  return (
    <fieldset className="schedule-color-picker">
      <legend>{label}</legend>
      <div className="schedule-color-swatches">
        {options.map((option) => (
          <label
            className="schedule-color-swatch"
            key={option.value ?? "inherit"}
            title={option.name}
          >
            <input
              className="sr-only"
              type="radio"
              name={id}
              value={option.value ?? "inherit"}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span
              style={{
                background: resolveCalendarColor(
                  option.value ?? inheritedColor,
                ),
              }}
              aria-hidden="true"
            />
            <span className="sr-only">{option.name}</span>
          </label>
        ))}
      </div>
      <div className="schedule-color-custom">
        <label>
          <span className="sr-only">{label} — chọn màu tùy chỉnh</span>
          <input
            type="color"
            value={background}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">{label} — mã HEX</span>
          <Input
            value={
              value !== null && !Object.hasOwn(calendarColors, value)
                ? value
                : background
            }
            pattern="#[0-9a-fA-F]{6}"
            required
            maxLength={7}
            spellCheck={false}
            aria-invalid={!valid}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
        <span
          className="schedule-color-preview"
          style={{ background, color: calendarTextColor(background) }}
        >
          {value === null ? "Theo bộ lịch" : "Xem trước"}
        </span>
      </div>
    </fieldset>
  );
}
