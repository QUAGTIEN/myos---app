# HTTP endpoints

Route Handlers chỉ cho nhu cầu HTTP thật: session/logout, xuất .ics và ghép nối Zalo. Server Components gọi service trực tiếp thay vì HTTP vòng về API của chính ứng dụng.

Mỗi endpoint validate đầu vào, xác thực theo nhu cầu và kiểm tra quyền tài nguyên; chống CSRF cho thao tác session/cookie. Chưa có route.ts nào.
