# MyOS — Triển khai màn Lịch theo thiết kế v3

12/10/2026. Đây là screenshot ứng dụng Next.js chạy thật ở chế độ local, khác với HTML thiết kế tại port3111. Route `/calendar` là màn triển khai đầu tiên; chưa rollout Tổng quan, Ghi chú, Dự án hoặc Cài đặt. Shell của route Lịch cũng dùng khi chuyển sang tab Chấm công; bảng và cơ chế tự lưu Chấm công giữ hiện tại.

[Mở ứng dụng local](http://127.0.0.1:3100/calendar) · [Bản thiết kế để đối chiếu](mobile-design-update.md).

## Screenshot thực tế

Ảnh được chụp từ browser test riêng, seed ba lịch cả ngày “đi chơi”, “IELTS”, “KHTN” qua schema/service hiện hữu vào IndexedDB của browser test. Không thêm fixture vào sản phẩm hoặc thay dữ liệu tài khoản. Khi mở ứng dụng ở browser riêng, nội dung là dữ liệu local của browser đó.

| Trạng thái | 390×844 | 375×812 | 320×740 |
| --- | --- | --- | --- |
| Tháng | [Ảnh](calendar-implementation/month-390x844.png) | [Ảnh](calendar-implementation/month-375x812.png) | [Ảnh](calendar-implementation/month-320x740.png) |
| Tuần | [Ảnh](calendar-implementation/week-390x844.png) | [Ảnh](calendar-implementation/week-375x812.png) | [Ảnh](calendar-implementation/week-320x740.png) |
| Bộ lọc | [Ảnh](calendar-implementation/filters-390x844.png) | [Ảnh](calendar-implementation/filters-375x812.png) | [Ảnh](calendar-implementation/filters-320x740.png) |
| Nội dung ngày | [Ảnh](calendar-implementation/day-390x844.png) | [Ảnh](calendar-implementation/day-375x812.png) | [Ảnh](calendar-implementation/day-320x740.png) |
| Form lịch hẹn | [Ảnh](calendar-implementation/create-390x844.png) | [Ảnh](calendar-implementation/create-375x812.png) | [Ảnh](calendar-implementation/create-320x740.png) |
| Cuối form | [Ảnh](calendar-implementation/create-bottom-390x844.png) | [Ảnh](calendar-implementation/create-bottom-375x812.png) | [Ảnh](calendar-implementation/create-bottom-320x740.png) |

## Đã khớp và điều chỉnh sau đối chiếu

- Header64, title22/28/600, avatar44; đúng ảnh biển và lớp navy của bản v3. Ảnh được lưu trong public để ứng dụng không phụ thuộc CDN ảnh lúc chạy.
- Nav56 ở375/390, icon18, nhãn11/16, radius18, margin ngang10 và dưới8; active không nhảy vị trí. ResizeObserver đo chiều cao nav để reserve cuối trang theo chiều cao thực khi nhãn xuống dòng.
- Gutter16; tháng18/26; nhóm Tháng/Tuần rộng128 và cao44; scope và search/menu cùng hàng. Dưới360 summary xuống hàng.
- Grid7 cột, weekday28, row48, vòng selected32, dot4 tối đa3; today underline theo ngày thực. Grid y233, preview y525 tại375/390 như spec.
- Preview không còn vỏ card chung; title16/24 và số mục12/18, row64, time72, chevron18. Hai màu nhóm mặc định turquoise/blue có badge nhạt; màu tùy chỉnh khác giữ nền và quy tắc tương phản hiện hữu.
- Dialog nằm giữa theo cả hai trục, góc16, margin16; danh sách dài cuộn. Form lịch hẹn giữ đủ fields/recurrence/liên kết/version checks; trường nhập cuộn riêng, header và actions còn thấy được.
- Trong lần kiểm tra đầu, lịch lệch xuống16 px do padding route và gap mặc định của Tabs; đã sửa. Fieldset của form dài có nội dung tràn lên footer; đã thêm vùng cuộn bao ngoài fieldset và chụp lại.

## Sai lệch và giới hạn còn lại

- Bản tham khảo cố định11/10/2026; ứng dụng đánh dấu Hôm nay theo ngày Việt Nam thực, nên underline khác khi chụp ngày12/10. Không sửa ngày hệ thống để giả khớp.
- Dấu chấm phản ánh ba event fixture, không sao chép các event chưa có từ screenshot. Avatar “M” là không gian local; chữ “P” trong prototype là mẫu.
- Form tạo lịch hẹn có các trường nghiệp vụ thật nhiều hơn form robot tham khảo; native date/time còn cách hiển thị của trình duyệt. Không bỏ trường hoặc bịa control để giống ảnh.
- Màu lịch tùy chỉnh được giữ như dữ liệu người dùng; không ép thành màu pastel của fixture. Đây là khác biệt có chủ đích để giữ tương phản.
- Đã kiểm tra Edge/Chromium mobile và desktop ở chế độ local. Chưa kiểm tra bàn phím/safe area trên iPhone thật hoặc cloud với tài khoản thực. Logic Auth/Firestore/service/repository không thay đổi.
- Trong kiểm tra cuối có một lần React báo hydration mismatch (#418) ở390. Chạy lại riêng đạt,30 lượt tải/reload ở15 browser contexts không lỗi,10 lần lặp luồng390 cũng đạt. Chưa xác định nguyên nhân; không khẳng định đã sửa lỗi này. [Giải thích mã lỗi từ React](https://react.dev/errors/418).
- Không thiếu ảnh/icon cho màn đầu tiên: ảnh biển đã đóng gói và icon dùng Lucide hiện hữu. Tài sản nhận diện logo/favicon không nằm trong thay đổi này.

## File code thay đổi

- [globals.css](../src/app/globals.css): shell mobile scoped cho route Lịch.
- [app-shell.tsx](../src/components/app-shell.tsx): đánh dấu route rollout, đo nav để reserve đúng.
- [calendar.css](../src/modules/calendar/calendar.css): layout/sizing/tokens của lịch mobile và dialog.
- [mobile-calendar.tsx](../src/modules/calendar/components/mobile-calendar.tsx): hierarchy toolbar, label bộ lọc, time badge/chevron và số mục.
- [dialogs.tsx](../src/modules/calendar/components/dialogs.tsx): scope dialog theo route, vùng body; giữ focus/close/pending hiện hữu.
- [event-form.tsx](../src/modules/calendar/components/event-form.tsx): vùng cuộn fields, không thay state/submit/validation.
- [calendar-screen.tsx](../src/modules/calendar/components/calendar-screen.tsx): thuộc thay đổi pilot trước, giữ `data-calendar-view` cho trạng thái tab; không thêm nghiệp vụ trong lượt này.
- [Ảnh biển](../public/images/mobile-ocean.jpg): Silas Baisch / Unsplash, nguồn và giấy phép trong README.

Kiểm tra: [mobile.spec.ts](../tests/e2e/mobile.spec.ts) cập nhật kỳ vọng dialog giữa; [calendar-design.spec.ts](../tests/e2e/calendar-design.spec.ts) kiểm tra responsive, screenshot, hình học/dialog/focus/form footer. Báo cáo đo: [390](calendar-implementation/measurements-390.json), [375](calendar-implementation/measurements-375.json), [320](calendar-implementation/measurements-320.json).

Lint, typecheck và production build local đã qua. Bộ hồi quy có **38 ca đạt, 18 ca bỏ qua theo project mobile/desktop có chủ đích, không có ca lỗi**. Các kiểm thử gồm tạo/sửa/hoàn thành/hủy lịch, chuỗi tuần, export ICS, xung đột/version, lỗi storage, liên kết và desktop drag; Chấm công kiểm tra tự lưu/nháp/xung đột/xóa; shell kiểm tra điều hướng/bàn phím và không tràn ngang. Sau chỉnh kích thước icon và input cuối cùng, chạy lại sáu ca mobile: năm ca đạt ngay; một ca320 gặp lỗi Windows khi ghi PNG (không phải assertion/runtime) và đã chạy riêng lại đạt. Sau bổ sung mô tả popup và nút Thêm nội dung toàn chiều rộng, kiểm tra375/320 và ba luồng mobile đạt; ca390 ghi nhận lỗi hydration lẻ nêu ở giới hạn, sau đó chạy riêng lại và10 lần lặp đều đạt. Toàn bộ screenshot và số đo trong album là bản cuối.

Lệnh xác minh:

```text
pnpm check
NEXT_PUBLIC_MYOS_MODE=local pnpm build
PLAYWRIGHT_CHANNEL=msedge pnpm exec playwright test tests/e2e/calendar-design.spec.ts tests/e2e/mobile.spec.ts tests/e2e/calendar.spec.ts tests/e2e/attendance.spec.ts tests/e2e/shell.spec.ts --workers=2
```

Biến môi trường được đặt trong process chạy kiểm tra; không chỉnh `.env.local`. Không deploy.
