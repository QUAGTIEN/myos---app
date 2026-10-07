# MyOS — Kế hoạch triển khai

Ngày lập: **06/10/2026**.
Trạng thái: **G2 bước 1–5 đã có source theo yêu cầu mới: đăng ký công khai/Auth/session/hồ sơ/Firestore; giữ local riêng. Vercel do người dùng deploy; ảnh/tệp cloud, Zalo và migration hoãn.** Xem [ADR 006](decisions/006-firebase-public-accounts.md).
Đây là kế hoạch toàn bộ dự án; chỉ các hạng mục ghi rõ đã hoàn thành mới có implementation.

Nguồn phạm vi: [MYOS_ARCHITECTURE.md](../MYOS_ARCHITECTURE.md).
Vị trí mã: [SOURCE_MAP.md](SOURCE_MAP.md).
Quy ước triển khai: [AGENTS.md](../AGENTS.md).

## 1. Chia bao nhiêu module?

**5 module nghiệp vụ**, đúng 5 mục trong giao diện:

| Module | Đường dẫn source | Màn hình | Trách nhiệm |
| --- | --- | --- | --- |
| Tổng quan | src/modules/overview | /dashboard | Lịch sắp tới, tiến độ dự án, ghi chú ghim, thao tác nhanh |
| Lịch | src/modules/calendar | /calendar | Lịch hẹn, thời khóa biểu, lịch lặp/ngoại lệ, đánh dấu, xuất lịch |
| Dự án | src/modules/projects | /projects và trang chi tiết | Nội dung, tiến độ, checklist/mốc, lịch và ghi chú liên quan |
| Ghi chú | src/modules/notes | /notes và trang chi tiết | Rich text, ảnh, autosave, tổ chức, liên kết, khôi phục |
| Cài đặt | src/modules/settings | /settings | Hồ sơ, tài khoản, timezone, giao diện, thông báo và dữ liệu |

Các phần kỹ thuật dùng chung không tạo thêm phân hệ trong giao diện:

| Phần dùng chung | Vị trí | Trách nhiệm |
| --- | --- | --- |
| Routing và khung UI | src/app, src/components | Layout, điều hướng, form/UI cơ sở, loading/error |
| Xác thực và Firebase | src/lib | Session, quyền, SDK, converters/DTO |
| Quy tắc nghiệp vụ | Hiện ở modules; packages/domain/src khi cần dùng chung web/worker | Schema, thời gian, lịch lặp, tiến độ, version, nhắc lịch |
| Tác vụ nền | functions/src khi triển khai worker | Job reminders, retry/lease, adapter Zalo, vòng đời tệp |

Kiến trúc là một ứng dụng Next.js theo phân hệ, có worker deploy riêng. Không tách mỗi module thành một service hoặc một repository độc lập.

## 2. Cách viết từng tính năng

Làm theo **luồng hoàn chỉnh**, từ dữ liệu tới thao tác người dùng, thay vì viết xong toàn bộ UI rồi mới ghép backend.

Mỗi tính năng đi qua các bước:

1. Chốt hành vi và tiêu chí hoàn thành, kể cả lỗi và dữ liệu trống.
2. Xác định schema, DTO, query/index, quyền và tác động tới dữ liệu liên quan.
3. Viết domain/service/repository cần thiết, không tạo lớp rỗng nếu chưa dùng.
4. Viết Server Action hoặc Route Handler, xác thực và validate đầu vào.
5. Gắn UI tương tác, trạng thái pending/loading/error, cập nhật sau lưu.
6. Kiểm tra luồng thật bằng Emulator và kiểm thử phù hợp.
7. Cập nhật tài liệu và bàn giao một phần dùng được trước khi chuyển tính năng.

Ngoại lệ G3 local: **Client Component → service → repository IndexedDB**, validate Zod và ghi có version trong transaction. Không cần Server Action/Emulator cho adapter trình duyệt.

Luồng cloud đích: **Server Component → DAL → service → repository → DTO → UI**.
Luồng ghi: **form → repository HTTP → Route Handler → session/quyền → validation → service → Firestore**.

Mỗi tính năng cần phân biệt rõ phần server và client. Firebase Admin chỉ ở server; quyền phải kiểm tra lại khi gọi action/API, không dựa duy nhất vào layout.

## 3. Thứ tự triển khai: 8 giai đoạn

**Thứ tự cập nhật: G1 → G3 → G4 → G5 → G6 → G7/G8 phần không phụ thuộc cloud → G2 → hoàn tất kiểm tra và triển khai cloud.** Giữ mã giai đoạn cũ để tham chiếu. Các chức năng worker, upload riêng tư và deploy vẫn cần G2; hoãn xác thực không loại bỏ phụ thuộc bảo mật này.

