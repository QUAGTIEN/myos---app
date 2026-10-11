# MyOS mobile — Bản xem thử v3

11/10/2026. Cập nhật theo ba yêu cầu mới: ảnh thật, điều hướng gọn, popup giữa màn hình. Đây là bản thiết kế độc lập, chưa triển khai vào ứng dụng; nội dung mẫu và tương tác preview không ghi dữ liệu.

## Quy tắc cập nhật

| Thành phần | Bản trước | Bản xem thử v3 |
| --- | --- | --- |
| Header | Navy đặc, min64 | Ảnh biển với lớp navy opacity42%; min64 ở phân hệ, Tổng quan104 để thấy ảnh. Title22/28/600 và avatar44 giữ nguyên |
| Nav | Cao72, radius24, item60, icon20, label12 | Cao56, radius18, item48, icon18, label11/16; padding4, margin ngang10 / dưới8 + safe-bottom |
| Dialog | Neo đáy, chỉ bo góc trên | Tâm x/y tại50% viewport, bo16 cả bốn góc, rộng viewport−32 (−24 dưới360), tối đa398; cao tối đa100dvh−32−safe-top−safe-bottom |
| Form dài | Body cuộn riêng | Giữ header/footer trong flow, body cuộn riêng; nút đóng44, action44; không thêm animation hoặc gesture |

Tại320 px, nhãn Tổng quan xuống hai dòng và nav tự giãn lên66 px; không cắt nhãn hoặc giảm chữ thêm.

Main giữ reserve theo chiều cao nav đo thực tế +34 +safe-bottom. Chỉ label nav dùng11; nội dung15/23, field16/24 và metadata12/18 giữ nguyên. Vùng chạm từng mục nav cao48. Màu nút, pastel, số liệu và font MyOS giữ nguyên.

Ảnh chỉ nằm trong header có sẵn, không chèn thêm banner/card, không nằm sau lịch, nội dung ghi chú hoặc trường nhập. Tổng quan tăng header40 px là thay đổi bố cục cần xem thử. Cùng một ảnh cho các phân hệ để giữ nhất quán; không tự gán ảnh có nghĩa như dữ liệu dự án.

Nguồn: [Silas Baisch — Unsplash](https://unsplash.com/photos/aerial-view-of-person-at-the-boat-on-the-ocean-AyZk1HuLors), ảnh chụp DJI FC220, đăng04/06/2019. Trang nguồn ghi miễn phí theo [Unsplash License](https://unsplash.com/license). Preview tải ảnh trực tiếp từ images.unsplash.com; khi không có mạng header còn nền navy. Chưa thêm asset ảnh vào ứng dụng.

## Xem thử

- [Gallery tương tác](http://127.0.0.1:3111/index.html)
- [Tổng quan](http://127.0.0.1:3111/overview.html)
- [Popup nội dung Chấm công](http://127.0.0.1:3111/attendance-day.html)
- [Form Tạo dự án](http://127.0.0.1:3111/project-create.html)
- [Album đầy đủ](mobile-suite-review.md)

![Bộ thiết kế cập nhật](mobile-design/suite-board.png)

| Viewport | Tổng quan | Popup Chấm công | Form dự án |
| --- | --- | --- | --- |
| 390×844 | [Ảnh](mobile-design/overview-390x844.png) | [Ảnh](mobile-design/attendance-day-390x844.png) | [Ảnh](mobile-design/project-create-390x844.png) |
| 375×812 | [Ảnh](mobile-design/overview-375x812.png) | [Ảnh](mobile-design/attendance-day-375x812.png) | [Ảnh](mobile-design/project-create-375x812.png) |

## Kiểm tra và giới hạn

Chụp lại Calendar12 trường hợp và bộ phân hệ63 trường hợp tại390×844,375×812,320×740. Các báo cáo nằm trong [Calendar](mobile-design/verification.json), [bộ phân hệ](mobile-design/suite-verification.json), [biến thể](mobile-design/suite-extra-verification.json) và [tương tác](mobile-design/suite-review-checks.json). Báo cáo bổ sung [v3](mobile-design/update-verification.json) kiểm tra ảnh tải, tâm dialog, nav và tương tác popup.

Đây là kiểm tra thiết kế trong Edge/Playwright, không thay kiểm tra runtime/logic của ứng dụng MyOS. Chưa thử bàn phím và safe area trên iPhone thật. Các popup đã dựng đều chuyển giữa; các menu nhỏ ⋯ vẫn neo vào nút thao tác theo vai trò menu, không chuyển thành dialog.
