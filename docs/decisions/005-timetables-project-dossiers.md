# ADR 005 — Bộ thời khóa biểu và hồ sơ dự án local

Ngày: 07/10/2026. Trạng thái: áp dụng theo phạm vi người dùng đã xác nhận; G2 vẫn hoãn.

## Quyết định

- Tab Lịch dùng FullCalendar ngày/tháng và lưới năm Luxon (2000–2100), không thêm thư viện. Tab Công việc giữ các views và thao tác lịch G5.
- Groups hiện có trở thành bộ thời khóa biểu có tên/màu, events tham chiếu groupId. Không tạo kho thứ hai hay sao chép dữ liệu lịch để hiển thị.
- Tạo/sửa bộ lịch có version check. Sao chép đọc settings/events và ghi toàn bộ trong một transaction; clone có ID mới, cùng ngày/lặp/ngoại lệ, đặt lại completed và bỏ projectIds/noteIds/sourceMilestone. Bộ gốc không thay đổi. Chưa có dịch hàng loạt sang kỳ mới hoặc xóa bộ đang có sự kiện.
- Kanban dùng trạng thái active/paused/completed hiện hữu, kéo bằng vùng nắm trên desktop hoặc chọn trạng thái để dùng bàn phím/mobile. Service/repository hiện hữu lưu trạng thái với version check; không có thứ tự tùy chỉnh trong từng cột.
- Project.workspace thêm mục tiêu, tài liệu plain text, liên kết HTTP(S), phần cứng tùy chọn, nhật ký/kiểm thử và metadata tệp. Zod defaults đọc dự án cũ; giữ schemaVersion 1 vì phần mở rộng tương thích. Không scan/ghi lại mọi dự án khi mở ứng dụng.
- Database v4 thêm projectAttachments (id, projectId, Blob), giữ nguyên stores cũ. Service hạn chế 20 MB/tệp và 50 tệp/dự án. Repository ghi/xóa metadata và Blob nguyên tử cùng kiểm tra project.version. Download kiểm tra projectId, dùng Blob URL tạm và thu hồi URL; tệp chỉ tải xuống, không chạy/nhúng tài liệu HTML.
- Hồ sơ chỉnh sửa giữ snapshot/version và bản nháp khi lỗi/conflict. Upload/xóa riêng, không thực hiện trong lúc có nháp hồ sơ. Dự án lưu trữ chỉ đọc. Giới hạn: 50 tài liệu, 100 liên kết, 100 linh kiện, 200 bản ghi; phần cứng tắt vẫn giữ danh sách linh kiện.
- Tên phân hệ ở toolbar, h1 trang giữ ẩn cho accessibility; tên dự án/ghi chú và tiêu đề khối vẫn hiển thị. Menu Ghi chú đứng trước Dự án. Thẻ bỏ viền màu, giữ viền trung tính/bóng nhẹ và các nền màu đã chốt.

## Kiểm chứng và phạm vi

workspace.spec.ts kiểm tra lưu hồ sơ IoT, chặn URL không an toàn, cost calculation, download, file rollback, conflict hai tab, archive chỉ đọc, Kanban và nâng v3→v4. Suite Calendar/Notes/Projects/Overview cũ giữ kiểm tra liên kết, migration và hồi quy. Không thêm dependency.

Dữ liệu theo browser/origin, chưa có backup/cloud/auth. Việc đính kèm source là lưu tệp hoặc link GitHub; không chạy/deploy dự án. Ghi chú giữ nghiệp vụ hiện tại. Firebase/G2, nhắc tự động/Zalo và deploy còn hoãn.
