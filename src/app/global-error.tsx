"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          margin: "48px",
          color: "#07334a",
        }}
      >
        <h1>MyOS đang gặp sự cố</h1>
        <p>Vui lòng tải lại để tiếp tục.</p>
        <button type="button" onClick={reset}>
          Thử lại
        </button>
      </body>
    </html>
  );
}
