import { calendarColors, localTime } from "./model";
import {
  attendanceText,
  isAttendanceMarked,
  type AttendanceActivity,
  type AttendanceEntry,
} from "./attendance-model";

const width = 1200;
const padding = 56;
const font = '"Be Vietnam Pro", Arial, sans-serif';
const palette = {
  ink: "#07334a",
  muted: "#536779",
  line: "#dbe2ec",
  soft: "#f5f7fb",
  weekend: "#fbf6ef",
  weekendInk: "#95541c",
  background: "#ffffff",
};
const columns = [
  { title: "Ngày", width: 120 },
  { title: "Thứ", width: 120 },
  { title: "Trạng thái", width: 170 },
  { title: "Nội dung", width: width - padding * 2 - 410 },
];
const weekdays = [
  "",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "CN",
];
const lineHeight = 22;
const rowPadding = 12;

function setFont(
  context: CanvasRenderingContext2D,
  size: number,
  weight = 400,
) {
  context.font = `${weight} ${size}px ${font}`;
}
// Ngắt dòng theo từ, từ quá dài sẽ bị cắt theo ký tự để không tràn cột.
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
    lines.push(line);
  }
  return lines.length ? lines : [""];
}
function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, w, h, radius);
}
function entryContent(entry: AttendanceEntry | undefined) {
  if (!entry || !isAttendanceMarked(entry)) return "";
  const time = entry.start && entry.end ? entry.start + "–" + entry.end : "";
  const text = attendanceText(entry);
  return [time, text === "Đã chấm" && time ? "" : text]
    .filter(Boolean)
    .join(" · ");
}

