# Bản đồ source MyOS

Cập nhật 09/10/2026. G2 bước 1–5 thêm tài khoản công khai và Firestore; local giữ riêng, không migration. Cây này mô tả source hiện có, không dựng thư mục giữ chỗ cho kế hoạch cloud.

## Cấu trúc hiện tại

~~~text
MYOS/
├── README.md                       # Trạng thái, cách chạy và kiểm tra
├── AGENTS.md                       # Quy ước phát triển
├── MYOS_ARCHITECTURE.md             # Kiến trúc sản phẩm và cloud mục tiêu
├── package.json, pnpm-lock.yaml, pnpm-workspace.yaml
├── tsconfig.json, next.config.ts, postcss.config.mjs
├── components.json                 # shadcn/ui Radix/Nova, registry và alias
├── eslint.config.mjs, playwright.config.ts
├── .env.example, .gitignore, .github/workflows/ci.yml
├── src/
│   ├── app/                        # Quy ước route/layout của Next.js
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── global-error.tsx, not-found.tsx
│   │   ├── (auth)/                 # login/register/forgot-password, layout
│   │   ├── api/{auth,data}/route.ts # Session/CSRF và dữ liệu có kiểm tra UID
│   │   └── (private)/
│   │       ├── layout.tsx, error.tsx
│   │       ├── dashboard/          # page.tsx và loading.tsx
│   │       ├── calendar/           # page.tsx và layout.tsx
│   │       ├── projects/           # page.tsx, layout.tsx, [projectId]/page.tsx
│   │       ├── notes/              # page.tsx, layout.tsx, [noteId]/page.tsx
│   │       └── settings/page.tsx
│   ├── components/
│   │   ├── app-shell.tsx           # Sidebar/header/menu desktop và mobile
│   │   ├── page-ui.tsx             # Heading, empty và skeleton
│   │   └── ui/                     # shadcn Button/Input/Textarea/Card/Badge/Tabs/NativeSelect
│   ├── modules/
│   │   ├── README.md               # Hướng dẫn chung của cả 5 phân hệ
│   │   ├── overview/               # overview-screen.tsx, model.ts, overview.css
│   │   ├── auth/                   # auth-screen.tsx, account-context.tsx, auth.css
│   │   ├── settings/               # settings-screen.tsx, settings.css
│   │   ├── projects/               # model, service, repository, hook, CSS, components
│   │   ├── notes/                  # Như Projects, thêm autosave và rich editor
│   │   └── calendar/               # Thêm recurrence, ics và bộ lịch
│   └── lib/
│       ├── utils.ts                # cn cho component shadcn; không có nghiệp vụ/I/O
│       ├── local-database.ts       # IndexedDB local, version 5
│       ├── repository-cache.tsx    # SWR provider/hook, cache theo UID, cập nhật sau commit
│       └── firebase/               # client, server, session, data, profile, cloud-client
├── scripts/test-data.mjs           # Build và test local/cloud với env riêng
├── firebase.json, firestore.rules, firestore.indexes.json
├── playwright.firebase.config.ts  # E2E Emulator port 3101
├── public/images/login-forest.jpg # Ảnh rừng Pexels 6000 × 4000 cho màn hình xác thực
├── public/images/sidebar-city.png  # Ảnh người dùng cung cấp, nền chìm sidebar
├── tests/
│   ├── README.md                   # Cách chạy và phạm vi kiểm thử
│   └── e2e/                       # local/Firebase Emulator; calendar-helpers dùng chung thao tác ô ngày
└── docs/
    ├── SOURCE_MAP.md
    ├── IMPLEMENTATION_PLAN.md
    └── decisions/                  # Mục lục và 7 quyết định đã áp dụng
~~~

node_modules, .next, test-results và playwright-report là dependency/output, không phải source và không commit. Chỉ giữ thư mục khi có file thực tế cần dùng.

