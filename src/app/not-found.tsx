import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="standalone-state">
      <FileQuestion size={42} aria-hidden="true" />
      <p className="eyebrow">404 · KHÔNG TÌM THẤY</p>
      <h1>Trang này chưa có ở đây</h1>
      <p>Đường dẫn có thể đã thay đổi hoặc nội dung chưa được tạo.</p>
      <Link className="button primary" href="/dashboard">
        <ArrowLeft size={17} aria-hidden="true" />
        Về Tổng quan
      </Link>
    </main>
  );
}
