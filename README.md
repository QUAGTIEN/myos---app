# MyOS

Ứng dụng Next.js cho phần mềm cá nhân gồm **Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt**.

## Trạng thái hiện tại

**G1 đã có implementation:** khung giao diện responsive, menu 5 mục, lịch tháng có điều hướng, trang đăng nhập preview, loading/error/404. Các module đọc dữ liệu local, không dùng dữ liệu cá nhân giả.

**G3 đã triển khai local:** tạo/sửa dự án, tìm kiếm/lọc/phân trang, ghim/lưu trữ/khôi phục, tiến độ thủ công hoặc checklist, mốc và lịch sử cập nhật. Nội dung dự án là văn bản thường. Dữ liệu lưu trong IndexedDB của trình duyệt qua repository riêng; chưa đồng bộ Firebase.

**G4 đã triển khai local:** ghi chú Tiptap (định dạng chữ, danh sách/checklist), chọn/dán/kéo thả ảnh và tạo từ ảnh, autosave sau 800 ms, thư mục/nhãn, tìm theo tiêu đề, ghim, thùng rác/khôi phục/xóa vĩnh viễn, 20 phiên bản trước và liên kết hai chiều với Dự án. Ảnh Blob tối đa 5 MB/tệp, 20 ảnh trong nội dung mỗi ghi chú. Database local version 2 thêm kho Notes/attachments, giữ dữ liệu Projects version 1.

**G2 được chuyển xuống cuối theo yêu cầu người dùng.** Chưa có Firebase Auth/session, upload, worker, Zalo hoặc cloud deployment. Route group (private) chưa có auth guard. Các chức năng chưa triển khai vẫn disabled kèm giải thích.

Dữ liệu local thuộc từng browser profile và origin: localhost và 127.0.0.1 là hai kho khác nhau. Xóa dữ liệu trình duyệt sẽ mất dự án, ghi chú, ảnh và lịch; chưa có backup toàn kho hoặc chuyển dữ liệu tự động sang Firestore. .ics chỉ xuất lịch, không sao lưu các module khác. Bản nháp lưu lỗi được giữ trong bộ nhớ của trang, có nút sao chép văn bản và cảnh báo khi rời trang; ảnh chưa lưu không có backup. Không nhập dữ liệu quan trọng cần lưu an toàn vào bản này.

**G5 đã triển khai local:** FullCalendar tháng/tuần/ngày/danh sách, lịch giờ/cả ngày, nhóm màu, đánh dấu, trùng giờ, kéo/resize rollback; chuỗi tuần và sửa/hủy/hoàn thành riêng từng buổi. Có liên kết Dự án/Ghi chú, tạo từ mốc giữ hạn mốc độc lập, `.ics` theo ngày/nhóm và cài đặt lịch. Database version 3 giữ dữ liệu cũ. Nhắc chỉ lưu cấu hình, chưa gửi tự động/Zalo. [ADR G5](docs/decisions/004-local-calendar.md).

**Tổng quan đã có dữ liệu local:** 4 số liệu, lịch ngày/qua đêm/lặp có ngoại lệ, checklist cần làm/quá hạn, tiến độ dự án, ghi chú mới/ghim và mốc gần hạn. Có tạo nhanh, mở/sửa/hoàn thành lịch và hoàn thành checklist; cập nhật theo tab nguồn và đổi ngày Việt Nam. Mỗi nguồn có loading/error/retry riêng. Tìm kiếm chung và vùng thông báo tích hợp vẫn chưa triển khai.

## Chạy local

Yêu cầu Node.js 22 hoặc 24 và pnpm 10.32.1. Cài pnpm theo môi trường của bạn; nếu chưa có, thay pnpm bằng npx --yes pnpm@10.32.1 trong các lệnh dưới.

~~~powershell
pnpm install --frozen-lockfile
pnpm dev
~~~

Mở http://localhost:3000. Bản local hiện chạy không cần .env hoặc tài khoản Firebase. Khi triển khai G2, tạo .env.local theo .env.example; không commit credential. localhost và 127.0.0.1 có kho dữ liệu riêng, nên dùng nhất quán một địa chỉ.

