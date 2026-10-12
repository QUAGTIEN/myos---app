# Ảnh header Lịch Ghi chú Dự án

12/10/2026 · Người dùng cung cấp3 ảnh theo thứ tự sau yêu cầu ảnh thật cho header3 phân hệ. Ghép theo thứ tự Lịch/Ghi chú/Dự án và thông báo mapping trước khi triển khai. Giữ chiều cao và chức năng hiện tại.

| Phân hệ | Ảnh | Asset1200×300 | Dung lượng |
| --- | --- | --- | --- |
| Lịch | Cực quang trên thành phố/vịnh | calendar-aurora.webp | 16.056 bytes |
| Ghi chú | Vịnh núi/thác nước | notes-fjord.webp | 124.698 bytes |
| Dự án | Phố màu bên bờ nước | projects-waterfront.webp | 99.768 bytes |

Nguồn: ảnh người dùng cung cấp trực tiếp, chưa có tên tác giả/URL nguồn. Chỉ crop/resize/nén bằng Sharp có sẵn trong Next, không sinh hoặc sửa nội dung ảnh bằng AI. Crop gốc theo chiều rộng, vùngy150–484/y380–705/y365–699 để giữ cực quang, vịnh/thác và dãy nhà; sau đó resize1200×300. `background-size: cover` có thể cắt thêm theo tỷ lệ viewport; không kéo méo ảnh.

## Code

- `src/components/app-shell.tsx`: data-module từ navigation hiện hữu, áp cùng module cho các route chi tiết.
- `src/app/globals.css`: ảnh/overlay navy #102f49c4 trong media<=700; fallback background navy. Lịch64 và Ghi chú/Dự án72 px +safe-top giữ nguyên. Search/filter/main không có ảnh. Giữ header/nav theo hướng cuộn, +44, avatar, popup dưới và chữ nhập16.
-3 asset tại `public/images/`, đóng gói cùng app; không tải ảnh từ host ngoài hoặc upload cloud.
- README/spec cập nhật nguồn/mapping, asset cũ giữ cho lịch sử reference. Không thay desktop, auth, Tổng quan/ảnh rừng, logic hoặc dữ liệu.

## Screenshot

Lint/typecheck, format và production build local đạt.19 kiểm tra đạt,3 skip desktop đúng phạm vi: assets WebP<150 KiB, geometry64/72 ở390×844/375×812/320×740, header có đúng ảnh/controls, main không có ảnh, không tràn ngang; desktop không có ảnh header. Suite mobile-document-update và shell giữ kiểm tra tạo/lọc/điều hướng/keyboard và nav theo hướng cuộn. Không có pageerror trong test header ảnh.

| Màn hình | 390×844 | 375×812 | 320×740 |
| --- | --- | --- | --- |
| Lịch | [Ảnh](module-header-photos/calendar-390.png) | [Ảnh](module-header-photos/calendar-375.png) | [Ảnh](module-header-photos/calendar-320.png) |
| Ghi chú | [Ảnh](module-header-photos/notes-390.png) | [Ảnh](module-header-photos/notes-375.png) | [Ảnh](module-header-photos/notes-320.png) |
| Dự án | [Ảnh](module-header-photos/projects-390.png) | [Ảnh](module-header-photos/projects-375.png) | [Ảnh](module-header-photos/projects-320.png) |

Các file `*-header-*.png` trong cùng thư mục chỉ chụp khối đầu để so sánh. Screenshot từ app thật bằng Edge Chromium mobile emulation, kho browser test trống, không dữ liệu tài khoản. Chưa kiểm chứng Safari/safe area trên iPhone thật; Vercel do người dùng quản lý triển khai.
