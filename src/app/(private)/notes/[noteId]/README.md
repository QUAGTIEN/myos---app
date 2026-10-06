# Route /notes/[noteId]

Server đọc ghi chú thuộc UID; client editor phụ trách rich text, hình ảnh và autosave.

Lưu JSON có version; giữ nháp và báo conflict khi dữ liệu mới hơn. File riêng tư tham chiếu bằng ID, không nhúng base64 vào document. Tiptap là thư viện đề xuất, chưa cài.
