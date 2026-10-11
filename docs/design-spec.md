# MyOS mobile — Đặc tả thiết kế đích v2

**12/10/2026:** đã được cho phép code pilot Lịch v3; [báo cáo triển khai ứng dụng thật](calendar-implementation-review.md). Thiết kế các route còn lại chưa rollout.

**Cập nhật bản xem thử v3:** ảnh biển thật trong header, nav 56 px, dialog giữa màn hình. [Thông số và ảnh kiểm tra](mobile-design-update.md) thay quy định v2 về ba thành phần này; chưa sửa ứng dụng MyOS.

11/10/2026 · **Chờ duyệt bản thiết kế trước khi code tiếp.** Đây là đặc tả mới sau audit, thay spec của bản thử Lịch. [Quy tắc](design-rules.md) · [tokens](design-tokens.md) · [component map](component-map.md) · [ảnh bản đích](mobile-design-review.md).

## 1. Phạm vi

Đặc tả tại file này tập trung route /calendar, tab Lịch, gồm tháng/tuần, filters và sheet ngày. Theo yêu cầu mới, các màn còn lại đã có [đặc tả mở rộng](mobile-suite-spec.md) và [album](mobile-suite-review.md); mở rộng này chỉ là thiết kế. AppShell/nav v2 được thể hiện trong bản duyệt để có ngữ cảnh thống nhất, chưa rollout các phân hệ. Chấm công và form tạo/chỉnh sửa giữ nghiệp vụ; bản chi tiết thiết kế các trạng thái đó chưa được dựng. Không coi primitive rule là thiết kế hoàn chỉnh của mọi form.

R1/R2B dùng cho trục căn, nhịp lịch, hierarchy tháng → ngày → nội dung; R2D cho sheet; R3B cho nav ổn định. Giữ MyOS turquoise/navy/font/5 nhãn. Mẫu này không phải pixel-copy vì chưa có design source/DPR và chức năng MyOS khác ảnh. Tất cả đích là P; đo preview là Đ-preview.

## 2. Layout đích

~~~text
AppShell: header navy64 + safe top, title Lịch / account44
  Submodule tabs44: Lịch / Chấm công
  Main: gutter16, top16
    Month heading44: Tháng 10, 2026 trái / prev44 + next44 phải
    Gap8
    Options44: view Tháng/Tuần128 / scope summary flex / Search44 + Menu44
    [Filters nếu mở: label + search, date, group — một cột]
    Gap12
    Grid: weekday28 + 7 cột ×5/6 hàng48
    Gap24
    Day preview:
      Heading min44: ngày + count dưới / thêm44
      Gap12
      Một event đầu hiện có: time + title + chevron, min64
      Gap8 + Xem lịch trong ngày44
  Main reserve: nav actual height +26 +max(8,safe bottom)
  Bottom nav 5 mục: margin ngang10, dưới max(8,safe), min56
Overlay: scrim / sheet chứa đầy đủ events, close 44, Thêm nội dung44
~~~

Options gộp view và summary/tools thay hai hàng riêng trong bản thử. Summary không trở thành nút chọn nhóm mới; Search vẫn mở đủ search/date/select như hiện tại. Menu vẫn chứa actions theo state/group hiện tại: tạo/sửa/sao chép bộ lịch nếu phù hợp, xuất .ics, cài đặt. Prototype menu chỉ minh họa default không có group chọn.

Ảnh biển chỉ ở header; không thêm card calendar hoặc ảnh sau grid; grid đặt trực tiếp trên nền page. Preview bỏ vỏ card chung, giữ một event đầu và link mở sheet. Không tự đổi sang hiển thị tất cả mục trong preview. Event dùng surface trắng và time label màu nhóm, thay nền màu phủ toàn hàng; màu chữ time vẫn lấy quy tắc tương phản của dữ liệu thật, không hard-code từ sample. Event title bình thường ink, completed semantics/strike giữ nguyên. Chevron là affordance mở chi tiết, không button riêng.

Ngày selected = number circle 32 primary/white; today = underline + weight600. Khi selected cũng today, hai dấu cùng tồn tại. Đây là thay đổi P có chủ đích so với selected nền toàn ô của bản thử; không sao chép cam R1. Ngoài tháng dùng muted, vẫn thao tác được trong bounds. Dots max3 như hiện tại, không thêm badge đếm mới. Accessible name đọc đủ ngày/số mục; completed có trạng thái chữ cho assistive tech. Đầu tuần theo settings, sample Monday chỉ minh họa cấu hình hiện có.

