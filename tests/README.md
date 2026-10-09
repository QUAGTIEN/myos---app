# Kiểm thử MyOS

Màu lịch 10/10/2026: lint/typecheck, build local/cloud đạt; 16 kiểm tra liên quan đạt trên desktop/mobile (6 domain không lặp trên mobile). Bao gồm HEX hợp lệ/không hợp lệ, tương phản chữ 4.5:1, dữ liệu cũ, kế thừa/override màu từng buổi, reload tháng/tuần, bộ lịch/cài đặt/copy và 6 mục hiển thị đầy đủ. Firebase Emulator: 2 kiểm tra màu cloud đạt, xác nhận lưu nhóm/ngoại lệ và từ chối màu sai. Đã xem bảng lịch, bộ chọn màu và Cài đặt ở desktop/mobile.

Kiểm chứng UI shadcn/ui ngày 10/10/2026: lint/typecheck/format và build đạt. Suite local chạy 96 cases: 86 đạt, 8 skip chủ đích, 2 lỗi locator cũ khi nút chuyển thành tab. Đã sửa locator và chạy lại 8 cases desktop/mobile, tất cả đạt, gồm sao chép bộ lịch, lưu cài đặt, CRUD Dự án và kiểm tra mới cho điều hướng tab bằng bàn phím/tabpanel. Đã xem ảnh Cài đặt, Dự án và các màn hình từ suite trên desktop/mobile.

Suite Firebase Emulator chạy 16 cases desktop/mobile: 14 đạt, 2 lỗi locator cũ của tab Chấm công. Đã sửa locator và chạy lại cả 2 cases, tất cả đạt. Các kiểm tra bao gồm xác thực, hồ sơ, CRUD cloud, nháp chấm công, quyền truy cập, version và thu hồi phiên; dùng project demo riêng, không ghi dữ liệu production. Emulator chạy bằng Java 21 portable trong thư mục tạm.

G1: shell.spec.ts kiểm tra 5 phân hệ, bộ lịch tháng, menu mobile/keyboard, 404, font, tràn nội dung và chức năng chưa khả dụng. Cấu hình 2 projects desktop/mobile; chạy production build qua port 3100.

G3: projects.spec.ts kiểm tra CRUD local/reload, ghim/lưu trữ/khôi phục, lọc/tìm kiếm/phân trang, checklist/mốc/chuyển mode, giữ bản nháp khi lưu lỗi, xung đột hai tab và storage bị chặn. 24 test tổng cộng trên desktop/mobile; fixture chỉ nằm trong context browser của test.

G4: notes.spec.ts thêm 16 test desktop/mobile cho autosave/rich text/checklist, ảnh chọn/dán/reload/history, quota rollback, conflict hai tab, links Projects, database upgrade, retention/cleanup và pagination. G4 có 40 test; dữ liệu/canvas ảnh chỉ là fixture trong context test, không đi vào dữ liệu người dùng.

Sau G5: suite có 68 cases, 61 chạy và 7 skip có chủ đích (6 domain trên mobile, 1 kéo/resize trên mobile). Lịch mới kiểm tra kéo đổi ngày và sửa giờ qua form; không dùng force hoặc sửa DOM để giả lập kéo. Tất cả browser tests dùng dữ liệu riêng theo BrowserContext.

Test autosave conflict cài clock trước khi tải ứng dụng để không thay timer đang hoạt động, và đợi trạng thái “Đã lưu” trước khi mở tab thứ hai. Test liên kết dùng ngày/giờ hẹn cụ thể để không vô tình trùng mốc khi ngày hôm nay thay đổi.

G5: calendar.spec.ts kiểm tra lịch đơn/cả ngày/tuần, sửa/hủy/hoàn thành riêng, tháng/tuần, trùng giờ, hai tab, quota rollback, links/mốc, download, settings, kéo đổi ngày và sửa giờ qua form. calendar-domain.spec.ts kiểm tra thời gian và iCalendar bằng parser độc lập, chỉ chạy project desktop để không lặp domain tests. Đăng nhập và quyền cloud thêm ở G2. Xem README ở root cho commands.

Tổng quan: overview.spec.ts có 8 cases desktop/mobile, kiểm tra dữ liệu nguồn/loại lưu trữ-thùng rác, ngày Việt Nam trên máy khác timezone, lịch qua đêm/ngoại lệ/end exclusive, đổi ngày, cập nhật tab, checklist commit/rollback, tạo nhanh và lỗi nguồn/retry riêng. Suite hiện có 84 cases; 7 skip theo cấu hình G5.

workspace.spec.ts: 8 cases desktop/mobile cho lịch tháng/tuần, bộ thời khóa biểu lưu/đổi tên/sao chép, hồ sơ IoT/tài liệu/link an toàn/nhật ký, tệp tải/xóa và rollback, Kanban, conflict hai tab và nâng database v3→v5. Fixtures của version cũ khởi tạo trên /login trước khi ứng dụng mở IndexedDB.

Thanh công cụ Lịch: workspace kiểm tra menu Thao tác lịch mở bằng Enter, đóng bằng Escape/click ngoài, trả focus sau dialog, ẩn sửa/sao chép khi chưa chọn bộ và không tràn ở 320 px. Calendar/workspace mở menu trước khi xuất `.ics`; kiểm tra điều hướng tháng dùng heading trong region Bộ lịch thay vì phụ thuộc class bố cục cũ.

