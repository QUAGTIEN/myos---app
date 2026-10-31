import { calendarColors, localTime } from "./model";
import {
  attendanceText,
  isAttendanceMarked,
  monthDays,
  type AttendanceActivity,
  type AttendanceEntry,
} from "./attendance-model";

// Bố cục theo kiểu văn bản hành chính: chữ có chân, kẻ ô vuông, một màu nhấn.
const width = 1240;
const margin = 72;
const font = '"Times New Roman", "Noto Serif", Georgia, serif';
const ink = "#1b1b1b";
const muted = "#5a5a5a";
const rule = "#8f8f8f";
const weekdayNames = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];
const cellHeight = 124;
const weekdayHeight = 40;
const noteLineHeight = 19;
const noteLines = 4;

function setFont(
  context: CanvasRenderingContext2D,
  size: number,
  weight = 400,
  style = "normal",
) {
  context.font = `${style} ${weight} ${size}px ${font}`;
}
// Ngắt dòng theo từ, cắt theo ký tự khi một từ dài hơn cả ô.
function wrap(context: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? line + " " + word : word;
      if (context.measureText(candidate).width <= max) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      line = "";
      for (const character of word) {
        if (context.measureText(line + character).width > max) {
          lines.push(line);
          line = "";
        }
        line += character;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}
function clamp(
  context: CanvasRenderingContext2D,
  text: string,
  max: number,
  count: number,
) {
  const lines = wrap(context, text, max);
  if (lines.length <= count) return lines;
  let last = lines[count - 1];
  while (last && context.measureText(last + "…").width > max)
    last = last.slice(0, -1);
  return [...lines.slice(0, count - 1), last.trimEnd() + "…"];
}
function entryContent(entry: AttendanceEntry | undefined) {
  if (!entry || !isAttendanceMarked(entry)) return null;
  const time = entry.start && entry.end ? entry.start + "–" + entry.end : "";
  const text = entry.note.trim() ? attendanceText(entry) : "";
  return [time, text].filter(Boolean).join(" · ");
}
// Màu nhạt pha từ màu bảng công để tô ngày đã chấm.
function tint(hex: string, amount: number) {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16);
    return Math.round(value + (255 - value) * (1 - amount));
  };
  return `rgb(${channel(1)}, ${channel(3)}, ${channel(5)})`;
}

