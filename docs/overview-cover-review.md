# Ảnh nền Tổng quan — 12/10/2026

Người dùng chọn và cung cấp ảnh tán rừng1200×627 cho Tổng quan mobile, sau khi thống nhất ảnh tĩnh có thể dịch/phóng nhẹ để tạo chiều sâu. Đây là ảnh mới được chọn cho Tổng quan; ảnh và phong cách xác thực vẫn giữ riêng.

## Triển khai

- `public/images/overview-canopy.webp`: chuyển định dạng/nén bằng Sharp có sẵn trong Next, giữ1200×627 và nội dung ảnh. PNG nguồn2.062.736 bytes → WebP440.574 bytes (~430 KiB), không sinh hoặc sửa nội dung ảnh bằng AI. Không dùng screenshot giao diện làm nền.
- `src/modules/overview/overview-screen.tsx`: lớp trang trí aria-hidden, không nhận tương tác; IntersectionObserver + visibilitychange + media query điều khiển chạy/dừng, cleanup khi rời route.
- `src/modules/overview/overview.css`: khung ảnh liên tục từ logo/header tới cuối số liệu, crop center46%, phủ navy #102f49c4. Animation18 giây ease-in-out/alternate, scale1.03→1.06 và dịch khoảng0.4–0.5%; chỉ ảnh di chuyển, chữ/số liệu đứng yên. Clip trong khung để không tràn ra tab.
- `src/components/app-shell.tsx`: ResizeObserver đo chiều cao header thực cho khung ảnh (kể cả safe area/chữ thay đổi). Header nền dự phòng khi chưa có summary; tại đầu trang cho thấy ảnh, khi cuộn và hiện lại dùng navy đặc.
- Mặc định paused, chỉ chạy khi Tổng quan mobile có ảnh nằm trong viewport, trang đang hiện và không reduced motion. CSS tắt animation độc lập khi reduced motion. Desktop ẩn lớp ảnh; không thay các phân hệ khác, logic, dữ liệu hoặc màu chữ.
- Nếu ảnh tải lỗi, khung vẫn có nền navy để đọc được nội dung. Không thêm video/WebGL/hiệu ứng nước hoặc ảnh rừng chuyển động giả.

## Kiểm tra

- Lint/typecheck, format và production build local đạt.
-27 kiểm tra đạt,3 bỏ qua desktop đúng phạm vi: Overview dữ liệu thật, checklist/lưu lỗi/tab khác, dialog lịch, shell5 route, các tinh chỉnh mobile trước đó và cover.
- Cover được kiểm tra ở390×844,375×812 và320×740: khớp đầu header và đáy summary, không tràn ngang; nội dung không dịch chuyển khi animation chạy. Header ẩn/hiện giữ đúng hành vi và đổi sang navy khi đã cuộn; rời route bỏ lớp ảnh và trạng thái shell.
- Kiểm tra bật/tắt reduced motion, dừng khi cuộn ngoài khung và visibilitychange mô phỏng. Browser headless không tái hiện backgrounding iOS; chưa đo năng lượng hoặc kiểm chứng trên iPhone thật.
- Screenshot là ứng dụng chạy thật trong Edge Chromium mobile emulation với kho test riêng trống. Chụp tạm dừng animation để ảnh đối chiếu ổn định; chuyển động xem tại ứng dụng. Không phải tài khoản người dùng.

| Viewport | Toàn màn | Khối đầu |
| --- | --- | --- |
| 390×844 | [Ảnh](overview-cover/overview-390.png) | [Ảnh](overview-cover/hero-390.png) |
| 375×812 | [Ảnh](overview-cover/overview-375.png) | [Ảnh](overview-cover/hero-375.png) |
| 320×740 | [Ảnh](overview-cover/overview-320.png) | [Ảnh](overview-cover/hero-320.png) |

Nguồn ảnh: người dùng cung cấp trực tiếp; chưa cung cấp tên tác giả hoặc đường dẫn nguồn. Không thay bằng ảnh khác. Vercel do người dùng quản lý triển khai; file môi trường giữ nguyên.
