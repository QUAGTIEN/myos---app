# MyOS

Ứng dụng Next.js cho phần mềm cá nhân gồm **Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt**.

Nền màn hình xác thực: [A Green Forest — Lauri Poldre / Pexels](https://www.pexels.com/photo/a-green-forest-19635500/), ảnh gốc 6000 × 4000 trong public/images/login-forest.jpg, [Pexels License](https://www.pexels.com/license/). Next Image tải kích thước phù hợp; khung liquid dùng chung cho đăng nhập/đăng ký/quên mật khẩu.

## Trạng thái hiện tại

**G1 đã có implementation:** khung giao diện responsive, menu 5 mục, lịch tháng có điều hướng, trang đăng nhập (đã nối Auth ở G2), loading/error/404. Các module đọc dữ liệu local, không dùng dữ liệu cá nhân giả.

**G3 đã triển khai local:** tạo/sửa dự án, tìm kiếm/lọc/phân trang, ghim/lưu trữ/khôi phục, tiến độ thủ công hoặc checklist, mốc và lịch sử cập nhật. Nội dung dự án là văn bản thường. Dữ liệu lưu trong IndexedDB của trình duyệt qua repository riêng; chưa đồng bộ Firebase.

**G4 đã triển khai local:** ghi chú Tiptap (định dạng chữ, danh sách/checklist), chọn/dán/kéo thả ảnh và tạo từ ảnh, autosave sau 800 ms, thư mục/nhãn, tìm theo tiêu đề, ghim, thùng rác/khôi phục/xóa vĩnh viễn, 20 phiên bản trước và liên kết hai chiều với Dự án. Ảnh Blob tối đa 5 MB/tệp, 20 ảnh trong nội dung mỗi ghi chú. Database local version 2 thêm kho Notes/attachments, giữ dữ liệu Projects version 1.

**G2 bước 1–5 đã có source:** tự đăng ký email/mật khẩu, đăng nhập/quên mật khẩu/đăng xuất; cookie HttpOnly, CSRF, kiểm tra phiên và UID tại mọi API; hồ sơ, cài đặt và dữ liệu Projects/Notes/Calendar trên Firestore. Tổng quan dùng lại nguồn cloud. Mặc định Firebase, không có allowlist hoặc admin duyệt tài khoản. Cần hoàn tất cấu hình Console và Firebase Admin để dùng project thật. Vercel do người dùng deploy; ảnh/tệp cloud, Zalo và nhập dữ liệu local chưa triển khai. Xem [ADR 006](docs/decisions/006-firebase-public-accounts.md).

Tối ưu chuyển trang: SWR giữ dữ liệu trong bộ nhớ dưới layout, cache riêng theo tài khoản và gộp các yêu cầu cùng nguồn trong 30 giây. Trang đã tải hiển thị dữ liệu cũ trong khi cập nhật nền; refresh/focus/tab khác vẫn lấy dữ liệu mới. Sau ghi cloud dùng kết quả canonical để cập nhật cache, chỉ tải lại Dự án khi liên kết thay đổi. Cache không lưu localStorage/CDN; bị bỏ khi đổi tài khoản, logout hoặc API trả 401. Lần mở đầu tiên vẫn cần mạng; pagination cloud và truy vấn lịch theo khoảng vẫn chưa triển khai.

Dữ liệu local thuộc từng browser profile và origin: localhost và 127.0.0.1 là hai kho khác nhau. Xóa dữ liệu trình duyệt sẽ mất dự án, ghi chú, ảnh và lịch; chưa có backup toàn kho hoặc chuyển dữ liệu tự động sang Firestore. .ics chỉ xuất lịch, không sao lưu các module khác. Bản nháp lưu lỗi được giữ trong bộ nhớ của trang, có nút sao chép văn bản và cảnh báo khi rời trang; ảnh chưa lưu không có backup. Không nhập dữ liệu quan trọng cần lưu an toàn vào bản này.

**G5 đã triển khai local:** FullCalendar tháng/tuần/ngày/danh sách, lịch giờ/cả ngày, nhóm màu, đánh dấu, trùng giờ, kéo/resize rollback; chuỗi tuần và sửa/hủy/hoàn thành riêng từng buổi. Có liên kết Dự án/Ghi chú, tạo từ mốc giữ hạn mốc độc lập, `.ics` theo ngày/nhóm và cài đặt lịch. Database version 3 giữ dữ liệu cũ. Nhắc chỉ lưu cấu hình, chưa gửi tự động/Zalo. [ADR G5](docs/decisions/004-local-calendar.md).

**Lịch và Dự án đã mở rộng local:** Lịch chia tab Lịch (ngày/tháng/năm) và Công việc (tuần/tháng/ngày/danh sách). Tạo, đổi tên/màu và sao chép bộ thời khóa biểu; bản sao giữ khoảng ngày và ngoại lệ, bỏ liên kết nguồn và đặt lại hoàn thành. Dự án có Thẻ/Kanban, kéo trên desktop hoặc chọn trạng thái trên mobile; hồ sơ mục tiêu, tài liệu, link HTTP(S), linh kiện/chi phí tùy chọn, nhật ký/kiểm thử và tệp đính kèm tối đa 20 MB/tệp. Database v4 thêm kho Blob dự án, giữ dữ liệu cũ. [Quyết định mở rộng](docs/decisions/005-timetables-project-dossiers.md).

**Tổng quan đã có dữ liệu local:** 4 số liệu, lịch ngày/qua đêm/lặp có ngoại lệ, checklist cần làm/quá hạn, tiến độ dự án, ghi chú mới/ghim và mốc gần hạn. Có tạo nhanh, mở/sửa/hoàn thành lịch và hoàn thành checklist; cập nhật theo tab nguồn và đổi ngày Việt Nam. Mỗi nguồn có loading/error/retry riêng. Tìm kiếm chung và vùng thông báo tích hợp vẫn chưa triển khai.

Thanh công cụ Lịch: tab Lịch/Công việc tách rõ ở đầu trang, Tạo lịch hẹn ở bên phải; điều hướng ngày, chế độ xem và chọn bộ lịch cùng một hàng trên desktop. Menu Thao tác lịch chứa tạo/sửa/sao chép bộ lịch, xuất `.ics` và cài đặt; sửa/sao chép chỉ hiện khi chọn bộ cụ thể. Mobile xuống hàng theo chiều rộng, hỗ trợ bàn phím và focus khi đóng menu/dialog.

## Chạy local

Yêu cầu Node.js 22 hoặc 24 và pnpm 10.32.1. Cài pnpm theo môi trường của bạn; nếu chưa có, thay pnpm bằng npx --yes pnpm@10.32.1 trong các lệnh dưới.

~~~powershell
pnpm install --frozen-lockfile
pnpm dev
~~~

Mở http://localhost:3000/login. Tạo `.env.local` theo `.env.example`: điền Firebase Web config, `FIREBASE_PROJECT_ID` trùng project phía web; cấu hình Admin bằng đường dẫn JSON ở `GOOGLE_APPLICATION_CREDENTIALS` hoặc cả `FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` phía server. Không commit `.env.local` hay JSON. Bật Email/Password và tạo Cloud Firestore **Standard Native mode, database (default)** trong Console. Thêm localhost và tên miền Vercel vào Authorized domains. Source dùng Rules deny-all: chép nội dung `firestore.rules` vào Console và Publish khi cấu hình project; browser không đọc/ghi database trực tiếp. Các API Admin kiểm tra quyền riêng.

Để xem dữ liệu local cũ, đặt `NEXT_PUBLIC_MYOS_MODE=local` rồi khởi động/build lại. Không tự chuyển dữ liệu giữa hai chế độ, không tự nhập dữ liệu cũ vào tài khoản; dùng đúng browser/origin cũ. Biến NEXT_PUBLIC được chốt tại build nên đổi chế độ phải build lại.

## Kiểm tra

~~~powershell
pnpm lint
pnpm typecheck
pnpm format:check
pnpm exec playwright install chromium
pnpm test:local
# Cần Java 21+; chỉ tạo dữ liệu test trên demo-myos, không cần Admin key.
pnpm test:firebase
# Sau kiểm thử, build lại theo .env.local cho bản thực tế.
pnpm build
~~~

E2E dùng production build ở port 3100; phải build trước. Nếu tải Chromium bị chặn và máy có Chrome/Edge, đặt PLAYWRIGHT_CHANNEL=chrome hoặc msedge trong môi trường trước khi chạy test. Không cần cài lại browser trong trường hợp này.

G3 đã kiểm chứng lint/typecheck/format/production build và 24 E2E trên desktop/mobile, gồm conflict hai tab và lỗi storage. Production dependency audit không có lỗ hổng đã biết tại lần kiểm tra này.

G4 đã kiểm chứng lint/typecheck/format/build và toàn bộ 40 E2E desktop/mobile (gồm 24 test cũ và 16 test Ghi chú). Đã xem ảnh màn hình editor, thư viện và lịch sử; kiểm tra upgrade giữ Projects và quota rollback giữ nháp/ảnh. Production dependency audit không có lỗ hổng đã biết.

G5 kiểm chứng lint/typecheck/format/build và 61 kiểm thử đạt: 40 hồi quy, 15 luồng Calendar desktop/mobile, 6 domain/iCalendar. Có 7 skip chủ đích (6 domain không lặp lại ở mobile và 1 kéo/resize desktop; mobile sửa giờ qua form). Đã xem screenshots lịch/form/danh sách trên desktop/mobile, thử kéo/resize và rollback, hai tab, nâng DB v2→v3 giữ Notes/Blob/Projects và transaction liên kết. Production dependency audit không có lỗ hổng đã biết. `.ics` được parse bằng ical.js độc lập; chưa nhập thử qua tài khoản Google/Outlook thật.

Tổng quan đã kiểm chứng lint/typecheck/format/build và toàn bộ E2E: 69 đạt, 7 skip chủ đích theo cấu hình G5. Kiểm tra dữ liệu tổng hợp, đổi ngày Việt Nam, cập nhật hai tab, tạo nhanh, hoàn thành checklist và lỗi/retry riêng từng nguồn. Đã xem giao diện desktop 1920 px và mobile.

pnpm start chạy bản production ở port 3000 sau build. CI kiểm tra lint/typecheck/format và E2E local + Firebase Emulator bằng Node 22/Java 21; không deploy tự động.

Lượt mở rộng Lịch/Dự án đã kiểm chứng lint/typecheck/format/build và toàn bộ E2E: 77 đạt, 7 skip theo cấu hình G5. Đã kiểm tra ảnh desktop/mobile, kéo Kanban, sao chép bộ lịch rollback, xuất khoảng năm, hồ sơ IoT, link an toàn, tệp tải/xóa/rollback, conflict hai tab và upgrade v3→v4; dữ liệu Notes/Projects/Calendar cũ vẫn giữ.

Giao diện dùng sidebar navy, desktop rộng, panel trắng và điểm nhấn màu rõ ở icon/viền/tiến độ. Bốn thẻ số liệu Tổng quan dùng nền màu tươi, các thẻ ghi chú giữ pastel. Thẻ không có viền màu, tiêu đề phân hệ chỉ hiển thị trên thanh công cụ; menu đặt Ghi chú trước Dự án. Tổng quan hiển thị dữ liệu thực tế.

Trang Ghi chú có thanh thao tác thống nhất, thư viện tích hợp và thẻ pastel gọn; bố cục chuyển phù hợp desktop/mobile, giữ các chức năng G4.

Trang Dự án dùng một khung nội dung thống nhất, số liệu gọn và thẻ nhỏ (4 cột desktop rộng); ghim/lưu trữ nằm trong menu ⋯, Thẻ/Kanban giữ chức năng hiện có. Đã kiểm chứng 32 E2E Dự án/hồ sơ/khung ứng dụng trên desktop/mobile; ảnh thực tế 1920 px dùng 4 cột, thẻ tối thiểu 212 px.

## Công nghệ đã chọn

- Next.js App Router + React + TypeScript.
- Firestore cho database; Firebase Authentication cho tài khoản.
- Cloud Storage for Firebase cho ảnh/tệp.
- Vercel cho web Next.js, người dùng tự deploy.
- Cloud Functions gen 2 + Cloud Scheduler cho nhắc lịch.
- pnpm quản lý web ở root; thêm package domain/worker khi có mã dùng chung và tác vụ nền thật.

Framework, Lucide, Radix Dialog, Zod, Tiptap, FullCalendar 6.1.21/Luxon 3.7.2, font và công cụ kiểm tra đã khóa phiên bản trong package.json/pnpm-lock.yaml. Firebase Web/Admin SDK và cấu hình Emulator đã được thêm ở G2. Worker còn là kế hoạch. Quyết định ở [ADR G1](docs/decisions/001-framework-shell.md), [ADR G3](docs/decisions/002-local-projects.md), [ADR G4](docs/decisions/003-local-notes.md) và [ADR G5](docs/decisions/004-local-calendar.md).

## Tài liệu

- [Kiến trúc đầy đủ](MYOS_ARCHITECTURE.md): công nghệ, 5 phân hệ, dữ liệu, triển khai và cách áp dụng Next.js Learn.
- [Hướng dẫn agent](AGENTS.md): phạm vi, quy ước và ranh giới mã nguồn.
- [Bản đồ source](docs/SOURCE_MAP.md): cây thư mục thực tế, nơi tìm code và phần còn dự kiến.
- [Hướng dẫn 5 phân hệ](src/modules/README.md): trách nhiệm, luồng dữ liệu và quy tắc nghiệp vụ hiện tại.
- [Kiểm thử](tests/README.md): phạm vi, cách chạy và dữ liệu test.
- [Kế hoạch triển khai](docs/IMPLEMENTATION_PLAN.md): 5 module, 8 giai đoạn và tiêu chí bàn giao.
- [Quyết định kiến trúc](docs/decisions/README.md).

## Cấu trúc chính

| Thư mục | Vai trò |
| --- | --- |
| src/app | Route, page, layout, loading/error và HTTP boundary của Next.js |
| src/modules | 5 phân hệ; hướng dẫn tập trung trong một README |
| src/components | app-shell.tsx và page-ui.tsx dùng chung |
| src/lib/local-database.ts | IndexedDB dùng chung, version và thông báo cập nhật |
| tests/e2e | Kiểm thử luồng desktop/mobile và quy tắc thời gian/iCalendar |
| docs | Bản đồ source, kế hoạch và quyết định kiến trúc |

Chỉ giữ **4 README**: root, modules, tests và mục lục decisions. Không tạo nhánh giữ chỗ cho domain, worker, API, migration hoặc asset chưa có implementation. Module chỉ có một màn hình đặt file trực tiếp; module nhiều nghiệp vụ giữ model/service/repository và components theo trách nhiệm thật. **Nguồn chính cho phạm vi sản phẩm là MYOS_ARCHITECTURE.md**; SOURCE_MAP mô tả cấu trúc đang chạy.

## Bước tiếp theo khi được yêu cầu lập trình

**Sửa runtime Vercel 08/10/2026:** khóa `jwks-rsa>jose` ở 5.10.0 để Firebase Admin nạp được qua CommonJS, tránh ERR_REQUIRE_ESM trên /dashboard. CI kiểm tra nạp Admin với require(ESM) bị tắt. Sau khi cập nhật source, cần deployment mới trên Vercel. Kết nối Admin tới Authentication và đọc Firestore project thật đã kiểm tra thành công trên máy local; chưa xác nhận đăng nhập/CRUD trên Vercel.

Tổng quan đã hoàn thành phạm vi tổng hợp local được yêu cầu. Các hạng mục còn lại thực hiện khi người dùng yêu cầu. G2 (xác thực và chuyển dữ liệu sang Firebase) thực hiện cuối, trước khi sử dụng cloud với dữ liệu riêng tư. Các phụ thuộc cloud trong kế hoạch vẫn cần đáp ứng trước khi triển khai production.

**G2 kiểm chứng:** lint/typecheck/format/build đạt; 77 hồi quy local đạt, 7 skip chủ đích; 6 E2E Auth/Firestore Emulator desktop/mobile đạt. Kiểm tra cách ly hai UID, CSRF, cookie/thu hồi riêng từng phiên, CRUD/reload, profile/đầu tuần, lỗi cloud giữ nháp, liên kết nguyên tử, version conflict, sao chép bộ lịch, revisions và Rules deny-all. Đã xem màn hình đăng nhập/cài đặt desktop/mobile. Production dependency audit không có lỗ hổng đã biết sau khi khóa bản vá transitive SDK. Project thật chưa smoke-test do chưa có Firebase Admin credentials; không deploy hoặc gửi email/tin nhắn thật khi kiểm thử.
