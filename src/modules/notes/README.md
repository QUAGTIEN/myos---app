# Ghi chú

Ca sử dụng: văn bản/rich text, ảnh, thư mục/tag, ghim, autosave, revisions và thùng rác.

G4 đã triển khai local; Firebase Storage/Auth chưa được dùng. Tiptap 3.31.4 lưu JSON/schemaVersion, không lưu HTML hoặc Blob URLs. Node localImage tham chiếu attachmentId; ảnh Blob ở IndexedDB. PNG/JPEG/WebP/GIF được kiểm tra decode, tối đa 5 MB/tệp, 20 ảnh/nội dung. Chọn, dán, drop ảnh hoặc tạo ghi chú từ ảnh. OCR/AI chưa triển khai.

- `model.ts`: schema Zod, metadata, revisions, rich nodes và helper nội dung.
- `repository.ts`: đọc/ghi Notes và ảnh, điều phối liên kết Projects nguyên tử cùng transaction.
- `service.ts`: tạo/lưu/ghim/thùng rác/xóa vĩnh viễn, ảnh và retention.
- `use-note-draft.ts`: debounce 800 ms, serialize các lần lưu, snapshot/version, giữ nháp trong bộ nhớ khi lỗi, manual retry.
- `use-notes.ts`: đọc và refresh sau commit/focus/tab khác.
- `components/`: thư viện, workspace, rich editor, lịch sử và ghi chú trên trang dự án; `notes.css` là style module.

Tối đa 20 phiên bản trước, gồm title/content/folder/tags/projectIds. Ảnh được giữ khi nội dung hiện tại hoặc revision còn tham chiếu; dọn ảnh không còn tham chiếu trong cùng transaction. Thùng rác không tự hết hạn. Xóa vĩnh viễn bỏ note, revisions, ảnh và liên kết dự án. Thư mục là tên trên metadata (đổi/để trống tại ghi chú), nhãn tối đa 10; không có hệ thư mục lồng nhau.

Khi tab khác cập nhật, bản sạch được refresh; bản đang sửa được giữ và tạm dừng autosave. Có sao chép văn bản, tải bản mới với xác nhận và Lưu ngay để thử lại. Nháp lỗi chỉ ở bộ nhớ trang, không phải backup; xóa browser storage mất mọi dữ liệu. Browser/origin khác không đồng bộ. UUID sai trả HTTP 404; UUID hợp lệ nhưng thiếu local hiển thị trạng thái trống phía client.

G5 bổ sung Lịch liên quan trong sidebar và tạo lịch gắn ghi chú. Liên kết event→note là nguồn duy nhất, không thêm bản sao eventIds vào note. Trash/xóa note không xóa lịch; Calendar báo liên kết không khả dụng.

Kiểm chứng trong `tests/e2e/notes.spec.ts`; quyết định tại [ADR G4](../../../docs/decisions/003-local-notes.md).
