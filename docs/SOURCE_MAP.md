# Bản đồ source MyOS

Ngày cập nhật: 06/10/2026. Giai đoạn: **bộ khung tài liệu, chưa implementation**.

## Cây thư mục hiện có

Mỗi nhánh nghiệp vụ/hạ tầng có README.md mô tả vai trò. Cây dưới đây liệt kê thư mục thực tế; các tên .tsx/.ts chỉ xuất hiện trong phần kế hoạch, chưa được tạo.

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

## Files Next.js dự kiến

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

## Cấu hình dự kiến, chưa tạo

- package.json và pnpm-workspace.yaml; lockfile sinh từ cài đặt thật.
- tsconfig.json, next.config.ts, next-env.d.ts theo bộ khởi tạo Next.js được chọn.
- Cấu hình lint, Tailwind/PostCSS theo phiên bản thực tế.
- firebase.json, .firebaserc, firestore.rules, firestore.indexes.json, storage.rules.
- functions/package.json, functions/tsconfig.json, packages/domain/package.json.
- apphosting.yaml, .env.example và .gitignore.
- .github/workflows/ci.yml khi có scripts/checks thực tế.

Không tạo config giả với project ID, secrets hoặc commands chưa chạy được. Kiến trúc đầy đủ chứa cây **mục tiêu** có các file này; cây hiện tại chỉ là định hướng thư mục.

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

Cây thư mục, hướng dẫn agent và tài liệu đã được chuẩn bị để bước lập trình tiếp theo có nơi đặt mã rõ ràng. Chưa có trang web chạy được hay hạ tầng Firebase đang hoạt động.
