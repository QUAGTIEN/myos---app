# Service worker

Điều phối jobs, ghép nối và vòng đời attachments khi cần. Đây là hạ tầng dùng chung, không là phân hệ thứ sáu.

Mọi tác vụ phải xét UID, version, khả năng retry và tác động đến dữ liệu gốc.
