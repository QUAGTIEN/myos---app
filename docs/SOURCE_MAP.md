# Bản đồ source MyOS

Ngày cập nhật: 07/10/2026. Giai đoạn: **G1, G3 Projects, G4 Notes và G5 Calendar local đã có implementation; G2 hoãn**.

## Cây thư mục hiện có

Mỗi nhánh nghiệp vụ/hạ tầng có README.md mô tả vai trò. Cây dưới đây tập trung vào thư mục; bảng phía sau phân biệt file đã triển khai và phần còn dự kiến.

~~~text
MYOS/
├── README.md
├── AGENTS.md
├── MYOS_ARCHITECTURE.md
├── src/
│   ├── app/
│   │   ├── (auth)/login/
│   │   ├── (private)/
│   │   │   ├── dashboard/
│   │   │   ├── calendar/
│   │   │   ├── projects/[projectId]/
│   │   │   ├── notes/[noteId]/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── auth/{session,logout}/
│   │       ├── calendar/export/
│   │       └── integrations/zalo/connect/
│   ├── modules/{overview,calendar,projects,notes,settings}/
│   ├── components/{ui,layout}/
│   └── lib/{firebase,auth,firestore}/
├── packages/domain/src/
│   ├── schemas/
│   ├── datetime/
│   ├── recurrence/
│   ├── progress/
│   ├── notes/
│   └── notifications/
├── functions/src/{scheduled,adapters,services,lib}/
├── public/icons/
├── scripts/{seed-emulator,migrations}/
├── tests/{unit,integration,rules,e2e}/
└── docs/{decisions,runbooks}/
~~~

Các ký hiệu {a,b} mô tả nhiều thư mục ngang hàng, không phải tên thư mục thật. Dashboard tương ứng module overview.

## G5 — Calendar local

`src/modules/calendar`: model, recurrence, repository, service, use-calendar, ics, calendar.css và components (bộ lịch, form, chi tiết, export, settings, liên kết). `/calendar/page.tsx` đọc ID query; layout tải CSS. Database version 3 giữ các kho cũ. Calendar repository cập nhật Project.relatedEventIds nguyên tử; Notes đọc liên kết từ Calendar. Export download client, chưa có API export server. Rules/worker/Auth vẫn là kế hoạch. Kiểm chứng ở `calendar.spec.ts` và `calendar-domain.spec.ts`; xem ADR 004.

## Files Next.js và trạng thái

**Đã tạo ở G1:** root layout/page/globals/not-found/global-error; login; private layout/error; dashboard/loading; 5 page chính; detail Projects/Notes có màn hình local, UUID sai trả 404; shell/menu; UI heading/empty/skeleton/notice/error; components màn hình của 5 module; cấu hình Firebase browser/server chưa có SDK. **G3 đã thêm:** Projects model.ts, repository.ts (IndexedDB), service.ts, use-projects.ts, projects.css; components danh sách/chi tiết/progress/project-dialog/item-dialog; projects/layout.tsx và detail page validate UUID. Có tests/e2e/projects.spec.ts cho luồng local. **G4 đã thêm:** Notes model/repository/service, use-notes/use-note-draft, notes.css; components thư viện/editor/history/project-notes; notes/layout và UUID detail page. src/lib/local/database.ts dùng chung database version 2, tests/e2e/notes.spec.ts kiểm tra G4. Chưa có Server Actions hoặc API route.ts; Firebase/worker vẫn là kế hoạch. Bảng dưới tiếp tục mô tả vai trò mục tiêu; file chưa nằm trong các danh sách implementation vẫn là kế hoạch.

| Vị trí | File sẽ tạo khi bắt đầu code | Vai trò |
| --- | --- | --- |
| src/app | layout.tsx, page.tsx, globals.css | Root layout, điều hướng đầu vào và style chung |
| src/app | not-found.tsx, global-error.tsx | Không tìm thấy và lỗi root |
| src/app/(auth)/login | page.tsx | Đăng nhập |
| src/app/(private) | layout.tsx, error.tsx | Khung chung 5 phân hệ và boundary lỗi |
| Mỗi route phân hệ | page.tsx; loading.tsx khi cần | Nội dung và skeleton |
| projects/[projectId], notes/[noteId] | page.tsx, not-found.tsx khi cần | Chi tiết tài nguyên |
| Các route src/app/api | route.ts | HTTP boundary có validation/xác thực |
| src/lib/firebase | client.ts, admin.ts | Tách SDK browser/server |
| src/lib/auth | require-user.ts, session.ts | Xác thực và quyền truy cập server |
| Mỗi src/modules/<module> | service.ts, repository.ts, actions.ts, types.ts khi cần | Ca sử dụng, dữ liệu, mutation và hợp đồng |
| Mỗi src/modules/<module>/components | Các component theo nhu cầu | UI nghiệp vụ; thư mục tạo lúc có component |
| functions/src | index.ts và các worker/adapter | Export Functions và xử lý nền |

## Cấu hình

**Đã tạo:** package.json, pnpm workspace/lockfile, tsconfig, next.config, PostCSS/Tailwind v4, ESLint, Prettier scripts, Playwright, .npmrc, .nvmrc, .env.example và CI. next-env.d.ts được Next.js sinh tự động và bỏ qua Git.

**Chưa tạo:** Firebase deploy config/Rules/indexes, apphosting.yaml và manifest/build cho domain/Functions. Danh sách mục tiêu đầy đủ:

- package.json và pnpm-workspace.yaml; lockfile sinh từ cài đặt thật.
- tsconfig.json, next.config.ts, next-env.d.ts theo bộ khởi tạo Next.js được chọn.
- Cấu hình lint, Tailwind/PostCSS theo phiên bản thực tế.
- firebase.json, .firebaserc, firestore.rules, firestore.indexes.json, storage.rules.
- functions/package.json, functions/tsconfig.json, packages/domain/package.json.
- apphosting.yaml, .env.example và .gitignore.
- .github/workflows/ci.yml khi có scripts/checks thực tế.

Không tạo config giả với project ID hoặc secrets. Kiến trúc đầy đủ chứa cây **mục tiêu**, bao gồm những phần chưa triển khai.

## Quy tắc phụ thuộc

| Lớp | Được phụ thuộc |
| --- | --- |
| app | modules, components, lib/auth |
| modules | domain, components, lib; repository server truy cập lib/firebase |
| components | React/UI và types đã an toàn cho client |
| lib | Firebase SDK và domain khi cần; không phụ thuộc UI |
| domain | TypeScript và thư viện thuần đã chọn |
| functions | domain và hạ tầng worker; không phụ thuộc Next.js/UI |

Service chịu trách nhiệm nghiệp vụ; repository chỉ truy cập dữ liệu. Tổng quan tổng hợp qua service/query chuyên dụng, không import component của phân hệ khác để đọc dữ liệu.

## Hoàn thành giai đoạn bộ khung

Cây thư mục và hướng dẫn đã có; web G1 chạy local theo README ở root. Hạ tầng Firebase chưa hoạt động, không có dữ liệu cá nhân hoặc auth guard. G2 tiếp tục xác thực và dữ liệu nền.
