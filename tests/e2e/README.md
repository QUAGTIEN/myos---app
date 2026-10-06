# E2E tests

G1: shell.spec.ts kiểm tra 5 phân hệ, bộ lịch tháng, menu mobile/keyboard, 404, font, tràn nội dung và chức năng chưa khả dụng. Cấu hình 2 projects desktop/mobile; chạy production build qua port 3100.

G3: projects.spec.ts kiểm tra CRUD local/reload, ghim/lưu trữ/khôi phục, lọc/tìm kiếm/phân trang, checklist/mốc/chuyển mode, giữ bản nháp khi lưu lỗi, xung đột hai tab và storage bị chặn. 24 test tổng cộng trên desktop/mobile; fixture chỉ nằm trong context browser của test.

G4: notes.spec.ts thêm 16 test desktop/mobile cho autosave/rich text/checklist, ảnh chọn/dán/reload/history, quota rollback, conflict hai tab, links Projects, database upgrade, retention/cleanup và pagination. G4 có 40 test; dữ liệu/canvas ảnh chỉ là fixture trong context test, không đi vào dữ liệu người dùng.

Sau G5: suite có 68 cases, 61 chạy và 7 skip có chủ đích (6 domain trên mobile, 1 kéo/resize trên mobile). Resize cần hover hiện tay nắm và giữ điểm đến trong viewport; không dùng force hoặc sửa DOM để giả lập kéo. Tất cả browser tests dùng dữ liệu riêng theo BrowserContext.

Test autosave conflict cài clock trước khi tải ứng dụng để không thay timer đang hoạt động, và đợi trạng thái “Đã lưu” trước khi mở tab thứ hai. Test liên kết dùng ngày/giờ hẹn cụ thể để không vô tình trùng mốc khi ngày hôm nay thay đổi.

G5: calendar.spec.ts kiểm tra lịch đơn/cả ngày/tuần, sửa/hủy/hoàn thành riêng, bốn views, trùng giờ, hai tab, quota rollback, links/mốc, download, settings, kéo/resize. calendar-domain.spec.ts kiểm tra thời gian và iCalendar bằng parser độc lập, chỉ chạy project desktop để không lặp domain tests. Đăng nhập và quyền cloud thêm ở G2. Xem README ở root cho commands.
