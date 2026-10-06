# E2E tests

G1: shell.spec.ts kiểm tra 5 phân hệ, bộ lịch tháng, menu mobile/keyboard, 404, font, tràn nội dung và chức năng chưa khả dụng. Cấu hình 2 projects desktop/mobile; chạy production build qua port 3100.

G3: projects.spec.ts kiểm tra CRUD local/reload, ghim/lưu trữ/khôi phục, lọc/tìm kiếm/phân trang, checklist/mốc/chuyển mode, giữ bản nháp khi lưu lỗi, xung đột hai tab và storage bị chặn. 24 test tổng cộng trên desktop/mobile; fixture chỉ nằm trong context browser của test.

Các luồng đăng nhập thật, lưu lịch/ghi chú, autosave và quyền cloud sẽ thêm ở giai đoạn tương ứng. Xem README ở root cho commands.
