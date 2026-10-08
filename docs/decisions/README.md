# Quyết định kiến trúc

Lưu quyết định khi thay đổi có tác động: vấn đề, lựa chọn, lý do, hệ quả và trạng thái.

Quyết định hiện có: Next.js/React/TypeScript, Firebase, modular monolith, 5 phân hệ và worker riêng; xem MYOS_ARCHITECTURE.md. Chưa cần sao chép thành nhiều ADR trùng nội dung.

ADR đã áp dụng: [001 — Framework và shell](001-framework-shell.md), [002 — Projects local khi hoãn Auth](002-local-projects.md).

[003 — Notes, autosave và ảnh local](003-local-notes.md): database version 2, retention và transaction liên kết dự án.

[004 — Calendar, recurrence và export local](004-local-calendar.md): database version 3, ngoại lệ từng buổi, timezone, liên kết và iCalendar.

Project hiện tại myos-app-40f4d, provider Email/Password công khai. Region/credentials và kết nối thật cần xác nhận; migration, Storage và Zalo hoãn.

[005 — Bộ thời khóa biểu và hồ sơ dự án](005-timetables-project-dossiers.md): tab lịch/năm, Kanban, workspace và tệp dự án nguyên tử; database version 4.

[006 — Firebase, tài khoản tự đăng ký và dữ liệu cloud](006-firebase-public-accounts.md): cookie session/CSRF, ownership tại API, transactions, giữ local riêng và Vercel.

[007 — Lịch tháng/tuần và chấm công](007-calendar-attendance.md): tab mới, Calendar entryKind tương thích, bảng tháng nguyên tử theo UID và IndexedDB v5.