## 3. Tọa độ baseline Đ-preview tại safe area0

| Vùng | 390 ×844 | 375 ×812 |
| --- | --- | --- |
| Header | y0,h64 | y0,h64 |
| Tabs | y64,h45 gồm divider | y64,h45 |
| Main/title tháng | x16,y125,w358,h44 | x16,y125,w343,h44 |
| Options | y177,h44 | y177,h44 |
| Grid tháng5 hàng | x16,y233,w358,h268 | x16,y233,w343,h268 |
| Day section | x16,y525,w358,h172 | x16,y525,w343,h172 |
| Nav | x10,y780,w370,h56 | x10,y748,w355,h56 |

Số đo [verification.json](mobile-design/verification.json). Month6 hàng cộng48, preview chuyển xuống573 và có thể cần cuộn; không ép5 hàng. Week1 hàng grid76, day sectiony333. Filter mở chèn form, gridy525/preview817; đây là trạng thái cuộn có chủ đích, không overlay đè calendar. Typography/tokens xem bảng riêng, không suy tọa độ CSS từ screenshot iPhone có browser chrome.

## 4. Responsive, safe area và text

- 375/390 dùng cùng layout; <360 options wrap summary xuống hàng, giữ trigger/icon44, gutter12. Cột320 rộng296/7≈42,3, row 48; không overflow toàn trang.
- <=700 giữ mobile breakpoint hiện có. Desktop/calendar FullCalendar không thay. Preview standalone hiển thị tối đa430 trên màn rộng chỉ để review, không phải spec desktop.
- Header + safe top; gutter max(token,safe-side); nav bottom max(8,safe-bottom); main reserve nav+26+max(8,safe-bottom). Không vẽ status bar, notch hoặc toolbar Safari.
- Nội dung dài theo flow, month/title/actions có thể tăng chiều cao; không dùng truncation cho h1/action. Meta không nhỏ hơn12. Grid ngày không scale theo poster.
- Sheet max100dvh trừ32 và safe-top/bottom, padding16 +safe; body cuộn; scrim khóa nền; focus trap/return/Escape dùng Radix hiện hữu lúc code. Trạng thái bàn phím cần kiểm tra thực, không mặc định coi dVH giải quyết tất cả.

## 5. Hành vi và trạng thái bắt buộc giữ

Chọn ngày vẫn chọn + mở sheet; prev/next vẫn tháng/tuần theo view; Search vẫn filter chung events/description/group/date; menu vẫn tùy trạng thái; thêm vẫn mở form hiện có; event vẫn mở chi tiết/edit; tuần vẫn chỉ7 ngày. Preview không tạo store/selector nghiệp vụ mới. Form giữ recurrence/end exclusive/links/version checks, không sửa save contract.

Loading: dùng trạng thái module hiện tại; error hiển thị thông báo + retry thật, action disabled theo nguồn; empty ghi Chưa có nội dung cho ngày này và vẫn cho thêm khi được phép. Không placeholder fixture masquerade data. Các trạng thái lỗi/loading/empty có quy tắc nhưng chưa có ảnh duyệt v2, là việc cần bổ sung khi chuyển sang code/QA.

Prototype là tài liệu review: tháng10/ngày11/nội dung đi chơi, IELTS, KHTN cố định lấy từ ảnh cũ. Chỉ mô phỏng view/filter/sheet; không API/database/auth/save. Chuyển route/tài khoản/edit/thêm hiển thị giải thích giới hạn; không phải chức năng app đã hoàn thành. Không dùng HTML preview như source production.

## 6. Các phân hệ khác

Áp quy tắc D01–D14 khi từng màn được duyệt. Tổng quan, Ghi chú, Dự án, Cài đặt và Chấm công đã có bản đích tại [spec mở rộng](mobile-suite-spec.md), các số đo ở suite-verification.json. Tổng quan giữ dải4 số, không quy định2×2 như spec cũ. Library card bỏ chiều cao cố định theo nội dung, form giữ chức năng. Không triển khai chúng trong pilot.

## 7. Gate tiếp theo

Duyệt đồng thời: shell navy/title 22, options compact, grid row 48 + selectedcircle 32, preview mở + rowtime có màu, nav5 nhãn12 và sheet. Sau duyệt mới code một màn, chạy app thật/chụp390 × 844/375 × 812, so với **bản đích v2** và spec; kiểm tra actions/mainflows/runtime rồi báo sai lệch. Không coi kiểm tra PNG preview là hoàn thành implementation hoặc runtime QA của MyOS.
