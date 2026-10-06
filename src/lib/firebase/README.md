# Firebase SDK

Đã có client.ts/admin.ts để đọc và validate cấu hình browser/server, chưa cài hoặc khởi tạo SDK. admin.ts đánh dấu server-only. G2 sẽ cài SDK và thêm Application Default Credentials ở server; các màn hình G1 chưa gọi Firebase.

Chưa có project ID, credential hay kết nối Firebase. Không đưa Admin key vào biến NEXT_PUBLIC.
