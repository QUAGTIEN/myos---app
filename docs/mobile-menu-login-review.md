# Menu mobile và ghi nhớ đăng nhập — 12/10/2026

## Thay đổi

- Bỏ chữ ở menu dưới, icon Lucide tăng từ 18 lên 26 px; nền chọn 40×40 px. Giữ 5 phân hệ, tên truy cập, trạng thái pending, bàn phím và vùng bấm tối thiểu 44 px. Thanh vẫn cao 52 px, rộng tối đa 340 px, giữ safe area và ẩn/hiện theo cuộn.
- `/login` kiểm tra cookie phía server và chuyển Tổng quan khi phiên hợp lệ. Không yêu cầu nhập lại mật khẩu để dùng phiên hiện hữu.
- Ghi nhớ mặc định bật, cookie HttpOnly kéo dài 14 ngày cho lần đăng nhập mới; cookie cũ giữ thời hạn cũ. Khi bỏ chọn, cookie theo phiên browser, token 2 giờ. Hết hạn/đăng xuất/thu hồi/vô hiệu hóa yêu cầu đăng nhập lại.
- Chuẩn bị CSRF khi nhập form; dùng ID token mới do lần đăng nhập vừa cấp thay vì ép refresh. Đọc/tạo hồ sơ và tạo Firebase session cookie song song sau xác thực; chỉ gửi cookie cho browser khi session hash đã lưu thành công.
- Browser SDK vẫn inMemory rồi signOut, không lưu mật khẩu hoặc thêm credential persistent. Không cache quyền, không đổi API/UID/CSRF/version hoặc dữ liệu nghiệp vụ. Chính sách tại [ADR 006](decisions/006-firebase-public-accounts.md).
- Thêm khai báo kiểu ảnh static của Next để typecheck không phụ thuộc file `next-env.d.ts` được build sinh ra.

## Ảnh từ ứng dụng thực tế

Browser emulation, viewport CSS 390×844 và 375×812; ảnh có mật độ 3×. Kho local riêng của kiểm thử đang trống, không phải dữ liệu tài khoản production. Nền rừng, header và nội dung Tổng quan giữ nguyên; chỉ menu dưới thay đổi.

- [390×844](mobile-menu-login-verification/menu-390x844.png)
- [375×812](mobile-menu-login-verification/menu-375x812.png)

## Kiểm chứng và giới hạn

Lint/typecheck/format, build local và cloud demo đạt. Typecheck source không đọc next-env/.next đạt. Firebase Emulator: 24 cases đạt; hồi quy shell/Home Screen/mobile refinements/document/header: 26 đạt, 8 skip chủ đích trên desktop. Kiểm tra mở lại chỉ với cookie persistent, login không gửi thêm credential, opt-out, server expiry, disabled/revoked, logout, CRUD, điều hướng bàn phím, form và safe-bottom 0/34 px ở 390/375 px; responsive 320 px đạt. Đã xem hai ảnh menu và ảnh đăng nhập từ suite.

Chưa đo latency trên Vercel hoặc thử đóng/mở Home Screen trên iPhone thật. Cookie chỉ áp dụng trong cùng origin và môi trường browser/Home Screen; xóa dữ liệu website hoặc dùng môi trường khác không giữ được phiên này. Chưa push hoặc deploy các thay đổi trong lượt này.
