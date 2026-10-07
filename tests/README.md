# Kiểm thử MyOS

G1: shell.spec.ts kiểm tra 5 phân hệ, bộ lịch tháng, menu mobile/keyboard, 404, font, tràn nội dung và chức năng chưa khả dụng. Cấu hình 2 projects desktop/mobile; chạy production build qua port 3100.

G3: projects.spec.ts kiểm tra CRUD local/reload, ghim/lưu trữ/khôi phục, lọc/tìm kiếm/phân trang, checklist/mốc/chuyển mode, giữ bản nháp khi lưu lỗi, xung đột hai tab và storage bị chặn. 24 test tổng cộng trên desktop/mobile; fixture chỉ nằm trong context browser của test.

G4: notes.spec.ts thêm 16 test desktop/mobile cho autosave/rich text/checklist, ảnh chọn/dán/reload/history, quota rollback, conflict hai tab, links Projects, database upgrade, retention/cleanup và pagination. G4 có 40 test; dữ liệu/canvas ảnh chỉ là fixture trong context test, không đi vào dữ liệu người dùng.

Sau G5: suite có 68 cases, 61 chạy và 7 skip có chủ đích (6 domain trên mobile, 1 kéo/resize trên mobile). Resize cần hover hiện tay nắm và giữ điểm đến trong viewport; không dùng force hoặc sửa DOM để giả lập kéo. Tất cả browser tests dùng dữ liệu riêng theo BrowserContext.

Test autosave conflict cài clock trước khi tải ứng dụng để không thay timer đang hoạt động, và đợi trạng thái “Đã lưu” trước khi mở tab thứ hai. Test liên kết dùng ngày/giờ hẹn cụ thể để không vô tình trùng mốc khi ngày hôm nay thay đổi.

G5: calendar.spec.ts kiểm tra lịch đơn/cả ngày/tuần, sửa/hủy/hoàn thành riêng, bốn views, trùng giờ, hai tab, quota rollback, links/mốc, download, settings, kéo/resize. calendar-domain.spec.ts kiểm tra thời gian và iCalendar bằng parser độc lập, chỉ chạy project desktop để không lặp domain tests. Đăng nhập và quyền cloud thêm ở G2. Xem README ở root cho commands.

Tổng quan: overview.spec.ts có 8 cases desktop/mobile, kiểm tra dữ liệu nguồn/loại lưu trữ-thùng rác, ngày Việt Nam trên máy khác timezone, lịch qua đêm/ngoại lệ/end exclusive, đổi ngày, cập nhật tab, checklist commit/rollback, tạo nhanh và lỗi nguồn/retry riêng. Suite hiện có 84 cases; 7 skip theo cấu hình G5.

workspace.spec.ts: 8 cases desktop/mobile cho lưới năm/ngày, bộ thời khóa biểu lưu/đổi tên/sao chép, hồ sơ IoT/tài liệu/link an toàn/nhật ký, tệp tải/xóa và rollback, Kanban, conflict hai tab và nâng database v3→v4. Fixtures của version cũ khởi tạo trên /login trước khi ứng dụng mở IndexedDB.

## Tổ chức và chạy

Chỉ có tests/e2e vì đây là bộ kiểm thử đang hoạt động. calendar-domain.spec.ts chạy quy tắc thời gian/iCalendar qua cùng runner Playwright, không cần tạo thêm runner hoặc thư mục unit trống.

~~~powershell
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
~~~

Có thể đặt PLAYWRIGHT_CHANNEL=chrome hoặc msedge để dùng browser đã cài. Playwright quản lý production server port 3100, 2 workers và hai cấu hình desktop/mobile. Không chạy build trong lúc production preview port 3000 đang dùng cùng .next; dừng preview trước và khởi động lại sau build.

Khi triển khai Auth/cloud, bổ sung kiểm thử quyền Firestore/Storage bằng Emulator và transaction/lease. Chỉ tạo tests/rules, tests/integration hoặc tests/unit khi có test thật. Adapter gửi tin trong test không gửi tin ra bên ngoài.
