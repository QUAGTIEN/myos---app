"use client";
import { CalendarDays, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { calendarColors, calendarError, type CalendarSettings } from "../model";
import { localCalendarRepository } from "../repository";
import { useCalendar } from "../use-calendar";
import "../calendar.css";

export function CalendarSettingsPanel() {
  const data = useCalendar();
  return (
    <section className="panel settings-panel schedule-settings">
      <h2>
        <CalendarDays size={20} />
        Lịch & thời gian
      </h2>
      {data.loading ? (
        <p>Đang tải cài đặt lịch…</p>
      ) : data.error ? (
        <p role="alert">
          {data.error}{" "}
          <button type="button" className="text-link" onClick={data.refresh}>
            Thử lại
          </button>
        </p>
      ) : (
        <SettingsForm settings={data.settings} />
      )}
    </section>
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
      const saved = await localCalendarRepository.saveSettings(draft);
      setDraft(saved);
      setMessage("Đã lưu cài đặt lịch trên trình duyệt này.");
    } catch (cause) {
      setError(calendarError(cause));
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="schedule-form" onSubmit={(e) => void save(e)}>
      <p className="schedule-help">Việt Nam · UTC+7 · Tuần bắt đầu Thứ Hai.</p>
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
            <input
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
            <select
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
            </select>
          </label>
        </div>
        <label>
          Nhắc mặc định
          <select
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
          </select>
        </label>
        <p className="schedule-help">
          Áp dụng cho lịch mới. Nhắc tự động chưa hoạt động (G7).
        </p>
        <h3>Nhóm lịch</h3>
        <div className="schedule-group-editors">
          {draft.groups.map((group, index) => (
            <div className="schedule-group-editor" key={group.id}>
              <i style={{ background: calendarColors[group.color] }} />
              <label>
                Tên nhóm {index + 1}
                <input
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
              <label>
                Màu nhóm {index + 1}
                <select
                  value={group.color}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      groups: draft.groups.map((item) =>
                        item.id === group.id
                          ? {
                              ...item,
                              color: e.target.value as typeof group.color,
                            }
                          : item,
                      ),
                    })
                  }
                >
                  {Object.entries({
                    turquoise: "Xanh ngọc",
                    blue: "Xanh dương",
                    amber: "Hổ phách",
                    rose: "Hồng",
                    violet: "Tím",
                  }).map(([value, name]) => (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
        <button
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
          <Plus size={15} />
          Thêm nhóm lịch
        </button>
      </fieldset>
      {error && (
        <p className="schedule-error" role="alert">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      <button
        className="button primary"
        type="submit"
        disabled={pending || settings.version > draft.version}
      >
        {pending ? "Đang lưu…" : "Lưu cài đặt lịch"}
      </button>
    </form>
  );
}