Tổng quan có trang khung từ đầu nhưng dữ liệu tổng hợp làm sau khi các module nguồn có dữ liệu thật. Cài đặt được bổ sung xuyên suốt khi các tính năng tương ứng xuất hiện.

### G1. Khởi tạo framework và khung giao diện

**Đầu vào:** bộ khung hiện tại.

**Công việc:**

- Chọn phiên bản stable Next.js/React/TypeScript tương thích Vercel.
- Khởi tạo Next.js ở root, giữ lại thư mục và tài liệu đã có.
- Tạo manifests pnpm workspace, TypeScript strict và scripts dev/build/lint/typecheck.
- Thiết lập UI cơ sở: màu, typography tiếng Việt, spacing, form, dialog, skeleton.
- Root layout, sidebar/header và menu mobile với đúng 5 mục.
- Tạo trang khung, login, not-found và error boundary; chưa giả lập dữ liệu như thật.
- Tách cấu hình Firebase browser/server, .env.example và .gitignore.
- Chuẩn bị CI cho checks thực tế, chưa tự deploy production.

**Bàn giao:** ứng dụng chạy local, đi được qua 5 màn hình khung.

**Hoàn thành khi:** build/typecheck/lint đạt; menu active đúng; giao diện desktop/mobile ổn; không có secrets trong mã client.

### G2. Đăng nhập, dữ liệu nền và Cài đặt cơ bản

**Phụ thuộc:** G1.

**Công việc:**

- Firebase Emulator Suite, bộ dữ liệu test và repositories cơ sở.
- Chốt schema users, account access, DTO và schemaVersion; thống nhất timestamp/timezone.
- Rules Firestore deny-all và indexes ban đầu; Storage hoãn.
- Triển khai một phương thức đăng nhập trước, mặc định email/password; thêm Google sau nếu cần.
- Endpoint /api/auth và /api/data, cookie an toàn, CSRF, UID và DAL requireUser.
- Kiểm tra UID tại read/action/handler; không tin UID từ form.
- Cài đặt: tên hiển thị, hồ sơ, timezone Việt Nam, ngày đầu tuần; giữ giao diện sáng.
- Luồng thay đổi thông tin tài khoản có xác thực lại khi triển khai phần nhạy cảm.
- Chuẩn bị cấu hình staging; kết nối cloud khi có project và cấu hình hợp lệ.

**Bàn giao:** người dùng được phép đăng nhập, xem/sửa hồ sơ và lưu tùy chọn.

**Hoàn thành khi:** dữ liệu/tùy chọn còn sau reload; người chưa đăng nhập bị chặn; hai UID không đọc/ghi chéo qua cả server và Rules; logout kết thúc phiên ở browser/server.

**Phạm vi mới:** chưa làm upload ảnh/tệp, Zalo hoặc deploy; không nhập local vào cloud. Vercel do người dùng triển khai.

### G3. Module Dự án

**Phụ thuộc cập nhật:** G1; G2 được hoãn. G3 dùng IndexedDB qua repository riêng theo [ADR 002](decisions/002-local-projects.md), chưa dùng Firestore.

**Thứ tự tính năng:**

1. Tạo/sửa/đọc dự án với tên, nội dung, trạng thái và hạn dự kiến.
2. Danh sách, lọc, phân trang local 12 mục, ghim và lưu trữ. Cursor cloud bổ sung khi chuyển Firestore.
3. Tiến độ thủ công 0–100%.
4. Checklist/mốc, chế độ tiến độ theo checklist và cập nhật lịch sử cần thiết.
5. Chuẩn bị ID/hợp đồng liên kết; UI lịch/ghi chú liên quan hoàn thành sau G4/G5.

**Bàn giao:** quản lý được dự án thực tế và theo dõi tiến độ.

**Hoàn thành khi:** CRUD và filter hoạt động; zero checklist không bị coi là 100%; chuyển chế độ tiến độ rõ ràng; lưu trữ không vô tình xóa nội dung hoặc lịch liên quan.

**Vị trí chính:** src/modules/projects. Quy tắc/schema thuần nằm tại model.ts, chỉ tách domain/progress khi cần dùng chung.

### G4. Module Ghi chú và tệp riêng tư

**Phụ thuộc cập nhật:** G3 và lưu local đã được người dùng chấp thuận. G2 hoãn; ảnh dùng IndexedDB Blob thay Firebase Storage, chưa có quyền tài khoản hoặc đồng bộ cloud. [ADR G4](decisions/003-local-notes.md).

**Thứ tự tính năng:**

