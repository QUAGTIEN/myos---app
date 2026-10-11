# Mobile: header, tabs, lịch, popup và nhập liệu — 12/10/2026

Triển khai theo5 điểm người dùng xác nhận. Giữ màu/font MyOS, toàn bộ dữ liệu, schema, service/repository và xác thực hiện có.

## Đã sửa

1. Header mobile ở vị trí sticky trong flow, ẩn khi cuộn xuống/hiện khi cuộn lên sau18 px; không thay reserve hoặc làm nhảy nội dung. Chuyển động180 ms, tắt theo reduced motion. Không ẩn khi focus header/đang nhập hoặc có dialog. Reset khi đổi route, bỏ listener khi unmount. Desktop giữ header cũ.
2. Tổng quan:3 tab dùng segmented control với nút44 px; cách khối bên dưới16 px. Panel Lịch trong ngày có đủ viền và radius, không dính vào tab. Handler chọn nội dung và số liệu thật giữ nguyên.
3. Lịch: phần ngày được chọn thành disclosure có aria-expanded/aria-controls, mặc định thu; ngày/count và chevron ở cùng trigger, nút thêm độc lập. Mở preview vẫn thấy sự kiện đầu và nút mở danh sách đầy đủ. Chạm ô ngày giữ popup đầy đủ. Sau grid cách16 px, divider1 px và padding-top12 px; không thêm card/ảnh/màu mới. Lịch tháng/tuần, dấu ngày và dữ liệu không đổi.
4. Popup tạo/sửa lịch và dự án: rộng tối đa360 px, trừ40 px ở viewport thông thường; cao tối đa78dvh trừ safe area. Padding12 px, heading18/26, khoảng dưới heading8 px. Vùng nhập tự cuộn, footer và nút đóng giữ riêng. Giữ Radix/focus trap/return focus/Escape, pending, validation và giữ nháp. Sửa cả CSS cũ ép project modal xuống bottom sheet.
5. Chữ ô nhập/select/textarea/contenteditable tối thiểu16 px ở viewport<=700 hoặc pointer coarse, bao phủ login/register/forgot-password, portal lịch/dự án và editor ghi chú. Tiêu đề ghi chú vẫn21 px. Không đặt maximum-scale/user-scalable=no; người dùng vẫn pinch zoom chủ động. Không thêm script ép reset zoom hoặc chặn thao tác cảm ứng.

## File code

- `src/components/app-shell.tsx`: header theo hướng cuộn.
- `src/app/globals.css`: sticky/header states, reduced motion, cỡ chữ ô nhập trên mobile/touch.
- `src/modules/overview/overview.css`: cụm tab và khoảng cách tới panel.
- `src/modules/calendar/components/mobile-calendar.tsx`: disclosure ngày.
- `src/modules/calendar/calendar.css`: disclosure, popup và nhịp form gọn.
- `src/modules/projects/components/project-dialog.tsx`: wrapper cuộn giữ footer.
- `src/modules/projects/projects.css`: popup giữa màn hình/kích thước và spacing.

README, spec/tokens/component-map có bổ sung theo yêu cầu này. Không sửa file môi trường, không deploy Vercel, không thêm dependency/asset.

## Kiểm tra và giới hạn

Tổng55 trường hợp riêng biệt đạt,11 bỏ qua theo phạm vi desktop/mobile; các lỗi được phát hiện trong quá trình sửa đã kiểm tra lại đạt.

- `pnpm check` (lint + typecheck) và production build local đạt.
- Suite calendar-design/mobile/install/shell:24 đạt,11 bỏ qua đúng phạm vi. Ba test refinement phát hiện quy tắc project bottom sheet còn sót và đã giúp sửa vị trí.
- Suite Projects/Notes:28 đạt, gồm tạo/sửa, version conflict, thất bại lưu giữ nội dung, autosave, ảnh/thùng rác và liên kết dữ liệu trên desktop/mobile.
- Suite refinement sau sửa:3 đạt ở390×844,375×812,320×740; có tạo lịch, tạo dự án, nhập/lưu ghi chú; kiểm tra cỡ chữ auth khi xoay844×390 và trên register/forgot-password. Không có pageerror ở các lượt refinement đạt.
- Header thực sự ra khỏi viewport khi cuộn xuống và trở về khi lên; thử jitter6 px, focus và chuyển route. Bề mặt cuộn dài được thêm trong browser test riêng để kiểm tra với kho trống.
- Popup lịch/dự án có tâm đúng giữa và nằm trong viewport; resize chiều cao480 px để kiểm tra hình học khi khung nhìn thấp. Đây là mô phỏng viewport, không phải bàn phím Safari thật.
- Chụp/kiểm tra ảnh từ ứng dụng chạy thực bằng Edge Chromium mobile emulation. Phần ảnh trống dùng kho browser test riêng; bộ3 lịch hẹn trong thư mục calendar là fixture kiểm thử, không dữ liệu tài khoản.
- Chưa kiểm chứng auto-focus zoom/bàn phím/standalone bằng iPhone thật. Bản sửa loại bỏ cỡ chữ dưới16 px là nguyên nhân ở source; hành vi Safari vẫn cần kiểm tra sau Vercel cập nhật. Không thay hay xóa dữ liệu để xử lý lỗi.

## Screenshot

| Trạng thái | 390×844 | 375×812 | 320×740 |
| --- | --- | --- | --- |
| Tổng quan | [Ảnh](mobile-refinements/overview-390.png) | [Ảnh](mobile-refinements/overview-375.png) | [Ảnh](mobile-refinements/overview-320.png) |
| Lịch thu gọn ngày | [Ảnh](mobile-refinements/calendar-collapsed-390.png) | [Ảnh](mobile-refinements/calendar-collapsed-375.png) | [Ảnh](mobile-refinements/calendar-collapsed-320.png) |
| Lịch mở ngày | [Ảnh](mobile-refinements/calendar-expanded-390.png) | [Ảnh](mobile-refinements/calendar-expanded-375.png) | [Ảnh](mobile-refinements/calendar-expanded-320.png) |
| Tạo lịch | [Ảnh](mobile-refinements/calendar-create-390.png) | [Ảnh](mobile-refinements/calendar-create-375.png) | [Ảnh](mobile-refinements/calendar-create-320.png) |
| Tạo dự án | [Ảnh](mobile-refinements/project-create-390.png) | [Ảnh](mobile-refinements/project-create-375.png) | [Ảnh](mobile-refinements/project-create-320.png) |
| Đăng nhập | [Ảnh](mobile-refinements/login-390.png) | [Ảnh](mobile-refinements/login-375.png) | [Ảnh](mobile-refinements/login-320.png) |

Ảnh lịch có3 mục, tháng/tuần/bộ lọc/popup ngày/form và cuối form: [thư mục kiểm tra](mobile-refinements/calendar/). Geometry baseline tháng5 hàng ở390 px: header64, grid y233/h268, disclosure y517/h57 khi thu, nav56; không tràn ngang. Baseline preview mở y525 trước đây đã thay theo yêu cầu mới, ảnh cũ vẫn ở calendar-implementation để đối chiếu lịch sử.
