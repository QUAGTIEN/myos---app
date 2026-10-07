# 006 — Tài khoản tự đăng ký và dữ liệu Firestore

Ngày: 07/10/2026. Phạm vi người dùng duyệt: G2 bước 1–5; Vercel do người dùng deploy. Không Storage, Zalo, worker hoặc migration local/cloud.

## Quyết định

- Firebase Authentication Email/Password: đăng ký công khai, đăng nhập, quên mật khẩu và đăng xuất. Không allowlist/accessGrants, không phân cấp admin-users. Chưa yêu cầu email_verified để dùng ứng dụng; chưa có Google login.
- Web Auth dùng inMemoryPersistence, đổi ID token mới thành phiên server rồi signOut SDK. Cookie HttpOnly, SameSite=Lax, Secure trên HTTPS: 2 giờ khi không ghi nhớ (cookie phiên browser), 5 ngày khi ghi nhớ. Phiên gồm Firebase session cookie và nonce ngẫu nhiên; server lưu hash/expiry dưới UID để thu hồi riêng từng phiên khi logout. Không lưu mật khẩu/token vào localStorage.
- Private layout kiểm tra phiên, nhưng API luôn tự xác thực lại, kiểm tra thu hồi/vô hiệu hóa, lấy UID từ Auth. `/api/auth` tạo/xóa phiên; `/api/data` đọc/ghi. Ghi yêu cầu Origin cùng trang và token CSRF đối chiếu cookie HttpOnly. Response no-store/private, không log nội dung cá nhân hoặc credentials.
- Giữ service/form/hook G3–G5. Repository HTTP gọi API thay vì IndexedDB trong cloud. API xác thực + Zod + quy tắc nghiệp vụ và Firestore transaction. Route Handler phù hợp repository client hiện hữu, tránh tạo Server Action chỉ làm proxy cho cùng HTTP boundary. Mã Admin và DAL đánh dấu server-only.
- Chỉ server Admin truy cập Firestore: Rules deny-all đối với browser, kể cả UID sở hữu. Admin bỏ qua Rules nên ownership bắt buộc kiểm tra tại server; đường dẫn do server dựng từ UID session, không nhận UID từ client.
- `users/{uid}` là hồ sơ (tên, email, timezone Việt Nam, đầu tuần, version/timestamps). Subcollections: projects, notes, calendarEvents, calendarSettings; sessions và notes/{id}/revisions phục vụ nội bộ. Dữ liệu canonical được Zod validate, timestamps UTC ISO do server tạo, lịch wall-clock vẫn theo ADR 004.
- Documents lưu JSON `payload` để rich content không vượt giới hạn nesting Firestore; tắt index payload. ID dùng documentId, truy vấn 250 mục/trang với cursor; tải đầy đủ tối đa 5.000 mục và 3 MB rồi báo lỗi rõ thay vì âm thầm thiếu dữ liệu. Chưa phải pagination cloud UI hoặc full-text search; cần phát triển khi dữ liệu lớn.
- Ghi kiểm tra expectedVersion trong transaction. Note/project và event/project reciprocal links nguyên tử; ID liên kết phải cùng UID. Server không nhận các relatedIds hoặc revisions do client làm nguồn canonical. Sao chép bộ lịch nguyên tử, tối đa 400 sự kiện/lần, bỏ liên kết/trạng thái hoàn thành nguồn.
- Notes giữ tối đa 20 revisions trong subcollection, tối đa tổng response note 2,5 MB; bản cũ nhất được bỏ khi vượt ngân sách. Mỗi payload tối đa 800.000 byte UTF-8, body ghi tối đa 2 MB. Giới hạn này giữ document/response tương thích Firestore và Vercel. Lỗi giữ bản nháp; nháp vẫn ở bộ nhớ trang, không phải backup offline.
- Không upload cloud ở lượt này; các nút ảnh/tệp disabled, backend từ chối metadata/node ảnh. Ảnh đồng hồ gốc là asset giao diện công khai, không phải ảnh ghi chú. Không mở Firebase Storage hoặc tạo metadata ảnh giả.
- Local giữ nguyên IndexedDB v4 và Blob, chỉ dùng khi `NEXT_PUBLIC_MYOS_MODE=local`, không tự đọc hoặc nhập local khi đăng nhập cloud. Đổi NEXT_PUBLIC phải build lại; cloud lỗi không fallback vào kho local.
- Cập nhật giữa thiết bị bằng đọc lại khi mở/focus/reload; không listener realtime, không polling nền. Version conflict vẫn bảo vệ bản đã lưu trên server.

## Cấu hình và kiểm chứng

Firebase Web config không thay thế Admin credentials. Local dùng `GOOGLE_APPLICATION_CREDENTIALS` tới JSON; Vercel dùng FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL và FIREBASE_PRIVATE_KEY phía server. Console cần Email/Password, Firestore Standard Native `(default)`, Authorized domains và Rules deny-all. Không commit credentials, không deploy/bật billing tự động.

`pnpm test:firebase` chỉ demo-myos với cả Auth/Firestore Emulator, env riêng, không gọi project thật. `pnpm test:local` build và chạy suite hồi quy IndexedDB riêng. CI có Java 21 và hai suite. Project thật chỉ xác nhận hoạt động sau khi có credentials và thử kết nối thực; kiểm thử Emulator không thay bước đó.

Tham chiếu: [Firebase session cookies](https://firebase.google.com/docs/auth/admin/manage-cookies), [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), [Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure).

Kiểm chứng 07/10/2026: 77 hồi quy local đạt (7 skip chủ đích), 6 E2E Emulator desktop/mobile đạt; lint/typecheck/format/build đạt. pnpm-workspace.yaml khóa grpc-js 1.14.5 cho Firestore SDK và uuid 11.1.1 cho gaxios 6 theo [grpc advisory](https://github.com/advisories/GHSA-m9gg-hp2v-232j) và [uuid advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq); production audit sạch. Java trên Windows dùng đường dẫn tạm thực trong .firebase để tránh lỗi AF_UNIX với TEMP dạng 8.3; chỉ áp dụng tiến trình kiểm thử.