1. Tạo/sửa/đọc ghi chú, tiêu đề và nội dung Tiptap JSON có version.
2. Autosave, trạng thái lưu, giữ bản nháp khi lỗi và xử lý conflict.
3. Lưu ảnh Blob local, metadata và node attachmentId; kiểm tra ảnh/kích thước. Storage cloud hoãn theo phạm vi G2 mới.
4. Tạo ghi chú từ ảnh hoặc nội dung dán; chọn ảnh trên mobile.
5. Ghim, thư mục/tag, tìm theo tiêu đề, thùng rác và khôi phục.
6. Gắn/mở ghi chú từ dự án; giữ attachment được tham chiếu khi khôi phục.
7. Revision/retention giới hạn; định nghĩa cleanup tệp upload dở/mồ côi.

**Bàn giao:** ghi chú văn bản và hình ảnh dùng hằng ngày, có xác nhận lưu đáng tin cậy.

**Hoàn thành khi:** ảnh tải lại được sau reload và đúng quyền; lỗi upload không tạo ảnh hỏng được báo đã lưu; hai phiên sửa không âm thầm ghi đè; xóa/khôi phục giữ nội dung và ảnh trong retention.

**Vị trí chính hiện tại:** src/modules/notes, src/lib/local-database.ts; liên kết dự án được điều phối ở Notes repository. Domain/Storage Rules còn là kiến trúc cloud đích.

### G5. Module Lịch và thời khóa biểu

**Phụ thuộc cập nhật:** G1, G3/G4; G2 hoãn. G5 triển khai local qua IndexedDB theo [ADR 004](decisions/004-local-calendar.md), gồm cả 3 phần bên dưới. Auth/cloud thực hiện ở G2, migration hoãn; nhắc hiện chỉ lưu cấu hình.

**G5.1 — Lịch một lần**

- Xem tháng/tuần/ngày/danh sách, chọn ngày và Hôm nay.
- Tạo/sửa/hủy event có giờ/cả ngày, nhóm/màu.
- Đánh dấu quan trọng/hoàn thành, cảnh báo trùng giờ.
- Kéo thả/đổi thời lượng; nếu lưu lỗi phải trả UI về trạng thái đúng.
- Query theo khoảng nhìn thấy, gồm event bắt đầu trước nhưng còn kéo dài vào khoảng.

**G5.2 — Thời khóa biểu lặp**

- Lặp tuần nhiều thứ, ngày hiệu lực và kết thúc.
- Series master, exceptions và original occurrence key.
- Sửa/hủy một buổi hoặc toàn chuỗi; nghỉ/đổi giờ riêng.
- Hoàn thành một buổi không hoàn thành cả chuỗi.
- Schema nhắc lịch và version để worker sử dụng ở G7.
- Lặp ngày/tháng và sửa từ một buổi trở đi bổ sung trong G8.

**G5.3 — Liên kết và xuất**

- Gắn dự án/ghi chú; tạo lịch từ mốc dự án nhưng giữ hạn mốc độc lập.
- Xuất .ics với UID, timezone, cả ngày và recurrence phù hợp.
- Xuất theo khoảng ngày hoặc nhóm, có kiểm tra quyền.
- Cài đặt nhóm lịch, giờ hiển thị và thời gian nhắc mặc định.

**Bàn giao:** đặt lịch và thời khóa biểu tuần, chỉnh ngoại lệ, xuất được lịch.

**Hoàn thành khi:** timezone/cả ngày/qua đêm đúng; chuỗi có giới hạn không sinh document vô hạn; sửa một buổi không đổi buổi khác; .ics nhập được vào trình lịch khác với thời gian đúng.

**Vị trí hiện tại:** src/modules/calendar (Luxon, recurrence thuần, repository IndexedDB, FullCalendar và download .ics client). Domain dùng chung/API export có quyền tài khoản còn là kiến trúc cloud đích.

### G6. Module Tổng quan

**Đã triển khai phạm vi Tổng quan local được yêu cầu:** thống kê, lịch ngày, checklist, tiến độ, mốc, ghi chú mới/ghim, tạo nhanh, cập nhật theo nguồn và lỗi theo khối. Tìm tiêu đề chung và vùng thông báo tích hợp còn lại, không tự mở rộng trong lượt chỉnh này.

**Phụ thuộc:** G3, G4, G5.

**Công việc:**

