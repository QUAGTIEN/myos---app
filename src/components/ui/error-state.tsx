"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";

export function ErrorState({ reset }: { reset: () => void }) {
  return (
    <section className="standalone-state">
      <TriangleAlert size={36} aria-hidden="true" />
      <h1>Chưa thể mở nội dung</h1>
      <p>Vui lòng thử lại. Nội dung đang nhập có thể chưa được lưu.</p>
      <button type="button" className="button primary" onClick={reset}>
        <RotateCcw size={17} aria-hidden="true" />
        Thử lại
      </button>
    </section>
  );
}
