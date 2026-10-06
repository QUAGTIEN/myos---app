# Hướng dẫn agent cho MyOS

## Phạm vi hiện tại

Người dùng hiện chỉ yêu cầu **bộ khung định hướng, chưa code**. Thư mục chứa README và tài liệu thiết kế. Không tự khởi tạo Next.js, viết TS/TSX, cài dependencies, thêm cấu hình chạy hoặc deploy cho đến khi người dùng yêu cầu bước lập trình.

Yêu cầu mới của người dùng có thể chuyển giai đoạn; khi đó thực hiện trong phạm vi được giao, không hỏi lại xác nhận chỉ vì đoạn hướng dẫn này. Không thêm phân hệ ngoài 5 phân hệ đã thống nhất.

## Đọc trước khi thay đổi

1. README.md: trạng thái thực tế.
2. MYOS_ARCHITECTURE.md: phạm vi sản phẩm và quyết định kiến trúc.
3. docs/SOURCE_MAP.md và README của thư mục đang làm: trách nhiệm và phụ thuộc.
4. docs/decisions/: quyết định bổ sung nếu có.
5. docs/IMPLEMENTATION_PLAN.md: thứ tự triển khai, phụ thuộc và tiêu chí hoàn thành.

AGENTS.md là tên file chuẩn để công cụ coding agent tìm thấy; không tạo một bản agent.md trùng nội dung.

## Công nghệ và phạm vi sản phẩm

- Framework: Next.js App Router; UI: React; ngôn ngữ: TypeScript.
- Database: Cloud Firestore; auth: Firebase Authentication.
- Ảnh/tệp: Cloud Storage for Firebase; host: Firebase App Hosting.
- Worker: Cloud Functions gen 2 và Cloud Scheduler; domain dùng chung.
- Chỉ có Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt.
- Tiếng Việt; timezone mặc định Asia/Ho_Chi_Minh; web responsive.
- Tìm kiếm, upload, thông báo và Zalo là khả năng bên trong 5 phân hệ.

## Ranh giới kiến trúc khi triển khai

- src/app điều phối route/layout và gọi service; không chứa mọi quy tắc nghiệp vụ trong page.
- src/modules chia theo nghiệp vụ. Mỗi module có components, actions, service, repository, schemas/types **khi cần**, không tạo lớp trống theo nghi thức.
- src/components chỉ chứa UI/layout dùng chung; không truy vấn Firestore.
- src/lib chứa hạ tầng và DAL xác thực phía web.
- packages/domain/src chứa TypeScript thuần, không phụ thuộc Next.js, React, Firebase Admin, secrets hoặc DOM.
- functions/src không import src/app hoặc UI. Logic domain dùng chung phải được bundle vào artifact worker.
- Module không gọi vòng nhau. Điều phối liên kết lịch/dự án/ghi chú qua service và hợp đồng dữ liệu rõ ràng.

Luồng đọc: Server Component → DAL/requireUser → service → repository → DTO.
Luồng ghi: form → Server Action → xác thực → Zod → service/transaction → repository.
Worker nhận job bằng transaction, gọi dịch vụ ngoài sau transaction.

## Next.js và TypeScript khi triển khai

- Page/layout mặc định là Server Components; chỉ dùng 'use client' cho phần tương tác cần thiết.
- Đánh dấu Firebase Admin, session và repository server bằng server-only.
- Route groups không thay URL; dùng Link cho điều hướng nội bộ.
- Root layout dùng html lang="vi"; layout vùng riêng có sidebar/header dùng chung.
- Dùng DTO có thể serialize qua ranh giới server/client; không truyền DocumentSnapshot, Admin SDK hay secrets.
- Đối chiếu API đúng phiên bản được khóa; params/searchParams xử lý theo API hiện hành.
- Có loading, empty, error và pending phù hợp; không dùng dữ liệu mẫu giả làm dữ liệu thật.
- TypeScript strict khi khởi tạo; hạn chế any, đặt tên mô tả nghiệp vụ, validate dữ liệu không tin cậy.
- Schema nghiệp vụ dùng chung đặt tại domain; schema form đặc thù ở module.
- Chọn bản stable tương thích Firebase App Hosting; không tự chuyển major framework trong thay đổi nhỏ.

## Dữ liệu, quyền và tích hợp

- Lấy UID từ session đã xác thực, không từ giá trị do client tự gửi.
- Kiểm tra quyền tại DAL, Server Action và Route Handler; layout/Proxy chỉ hỗ trợ điều hướng.
- Admin SDK bỏ qua Security Rules nên server phải kiểm tra quyền sở hữu.
- Browser trực tiếp dùng Firebase cho đăng nhập/upload; realtime chỉ thêm theo nhu cầu có rules rõ ràng.
- Không cache dữ liệu cá nhân ở CDN dùng chung. Không đưa secret hoặc nội dung riêng tư vào URL/metadata/log.
- Không commit key, credential, token hoặc file môi trường thật.
- Query Firestore có limit, indexes và cursor ổn định; không giả định có SQL/full-text search.
- Timestamp lưu nhất quán, đổi timezone tại ranh giới hiển thị; lịch lặp phải xử lý ngoại lệ/version.
- Autosave ghi chú cần chống ghi đè bản mới và giữ nháp khi lỗi.
- Không gọi Zalo hay gửi tin trong callback transaction vì callback có thể chạy lại.
- Tích hợp Zalo chỉ triển khai sau kiểm tra quyền gửi, phí và hạn mức thực tế; không dùng API không chính thức như một quyết định đã chốt.
- Không tạo cloud project, bật billing, deploy hoặc gửi tin thật chỉ vì đã tạo bộ khung.

## Kiểm tra và báo cáo

Ở giai đoạn tài liệu: kiểm tra đường dẫn, cấu trúc, link nội bộ và tính nhất quán; không chạy build/test giả khi chưa có project chạy được.

Khi có implementation: chạy lint, typecheck, build và kiểm thử phù hợp với thay đổi theo scripts thực tế trong package.json. Test logic lịch lặp, quyền truy cập, transaction và nhắc lịch bằng Emulator khi cần; tránh test chỉ sao chép implementation.

Báo rõ phần đã tạo, phần chưa triển khai và kết quả kiểm tra. Cập nhật MYOS_ARCHITECTURE.md, SOURCE_MAP và README liên quan khi đổi kiến trúc. Ghi quyết định có tác động vào docs/decisions; không viết lại tài liệu dài cho thay đổi giao diện nhỏ.