- Hôm nay và lịch sắp tới từ dữ liệu calendar.
- Dự án đang làm, tiến độ, mốc gần hạn từ projects.
- Ghi chú ghim/vừa sửa từ notes.
- Tạo nhanh lịch, dự án và ghi chú bằng luồng đã có.
- Tìm tiêu đề theo phạm vi/index đã chốt, mở đúng phân hệ.
- Suspense theo khối, skeleton/empty/error riêng.
- Cập nhật các khối liên quan sau khi dữ liệu nguồn thay đổi.
- Vùng thông báo/tình trạng tích hợp nhận dữ liệu ở G7.

**Bàn giao:** nhìn tổng thể dữ liệu thật trên một màn hình.

**Hoàn thành khi:** số liệu khớp module nguồn; link đúng tài nguyên; một khối tải lỗi không giả dữ liệu hoặc ngăn các khối khác hiển thị.

**Vị trí chính:** src/modules/overview, route /dashboard.

### G7. Nhắc lịch và tích hợp Zalo

**Phụ thuộc:** G2, G5; kết quả kiểm chứng Zalo sớm.

**G7.1 — Nhắc trong ứng dụng**

- Lưu reminders và notificationJobs theo event/occurrence/version.
- Materialize jobs trong cửa sổ tương lai, bổ sung định kỳ.
- Scheduler/worker claim job bằng lease và transaction.
- Ghi thông báo trong app; hiển thị đọc/chưa đọc ở Tổng quan.
- Sửa/hủy lịch vô hiệu job cũ; retry và expiry có giới hạn.
- Cài đặt bật/tắt thông báo và mặc định nhắc.

**G7.2 — Kênh Zalo**

- Chỉ bắt đầu adapter thật khi kiểm chứng API/quyền đã đạt.
- Ghép nối đúng người nhận bằng mã có hạn, dùng một lần.
- Secret Manager cho token; không trả secret cho browser.
- Gửi ngoài transaction, backoff khi lỗi tạm thời, phân biệt timeout không biết kết quả.
- Kết nối/ngắt, gửi thử và trạng thái lỗi trong Cài đặt/Tổng quan.
- Kiểm tra tự nhắc khi đóng web, giới hạn quá hạn và giờ yên lặng.

**Bàn giao:** lời nhắc trong app và kênh Zalo khi nền tảng cho phép.

**Hoàn thành khi:** job sửa/hủy không gửi theo version cũ; hai worker không cùng claim lease; lỗi có thể tra cứu; người dùng thấy kênh nào đang hoạt động. Không cam kết gửi đúng từng giây hoặc exactly-once khi kết quả phía nhà cung cấp không xác định.

Nếu Zalo chưa đạt điều kiện thì bàn giao nhắc trong app, ghi rõ kênh Zalo còn chờ; không coi phần Zalo đã hoàn thành và không tự thay bằng API không chính thức.

**Vị trí chính:** functions/src, domain/notifications và khả năng tích hợp trong settings/calendar/overview.

### G8. Hoàn thiện chức năng, kiểm thử và vận hành

**Phụ thuộc:** các phần cơ bản G1–G7; Zalo không khả dụng phải có trạng thái chờ riêng.

**Công việc:**

- Lịch lặp ngày/tháng, sửa chuỗi từ buổi này trở đi và in lịch/lưu PDF.
- Hoàn thiện đính kèm PDF/tệp, lịch sử và chính sách retention theo phạm vi kiến trúc.
- Hoàn thiện nhóm Cài đặt còn lại: tài khoản, thông báo, dữ liệu và tùy chọn ghi chú.
- E2E liên phân hệ: dự án → ghi chú ảnh → thời khóa biểu → nhắc → đánh dấu → Tổng quan.
- Kiểm tra mobile, bàn phím, validation, lỗi mạng và query/index/cursor.
- Build web/worker, bundle domain, logs/metrics và cảnh báo job trễ.
- Runbook deploy/rollback và kiểm tra sau deploy trên staging.
- Backup/restore Firestore + Storage + Auth UID; thử khôi phục dữ liệu và ảnh thật.
- Chuẩn bị production Vercel/Functions/Rules/indexes theo môi trường thực tế; triển khai khi người dùng yêu cầu.

**Bàn giao:** phiên bản sử dụng cá nhân có thể vận hành và phục hồi dữ liệu.

**Hoàn thành khi:** kiểm tra luồng chính đạt trên staging; quyền và secrets đúng; có quy trình backup/restore đã thử; production chỉ được ghi nhận sau triển khai và kiểm tra thật.

## 4. Các mốc bàn giao

