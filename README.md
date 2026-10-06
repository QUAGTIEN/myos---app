# MyOS

Bộ khung ứng dụng Next.js cho phần mềm cá nhân gồm **Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt**.

## Trạng thái hiện tại

**G1 đã có implementation:** khung giao diện responsive, menu 5 mục, lịch tháng có điều hướng, trang đăng nhập preview, loading/error/404. Các module hiển thị trạng thái trống, không dùng dữ liệu cá nhân giả.

**G3 đã triển khai local:** tạo/sửa dự án, tìm kiếm/lọc/phân trang, ghim/lưu trữ/khôi phục, tiến độ thủ công hoặc checklist, mốc và lịch sử cập nhật. Nội dung dự án là văn bản thường. Dữ liệu lưu trong IndexedDB của trình duyệt qua repository riêng; chưa đồng bộ Firebase.

**G4 đã triển khai local:** ghi chú Tiptap (định dạng chữ, danh sách/checklist), chọn/dán/kéo thả ảnh và tạo từ ảnh, autosave sau 800 ms, thư mục/nhãn, tìm theo tiêu đề, ghim, thùng rác/khôi phục/xóa vĩnh viễn, 20 phiên bản trước và liên kết hai chiều với Dự án. Ảnh Blob tối đa 5 MB/tệp, 20 ảnh trong nội dung mỗi ghi chú. Database local version 2 thêm kho Notes/attachments, giữ dữ liệu Projects version 1.

**G2 được chuyển xuống cuối theo yêu cầu người dùng.** Chưa có Firebase Auth/session, upload, worker, Zalo hoặc cloud deployment. Route group (private) chưa có auth guard. Các chức năng chưa triển khai vẫn disabled kèm giải thích.

Dữ liệu local thuộc từng browser profile và origin: localhost và 127.0.0.1 là hai kho khác nhau. Xóa dữ liệu trình duyệt sẽ mất dự án, ghi chú và ảnh; chưa có backup/export hoặc chuyển dữ liệu tự động sang Firestore. Bản nháp lưu lỗi được giữ trong bộ nhớ của trang, có nút sao chép văn bản và cảnh báo khi rời trang; ảnh chưa lưu không có backup. Không nhập dữ liệu quan trọng cần lưu an toàn vào bản này.

## Chạy local

Yêu cầu Node.js 22 hoặc 24 và pnpm 10.32.1. Cài pnpm theo môi trường của bạn; nếu chưa có, thay pnpm bằng npx --yes pnpm@10.32.1 trong các lệnh dưới.

~~~powershell
pnpm install --frozen-lockfile
pnpm dev
~~~

Mở http://localhost:3000. G1 chạy không cần .env hoặc tài khoản Firebase. Khi triển khai G2, tạo .env.local theo .env.example; không commit credential.

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

pnpm start chạy bản production ở port 3000 sau build. CI kiểm tra lint, typecheck, build và E2E bằng Node 22; không deploy tự động.

## Công nghệ đã chọn

- Next.js App Router + React + TypeScript.
- Firestore cho database; Firebase Authentication cho tài khoản.
- Cloud Storage for Firebase cho ảnh/tệp.
- Firebase App Hosting cho web Next.js.
- Cloud Functions gen 2 + Cloud Scheduler cho nhắc lịch.
- pnpm workspace dự kiến cho web ở root, domain và worker.

Framework, Lucide, Radix Dialog, Zod, Tiptap, font và công cụ kiểm tra đã khóa phiên bản trong package.json/pnpm-lock.yaml. Firebase chỉ có cấu hình browser/server; SDK sẽ cài ở G2. FullCalendar và nghiệp vụ domain/worker sẽ được thêm khi triển khai module tương ứng. Quyết định phiên bản ở [ADR G1](docs/decisions/001-framework-shell.md); lưu trữ tạm ở [ADR G3](docs/decisions/002-local-projects.md) và [ADR G4](docs/decisions/003-local-notes.md).

## Tài liệu

- [Kiến trúc đầy đủ](MYOS_ARCHITECTURE.md): công nghệ, 5 phân hệ, dữ liệu, triển khai và cách áp dụng Next.js Learn.
- [Hướng dẫn agent](AGENTS.md): phạm vi, quy ước và ranh giới mã nguồn.
- [Bản đồ source](docs/SOURCE_MAP.md): cây thư mục thực tế và các file sẽ tạo khi bắt đầu code.
- [Kế hoạch triển khai](docs/IMPLEMENTATION_PLAN.md): 5 module, 8 giai đoạn và tiêu chí bàn giao.
- [Quyết định kiến trúc](docs/decisions/README.md).
- [Vận hành và triển khai](docs/runbooks/README.md).

## Cấu trúc chính

| Thư mục | Vai trò |
| --- | --- |
| src/app | Route, page, layout, loading/error và HTTP boundary của Next.js |
| src/modules | 5 phân hệ nghiệp vụ |
| src/components | UI và bố cục dùng chung |
| src/lib | Firebase, xác thực và helper Firestore |
| packages/domain/src | Quy tắc nghiệp vụ thuần dùng chung |
| functions/src | Worker nhắc lịch và adapter tích hợp |
| public | Tài nguyên tĩnh công khai |
| scripts | Seed Emulator và migration được kiểm soát |
| tests | Kiểm thử theo lớp khi có implementation |
| docs | Bản đồ source, quyết định và runbook |

Chi tiết trách nhiệm nằm trong README từng thư mục. **Nguồn chính cho phạm vi sản phẩm là MYOS_ARCHITECTURE.md**; SOURCE_MAP mô tả phần đã tạo trên ổ đĩa.

## Bước tiếp theo khi được yêu cầu lập trình

G5: Lịch và thời khóa biểu, khi người dùng yêu cầu. G2 (xác thực và chuyển dữ liệu sang Firebase) thực hiện cuối, trước khi sử dụng cloud với dữ liệu riêng tư. Các phụ thuộc cloud trong kế hoạch vẫn cần đáp ứng trước khi triển khai production.
