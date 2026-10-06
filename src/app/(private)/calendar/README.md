# Route /calendar — Lịch

G5: server page cấp ngày hôm nay theo Việt Nam và validate query ID liên kết; chưa có xác thực (G2 hoãn). Client đọc IndexedDB, xử lý tháng/tuần/ngày/danh sách, chọn ô, form, kéo/resize, chuỗi tuần/ngoại lệ và download .ics. Layout tải CSS module.

FullCalendar 6.1.21 và Luxon 3.7.2 đã cài. Reminder chỉ là cấu hình; thông báo/Zalo chờ G7. Source quy tắc và repository ở src/modules/calendar, không nằm trong page.