Rà soát bổ sung: 55 file TypeScript/React đều có vai trò route hoặc import thực tế. Đã bỏ 33 rule CSS (174 dòng) của các màn hình khung cũ khỏi globals.css và loại exclude dành cho packages/functions chưa tồn tại trong tsconfig. test-results và tsconfig.tsbuildinfo có thể dọn sau kiểm tra; .next cần cho production preview đang chạy, node_modules cần để chạy/build. Không xóa lockfile hoặc cấu hình kiểm thử để giảm số file.

## Tìm code theo nhiệm vụ

| Việc cần làm | Vị trí |
| --- | --- |
| Điều hướng, sidebar, header, menu | src/components/app-shell.tsx |
| Màu, font, spacing, UI chung | src/app/globals.css và src/components/page-ui.tsx |
| Lịch hẹn/thời khóa biểu | src/modules/calendar |
| Ngoại lệ chuỗi tuần | calendar/model.ts, recurrence.ts, service.ts |
| Xuất iCalendar | calendar/ics.ts |
| Bộ lịch hiện hữu | calendar/components/calendar-book.tsx; groups trong calendarSettings |
| Chấm công nội dung/tự lưu/xóa logic, bảng toàn chiều rộng | calendar/attendance-model.ts, attendance-repository.ts, components/attendance.tsx; API trong lib/firebase/data.ts |
| Hồ sơ, linh kiện và tệp dự án | projects/components/project-workspace.tsx; model/service/repository Projects; store projectAttachments |
| Cài đặt lịch và lịch liên quan | calendar/components/calendar-settings.tsx, related-calendar.tsx |
| Dự án, checklist/mốc, tiến độ | src/modules/projects |
| Ghi chú, ảnh, lịch sử, autosave | src/modules/notes |
| Khung Tổng quan và Cài đặt | overview/overview-screen.tsx, settings/settings-screen.tsx |
| Kết nối/kho/version dữ liệu local | src/lib/local-database.ts |
| Luồng người dùng và quy tắc thời gian | tests/e2e |

Projects/Notes/Calendar giữ model, service và repository riêng vì có quy tắc dữ liệu, transaction và kiểm tra version khác nhau. Hook đọc dữ liệu phục vụ loading/error và cập nhật giữa tab; hai hook Notes nằm cùng hooks.ts, vẫn giữ hai hàm riêng. Editor, form, lịch sử và dialog được tách khi có trách nhiệm thực tế; không gom thành một file lớn chỉ để giảm số file.

Page/layout/loading/error nhỏ vẫn là file riêng vì Next.js dùng tên và vị trí để điều phối routing, server/client và boundary. Các thành phần trang dùng chung nằm cùng components/page-ui.tsx; thành phần lỗi chỉ dùng một nơi đặt trực tiếp tại app/(private)/error.tsx. Module chỉ có một màn hình không cần thêm thư mục components.

## Luồng dữ liệu đang chạy

Cloud: Client Component → service → repository HTTP → API xác thực/CSRF/Zod → Firestore transaction. Layout private dùng requirePageUser nhưng mọi API tự kiểm tra session. Local: Client → service → IndexedDB chỉ khi cấu hình local.

Database myos-local version 5 gồm projects, projectAttachments, notes, noteAttachments, calendarEvents, calendarSettings, attendanceActivities và attendanceMonths. Calendar/Notes repository điều phối liên kết Projects trong transaction; khi ghi lỗi phải rollback. Liên kết event→note được đọc từ Calendar, không sao chép eventIds vào note. Xem [hướng dẫn module](../src/modules/README.md) và [quyết định kiến trúc](decisions/README.md).

## Các file nhỏ đã gom

