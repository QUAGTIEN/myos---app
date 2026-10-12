# Ảnh header Lịch Ghi chú Dự án

12/10/2026 · Theo yêu cầu đồng bộ mới, cả Lịch, Ghi chú và Dự án dùng ảnh cực quang của Lịch. Bỏ hai asset header riêng của Ghi chú/Dự án khỏi `public/images`; giữ chiều cao và chức năng hiện tại. Áp dụng cả trang chi tiết của hai phân hệ, chỉ mobile.

| Phân hệ | Ảnh | Asset1200×300 | Dung lượng |
| --- | --- | --- | --- |
| Lịch | Cực quang trên thành phố/vịnh | calendar-aurora.webp | 16.056 bytes |
| Ghi chú | Cùng ảnh cực quang của Lịch | calendar-aurora.webp | Dùng chung |
| Dự án | Cùng ảnh cực quang của Lịch | calendar-aurora.webp | Dùng chung |

Nguồn: ảnh cực quang người dùng cung cấp trực tiếp, chưa có tên tác giả/URL nguồn. Giữ asset đã crop vùng y150–484, resize1200×300 và nén WebP từ lượt trước; không sinh hoặc sửa nội dung ảnh bằng AI. `background-size: cover` có thể cắt thêm theo tỷ lệ viewport; không kéo méo ảnh. Cả ba header dùng cùng URL/lớp phủ/cách căn ảnh, trình duyệt có thể dùng chung bản ảnh đã tải.

## Code

- `src/components/app-shell.tsx`: data-module từ navigation hiện hữu, áp cùng module cho các route chi tiết.
- `src/app/globals.css`: ảnh/overlay navy #102f49c4 trong media<=700; fallback background navy. Lịch64 và Ghi chú/Dự án72 px +safe-top giữ nguyên. Search/filter/main không có ảnh. Giữ header/nav theo hướng cuộn, +44, avatar, popup dưới và chữ nhập16.
- Một asset dùng chung tại `public/images/calendar-aurora.webp`, đóng gói cùng app; không tải ảnh từ host ngoài hoặc upload cloud.
- README/spec cập nhật nguồn/mapping; screenshot cũ giữ làm lịch sử reference. Không thay desktop, auth, Tổng quan/ảnh rừng, logic hoặc dữ liệu.

## Kiểm chứng sau khi đồng bộ

Lint, typecheck, format và build local đạt. Hai case E2E desktop/mobile đạt: cả ba header dùng cùng `calendar-aurora.webp`, giữ64/72 px ở390×844/375×812/320×740, nút tạo44 px hoạt động, nội dung không tràn và desktop không có ảnh header. Đã xem screenshot thực tế của cả ba header; không ghi nhận pageerror. Hai asset cũ không còn được tham chiếu trong source/test và đã được bỏ khỏi ứng dụng.

## Screenshot trước khi đồng bộ

Các ảnh dưới là bản lưu của lượt dùng ba ảnh riêng trước yêu cầu mới. Kiểm tra giao diện hiện hành trong `module-header-photos.spec.ts` ghi ảnh vào output riêng của từng case, kiểm tra cùng ảnh cực quang ở390×844/375×812/320×740 và desktop giữ nguyên.

Lint/typecheck, format và production build local đạt.19 kiểm tra đạt,3 skip desktop đúng phạm vi: assets WebP<150 KiB, geometry64/72 ở390×844/375×812/320×740, header có đúng ảnh/controls, main không có ảnh, không tràn ngang; desktop không có ảnh header. Suite mobile-document-update và shell giữ kiểm tra tạo/lọc/điều hướng/keyboard và nav theo hướng cuộn. Không có pageerror trong test header ảnh.

| Màn hình | 390×844 | 375×812 | 320×740 |
| --- | --- | --- | --- |
| Lịch | [Ảnh](module-header-photos/calendar-390.png) | [Ảnh](module-header-photos/calendar-375.png) | [Ảnh](module-header-photos/calendar-320.png) |
| Ghi chú | [Ảnh](module-header-photos/notes-390.png) | [Ảnh](module-header-photos/notes-375.png) | [Ảnh](module-header-photos/notes-320.png) |
| Dự án | [Ảnh](module-header-photos/projects-390.png) | [Ảnh](module-header-photos/projects-375.png) | [Ảnh](module-header-photos/projects-320.png) |

Các file `*-header-*.png` trong cùng thư mục chỉ chụp khối đầu để so sánh. Screenshot từ app thật bằng Edge Chromium mobile emulation, kho browser test trống, không dữ liệu tài khoản. Chưa kiểm chứng Safari/safe area trên iPhone thật; Vercel do người dùng quản lý triển khai.
