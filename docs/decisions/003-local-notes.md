# ADR 003 — Ghi chú và ảnh local

Ngày: 06/10/2026. Trạng thái: áp dụng G4 theo phạm vi đã được người dùng xác nhận; G2 vẫn để cuối.

## Quyết định

Tiptap React/StarterKit/Core/PM/TaskList/TaskItem khóa cùng version 3.31.4. Next.js khởi tạo editor với `immediatelyRender: false`; nội dung JSON qua schema Zod. Chỉ các node/mark đã hỗ trợ được lưu. Không nhận ảnh URL bên ngoài hoặc SVG; ảnh local dùng node attachmentId và React node view, tạo Blob URL khi hiển thị và revoke khi unmount. `setEditable(..., false)` không phát onUpdate giả. Tham khảo [Tiptap React](https://tiptap.dev/docs/editor/getting-started/install/react), [React node views](https://tiptap.dev/docs/editor/extensions/custom-extensions/node-views/react).

Chia sẻ `src/lib/local/database.ts` với Projects. Database `myos-local` nâng từ 1 lên 2, thêm `notes` và `noteAttachments` (index noteId), không xóa hoặc ghi lại Projects. Tab version cũ phải đóng/tải lại khi nâng cấp; kết nối nhận versionchange sẽ đóng. Firebase/cloud chưa được dùng.

Ghi note, Blob mới, dọn Blob hết tham chiếu và cập nhật liên kết dự án trong một readwrite transaction. Kiểm tra version hiện tại, quyền sở hữu ảnh theo noteId, dự án tồn tại và không gắn mới vào dự án lưu trữ. Notes.projectIds là nguồn liên kết; Projects.relatedNoteIds được cập nhật nguyên tử, tăng version và history. Commit xong mới thông báo cả hai module. Các request được xếp trong callback IndexedDB, không await tác vụ ngoài trong transaction.

Autosave debounce 800 ms và serialize các lần lưu. Dùng snapshot đang gửi; thao tác gõ khi đang lưu sẽ tạo lượt tiếp theo. Bản sạch nhận cập nhật tab khác; bản có nháp giữ nguyên và tạm dừng autosave khi conflict/lỗi. Lưu ngay để retry; tải bản mới có xác nhận; sao chép nháp là văn bản, không sao chép Blob ảnh. Trước thao tác pin/trash/restore cần flush bản đang sửa.

## Giới hạn và vòng đời

Ảnh PNG/JPEG/WebP/GIF được kiểm tra MIME, kích thước và decode trước khi lưu; 5 MB/ảnh và 20 ảnh trong nội dung. Không lưu Blob URL vào JSON. Lỗi ảnh không chèn node hỏng. Revision giữ 20 bản trước gồm metadata/nội dung; giữ ảnh được tham chiếu bởi current hoặc revisions. Thùng rác giữ nguyên dữ liệu, không có tự hết hạn. Xóa vĩnh viễn cần xác nhận rồi xóa note/ảnh/revisions/liên kết; ảnh upload chỉ ghi cùng note, không tạo tệp mồ côi do commit lỗi.

Thư mục là tên metadata và nhãn tối đa 10, không có folder hierarchy hoặc quản lý thư mục độc lập. Search chỉ theo tiêu đề, local pagination 12 mục. Chưa có AI/OCR, tệp PDF, cloud auth/upload, backup hoặc export. Nháp lỗi nằm trong bộ nhớ trang; cảnh báo khi đóng/rời qua link và nút sao chép giúp giữ văn bản, không bảo đảm phục hồi nháp/ảnh chưa lưu sau khi đóng browser. Dữ liệu đã lưu vẫn theo profile/origin.

G2 cần thiết kế chuyển JSON schema, Blob/attachmentId, revision retention, project links và owner UID sang Firestore/Storage. Không coi local là cloud đồng bộ hoặc private account.

## Kiểm chứng

E2E desktop/mobile: rich text/checklist/autosave, thư mục/nhãn/ghim/search, chọn/dán và lỗi ảnh, reload, lịch sử/khôi phục/thùng rác/xóa vĩnh viễn, quota rollback nguyên tử, conflict hai tab, liên kết dự án, upgrade database G3, retention/dọn ảnh và phân trang.