export async function renderAttendanceImage({
  activity,
  month,
  entries,
}: {
  activity: AttendanceActivity;
  month: string;
  entries: AttendanceEntry[];
}) {
  await Promise.all(
    [400, 600, 700].map((weight) =>
      document.fonts.load(`${weight} 16px ${font}`).catch(() => []),
    ),
  );
  const accent = calendarColors[activity.color];
  const start = localTime(month + "-01");
  const days = Array.from({ length: start.daysInMonth! }, (_, index) =>
    start.plus({ days: index }),
  );
  const byDate = new Map(entries.map((entry) => [entry.date, entry]));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xuất ảnh.");

  setFont(context, 15);
  const rows = days.map((day) => {
    const content = entryContent(byDate.get(day.toISODate()!));
    const lines = content
      ? wrap(context, content, columns[3].width - 32)
      : ["—"];
    return {
      day,
      marked: !!content,
      lines,
      height: Math.max(48, lines.length * lineHeight + rowPadding * 2),
    };
  });
  const marked = rows.filter((row) => row.marked).length;
  const headerHeight = 230;
  const tableTop = headerHeight;
  const tableHeight = 46 + rows.reduce((sum, row) => sum + row.height, 0);
  const height = tableTop + tableHeight + 96;

  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.textBaseline = "middle";
  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);
  context.fillStyle = accent;
  context.fillRect(0, 0, width, 8);

  // Tiêu đề và tóm tắt tháng.
  context.fillStyle = accent;
  setFont(context, 13, 700);
  context.letterSpacing = "2px";
  context.fillText("BẢNG CHẤM CÔNG", padding, 62);
  context.letterSpacing = "0px";
  context.fillStyle = palette.ink;
  setFont(context, 32, 700);
  const title = wrap(context, activity.name, 640)[0];
  context.fillText(title, padding, 104);
  context.fillStyle = palette.muted;
  setFont(context, 17, 500);
  context.fillText(
    start.setLocale("vi").toFormat("'Tháng' M 'năm' yyyy"),
    padding,
    142,
  );

  const stats = [
    { label: "Ngày đã chấm", value: String(marked) },
    { label: "Ngày trong tháng", value: String(days.length) },
    {
      label: "Tỷ lệ",
      value: Math.round((marked / days.length) * 100) + "%",
    },
  ];
  const statWidth = 132;
  stats.forEach((stat, index) => {
    const x = width - padding - (stats.length - index) * (statWidth + 12) + 12;
    roundRect(context, x, 48, statWidth, 96, 10);
    context.fillStyle = index === 0 ? accent : palette.soft;
    context.fill();
    context.fillStyle = index === 0 ? "#ffffff" : palette.ink;
    setFont(context, 30, 700);
    context.fillText(stat.value, x + 18, 84);
    context.fillStyle = index === 0 ? "rgba(255,255,255,0.85)" : palette.muted;
    setFont(context, 13, 500);
    context.fillText(stat.label, x + 18, 120);
  });

  context.strokeStyle = palette.line;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(padding, 182);
  context.lineTo(width - padding, 182);
  context.stroke();

  // Bảng ngày.
  const tableWidth = width - padding * 2;
  context.save();
  roundRect(context, padding, tableTop, tableWidth, tableHeight, 10);
  context.clip();
  context.fillStyle = palette.ink;
  context.fillRect(padding, tableTop, tableWidth, 46);
  setFont(context, 13, 600);
  context.fillStyle = "#ffffff";
  let x = padding;
  for (const column of columns) {
    context.fillText(column.title.toUpperCase(), x + 16, tableTop + 23);
    x += column.width;
  }
  let y = tableTop + 46;
  rows.forEach((row, index) => {
    const weekend = row.day.weekday >= 6;
    context.fillStyle = weekend
      ? palette.weekend
      : index % 2
        ? palette.soft
        : palette.background;
    context.fillRect(padding, y, tableWidth, row.height);
    const middle = y + Math.min(row.height, 48) / 2;
    x = padding;
    setFont(context, 15, 600);
    context.fillStyle = palette.ink;
    context.fillText(row.day.toFormat("dd/MM"), x + 16, middle);
    x += columns[0].width;
    setFont(context, 15, weekend ? 600 : 400);
    context.fillStyle = weekend ? palette.weekendInk : palette.muted;
    context.fillText(weekdays[row.day.weekday], x + 16, middle);
    x += columns[1].width;
    if (row.marked) {
      roundRect(context, x + 16, middle - 14, 112, 28, 14);
      context.fillStyle = accent;
      context.globalAlpha = 0.12;
      context.fill();
      context.globalAlpha = 1;
      context.fillStyle = accent;
      context.beginPath();
      context.arc(x + 32, middle, 4, 0, Math.PI * 2);
      context.fill();
      setFont(context, 13, 600);
      context.fillText("Đã chấm", x + 44, middle);
    } else {
      setFont(context, 13, 500);
      context.fillStyle = "#97a6b4";
      context.fillText("Chưa chấm", x + 16, middle);
    }
    x += columns[2].width;
    setFont(context, 15);
    context.fillStyle = row.marked ? palette.ink : "#b5c0cb";
    row.lines.forEach((line, lineIndex) => {
      context.fillText(
        line,
        x + 16,
        y + rowPadding + lineHeight / 2 + lineIndex * lineHeight + 2,
      );
    });
    y += row.height;
    context.strokeStyle = palette.line;
    context.beginPath();
    context.moveTo(padding, y);
    context.lineTo(padding + tableWidth, y);
    context.stroke();
  });
  context.restore();
  roundRect(
    context,
    padding + 0.5,
    tableTop + 0.5,
    tableWidth - 1,
    tableHeight - 1,
    10,
  );
  context.strokeStyle = palette.line;
  context.stroke();

  // Chân trang.
  const footer = tableTop + tableHeight + 48;
  setFont(context, 13);
  context.fillStyle = palette.muted;
  context.fillText(
    "Xuất từ MyOS lúc " +
      localTime(new Date().toISOString()).toFormat("HH:mm, dd/MM/yyyy"),
    padding,
    footer,
  );
  context.textAlign = "right";
  setFont(context, 13, 600);
  context.fillStyle = palette.ink;
  context.fillText("Tổng cộng: " + marked + " ngày", width - padding, footer);
  context.textAlign = "left";

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
