# ADR 004 — Lịch, thời khóa biểu và export local

Ngày: 06–07/10/2026. Trạng thái: đã áp dụng G5, G2 tiếp tục hoãn theo yêu cầu người dùng.

## Quyết định

- FullCalendar 6.1.21 (React/daygrid/timegrid/list/interaction/luxon3), Luxon 3.7.2 và Zod; khóa phiên bản v6 tương thích React 19, chưa chuyển major v7 trong lượt này. Thao tác MyOS dùng Lucide.
- `recurrence.ts` mở rộng chuỗi tuần hữu hạn theo khoảng nhìn thấy; FullCalendar nhận các occurrence. Chưa cần RRule plugin, RRULE chỉ được tạo khi export.
- Database version 3 thêm `calendarEvents`, `calendarSettings`, giữ nguyên Projects/Notes/attachments. Repository interface tách storage khỏi service. Hủy lịch là soft cancellation; chưa có thùng rác lịch.
- Ghi có kiểm tra version trong transaction, chỉ báo thành công sau commit. BroadcastChannel/custom event/focus cập nhật tab. Form lỗi giữ nháp; kéo/resize gọi revert nếu lưu lỗi.
- Giờ Việt Nam cố định Asia/Ho_Chi_Minh. Giờ hẹn lưu wall-clock `YYYY-MM-DDTHH:mm`, cả ngày `YYYY-MM-DD`, metadata UTC ISO. End exclusive, form cả ngày hiển thị ngày cuối inclusive. Không dùng timezone hệ điều hành.
- Ngày 2000–2100 (Việt Nam UTC+7), lịch đơn tối đa 31 ngày, buổi lặp tối đa 7 ngày, chuỗi tối đa 5 năm có kết thúc bắt buộc. Các thứ lặp bao gồm thứ DTSTART. Query nhìn lùi 31 ngày để giữ event giao đầu khoảng, cũng xét ngoại lệ có ngày gốc ngoài khoảng.
- Original occurrence key là start wall-clock gốc. Ngoại lệ giữ snapshot và `fields` thực sự đổi; hoàn thành chỉ override `completed`, nên sửa tên toàn chuỗi vẫn áp dụng cho buổi hoàn thành. Đổi thời gian/chế độ cả ngày/repeat của master đặt lại ngoại lệ sau xác nhận.
- Kéo/resize chuỗi chỉ đổi buổi đã kéo. Đổi chế độ cả ngày của chuỗi qua sửa toàn chuỗi. Giờ hiển thị có thể ẩn phần lịch ngoài giờ đã chọn; mặc định 00:00–24:00.
- `reminderMinutes` lưu cùng event version. Không có worker/timer gửi thông báo hoặc gọi Zalo; mặc định nhắc trong settings áp dụng cho lịch mới.

## Liên kết

Calendar repository ghi event và Project.relatedEventIds nguyên tử, tăng project version/history khi liên kết đổi. Không sửa hạn hoặc tiến độ mốc. sourceMilestone là nguồn tạo; xóa mốc sau đó không xóa lịch. Dự án lưu trữ không nhận liên kết mới, lịch cũ vẫn dùng được.

Notes không thêm bản sao eventIds; Lịch liên quan đọc từ Calendar và mở đúng occurrence. Trash/xóa note không xóa lịch; UI báo liên kết không còn khả dụng, người dùng có thể bỏ liên kết. Ghi kiểm tra liên kết mới còn tồn tại. Các module không gọi vòng service; repository dùng model contracts.

## Export

Download `.ics` theo khoảng ngày/nhóm, tối đa 367 ngày. Giữ UID master, SEQUENCE, RRULE tuần hữu hạn, EXDATE cho các buổi hủy/ngoài bộ lọc, RECURRENCE-ID cho ngoại lệ. DTSTART/DTEND có TZID hoặc VALUE=DATE, VTIMEZONE UTC+7 phù hợp giới hạn ngày ứng dụng. Nhắc/hoàn thành dùng X-MYOS, không tự thêm VALARM. Escape TEXT, CRLF và fold tối đa 75 UTF-8 octets, không cắt ký tự tiếng Việt.

Giữ DTSTART gốc để giữ identity ngoại lệ, dùng EXDATE thay đổi phạm vi xuất; chuỗi hữu hạn nên danh sách này hữu hạn. File là bản chụp; nhập bản xuất mới với cùng UID có thể thay bản trước tùy trình lịch. Chưa có import vào MyOS hoặc Google sync.

## Kiểm chứng và giới hạn

Domain tests kiểm tra timezone/qua đêm/end exclusive, ngoại lệ chuyển trước chuỗi, validation, inheritance và reset. Parser ical.js độc lập kiểm tra RRULE/EXDATE/RECURRENCE-ID, cả ngày, Unicode và group filter. E2E kiểm tra form/views/reload, trùng giờ, hai tab, storage failure, links, download, settings và kéo/resize. Chưa nhập bằng tài khoản Google/Outlook thật; parser là mức kiểm chứng hiện tại.

Local data theo browser/origin; `.ics` không backup Projects/Notes/ảnh. Chưa có quyền tài khoản, server export, migration hay cloud sync. Lặp ngày/tháng, in/PDF và sửa từ buổi này trở đi thuộc G8. Firestore/worker phải thiết kế query overlap/index, canonical UTC timestamps, exception/job versions và migration trước khi triển khai.

Tham chiếu: [FullCalendar React](https://fullcalendar.io/docs/react), [Luxon](https://moment.github.io/luxon/), [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545.html).