| Mốc | Sau giai đoạn | Người dùng làm được |
| --- | --- | --- |
| M1 — Khung chạy được | G1 | Mở web local, điều hướng 5 màn hình |
| M2 — Tài khoản riêng tư | G2 | Đăng nhập, lưu hồ sơ/tùy chọn |
| M3 — Dữ liệu cá nhân | G3–G4 | Quản lý dự án, ghi chú và ảnh |
| M4 — Lịch dùng hằng ngày | G5–G6 | Đặt lịch/thời khóa biểu, xuất .ics, xem Tổng quan |
| M5 — Nhắc lịch | G7 | Nhận nhắc trong app; Zalo nếu kiểm chứng đạt |
| M6 — Sẵn sàng vận hành | G8 | Dùng bản được triển khai, có giám sát và khôi phục |

**Bản dùng hằng ngày đầu tiên là M4**: phải có thời khóa biểu tuần và ghi chú hình ảnh, không chỉ các màn hình trống. Nhắc lịch tự động là mốc M5, phần vận hành đầy đủ là M6.

## 5. Ưu tiên và phần để sau

| Mức | Phạm vi |
| --- | --- |
| Cốt lõi | Đăng nhập/quyền, 5 phân hệ, dự án/tiến độ, ghi chú rich text + ảnh + autosave, lịch + thời khóa biểu tuần + ngoại lệ, Tổng quan, .ics |
| Hoàn thiện kế hoạch này | Nhắc trong app, Zalo có điều kiện kiểm chứng, mở rộng lịch lặp, đính kèm, cấu hình đầy đủ, in lịch, backup/restore và deploy |
| Nâng cấp riêng sau | OCR/AI, nhập ghi chú qua tin nhắn Zalo, PWA/offline, tìm kiếm toàn văn, đồng bộ Google Calendar |

Không thêm phân hệ tài chính, chấm công hoặc kho file độc lập. “Giống Google Calendar/Notes” là định hướng trải nghiệm cho phạm vi đã mô tả, không cam kết sao chép toàn bộ sản phẩm.

## 6. Tiêu chí hoàn thành một giai đoạn

- Phạm vi và hành vi đã đạt, bao gồm quyền, empty/error/pending và reload.
- Typecheck/lint/build đạt theo scripts của project thực tế.
- Các kiểm thử có ý nghĩa cho thay đổi đạt; không bắt buộc test lại mọi lớp không liên quan.
- Không có secret, dữ liệu mẫu hoặc stub bị hiểu là chức năng thật.
- Tài liệu source/kiến trúc cập nhật đúng implementation.
- Có mô tả bàn giao: đã làm, đã kiểm tra, giới hạn và phần tiếp theo.
- Nếu còn điều kiện chưa đáp ứng, ghi trạng thái chờ cụ thể; không đánh dấu hoàn thành toàn bộ.

Không đặt lịch số tuần trước khi có khối lượng implementation và năng lực thực tế. Sau G1–G2 có thể ước lượng lại từng mốc bằng dữ liệu công việc đã làm.

## 7. Trạng thái thực hiện

| Hạng mục | Trạng thái hiện tại |
| --- | --- |
| Bộ khung thư mục và tài liệu | Đã dọn gọn: chỉ giữ source thực tế, 4 README, bỏ nhánh giữ chỗ |
| Kế hoạch triển khai | Đã lập |
| G1 | Hoàn thành local: lint/typecheck/format/build đạt, 12 E2E desktop/mobile đạt |
| G3 | Có implementation local: CRUD, checklist/mốc, tiến độ, ghim/lưu trữ, lịch sử; chất lượng kiểm tra ghi trong README |
| G2 | Auth/Firebase bước 1–5 có source; chờ cấu hình project thật, không migration |
| G4 | Có implementation local: rich text/ảnh, autosave, thư mục/nhãn, thùng rác, revisions và liên kết Projects |
| G5 | Có implementation local: lịch đơn/cả ngày, tuần/ngoại lệ, marks, kéo/resize, liên kết, .ics và settings |
| G6 local | Đã triển khai Tổng quan tổng hợp local; tìm kiếm chung/thông báo tích hợp còn kế hoạch |
| Mở rộng theo yêu cầu | Tab Lịch/Công việc, bộ thời khóa biểu, Kanban và hồ sơ dự án/tệp local |
| G7–G8 | Chưa triển khai gửi nhắc/Zalo/cloud; các mục còn lại chờ phạm vi được giao |
| Firebase/cloud/billing/deploy | Chưa thực hiện |
| Khả năng gửi Zalo thực tế | Chưa kiểm chứng |

**Tổng quan local và lượt mở rộng Lịch/Dự án đã có implementation.** Phần tiếp theo thực hiện khi người dùng yêu cầu. G2 đã được yêu cầu triển khai bước 1–5. Dữ liệu cloud theo UID; local giữ riêng. Upload/Zalo/deploy không thuộc lượt này.
