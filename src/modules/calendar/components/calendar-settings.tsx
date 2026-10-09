"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firebaseEnabled } from "@/lib/firebase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { useState, type FormEvent } from "react";
import {
  resolveCalendarColor,
  calendarError,
  type CalendarSettings,
} from "../model";
import { CalendarColorPicker } from "./color-picker";
import { calendarRepository } from "../repository";
import { useCalendar } from "../use-calendar";
import "../calendar.css";

export function CalendarSettingsPanel() {
  const data = useCalendar();
  return (
    <Card asChild className="settings-section schedule-settings">
      <section>
        <CardHeader>
          <h2>Lịch & thời gian</h2>
        </CardHeader>
        <CardContent>
          {data.loading ? (
            <p>Đang tải cài đặt lịch…</p>
          ) : data.error ? (
            <p role="alert">
              {data.error}{" "}
              <Button
                variant="link"
                size="default"
                type="button"
                className="text-link"
                onClick={data.refresh}
              >
                Thử lại
              </Button>
            </p>
          ) : (
            <SettingsForm settings={data.settings} />
          )}
        </CardContent>
      </section>
    </Card>
  );
}
function SettingsForm({ settings }: { settings: CalendarSettings }) {
  const [draft, setDraft] = useState(settings);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function save(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const saved = await calendarRepository.saveSettings(draft);
      setDraft(saved);
      setMessage(
        firebaseEnabled
          ? "Đã lưu cài đặt lịch vào tài khoản."
          : "Đã lưu cài đặt lịch trên trình duyệt này.",
      );
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="schedule-form" onSubmit={(e) => void save(e)}>
      {settings.version > draft.version && (
        <p className="schedule-warning">
          Cài đặt đã đổi ở tab khác. Nội dung đang nhập vẫn được giữ; tải lại
          trang để lấy bản mới.
        </p>
      )}
      <fieldset disabled={pending}>
        <div className="schedule-form-grid">
          <label>
            Giờ bắt đầu hiển thị
            <Input
              type="time"
              required
              value={draft.slotMinTime}
              onChange={(e) =>
                setDraft({ ...draft, slotMinTime: e.target.value })
              }
            />
          </label>
          <label>
            Giờ kết thúc hiển thị
            <NativeSelect
              value={draft.slotMaxTime}
              onChange={(e) =>
                setDraft({ ...draft, slotMaxTime: e.target.value })
              }
            >
              {Array.from(
                { length: 25 },
                (_, hour) => `${String(hour).padStart(2, "0")}:00`,
              )
                .concat(
                  !draft.slotMaxTime.endsWith(":00") ? [draft.slotMaxTime] : [],
                )
                .map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
            </NativeSelect>
          </label>
        </div>
        <label>
          Nhắc mặc định (chưa bật)
          <NativeSelect
            value={draft.defaultReminderMinutes ?? "off"}
            onChange={(e) =>
              setDraft({
                ...draft,
                defaultReminderMinutes:
                  e.target.value === "off" ? null : Number(e.target.value),
              })
            }
          >
            {[null, 0, 5, 15, 30, 60, 1440].map((value) => (
              <option key={value ?? "off"} value={value ?? "off"}>
                {value === null
                  ? "Không nhắc"
                  : value === 0
                    ? "Đúng giờ"
                    : `${value} phút`}
              </option>
            ))}
          </NativeSelect>
        </label>
        <h3>Nhóm lịch</h3>
        <div className="schedule-group-editors">
          {draft.groups.map((group, index) => (
            <div className="schedule-group-editor" key={group.id}>
              <i style={{ background: resolveCalendarColor(group.color) }} />
              <label>
                Tên nhóm {index + 1}
                <Input
                  required
                  maxLength={40}
                  value={group.name}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      groups: draft.groups.map((item) =>
                        item.id === group.id
                          ? { ...item, name: e.target.value }
                          : item,
                      ),
                    })
                  }
                />
              </label>
              <CalendarColorPicker
                label={`Màu nhóm ${index + 1}`}
                value={group.color}
                onChange={(color) =>
                  color !== null &&
                  setDraft({
                    ...draft,
                    groups: draft.groups.map((item) =>
                      item.id === group.id
                        ? {
                            ...item,
                            color,
                          }
                        : item,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="button secondary small"
          disabled={draft.groups.length >= 20}
          onClick={() =>
            setDraft({
              ...draft,
              groups: [
                ...draft.groups,
                {
                  id: crypto.randomUUID(),
                  name: "Nhóm mới",
                  color: "turquoise",
                },
              ],
            })
          }
        >
          Thêm nhóm lịch
        </Button>
      </fieldset>
      {error && (
        <p className="schedule-error" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      <Button
        variant="default"
        size="default"
        className="button primary"
        type="submit"
        disabled={pending || settings.version > draft.version}
      >
        {pending ? "Đang lưu…" : "Lưu cài đặt lịch"}
      </Button>
    </form>
  );
}
