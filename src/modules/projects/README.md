# Dự án

Ca sử dụng: tạo/sửa dự án, nội dung, checklist, mốc, cập nhật và tiến độ.

G3 đã triển khai bằng IndexedDB local, chưa có Firebase hoặc auth. Checklist thuộc dự án, không mở thêm phân hệ công việc độc lập.

- `model.ts`: schema Zod, kiểu dữ liệu, ngày và tiến độ; không có item được tính thì tiến độ checklist là chưa có dữ liệu, không phải 100%.
- `repository.ts`: database `myos-local`, store `projects`, read/write transaction, kiểm tra version và thông báo cho tab khác.
- `service.ts`: tạo/sửa, ghim, lưu trữ/khôi phục, checklist/mốc, sắp xếp và lịch sử 100 cập nhật gần nhất.
- `use-projects.ts`: đọc local, cập nhật sau commit, refresh khi focus/tab khác thay đổi, loading/error/pending.
- `components/`, `projects.css`: danh sách, chi tiết, form và giao diện responsive.

Nội dung dự án là plain text. Ngày dự kiến lưu `YYYY-MM-DD`; timestamps ISO hiển thị Asia/Ho_Chi_Minh. Tiến độ thủ công được giữ khi chuyển sang checklist. Mốc mặc định không tính vào tiến độ, có thể bật trong form. Lưu trữ giữ dữ liệu và chuyển chi tiết sang chỉ đọc; không có xóa dự án vĩnh viễn.

Form giữ snapshot/version lúc mở. Tab khác ghi trước sẽ khiến lưu bị từ chối và giữ bản nháp. Có tối đa 200 item/dự án; phân trang danh sách local 12 mục, không phải Firestore cursor. Dữ liệu theo browser/origin, có thể mất khi xóa browser storage. Chưa có export/backup/migration cloud. `relatedNoteIds`/`relatedEventIds` chuẩn bị hợp đồng; chưa có thao tác liên kết thật.

Kiểm thử: `tests/e2e/projects.spec.ts`; quyết định: [ADR G3](../../../docs/decisions/002-local-projects.md).
