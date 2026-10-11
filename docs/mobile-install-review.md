# Sửa Home Screen và điều hướng mobile — 12/10/2026

Ảnh người dùng có thanh địa chỉ và toolbar trình duyệt iOS. Source trước sửa không có manifest hoặc metadata Apple capable. Đây là thiếu sót cấu hình; ảnh không xác định được phiên bản iOS hay cách shortcut được tạo. Trên iOS26, người dùng vẫn có thể tắt Open as Web App khi thêm Home Screen, kể cả site có manifest. [Nguồn WebKit](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/#every-site-can-be-a-web-app-on-ios-and-ipados).

## Thay đổi

- `src/app/manifest.ts`: identity ổn định `/`, scope `/`, start `/dashboard`, standalone, tiếng Việt và màu MyOS. Route công khai, không chứa dữ liệu tài khoản.
- `src/app/layout.tsx`: manifest và cấu hình Apple dùng cả trang xác thực. Next15.5 phát sinh `mobile-web-app-capable`; thêm riêng `apple-mobile-web-app-capable` để tương thích iOS cũ.
- `src/app/globals.css`: menu 5 phân hệ dùng cùng baseline56 px, vùng chạm48 px, icon18 px, radius18. Đáy `max(8px,safe-bottom)` thay phép cộng khoảng hở với safe area. Nội dung dự phòng menu thực +26 px +khoảng đáy.
- `src/components/app-shell.tsx`: đo menu thực ở mọi route để dự phòng đúng khi chữ/chiều cao thay đổi.
- Giữ nghiệp vụ, dữ liệu, nhận diện và nội dung từng màn hình. Chỉ Lịch có header/nội dung thiết kế mới đã triển khai trước đó.
- Cập nhật README, SOURCE_MAP, kiến trúc và các thông số safe area trong design spec/tokens/suite spec.

Không thêm service worker/cache offline hoặc icon/logo chưa được duyệt. Ứng dụng vẫn cần mạng. Asset icon Home Screen riêng còn thiếu.

## Kiểm tra

- Lint, TypeScript và production build local đạt; `.env.local` không bị sửa.
- Suite shell/mobile/install: 19 đạt, 5 bỏ qua đúng phạm vi, 2 lỗi phát hiện thiếu tag Apple trong output Next15. Sau bổ sung tag, chạy lại toàn suite install: 4 đạt, 2 bỏ qua desktop; hai lỗi metadata đã đạt. Tổng21 trường hợp riêng biệt đạt,5 bỏ qua.
- Kiểm tra cả5 route ở390×844 và375×812, không tràn ngang, menu56 px, mỗi link ít nhất44 px, đủ khoảng dự phòng nội dung. Thử safe-bottom0 và34 px bằng biến CSS; 34 px là mô phỏng, không phải số đo từ iPhone người dùng.
- Luồng tạo lịch/ghi chú/công việc, lịch tuần/nhiều mục, tự lưu chấm công320 px, điều hướng/bàn phím và font Việt đạt. Không có pageerror trong các lượt kiểm tra này.
- Screenshot bên dưới dùng dữ liệu trống trong browser test riêng, không dữ liệu tài khoản. Chụp từ ứng dụng chạy thật bằng Edge Chromium mobile emulation, không mô phỏng thanh Safari.

| Viewport | Tổng quan | Lịch |
| --- | --- | --- |
| 390×844, safe34 | [Ảnh](mobile-install/dashboard-390-safe34.png) | [Ảnh](mobile-install/calendar-390-safe34.png) |
| 375×812, safe34 | [Ảnh](mobile-install/dashboard-375-safe34.png) | [Ảnh](mobile-install/calendar-375-safe34.png) |

Chưa kiểm chứng native Safari, cài shortcut hoặc bàn phím trên iPhone thật. Sau khi deploy, mở domain chính trong Safari, thêm lại Home Screen và bật Open as Web App nếu có; xác nhận không còn toolbar trình duyệt và menu nằm trên home indicator. Không xóa dữ liệu trình duyệt để xử lý lỗi này. Vercel do người dùng quản lý triển khai.
