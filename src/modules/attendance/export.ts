import { calendarColors, localTime } from "@/modules/calendar/model";
import {
  attendanceEvaluation,
  attendanceLesson,
  isAttendanceMarked,
  type AttendanceActivity,
  type AttendanceEntry,
} from "./model";

// Bố cục phiếu báo cáo học tập theo từng buổi: chữ có chân, bảng 4 cột rõ ràng để gửi phụ huynh.
const width = 1080;
const margin = 64;
const font = '"Times New Roman", "Noto Serif", Georgia, serif';
const ink = "#1b1b1b";
const muted = "#5a5a5a";
const rule = "#9aa5b1";
const headerHeight = 48;
const bodyFontSize = 18;
const bodyLineHeight = 27;
const cellPadX = 16;
const cellPadY = 18;
const minRowHeight = 76;

const weekdayShort = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

function setFont(
  context: CanvasRenderingContext2D,
  size: number,
  weight = 400,
  style = "normal",
) {
  context.font = `${style} ${weight} ${size}px ${font}`;
}

function wrap(context: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    if (!paragraph.trim()) {
      if (lines.length) lines.push("");
      continue;
    }
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

function clampSingleLine(
  context: CanvasRenderingContext2D,
  text: string,
  max: number,
) {
  if (context.measureText(text).width <= max) return text;
  let result = text;
  while (result && context.measureText(result + "…").width > max)
    result = result.slice(0, -1);
  return result.trimEnd() + "…";
}

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
  entries,
}: {
  activity: AttendanceActivity;
  month: string;
  entries: AttendanceEntry[];
}) {
  await Promise.all(
    ["400 18px", "700 18px", "italic 400 18px"].map((style) =>
      document.fonts.load(`${style} ${font}`).catch(() => []),
    ),
  );

  const accent = calendarColors[activity.color];
  const headerFill = tint(accent, 0.14);
  const start = localTime(month + "-01");
  const totalDays = start.daysInMonth!;
  const sessions = [...entries]
    .filter((entry) => entry.date.slice(0, 7) === month && isAttendanceMarked(entry))
    .sort((a, b) => a.date.localeCompare(b.date));
  const hasEvaluation = sessions.some(
    (entry) => attendanceEvaluation(entry).trim().length > 0,
  );

  const tableWidth = width - margin * 2;
  const colWidths = hasEvaluation
    ? [
        Math.round(tableWidth * 0.11), // Buổi
        Math.round(tableWidth * 0.18), // Ngày học
        Math.round(tableWidth * 0.355), // Bài học
        0, // Đánh giá
      ]
    : [
        Math.round(tableWidth * 0.12), // Buổi
        Math.round(tableWidth * 0.2), // Ngày học
        0, // Bài học
      ];
  colWidths[colWidths.length - 1] =
    tableWidth - colWidths.slice(0, -1).reduce((sum, item) => sum + item, 0);
  const colStarts = colWidths.reduce<number[]>(
    (starts, _w, index) => [
      ...starts,
      index === 0 ? margin : starts[index - 1] + colWidths[index - 1],
    ],
    [],
  );

  // Đo trước chiều cao từng dòng để không cắt mất chữ nào.
  const measureCanvas = document.createElement("canvas");
  const measure = measureCanvas.getContext("2d");
  if (!measure) throw new Error("Trình duyệt không hỗ trợ xuất ảnh.");
  setFont(measure, bodyFontSize);

  const measuredRows = sessions.map((entry, index) => {
    const date = localTime(entry.date);
    const weekday = weekdayShort[date.weekday % 7];
    const dateLine = date.toFormat("dd/MM/yyyy");
    const timeText = entry.start && entry.end ? entry.start + "–" + entry.end : "";
    const lessonText = attendanceLesson(entry).trim();
    const evalText = hasEvaluation ? attendanceEvaluation(entry).trim() : "";

    const dateLines = timeText
      ? [weekday + ",", dateLine, timeText]
      : [weekday + ",", dateLine];
    const lessonLines = lessonText
      ? wrap(measure, lessonText, colWidths[2] - cellPadX * 2)
      : ["—"];
    const evalLines = hasEvaluation
      ? evalText
        ? wrap(measure, evalText, colWidths[3] - cellPadX * 2)
        : ["—"]
      : [];

    const maxLines = Math.max(
      1,
      dateLines.length,
      lessonLines.length,
      evalLines.length,
    );
    const height = Math.max(
      minRowHeight,
      maxLines * bodyLineHeight + cellPadY * 2,
    );
    return {
      sessionLabel: "Buổi " + (index + 1),
      dateLines,
      lessonLines,
      evalLines,
      lessonEmpty: !lessonText,
      evalEmpty: !evalText,
      height,
    };
  });

  const tableTop = 244;
  const emptyRowHeight = 112;
  const bodyHeight = measuredRows.length
    ? measuredRows.reduce((sum, row) => sum + row.height, 0)
    : emptyRowHeight;
  const tableHeight = headerHeight + bodyHeight;
  const summaryTop = tableTop + tableHeight + 42;
  const height = summaryTop + 56;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xuất ảnh.");
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);
  context.textBaseline = "middle";

  // Nền trắng.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);

  // Tiêu đề.
  context.textAlign = "center";
  context.fillStyle = ink;
  setFont(context, 42, 700);
  context.letterSpacing = "3px";
  context.fillText("THÁNG " + start.month, width / 2, 78);
  context.letterSpacing = "0px";

  setFont(context, 24, 400, "italic");
  context.fillStyle = "#3f4c59";
  context.fillText(
    clampSingleLine(context, activity.name, tableWidth - 80),
    width / 2,
    124,
  );

  // Thanh ngang màu nhấn.
  context.fillStyle = accent;
  context.fillRect(width / 2 - 74, 152, 148, 3);

  // Thông tin thời gian & tổng buổi.
  context.fillStyle = ink;
  context.textAlign = "left";
  setFont(context, 18);
  context.fillText(
    "Thời gian: " +
      start.toFormat("01/MM/yyyy") +
      " – " +
      totalDays +
      start.toFormat("/MM/yyyy"),
    margin,
    206,
  );
  context.textAlign = "right";
  context.fillText(
    "Tổng số buổi: " + sessions.length + " buổi",
    width - margin,
    206,
  );

  // Header bảng.
  context.fillStyle = headerFill;
  context.fillRect(margin, tableTop, tableWidth, headerHeight);
  context.fillStyle = ink;
  context.textAlign = "center";
  setFont(context, 18, 700);
  const headers = hasEvaluation
    ? ["Buổi", "Ngày học", "Bài học", "Đánh giá"]
    : ["Buổi", "Ngày học", "Bài học"];
  headers.forEach((label, index) => {
    context.fillText(
      label,
      colStarts[index] + colWidths[index] / 2,
      tableTop + headerHeight / 2 + 1,
    );
  });

  // Nội dung các buổi.
  let y = tableTop + headerHeight;
  if (!measuredRows.length) {
    context.textAlign = "center";
    context.fillStyle = muted;
    setFont(context, 18, 400, "italic");
    context.fillText(
      "Chưa có buổi học nào trong tháng này.",
      width / 2,
      y + emptyRowHeight / 2,
    );
    y += emptyRowHeight;
  } else {
    for (const row of measuredRows) {
      const centerY = y + row.height / 2;

      // Cột 1: Buổi (căn giữa).
      context.textAlign = "center";
      context.fillStyle = ink;
      setFont(context, bodyFontSize, 400);
      context.fillText(row.sessionLabel, colStarts[0] + colWidths[0] / 2, centerY);

      // Cột 2: Ngày học (căn giữa dọc).
      const dateBlockHeight = row.dateLines.length * bodyLineHeight;
      const dateStartY = y + (row.height - dateBlockHeight) / 2 + bodyLineHeight / 2;
      row.dateLines.forEach((line, lineIndex) => {
        context.fillStyle = lineIndex === 2 ? muted : ink;
        setFont(context, lineIndex === 2 ? 15 : bodyFontSize, 400);
        context.fillText(
          line,
          colStarts[1] + colWidths[1] / 2,
          dateStartY + lineIndex * bodyLineHeight,
        );
      });

      // Cột 3: Bài học (căn trái, căn giữa dọc nhẹ nếu ít dòng).
      context.textAlign = "left";
      setFont(context, bodyFontSize, 400);
      context.fillStyle = row.lessonEmpty ? muted : ink;
      const lessonBlockHeight = row.lessonLines.length * bodyLineHeight;
      const lessonStartY =
        y + (row.height - lessonBlockHeight) / 2 + bodyLineHeight / 2;
      row.lessonLines.forEach((line, lineIndex) => {
        context.fillText(
          line,
          colStarts[2] + cellPadX,
          lessonStartY + lineIndex * bodyLineHeight,
        );
      });

      // Cột 4: Đánh giá (chỉ vẽ khi tháng có ít nhất một buổi có đánh giá).
      if (hasEvaluation) {
        context.fillStyle = row.evalEmpty ? muted : ink;
        const evalBlockHeight = row.evalLines.length * bodyLineHeight;
        const evalStartY =
          y + (row.height - evalBlockHeight) / 2 + bodyLineHeight / 2;
        row.evalLines.forEach((line, lineIndex) => {
          context.fillText(
            line,
            colStarts[3] + cellPadX,
            evalStartY + lineIndex * bodyLineHeight,
          );
        });
      }

      y += row.height;
    }
  }

  // Kẻ lưới bảng sắc nét.
  context.strokeStyle = rule;
  context.lineWidth = 1;
  context.beginPath();
  // Kẻ dọc giữa các cột.
  for (let column = 1; column < colWidths.length; column++) {
    const x = Math.round(colStarts[column]) + 0.5;
    context.moveTo(x, tableTop);
    context.lineTo(x, tableTop + tableHeight);
  }
  // Kẻ ngang dưới header.
  const headerLineY = Math.round(tableTop + headerHeight) + 0.5;
  context.moveTo(margin, headerLineY);
  context.lineTo(margin + tableWidth, headerLineY);
  // Kẻ ngang giữa các buổi.
  let rowY = tableTop + headerHeight;
  for (let index = 0; index < measuredRows.length - 1; index++) {
    rowY += measuredRows[index].height;
    const lineY = Math.round(rowY) + 0.5;
    context.moveTo(margin, lineY);
    context.lineTo(margin + tableWidth, lineY);
  }
  context.stroke();

  // Viền ngoài bảng.
  context.strokeStyle = rule;
  context.lineWidth = 1.5;
  context.strokeRect(margin, tableTop, tableWidth, tableHeight);

  // Chân trang.
  context.textAlign = "left";
  setFont(context, 17, 400, "italic");
  context.fillStyle = muted;
  context.fillText("Bảng theo dõi học tập theo từng buổi", margin, summaryTop);

  context.textAlign = "right";
  setFont(context, 18, 700);
  context.fillStyle = ink;
  context.fillText(
    "Tổng cộng: " + sessions.length + " buổi",
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
    .replace(/[\u0300-\u036f]/g, "")
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
