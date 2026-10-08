# 007 — Lịch tháng/tuần và chấm công trong phân hệ Lịch

Ngày: 08/10/2026. Theo phạm vi người dùng đã duyệt, thay giao diện Lịch/Công việc trước đây bằng Lịch/Chấm công. Không thêm phân hệ thứ sáu.

## Quyết định

- Lịch chỉ còn FullCalendar dayGridMonth/dayGridWeek. Mỗi ô ngày mở lựa chọn lịch hẹn, công việc hoặc ghi chú; tuần dùng bảy cột ngày để xem và nhập nội dung từng ngày. Không còn lưới năm, lịch ngày hay danh sách. Giữ groups, chuỗi tuần, ngoại lệ, liên kết, kéo đổi ngày và xuất `.ics` hiện hữu; sửa giờ qua form.
- `entryKind` trong CalendarEvent/Occurrence là appointment/task/note, default appointment để đọc dữ liệu cũ mà không ghi lại cả kho. Ngoại lệ có thể override entryKind như các trường nội dung khác. Ghi chú trên ô ngày là nội dung nhẹ thuộc Calendar, không nhân bản tài liệu rich text của Ghi chú; liên kết tới Ghi chú hiện hữu vẫn dùng noteIds. Ghi chú không gây cảnh báo trùng giờ.
- Cột Hôm nay/Sắp tới dùng occurrence từ nguồn Calendar; không có kho tổng hợp hoặc dữ liệu giả. Nhóm/bộ lịch vẫn quản lý qua menu; không chuyển nhóm cũ thành công việc chấm công.
- Chấm công có tối đa 50 loại công việc, mỗi loại có tên/màu. Mỗi công việc/tháng có một bảng riêng, identity `activityId_YYYY-MM`. Tối đa một bản ghi/ngày, trạng thái done/rest; không có bản ghi nghĩa là chưa chấm. Giờ là tùy chọn nhưng phải có đủ bắt đầu/kết thúc trong cùng ngày; note tối đa 2.000 ký tự. Chưa hỗ trợ nhiều ca trong một ngày hoặc ca qua đêm.
- Thao tác trên bảng sửa bản nháp; Lưu chấm công ghi nguyên tử cả tháng với expectedVersion. Không tự lưu mỗi ô. Khi lỗi/conflict giữ bản nháp, có tải bản mới với xác nhận. Đổi công việc/tháng/tab hoặc rời trang có xác nhận khi có thay đổi chưa lưu. Nháp chỉ ở bộ nhớ, không phải bản sao lưu.
- Tổng kết tính ngày đã thực hiện/nghỉ/chưa chấm và tổng giờ đã nhập; ngày chưa chấm gồm cả ngày tương lai. Không coi chúng là vắng hoặc còn thiếu vì chưa có lịch dự kiến/định mức. Tổng kết thể hiện rõ khi đang tính cả nháp.
- Local database v5 thêm attendanceActivities/attendanceMonths, giữ nguyên stores/Blob cũ. Repository kiểm tra activity tồn tại và version trong cùng transaction. Firebase dùng collections tương ứng dưới users/{UID}; UID lấy từ phiên, Admin API validate schema, identity, activity sở hữu và version trong transaction. Tháng được đọc bằng id cụ thể; không tải toàn bộ lịch sử tháng.
- SWR dùng hai nguồn mới, cache riêng theo tài khoản; canonical sau commit cập nhật đúng key. Không cache CDN hoặc ghi credentials vào source. Rules deny-all và cơ chế session/CSRF hiện hữu tiếp tục áp dụng.

## Kiểm chứng

`attendance.spec.ts`: tạo nội dung từ ô tháng/tuần, tìm kiếm, reload; chấm nhiều ngày/giờ/note, lưu chủ động, độc lập công việc/tháng, giữ nháp khi storage lỗi hoặc tab khác cập nhật, schema ngày nhuận/tháng/giờ. `firebase.spec.ts`: lưu tháng, conflict, tài khoản khác không đọc/ghi được, schema sai bị từ chối, lỗi mạng giữ nháp rồi thử lại. Calendar/Workspace giữ hồi quy lịch lặp, liên kết, copy, `.ics`, kéo/rollback và nâng database.
