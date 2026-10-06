# Lịch

Ca sử dụng: tạo/sửa lịch hẹn, thời khóa biểu lặp tuần, ngoại lệ, nhóm màu, đánh dấu, nhắc và xuất .ics.

G5 đã triển khai local, G2 hoãn. `model.ts` Zod/timezone; `recurrence.ts` mở rộng tuần hữu hạn/ngoại lệ; `service.ts` mutations; `repository.ts` IndexedDB version 3 và liên kết Projects nguyên tử; `ics.ts` iCalendar; `use-calendar.ts` đọc/error/cập nhật tab; `components` FullCalendar, form, chi tiết, export, settings và lịch liên quan. CSS scoped `schedule-*`.

Việt Nam UTC+7; end exclusive, form cả ngày hiển thị ngày cuối inclusive. Chuỗi nhiều thứ tối đa 5 năm có ngày kết thúc, mỗi buổi tối đa 7 ngày. Exception giữ originalStart và chỉ override fields đã đổi. Đổi lịch gốc reset ngoại lệ sau xác nhận. Hủy soft, hoàn thành riêng từng buổi; lỗi/version conflict giữ nháp, kéo/resize rollback.

Xuất tối đa 367 ngày với UID/RRULE/EXDATE/RECURRENCE-ID/VTIMEZONE, Unicode folding 75 octets. Chỉ lưu reminder config, chưa gửi thông báo/Zalo. Lặp ngày/tháng, sửa từ buổi này trở đi, print/PDF còn G8. Không có Auth/cloud/migration. Xem [ADR G5](../../../docs/decisions/004-local-calendar.md) và hai test calendar trong tests/e2e.