## Kiểm tra

~~~powershell
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
~~~

E2E dùng production build ở port 3100; phải build trước. Nếu tải Chromium bị chặn và máy có Chrome/Edge, đặt PLAYWRIGHT_CHANNEL=chrome hoặc msedge trong môi trường trước khi chạy test. Không cần cài lại browser trong trường hợp này.

G3 đã kiểm chứng lint/typecheck/format/production build và 24 E2E trên desktop/mobile, gồm conflict hai tab và lỗi storage. Production dependency audit không có lỗ hổng đã biết tại lần kiểm tra này.

G4 đã kiểm chứng lint/typecheck/format/build và toàn bộ 40 E2E desktop/mobile (gồm 24 test cũ và 16 test Ghi chú). Đã xem ảnh màn hình editor, thư viện và lịch sử; kiểm tra upgrade giữ Projects và quota rollback giữ nháp/ảnh. Production dependency audit không có lỗ hổng đã biết.

G5 kiểm chứng lint/typecheck/format/build và 61 kiểm thử đạt: 40 hồi quy, 15 luồng Calendar desktop/mobile, 6 domain/iCalendar. Có 7 skip chủ đích (6 domain không lặp lại ở mobile và 1 kéo/resize desktop; mobile sửa giờ qua form). Đã xem screenshots lịch/form/danh sách trên desktop/mobile, thử kéo/resize và rollback, hai tab, nâng DB v2→v3 giữ Notes/Blob/Projects và transaction liên kết. Production dependency audit không có lỗ hổng đã biết. `.ics` được parse bằng ical.js độc lập; chưa nhập thử qua tài khoản Google/Outlook thật.

Tổng quan đã kiểm chứng lint/typecheck/format/build và toàn bộ E2E: 69 đạt, 7 skip chủ đích theo cấu hình G5. Kiểm tra dữ liệu tổng hợp, đổi ngày Việt Nam, cập nhật hai tab, tạo nhanh, hoàn thành checklist và lỗi/retry riêng từng nguồn. Đã xem giao diện desktop 1920 px và mobile.

pnpm start chạy bản production ở port 3000 sau build. CI kiểm tra lint, typecheck, build và E2E bằng Node 22; không deploy tự động.

Giao diện dùng sidebar navy, desktop rộng, panel trắng và điểm nhấn màu rõ ở icon/viền/tiến độ. Bốn thẻ số liệu Tổng quan dùng nền màu tươi, các thẻ ghi chú giữ pastel; bỏ chữ giới thiệu lặp lại. Tổng quan hiển thị dữ liệu thực tế.

## Công nghệ đã chọn

- Next.js App Router + React + TypeScript.
- Firestore cho database; Firebase Authentication cho tài khoản.
- Cloud Storage for Firebase cho ảnh/tệp.
- Firebase App Hosting cho web Next.js.
- Cloud Functions gen 2 + Cloud Scheduler cho nhắc lịch.
- pnpm quản lý web ở root; thêm package domain/worker khi có mã dùng chung và tác vụ nền thật.

Framework, Lucide, Radix Dialog, Zod, Tiptap, FullCalendar 6.1.21/Luxon 3.7.2, font và công cụ kiểm tra đã khóa phiên bản trong package.json/pnpm-lock.yaml. Firebase hiện chỉ có mẫu biến môi trường; SDK và cấu hình hoạt động sẽ triển khai ở G2. Worker còn là kế hoạch. Quyết định ở [ADR G1](docs/decisions/001-framework-shell.md), [ADR G3](docs/decisions/002-local-projects.md), [ADR G4](docs/decisions/003-local-notes.md) và [ADR G5](docs/decisions/004-local-calendar.md).

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

Tổng quan đã hoàn thành phạm vi tổng hợp local được yêu cầu. Các hạng mục còn lại thực hiện khi người dùng yêu cầu. G2 (xác thực và chuyển dữ liệu sang Firebase) thực hiện cuối, trước khi sử dụng cloud với dữ liệu riêng tư. Các phụ thuộc cloud trong kế hoạch vẫn cần đáp ứng trước khi triển khai production.