| File trước đây | Vị trí hiện tại | Lý do |
| --- | --- | --- |
| components/ui/{empty-state,page-heading,feature-notice,skeleton}.tsx | components/page-ui.tsx | Các thành phần bố cục/trạng thái trang thuần UI, cùng ranh giới server-compatible |
| components/ui/error-state.tsx | app/(private)/error.tsx | Chỉ được dùng bởi route error; giữ use client và hành vi retry |
| notes/use-notes.ts, use-note-draft.ts | notes/hooks.ts | Đọc dữ liệu và quản lý nháp của cùng module; giữ hai hook với vòng đời riêng |
| calendar/components/calendar-dialog.tsx, export-dialog.tsx | calendar/components/dialogs.tsx | Khung modal và hộp thoại xuất lịch, giữ focus/pending/download |
| notes/components/project-notes.tsx | projects/components/project-detail-screen.tsx | Khối ghi chú chỉ dùng trong chi tiết Dự án; giữ gọi hook/service Notes |
| components/layout/app-shell.tsx | components/app-shell.tsx | Không cần lớp thư mục một file |
| lib/local/database.ts | lib/local-database.ts | Hạ tầng local duy nhất, không cần thư mục một file |

Từ 59 xuống 52 file TypeScript/React. page/layout/loading/error của Next.js vẫn phải giữ vị trí riêng. ProgressIndicator dùng ở cả danh sách/chi tiết; RelatedCalendar dùng ở Dự án/Ghi chú; NoteHistory có dialog/khôi phục riêng. Những thành phần này tiếp tục tách vì có mục đích thực tế. Không gộp editor, form, recurrence, repository vào màn hình lớn chỉ để giảm số file.

## Phần chưa triển khai

Firebase Web/Admin và session đã có mã thực tế trong lib/firebase; API không cache dữ liệu riêng. Không nhập dữ liệu local hoặc triển khai ảnh/tệp cloud. Worker và Zalo vẫn là kế hoạch.

| Phần dự kiến | Chỉ tạo khi có implementation |
| --- | --- |
| Worker nhắc và Zalo | functions/src; trigger, service, adapter, hạ tầng theo nhu cầu |
| Domain dùng chung web/worker | packages/domain khi có code dùng chung thật; hiện quy tắc ở module |
| Seed/migration | scripts với Emulator, dry-run, schemaVersion, backup và chạy lại an toàn |
| Rules/integration/unit | tests theo lớp khi có kiểm thử thật |
| Tài nguyên công khai bổ sung | public khi cần asset khác; không đặt ảnh ghi chú hoặc secrets ở đây |
| Deploy | Vercel do người dùng triển khai; firebase.json/rules/indexes đã có source |
| Runbook | docs/runbooks khi có quy trình setup/deploy/rollback/backup thực tế |

Worker không import Next.js/UI; domain giữ TypeScript thuần, không SDK/DOM/secrets và phải được bundle vào artifact Functions. Endpoint HTTP chỉ tạo khi cần; export G5 hiện download ở client, không cần API export giữ chỗ. Không gửi tin trong transaction.

## Quy tắc duy trì cấu trúc

- Chỉ 4 README: root, modules, tests và mục lục decisions. Mô tả thư mục nhỏ đặt tại đây; quy tắc nghiệp vụ nằm trong hướng dẫn module/ADR.
- Không tạo thư mục trống, README hay barrel index.ts chỉ để giữ cây mục tiêu trong Git.
- Tách file khi có trách nhiệm rõ, dùng lại thật hoặc ranh giới server/client bắt buộc. Giữ helper nhỏ dùng một chỗ gần nơi dùng.
- Cây mục tiêu trong MYOS_ARCHITECTURE.md là kế hoạch; tài liệu này là nguồn chính cho cấu trúc đang có.
- Khi có worker/domain thật, thêm package workspace tương ứng; hiện chỉ có ứng dụng web ở root.

G2 nối Tổng quan/Lịch/Dự án/Ghi chú/Cài đặt với Firestore theo UID. Kiểm thử firebase.spec.ts dùng demo-myos; nhắc/Zalo và deploy chưa thực hiện.