export async function renderAttendanceImage({
  activity,
  month,
  firstDay,
  entries,
}: {
  activity: AttendanceActivity;
  month: string;
  firstDay: number;
  entries: AttendanceEntry[];
}) {
  await Promise.all(
    ["400 16px", "700 16px", "italic 400 16px"].map((style) =>
      document.fonts.load(`${style} ${font}`).catch(() => []),
    ),
  );
  const accent = calendarColors[activity.color];
  const fill = tint(accent, 0.14);
  const start = localTime(month + "-01");
  const days = monthDays(month, firstDay);
  const byDate = new Map(entries.map((entry) => [entry.date, entry]));
  const marked = days.filter(
    (day) =>
      day.slice(0, 7) === month && entryContent(byDate.get(day)) !== null,
  ).length;
  const total = start.daysInMonth!;
  const weeks = days.length / 7;

  const gridTop = 236;
  const gridWidth = width - margin * 2;
  const cellWidth = gridWidth / 7;
  const gridHeight = weekdayHeight + weeks * cellHeight;
  const summaryTop = gridTop + gridHeight + 36;
  const height = summaryTop + 56;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xuất ảnh.");
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.textBaseline = "middle";
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.fillStyle = ink;

  // Tiêu đề.
  context.textAlign = "center";
  setFont(context, 40, 700);
  context.letterSpacing = "4px";
  context.fillText("THÁNG " + start.month, width / 2, 82);
  context.letterSpacing = "0px";
  setFont(context, 22, 400, "italic");
  context.fillText(
    clamp(context, activity.name, 720, 1)[0] ?? "",
    width / 2,
    124,
  );
  context.fillRect(width / 2 - 60, 146, 120, 1.5);

  context.textAlign = "left";
  setFont(context, 18, 700);
  const label = "Thời gian: ";
  context.fillText(label, margin, 194);
  const labelWidth = context.measureText(label).width;
  setFont(context, 18);
  context.fillText(
    start.toFormat("01/MM/yyyy") + " – " + total + start.toFormat("/MM/yyyy"),
    margin + labelWidth,
    194,
  );
  context.textAlign = "right";
  setFont(context, 18);
  context.fillText("Số buổi chấm công: " + marked, width - margin, 194);

  // Lưới lịch.
  context.fillStyle = "#f1f1f1";
  context.fillRect(margin, gridTop, gridWidth, weekdayHeight);
  context.textAlign = "center";
  setFont(context, 16, 700);
  for (let index = 0; index < 7; index++) {
    context.fillStyle = ink;
    context.fillText(
      weekdayNames[(firstDay + index) % 7],
      margin + cellWidth * index + cellWidth / 2,
      gridTop + weekdayHeight / 2 + 1,
    );
  }
  days.forEach((day, index) => {
    const x = margin + (index % 7) * cellWidth;
    const y = gridTop + weekdayHeight + Math.floor(index / 7) * cellHeight;
    const inMonth = day.slice(0, 7) === month;
    const content = inMonth ? entryContent(byDate.get(day)) : null;
    if (content !== null) {
      context.fillStyle = fill;
      context.fillRect(x, y, cellWidth, cellHeight);
    }
    context.textAlign = "right";
    setFont(context, 20, content !== null ? 700 : 400);
    context.fillStyle = !inMonth ? "#bdbdbd" : content !== null ? accent : ink;
    context.fillText(String(Number(day.slice(8))), x + cellWidth - 12, y + 22);
    if (content) {
      context.textAlign = "left";
      setFont(context, 15);
      context.fillStyle = ink;
      clamp(context, content, cellWidth - 24, noteLines).forEach(
        (line, lineIndex) =>
          context.fillText(
            line,
            x + 12,
            y + 50 + lineIndex * noteLineHeight + noteLineHeight / 2,
          ),
      );
    }
  });
  context.strokeStyle = rule;
  context.lineWidth = 1;
  context.beginPath();
  for (let column = 1; column < 7; column++) {
    const x = Math.round(margin + column * cellWidth) + 0.5;
    context.moveTo(x, gridTop);
    context.lineTo(x, gridTop + gridHeight);
  }
  for (let row = 0; row < weeks; row++) {
    const y = gridTop + weekdayHeight + row * cellHeight + 0.5;
    context.moveTo(margin, y);
    context.lineTo(margin + gridWidth, y);
  }
  context.stroke();
  context.strokeStyle = ink;
  context.lineWidth = 1.5;
  context.strokeRect(margin, gridTop, gridWidth, gridHeight);

  // Chú thích và tổng hợp.
  context.textAlign = "left";
  context.fillStyle = fill;
  context.fillRect(margin, summaryTop - 9, 28, 18);
  context.strokeStyle = rule;
  context.lineWidth = 1;
  context.strokeRect(margin + 0.5, summaryTop - 8.5, 27, 17);
  setFont(context, 16, 400, "italic");
  context.fillStyle = muted;
  context.fillText("Ngày có chấm công", margin + 40, summaryTop);
  context.textAlign = "right";
  setFont(context, 17, 700);
  context.fillStyle = ink;
  context.fillText(
    "Tổng cộng: " + marked + " buổi",
    width - margin,
    summaryTop,
  );

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Không tạo được ảnh.")),
      "image/png",
    ),
  );
}

export function attendanceImageName(
  activity: AttendanceActivity,
  month: string,
) {
  const slug = activity.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return "bang-cong-" + (slug || "myos") + "-" + month + ".png";
}

// Chép ảnh vào clipboard để dán thẳng vào Zalo, Messenger, tài liệu.
export function canCopyAttendanceImage() {
  return (
    typeof window !== "undefined" &&
    typeof ClipboardItem !== "undefined" &&
    !!navigator.clipboard?.write
  );
}
export async function copyAttendanceImage(blob: Blob) {
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  } catch {
    throw new Error(
      "Trình duyệt không cho sao chép ảnh. Hãy dùng nút Lưu ảnh PNG.",
    );
  }
}

// Điện thoại mở bảng chia sẻ (lưu vào Ảnh); máy tính tải file trực tiếp.
export async function saveAttendanceImage(blob: Blob, name: string) {
  const file = new File([blob], name, { type: "image/png" });
  if (
    window.matchMedia("(pointer: coarse)").matches &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
