# Vùng giao diện cá nhân

Dự kiến layout.tsx chứa sidebar/header thống nhất cho Tổng quan, Lịch, Dự án, Ghi chú và Cài đặt; error.tsx xử lý lỗi nội dung.

Route group (private) không nằm trong URL và không tự tạo cơ chế bảo mật. Kiểm tra session/quyền ở DAL, action và API. Mọi dữ liệu chỉ thuộc người dùng đã xác thực.
