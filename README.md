# MyOS

Bộ khung ứng dụng Next.js cho phần mềm cá nhân gồm **Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt**.

## Trạng thái hiện tại

**G1 đã có implementation:** khung giao diện responsive, menu 5 mục, lịch tháng có điều hướng, trang đăng nhập preview, loading/error/404. Các module hiển thị trạng thái trống, không dùng dữ liệu cá nhân giả.

**Chưa triển khai Firebase Auth/session, CRUD, upload, worker, Zalo hoặc cloud deployment.** Các nút tạo/lưu và đăng nhập chưa khả dụng được disabled kèm giải thích. Nhóm route (private) hiện không có auth guard; chưa dùng cho dữ liệu cá nhân.

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

pnpm start chạy bản production ở port 3000 sau build. CI kiểm tra lint, typecheck, build và E2E bằng Node 22; không deploy tự động.

## Công nghệ đã chọn

- Next.js App Router + React + TypeScript.
- Firestore cho database; Firebase Authentication cho tài khoản.
- Cloud Storage for Firebase cho ảnh/tệp.
- Firebase App Hosting cho web Next.js.
- Cloud Functions gen 2 + Cloud Scheduler cho nhắc lịch.
- pnpm workspace dự kiến cho web ở root, domain và worker.

Framework, Lucide, Radix Dialog, font và công cụ kiểm tra đã khóa phiên bản trong package.json/pnpm-lock.yaml. Firebase chỉ có cấu hình browser/server; SDK sẽ cài ở G2. FullCalendar, Tiptap và nghiệp vụ domain/worker sẽ được thêm khi triển khai module tương ứng. Quyết định phiên bản, dependency patches và hạn chế hỗ trợ App Hosting ở [ADR G1](docs/decisions/001-framework-shell.md).

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

G2: Firebase Emulator, đăng nhập, session/allowlist, Rules và Cài đặt cơ bản. Không dùng bản G1 như ứng dụng riêng tư có bảo vệ tài khoản.