attendance.spec.ts kiểm tra nội dung ngày tháng/tuần, toolbar, ghi chú tính đã chấm/tự lưu và reload, công việc/tháng độc lập, bảng không có cột thông tin bên phải, xóa có xác nhận, giữ nháp khi lỗi và xung đột tab. Schema cũ/ngày nhuận vẫn giữ. Firebase suite thêm tuần tự hóa việc gõ trong lúc cloud write, tự lưu offline/retry, version/ownership và xóa công việc khóa tháng/không phục hồi. Tổng quan kiểm tra không còn nút tạo nhanh, vẫn sửa lịch hiện hữu.

Kiểm chứng bỏ cột bên phải ngày 09/10/2026: Attendance desktop/mobile đạt 9 cases, 1 skip schema trên mobile; đã xem bố cục Lịch và Chấm công thực tế ở cả hai kích thước. Lint, typecheck, format và production build đạt.

Card lịch ngày 09/10/2026: Calendar/Attendance đạt 26 cases, 2 skip chủ đích. Trường hợp sáu mục cùng ngày kiểm tra tất cả card hiện đủ, không chồng, mở chi tiết và reload ở tháng/tuần trên desktop/mobile; đã xem ảnh thực tế. CRUD, chuỗi tuần, qua đêm/nhiều ngày, kéo thả/rollback và xuất ICS vẫn đạt.

Thanh ngang pastel đậm ngày 09/10/2026: Calendar đạt 17 cases, 1 skip kéo thả mobile. Sau chỉnh giờ/tên xuống dòng trong ô hẹp, hai cases sáu mục tháng/tuần chạy lại đạt trên desktop/mobile; đã xem ảnh thực tế. Ô tự giãn, tất cả mục hiện đủ, cùng một cột và không chồng.

Kiểm chứng ngày 08/10/2026: lint, typecheck, format và production build đạt; Attendance desktop/mobile đạt 7 cases, 1 skip để không lặp schema test; Firebase Emulator đạt 14 cases. Suite local đầy đủ đã chạy 92 cases: 82 đạt, 8 skip và 2 lỗi locator của Attendance; sau khi sửa locator, các cases Attendance chạy lại đạt. Calendar/domain/workspace cũng chạy lại sau thay đổi giao diện. Không xác nhận tốc độ hoặc dữ liệu trên deployment thật từ các kết quả Emulator này.

Kiểm chứng ngày 09/10/2026: lint/typecheck/format/build đạt; hồi quy Calendar/Attendance/domain/workspace/shell đạt 48 cases, 8 skip chủ đích. Sau chỉnh kích thước editor mobile và validation giờ, Attendance chạy lại đạt 7 cases, 1 skip; Firebase Emulator đạt toàn bộ 14 cases với ghi chú riêng/cloud reload, lỗi mạng giữ nội dung đang gõ, version/ownership và Auth. Đã xem ảnh desktop 1920 px và mobile 320 px của bảng/editor thực tế.

## Tổ chức và chạy

Firebase suite bổ sung kiểm tra cache qua điều hướng desktop/mobile, số request ở Tổng quan/dialog, canonical sau tạo/ghim, GET cũ về sau POST không ghi đè, CSRF tái dùng và cookie hết hạn không ghi trùng. Kiểm tra riêng tài khoản disabled và refresh token bị thu hồi trên Emulator để bảo vệ tối ưu DAL. Không tạo dữ liệu hoặc gửi email trên Firebase thật.

Chỉ có tests/e2e vì đây là bộ kiểm thử đang hoạt động. calendar-domain.spec.ts chạy quy tắc thời gian/iCalendar qua cùng runner Playwright, không cần tạo thêm runner hoặc thư mục unit trống.

~~~powershell
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
~~~

Có thể đặt PLAYWRIGHT_CHANNEL=chrome hoặc msedge để dùng browser đã cài. Playwright quản lý production server port 3100, 2 workers và hai cấu hình desktop/mobile. Không chạy build trong lúc production preview port 3000 đang dùng cùng .next; dừng preview trước và khởi động lại sau build.

Khi triển khai Auth/cloud, bổ sung kiểm thử quyền Firestore/Storage bằng Emulator và transaction/lease. Chỉ tạo tests/rules, tests/integration hoặc tests/unit khi có test thật. Adapter gửi tin trong test không gửi tin ra bên ngoài.

## G2 Firebase

`pnpm test:firebase` build với env demo-myos, chạy Auth/Firestore Emulator (Java 21+) và firebase.spec.ts qua port 3101, desktop/mobile. Kiểm tra đăng ký/đăng nhập/quên mật khẩu/logout, hồ sơ, CRUD cloud, hai UID, từ chối liên kết chéo, transaction, version conflict, 20 revisions, Rules và cookie đã thu hồi. `pnpm test:local` tự build local trước suite cũ. Sau đó `pnpm build` để khôi phục cấu hình thực tế. Emulator chỉ demo project, không dùng key Admin hoặc dữ liệu thật.

Chấm công theo nội dung/tự lưu 09/10/2026: lint/typecheck/format/build đạt; Attendance + Tổng quan đạt 17 kiểm tra (1 skip), Attendance cuối đạt 9 (1 skip). Firebase Emulator đạt 16 kiểm tra, gồm ghi trong lúc request đang chạy, offline giữ nháp, ownership/version và xóa công việc khóa bảng tháng. Đã xem giao diện thật desktop/mobile; chưa xác nhận deployment Vercel thật.
