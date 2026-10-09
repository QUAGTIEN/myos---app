# MyOS — Kiến trúc và bộ khung dự án Firebase

Ngày cập nhật: **09/10/2026** · Phiên bản: **1.16 — Chấm công theo nội dung và tự lưu**

**Phạm vi hiện hành:** Lịch tháng/tuần; Chấm công là ghi chú theo ngày, có nội dung tính đã chấm, tự lưu tuần tự cả tháng với version check và giữ nháp khi lỗi. Xóa công việc bằng deletedAt nguyên tử, khóa đọc/ghi các tháng và không cho phục hồi; dữ liệu cũ đọc tương thích, không đổi IndexedDB v5. Lịch và Chấm công dùng toàn bộ chiều rộng, không có cột thông tin bên phải; Tổng quan bỏ ba nút tạo nhanh. Groups/events/liên kết cũ giữ nguyên. [ADR 007](docs/decisions/007-calendar-attendance.md).

**Lịch sử mở rộng local:** Lịch tách xem ngày/tháng/năm và Công việc theo nhiều bộ thời khóa biểu. Groups là bộ lịch đã lưu; sao chép settings/events nguyên tử, identity mới, không sao chép liên kết nguồn. Dự án có Kanban và workspace được validate với defaults để đọc bản cũ; Blob ở projectAttachments, ghi/xóa cùng metadata trong transaction kiểm tra version. IndexedDB v4 giữ stores cũ. Chi tiết tại [ADR 005](docs/decisions/005-timetables-project-dossiers.md).

Tài liệu được cập nhật theo lựa chọn của người dùng: Firebase và đúng **5 phân hệ: Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt**. Ngữ cảnh sản phẩm nằm trong [cuộc trò chuyện gốc](https://chatgpt.com/share/6ac3f0a0-ebb0-83ec-970a-56dcaaa98894).

**Trạng thái hiện tại:** G2 bước 1–5 có source Auth/session/hồ sơ/Firestore cho 5 phân hệ; chưa xác nhận project thật khi thiếu Admin credentials. Local v4 giữ riêng, không migration; ảnh/tệp cloud, worker, Zalo và deploy hoãn. Quyết định hiện hành ở [ADR 006](docs/decisions/006-firebase-public-accounts.md); các phần worker/media bên dưới là kế hoạch.

Trước G2, G3–G5 dùng luồng **Client Component → service → repository IndexedDB**. Schema Zod và quy tắc nằm trong module đến khi cần dùng chung. Mỗi lần ghi kiểm tra version trong cùng transaction, chỉ báo thành công sau commit. G2 đã thêm API session/data và Firestore; chưa có chuyển dữ liệu local tự động. G4 có Tiptap JSON, ảnh Blob, autosave và 20 revisions; note/ảnh/liên kết dự án ghi nguyên tử. Database `myos-local` version 2 thêm `notes`, `noteAttachments` và giữ `projects`. Notes.projectIds là nguồn liên kết, Projects.relatedNoteIds được cập nhật cùng transaction. G5 thêm calendarEvents/calendarSettings ở database version 3, giữ các kho cũ. Có bộ lịch bốn views, lặp tuần/ngoại lệ, kéo/resize rollback, liên kết hai chiều Dự án/Ghi chú, .ics và cài đặt lịch. Nhắc chỉ lưu cấu hình; gửi tự động/Zalo chờ G7. Quyết định tại [ADR G5](docs/decisions/004-local-calendar.md). Xem [ADR G4](docs/decisions/003-local-notes.md).

Tổng quan đọc G3–G5 qua các hook hiện có và `overview/model.ts` để tổng hợp trong bộ nhớ: ngày Việt Nam, lịch lặp/qua đêm, checklist và mốc của dự án chưa hoàn thành/chưa lưu trữ, dự án active, ghi chú ngoài thùng rác. Không thêm collection/store hoặc bản sao dữ liệu. Mutations gọi lại service nguồn; từng khối tải lỗi có retry riêng. `overview-screen.tsx` điều phối thao tác và các panel; `overview.css` giữ bố cục responsive. Tìm kiếm chung và vùng thông báo tích hợp còn là kế hoạch.

## 1. Quyết định kiến trúc

**Tối ưu đọc ngày 08/10/2026:** `RepositoryCacheProvider` dùng SWR trong layout riêng, Map mới theo UID (local có scope riêng), chia sẻ nguồn Projects/Notes/Calendar giữa Tổng quan, danh sách và dialog. Không persist dữ liệu riêng tư và không cache CDN. Yêu cầu cùng key gộp 30 giây; cập nhật nền khi remount/focus/reconnect, sự kiện tab khác và retry chủ động. Ghi cloud chỉ cập nhật cache sau server commit, với kết quả canonical; kiểm tra version server vẫn bắt buộc. CSRF dùng lại trong bộ nhớ tối đa 55 phút, chỉ retry một lần khi server từ chối token trước ghi. DAL xác thực chữ ký rồi đọc UserRecord/session song song, kiểm tra disabled/revocation bằng cùng UserRecord; không cache quyền giữa các request. Chi tiết [ADR 006](docs/decisions/006-firebase-public-accounts.md).

**Chọn Next.js + TypeScript, Cloud Firestore, Firebase Authentication, Cloud Storage for Firebase (hoãn) và Vercel. Nhắc lịch chạy bằng Cloud Functions for Firebase thế hệ 2 + Cloud Scheduler.**

Phân biệt tên dịch vụ:

| Dịch vụ | Chức năng trong MyOS |
| --- | --- |
| Firebase | Hệ sinh thái dịch vụ chung |
| Cloud Firestore | Database document/collection |
| Firebase Hosting | Host nội dung tĩnh/SPA; có thể kết hợp backend riêng |
| Firebase App Hosting | Host ứng dụng Next.js có server rendering và backend |
| Cloud Storage for Firebase | Lưu ảnh, PDF và các file |
| Firebase Authentication | Đăng nhập và định danh người dùng |
| Cloud Functions + Cloud Scheduler | Tác vụ nền và nhắc lịch |

**Firestore là database.** Người dùng chọn Vercel để host Next.js với API/session server; Firebase App Hosting là phương án tham khảo cũ. [App Hosting](https://firebase.google.com/docs/app-hosting), [Firebase Hosting](https://firebase.google.com/docs/hosting)

Kiến trúc vẫn là **modular monolith**: một ứng dụng chính chia theo nghiệp vụ, một database; worker deploy riêng để chạy khi đóng web. Không cần microservices, Kubernetes hay Redis ở giai đoạn đầu.

Giả định:

- Nhiều tài khoản tự đăng ký, mỗi người có không gian riêng; tiếng Việt, timezone Asia/Ho_Chi_Minh.
- Sidebar và điều hướng mobile chỉ có Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt. Tệp đính kèm, tìm kiếm và nhắc Zalo là khả năng bên trong các phân hệ này.
- Web responsive cho Windows và điện thoại; bổ sung PWA sau.
- Đăng nhập riêng tư; quyền ứng dụng chỉ cấp cho tài khoản được cho phép.
- Bản đầu cần Internet cho các thao tác ghi quan trọng. Chưa triển khai đồng bộ offline hoặc xung đột giữa nhiều thiết bị.
- Cloud tiếp tục nhắc khi máy cá nhân tắt; không cam kết đúng từng giây.
- Zalo Bot cần thử quyền gửi chủ động, phí và hạn mức trên tài khoản thực.
- **Hạ tầng đầy đủ cần Blaze và liên kết Cloud Billing.** Có hạn mức miễn phí nhưng không cam kết hóa đơn bằng 0. Tài liệu này chưa tạo project, bật billing hay deploy dịch vụ.

## 2. Bộ công nghệ đề xuất

| Thành phần | Công nghệ | Vai trò |
| --- | --- | --- |
| Web và backend giao diện | Next.js App Router + React + TypeScript | Trang, layout, Server Components, Server Actions và Route Handlers |
| Runtime | Node.js 22 LTS, khóa phiên bản được nền tảng hỗ trợ | Dùng chung cho web/Functions khi adapter và SDK tương thích |
| Package manager | pnpm | Lockfile, build tái lập và workspace cho phần dùng chung |
| UI | Tailwind CSS + shadcn/ui + lucide-react | Giao diện thống nhất; icon có sẵn từ Lucide, không generate icon |
| Form/validation | React controlled forms + Zod (G3–G5); React Hook Form cân nhắc khi cần | Validate form/repository; validation server thêm ở G2 |
| Database | **Cloud Firestore Standard edition, Native mode** | Document/collection, transaction và index theo truy vấn |
| Auth | Firebase Authentication | Email/password hoặc Google; không dùng phone OTP trong MVP |
| SDK browser | Firebase Web SDK dạng modular | Đăng nhập, upload có rules; listener nếu cần |
| SDK server | Firebase Admin SDK | Session cookie, database và tác vụ nền; server tự kiểm tra quyền |
| Lưu file | Cloud Storage for Firebase | Object riêng tư, metadata trong Firestore |
| Lịch | FullCalendar 6.1.21, plugin miễn phí, mở rộng tuần trong module | Ngày/tuần/tháng/danh sách; RRule plugin chưa cần ở G5 |
| Xuất lịch | iCalendar (.ics), theo RFC 5545 | Xuất lịch có giờ/cả ngày/lặp, giữ UID và timezone |
| Editor ghi chú | Tiptap core + StarterKit + Image/TaskList, extension open-source tương thích | Nội dung định dạng, checklist và ảnh; lưu JSON có version |
| Ngày giờ | Luxon 3.7.2 + FullCalendar luxon3 | UTC/ngày địa phương, múi giờ Việt Nam độc lập timezone máy |
| Tác vụ nền | Cloud Functions gen 2 + Cloud Scheduler | Quét job nhắc mỗi phút, retry, đọc cập nhật Zalo |
| Secrets | Google Secret Manager | Bot Token và bí mật tích hợp |
| Hosting | **Vercel** | Next.js động; người dùng deploy |
| Kiểm thử | Vitest, Testing Library, Playwright, Firebase Emulator Suite | Domain, Security Rules, transactions và E2E |
| Source/CI | GitHub private repo + GitHub Actions | Kiểm tra trước triển khai |
| Giám sát | Cloud Logging + Cloud Monitoring | Lỗi và tình trạng worker |

shadcn/ui ngày 10/10/2026: Radix/Nova, TypeScript/RSC, alias `@/components/ui` và `@/lib/utils`. Button/Input/Textarea dùng chung ở màn hình/form; Cài đặt và Dự án dùng Card/Badge, thiết lập dùng NativeSelect. Tabs có role/tablist/tabpanel và điều hướng bàn phím; Lịch giữ guard nháp/pending khi chuyển tab. FullCalendar, Tiptap, file/checkbox và Radix dialog hiện hữu tiếp tục giữ hành vi nghiệp vụ. `globals.css` ánh xạ semantic utilities vào tokens MyOS, dùng muted cho chữ và surface-soft cho nền muted, primary-soft cho accent. Hệ bo góc 6/8/10 px, Be Vietnam Pro và focus nền/chữ dùng chung; không thêm viền focus nổi. CLI `init`/`apply` mặc định có thể thay màu/font nên mọi lần thêm component phải review diff. Các thay đổi UI không thay repository/schema hay quy tắc lưu.

Chọn phiên bản stable tương thích, commit lockfile; kiểm tra matrix Next.js/App Hosting trước khi chốt version. Không dùng latest tự động trong production. Functions hiện có Node.js 22 trong runtime hỗ trợ. [Quản lý Functions](https://firebase.google.com/docs/functions/manage-functions)

Dùng Zod schema và Firestore converters cho kiểu dữ liệu; không giả định TypeScript đảm bảo document cũ đúng schema. Không thêm ORM SQL.

## 3. Sơ đồ và luồng xử lý

~~~mermaid
flowchart TB
    U[Máy tính / Điện thoại] --> W[Next.js trên Vercel]
    U --> A[Firebase Authentication]
    W --> M[Service theo phân hệ]
    M --> D[(Cloud Firestore)]
    U -->|Upload có Auth và Storage Rules| S[Cloud Storage for Firebase]
    W -->|Xác thực session, cấp URL xem có hạn| S
    C[Cloud Scheduler mỗi phút] --> F[Cloud Function xử lý nhắc]
    F -->|Transaction nhận job| D
    F --> Z[Zalo Bot API]
    Z --> P[Zalo của người dùng]
    G[Cloud Function đọc cập nhật Zalo] --> Z
    G --> D
    K[Secret Manager] --> F
    K --> G
~~~

| Lớp | Trách nhiệm |
| --- | --- |
| Presentation | Giao diện, form, thông báo lỗi |
| Application | Ca sử dụng: đặt lịch, cập nhật dự án, lưu ghi chú và cấu hình |
| Domain | Quy tắc ngày giờ, lịch lặp, tiến độ và phiên bản nội dung |
| Infrastructure | Repository Firestore, Storage và adapter Zalo |

Luồng ghi hiện tại: **Form → service → repository HTTP → Route Handler → xác thực session/CSRF/UID/Zod → Firestore transaction**.

- Dùng Firebase Auth ở browser; endpoint session kiểm tra ID token, recent sign-in và chống CSRF trước khi tạo HttpOnly/Secure cookie. Server xác minh cookie cho từng thao tác; đăng xuất xóa cookie và state browser. [Session cookies](https://firebase.google.com/docs/auth/admin/manage-cookies)
- Admin SDK **bỏ qua Firestore Security Rules** và dùng IAM; mọi server service phải lấy UID từ session đã xác thực, tự kiểm tra quyền và phạm vi đường dẫn. Không tin UID do form gửi lên. [Firestore security](https://firebase.google.com/docs/firestore/security/overview)
- Bản đầu thao tác CRUD qua server. Browser chỉ trực tiếp đăng nhập/upload; đọc realtime bằng SDK chỉ bổ sung cho truy vấn có rules và giới hạn rõ ràng.
- Domain/service dùng chung giữa Next.js và Functions qua package nội bộ; không import Next.js hoặc UI vào worker.
- Không cache dữ liệu cá nhân ở CDN dùng chung. Cache nội bộ phải theo UID và có invalidation.
- Transaction có thể chạy lại callback: **không gửi Zalo hoặc gọi dịch vụ ngoài bên trong transaction**. [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)

## 4. Cấu trúc mã nguồn mục tiêu

Một repository, pnpm workspace nhỏ cho web, worker và mã domain dùng chung. **Cây dưới đây là mục tiêu tổng thể**, không phải danh sách file đã viết. Web/config/CI đã có; domain, worker và API nghiệp vụ còn định hướng, không tạo thư mục giữ chỗ. Module một màn hình dùng file trực tiếp trong module; chỉ tạo components khi có nhiều thành phần thực tế. Xem [bản đồ source thực tế](docs/SOURCE_MAP.md).

~~~text
MYOS/
├── MYOS_ARCHITECTURE.md
├── README.md
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── apphosting.yaml                  # runtime/env của App Hosting
├── firebase.json                    # Functions, rules, indexes, emulators
├── .firebaserc                      # aliases dev/staging/production
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── .env.example
├── .gitignore
├── .github/workflows/ci.yml
├── public/{icons,manifest.webmanifest}
├── src/
│   ├── app/
│   │   ├── layout.tsx              # root: html lang=vi, body, font, metadata
│   │   ├── page.tsx                # chuyển tới dashboard/login theo session
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── global-error.tsx        # lỗi root layout, UI tối giản
│   │   ├── (auth)/login/page.tsx
│   │   ├── (private)/layout.tsx    # khung sidebar/header dùng chung
│   │   ├── (private)/error.tsx     # lỗi nội dung trong vùng đăng nhập
│   │   ├── (private)/dashboard/page.tsx
│   │   ├── (private)/dashboard/loading.tsx
│   │   ├── (private)/projects/page.tsx
│   │   ├── (private)/projects/[projectId]/page.tsx
│   │   ├── (private)/calendar/page.tsx
│   │   ├── (private)/notes/page.tsx
│   │   ├── (private)/notes/[noteId]/page.tsx
│   │   ├── (private)/settings/page.tsx
│   │   └── api/
│   │       ├── auth/{session,logout}/route.ts
│   │       ├── calendar/export/route.ts
│   │       └── integrations/zalo/connect/route.ts
│   ├── modules/
│   │   ├── overview/
│   │   ├── calendar/
│   │   ├── projects/
│   │   ├── notes/
│   │   └── settings/
│   ├── components/{app-shell,page-ui}.tsx
│   └── lib/
│       ├── firebase/{client,admin}.ts
│       ├── auth/                  # require-user, session, DAL server-only
│       └── firestore/               # repository helper/converters
├── packages/
│   └── domain/                      # TypeScript thuần, dùng bởi web và worker
│       ├── package.json
│       └── src/{schemas,datetime,recurrence,progress,notes,notifications}
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── scheduled/{dispatch-reminders,poll-zalo,recurring-items}.ts
│       ├── adapters/zalo.ts
│       ├── services/attachments.ts   # hạ tầng dùng chung, không phải mục menu
│       └── lib/{firebase,logging}.ts
├── scripts/{seed-emulator,migrations}/
├── tests/{unit,integration,rules,e2e}/
└── docs/                           # SOURCE_MAP.md và tài liệu bổ sung
    ├── SOURCE_MAP.md
    ├── decisions/
    └── runbooks/
~~~

Mỗi module có components, actions, service, repository, schemas/types khi cần. Tìm kiếm, upload, nhắc lịch và adapter tích hợp là dịch vụ dùng chung; không tạo thêm phân hệ trong giao diện. app chỉ điều phối routing và layout. packages/domain không có secrets hoặc Admin SDK. Khi deploy Functions, build/bundle phần domain vào artifact; không phụ thuộc symlink ngoài thư mục được upload. CI hiện kiểm tra web; bổ sung build worker khi có implementation.

Schema được quản lý bằng Zod/types, schemaVersion, scripts migration, rules và indexes trong Git. Không còn migration SQL, RPC hoặc types sinh từ PostgreSQL.

## 5. Thiết kế đúng 5 phân hệ

### 5.1. Tổng quan — nhìn tổng thể hệ thống

**Mục tiêu:** mở ứng dụng là biết lịch sắp tới, tình trạng các dự án và nội dung cần chú ý.

| Thành phần | Nội dung và thao tác |
| --- | --- |
| Hôm nay | Ngày hiện tại, lịch hôm nay, sự kiện tiếp theo, lịch quan trọng |
| Dự án | Dự án đang thực hiện, phần trăm tiến độ, mốc sắp đến hạn |
| Ghi chú | Ghi chú được ghim, vừa sửa, ghi chú liên quan tới lịch hôm nay |
| Thông báo | Nhắc lịch chưa đọc; tình trạng kết nối Zalo khi có vấn đề |
| Tạo nhanh | Tạo lịch hẹn, dự án hoặc ghi chú văn bản/hình ảnh |
| Tìm kiếm chung | Tìm tên lịch, dự án, ghi chú; kết quả mở đúng phân hệ |

Chỉ tổng hợp từ dữ liệu gốc. Mọi số liệu/cảnh báo bấm được để đi tới dữ liệu tương ứng. Dashboard không có dữ liệu thì hiển thị trạng thái trống và thao tác bắt đầu, không dùng số minh họa như dữ liệu thật.

**Màn hình:** /dashboard. Bản mobile ưu tiên lịch tiếp theo, dự án đang làm và nút ghi chú nhanh.

### 5.2. Lịch — lịch hẹn và thời khóa biểu

**Mục tiêu:** trải nghiệm lịch cá nhân gần cách sử dụng Google Calendar, phù hợp dữ liệu của MyOS.

| Nhóm chức năng | Thiết kế |
| --- | --- |
| Xem lịch | Tháng, tuần, ngày, danh sách; Hôm nay; chuyển nhanh ngày/tháng |
| Lịch hẹn | Tên, nội dung, giờ bắt đầu/kết thúc, địa điểm/link, sự kiện cả ngày |
| Nhóm lịch | Cá nhân, học tập, công việc hoặc nhóm tự tạo; màu và bật/tắt hiển thị |
| Thời khóa biểu | Chọn các thứ, giờ bắt đầu/kết thúc, ngày hiệu lực; lặp hằng tuần, có thể nhiều buổi |
| Lịch lặp | Hằng ngày/tuần/tháng, khoảng lặp, ngày kết thúc; ưu tiên tuần cho thời khóa biểu |
| Sửa chuỗi | Sửa/xóa một buổi, từ buổi này trở đi, hoặc toàn chuỗi |
| Đánh dấu | Quan trọng, đã hoàn thành, đã hủy; màu nhãn và ghi chú riêng |
| Nhắc lịch | Đúng giờ/trước một khoảng; nhắc trong app và Zalo khi đã kết nối |
| Thao tác | Bấm ô để tạo; kéo thả/đổi thời lượng có xác nhận kết quả lưu; mobile có form tương đương |
| Liên kết | Gắn dự án, mốc dự án hoặc ghi chú liên quan |
| Xuất lịch | Xuất .ics theo nhóm/khoảng ngày hoặc toàn bộ; in lịch tuần/tháng, lưu PDF qua chức năng in |

Ví dụ thời khóa biểu: **Học tiếng Anh, thứ 2–4–6, 19:00–20:30, hiệu lực 01/11 đến 31/12**. Sinh các buổi theo timezone; có thể bỏ một ngày nghỉ hoặc đổi giờ riêng một buổi.

**Quy tắc lịch lặp:** dùng series master + recurrence rule + exceptions. Không tạo vô hạn document cho mọi buổi. Hiển thị theo cửa sổ truy vấn; tạo job nhắc trong cửa sổ tương lai, ví dụ 30 ngày, và bổ sung định kỳ. “Từ buổi này trở đi” tách chuỗi và chặn job cũ; hoàn thành một buổi không hoàn thành cả chuỗi. Sự kiện trùng giờ được cảnh báo, người dùng vẫn có thể giữ cả hai.

**Quy tắc xuất:** .ics theo iCalendar, UID ổn định, ngày cả ngày đúng kiểu DATE, lịch có giờ có timezone rõ ràng, chuỗi có RRULE/EXDATE/RECURRENCE-ID phù hợp. Trạng thái hoàn thành riêng của MyOS có thể không được ứng dụng khác hiển thị giống nhau. Export là bản chụp dữ liệu, không tự tạo đồng bộ hai chiều với Google Calendar. Khi chỉ xuất một khoảng ngày, có thể xuất các buổi độc lập với UID theo occurrence để tránh nhập cả chuỗi ngoài khoảng chọn.

**Màn hình:** /calendar; form tạo/sửa dạng panel; trang xuất nằm trong Lịch. Cấu hình nhắc mặc định nằm trong Cài đặt.

Nguồn kỹ thuật: [FullCalendar RRule](https://fullcalendar.io/docs/rrule-plugin), [iCalendar RFC 5545](https://www.rfc-editor.org/rfc/rfc5545).

### 5.3. Dự án — nội dung và tiến độ

**Mục tiêu:** quản lý các dự án đang làm, nội dung liên quan và mức hoàn thành.

- Danh sách dạng thẻ/bảng; lọc Đang làm, Tạm dừng, Hoàn thành, Lưu trữ.
- Tạo dự án với tên, mô tả/nội dung định dạng, ngày bắt đầu, hạn dự kiến, màu và ảnh bìa tùy chọn.
- Trang chi tiết có Tổng hợp, Nội dung, Các mốc/checklist, Lịch liên quan và Ghi chú liên quan.
- Cập nhật tiến độ bằng thanh 0–100% hoặc theo checklist hoàn thành; mỗi dự án chọn một cách rõ ràng.
- Checklist/mốc là phần bên trong dự án: tên, nội dung, trạng thái, hạn và thứ tự; không tạo mục quản lý công việc riêng.
- Ghim dự án quan trọng; lịch sử cập nhật nội dung/tiến độ ở mức cần thiết.
- Gắn ghi chú và hình ảnh/tài liệu; tạo lịch từ mốc dự án, mở lịch để chỉnh giờ.

**Quy tắc tiến độ:** chế độ thủ công cho phép nhập phần trăm. Chế độ checklist tính số mục hoàn thành / số mục được tính tiến độ, trọng số bằng nhau ở bản đầu; khi chưa có mục thì hiển thị “Chưa có dữ liệu”, không tự coi là 100%. Các mốc có countsTowardProgress để tránh đếm hai lần. Chuyển chế độ phải hiển thị tác động và lưu giá trị thủ công trước đó.

Ngày đến hạn của mốc và giờ đặt lịch là hai trường khác nhau. Đổi giờ buổi làm không tự đổi hạn dự án. Lưu trữ vẫn giữ dữ liệu liên quan; lịch tương lai chỉ hủy nếu người dùng chọn rõ.

**Màn hình:** /projects và /projects/{projectId}.

### 5.4. Ghi chú — văn bản, hình ảnh và nội dung cá nhân

**Mục tiêu:** trải nghiệm gần Notes trên iPhone: tạo nhanh, dễ đọc, nhập ảnh/nội dung và tìm lại thuận tiện.

| Nhóm | Thiết kế |
| --- | --- |
| Tạo ghi chú | Ghi chú trống, từ một đoạn nội dung dán, hoặc chọn một/nhiều ảnh |
| Nội dung | Tiêu đề, rich text, heading, danh sách, checklist, liên kết |
| Hình ảnh | Upload/kéo thả/dán từ clipboard nếu trình duyệt hỗ trợ; xem ảnh lớn và sắp xếp trong nội dung |
| Mobile | Chọn ảnh từ thư viện hoặc chụp bằng bộ chọn tệp khi thiết bị hỗ trợ |
| Đính kèm | Ảnh/PDF và file thông thường trong ghi chú; ảnh/PDF preview, định dạng khác tải xuống |
| Tổ chức | Thư mục ghi chú, tag, ghim, sắp theo ngày sửa/tạo |
| Liên kết | Gắn dự án; gắn ghi chú vào lịch hẹn; mở lại từ Tổng quan |
| Lưu | Autosave có trạng thái Đang lưu/Đã lưu/Lỗi; phát hiện thay đổi từ thiết bị khác |
| Xóa/khôi phục | Thùng rác của Ghi chú và khôi phục trước khi hết retention cấu hình |
| Tìm | Tiêu đề, tag; tìm nội dung trong tập đã tải có giới hạn, nâng cấp full-text sau |

**Editor:** dùng Tiptap với extension open-source phù hợp. Lưu document JSON có version, kèm plainText/titleNormalized phục vụ preview và tìm kiếm; render bằng danh sách node cho phép và sanitize khi xuất HTML. Ảnh ở Storage, node chỉ tham chiếu attachmentId, không nhúng base64. [Tiptap Editor](https://tiptap.dev/docs/editor/getting-started/overview)

**Autosave:** debounce sau khi ngừng gõ, ví dụ 1–2 giây; ghi version theo optimistic concurrency. Nếu version server đã thay đổi, giữ bản nháp và cho chọn bản cần giữ, không âm thầm ghi đè. Khi offline, thể hiện chưa đồng bộ; không báo “Đã lưu” trước khi server xác nhận. Version/revision cũ có giới hạn số lượng và retention để kiểm soát chi phí.

**Tính năng thông minh đề xuất theo mức:**

- Bản đầu: checklist, mẫu ghi chú, gợi ý gắn dự án từ thao tác người dùng, phát hiện link/ngày giờ để hiện nút “Tạo lịch”; luôn xem lại ngày/giờ trước khi lưu lịch.
- Nâng cấp tùy chọn: OCR lấy chữ từ ảnh để tìm hoặc tạo nội dung; tóm tắt ghi chú, gợi ý tiêu đề/tag. Từng chức năng có trạng thái xử lý và người dùng duyệt kết quả.
- OCR/AI chỉ chạy khi người dùng chọn; quyết định provider, chi phí và việc gửi nội dung ra dịch vụ xử lý phải được làm rõ trước khi tích hợp. Không cần AI để hoàn thành bản Ghi chú cơ bản.

**Màn hình:** /notes và /notes/{noteId}; desktop có thư mục → danh sách → editor; mobile chuyển giữa danh sách và nội dung.

Ảnh/tài liệu được quản lý trong Ghi chú hoặc phần đính kèm của Dự án; không có phân hệ kho file riêng. “Gửi ảnh” trong phạm vi bản đầu nghĩa là tải/dán ảnh vào MyOS; nhập ảnh bằng tin nhắn Zalo là khả năng bổ sung nếu người dùng muốn sau này.

### 5.5. Cài đặt — cấu hình và tài khoản

- Hồ sơ: tên hiển thị, tên người dùng, avatar; tài khoản đăng nhập và provider đang liên kết.
- Đăng nhập: email/password hoặc Google ở bản đầu. Tên người dùng là thông tin hồ sơ; nếu muốn đăng nhập bằng username riêng, cần thêm ánh xạ duy nhất và quy trình riêng. Không tự coi đổi tên hồ sơ là đổi email đăng nhập.
- Đổi email/mật khẩu theo Firebase Auth, xác thực lại khi cần; không lưu mật khẩu trong Firestore.
- Giao diện: sáng/tối/hệ thống, màn hình mặc định, mật độ hiển thị.
- Lịch: timezone, ngày đầu tuần, khung giờ hiển thị, nhóm lịch và thời gian nhắc mặc định.
- Ghi chú: mẫu mặc định, cách sắp xếp, retention thùng rác và tùy chọn lưu bản nháp.
- Thông báo: bật/tắt, kết nối/ngắt Zalo, gửi thử; hiển thị rõ múi giờ và tùy chọn giờ yên lặng.
- Dữ liệu: xuất dữ liệu cá nhân, tình trạng sao lưu, dung lượng file; thiết lập liên quan OCR/AI khi được bổ sung.

Giờ yên lặng mặc định tắt để tránh mất nhắc quan trọng. Nếu bật, lựa chọn rõ bỏ qua hay chuyển tới giờ tiếp theo và áp dụng giới hạn quá hạn; không trì hoãn lịch hẹn cũ rồi gửi hàng loạt.

**Màn hình:** /settings, chia các tab Hồ sơ, Giao diện, Lịch, Ghi chú, Thông báo, Dữ liệu. Đây là các nhóm cấu hình trong một phân hệ.

### 5.6. Mối liên kết và điều hướng

~~~mermaid
flowchart LR
    O[Tổng quan] --> C[Lịch]
    O --> P[Dự án]
    O --> N[Ghi chú]
    P <-->|Mốc và buổi làm| C
    P <-->|Nội dung và hình ảnh| N
    C <-->|Ghi chú buổi hẹn| N
    S[Cài đặt] --> O
    S --> C
    S --> P
    S --> N
~~~

Ví dụ: tạo dự án “Học tiếng Anh” → thêm ghi chú kèm ảnh bài học → đặt thời khóa biểu thứ 2–4–6 → cấu hình nhắc Zalo → Tổng quan hiển thị buổi tới và tiến độ dự án. Tìm kiếm và tạo nhanh luôn mở đúng một trong năm phân hệ; không mở thêm mục menu độc lập.

## 6. Firestore: dữ liệu cho 5 phân hệ

Collection theo UID; dữ liệu hỗ trợ nhắc/upload nằm riêng để server xử lý. Đây là cấu trúc mục tiêu:

~~~text
users/{uid}                          # hồ sơ, timezone, preferences
├── projects/{projectId}
│   ├── items/{itemId}                # checklist/mốc của dự án
│   └── updates/{updateId}            # lịch sử cập nhật cần thiết
├── calendarGroups/{groupId}
├── events/{eventId}                  # lịch đơn hoặc master của chuỗi
├── eventExceptions/{exceptionId}     # override/hủy/hoàn thành một occurrence
├── reminders/{reminderId}
├── notes/{noteId}
│   └── revisions/{revisionId}        # phiên bản có retention
├── noteFolders/{folderId}
├── attachments/{attachmentId}        # metadata; bytes ở Storage
├── tags/{tagId}
└── notifications/{notificationId}    # hiển thị trong Tổng quan/Lịch

notificationJobs/{jobId}              # server-only
notificationJobs/{jobId}/attempts/{attemptId}
integrationConnections/{connectionId} # server-only; UID/provider/chatId
integrationPairings/{codeHash}         # server-only; mã một lần có TTL
system/workerState                    # cursor/lease và heartbeat
users/{uid}/sessions/{hash}           # phiên server, client không truy cập
~~~

| Collection | Trường chính |
| --- | --- |
| users | displayName, username, avatarAttachmentId, timezone, preferences |
| projects | title, descriptionJson, status, startDate, dueDate, progressMode, manualProgress, pinned |
| project items | title, description, kind, status, dueDate, sortOrder, countsTowardProgress |
| calendarGroups | title, color, visible, sortOrder |
| events | calendarGroupId, projectId, projectItemId, noteId, title, description, startsAt/endsAt hoặc startDate/endDateExclusive, timezone, recurrence, status, important, scheduleVersion |
| eventExceptions | eventId, occurrenceKey, originalStart, override thời gian/nội dung/status, canceled, parentVersion |
| reminders | eventId, offsetMinutes, channel, enabled; cấu hình chung cho chuỗi hoặc override |
| notes | title, contentJson, plainText, titleNormalized, folderId, projectId, tagIds, pinned, version, deletedAt |
| attachments | ownerType note/project, ownerId, objectPath, MIME, byteSize, uploadStatus, createdAt |
| notificationJobs | uid, eventId, reminderId, occurrenceKey, scheduleVersion, dueAt, nextAttemptAt, expiresAt, state, leaseUntil, leaseToken |
| integrationConnections | uid, provider, recipientId, enabled; token trong Secret Manager |

### Quy tắc dữ liệu

- Zod/types/converters, schemaVersion, createdAt/updatedAt bằng server timestamp. ID ngẫu nhiên cho dữ liệu thường; jobId xác định theo UID/reminder/occurrence/version/channel.
- Firestore Timestamp cho instants; chuỗi YYYY-MM-DD cho date-only, timezone IANA rõ ràng. Cả ngày dùng endDateExclusive. Không ép ngày cả ngày thành 00:00 UTC.
- ProjectId, noteId, groupId và projectItemId phải tồn tại cùng users/{uid}; Firestore không áp foreign key/cascade, service kiểm tra.
- items thuộc dự án; event chỉ liên kết, không sao chép toàn bộ nội dung/mốc. Tiến độ có một chế độ xác định; dữ liệu Tổng quan có thể tính lại.
- Recurrence lưu ngay trên event master; exception định danh theo series + original occurrence. Đổi giờ một buổi vẫn giữ original occurrence key để không tạo bản sao.
- Lịch qua nhiều ngày phải có duration/query window phù hợp; không chỉ query startsAt trong tuần rồi bỏ sót event bắt đầu trước tuần và vẫn kéo dài tới tuần đó. Chuỗi lặp được lọc theo khoảng hiệu lực rồi expand trong cửa sổ hiển thị.
- Giới hạn reminder mỗi event và transaction nhỏ; job cũ kiểm tra scheduleVersion khi gửi. Chuỗi được materialize trong cửa sổ hữu hạn, không ghi mọi buổi từ nay mãi mãi.
- Notes dùng contentJson có giới hạn kích thước dưới giới hạn document Firestore. Ghi chú quá dài cần tách content blocks/đưa revision lớn sang Storage trong thiết kế mở rộng; không nhúng ảnh base64. [Firestore limits](https://firebase.google.com/docs/firestore/quotas)
- Attachments gắn vào một chủ sở hữu note hoặc project; node ảnh chứa attachmentId. Khi tham chiếu ảnh của ghi chú từ dự án, dùng liên kết ghi chú để giữ ownership rõ ràng.
- Autosave transaction so sánh version; giữ draft khi conflict và retry có kiểm soát. Revision không nhân đôi mỗi phím gõ.
- Xóa mềm ghi chú giữ ảnh để khôi phục; dọn object sau retention và sau khi kiểm tra không còn chủ sở hữu hợp lệ. Xóa document cha không tự xóa subcollection.
- Dọn upload pending/ảnh mồ côi bằng worker; status ready chỉ sau khi server kiểm tra object/MIME/size. Thùng rác/retention là khả năng trong Ghi chú/Cài đặt.

### Query, index và tìm kiếm

Composite indexes theo projects status/updatedAt, events group/startsAt và nhóm lịch lặp còn hiệu lực, notes folder/pinned/updatedAt/titleNormalized, jobs state/nextAttemptAt và processing/leaseUntil. Pagination, giới hạn cửa sổ lịch và limit danh sách để kiểm soát reads.

Firestore Standard không có JOIN SQL. Server tổng hợp Tổng quan từ lịch/dự án/ghi chú theo UID; có thể cache ngắn theo UID và version. Chỉ thêm projection có thể rebuild khi số đo cho thấy cần.

Tìm kiếm chung ưu tiên titleNormalized/prefix/tag, gom kết quả ba loại lịch/dự án/ghi chú. Tìm nội dung toàn kho, OCR chữ trong ảnh và full-text cần thiết kế index/provider riêng; không tải toàn bộ nội dung mọi ghi chú mỗi lần gõ. [Text search](https://firebase.google.com/docs/firestore/enterprise/text-search)

## 7. Nhắc lịch và Zalo trên Firebase

1. Tạo event/reminder/job bằng server transaction; kết quả đã commit mới trả về thành công.
2. Một scheduled Cloud Function gen 2 chạy mỗi phút qua Cloud Scheduler. Không tạo một Scheduler job cho từng lịch cá nhân. [Scheduled Functions](https://firebase.google.com/docs/functions/schedule-functions)
3. Query batch nhỏ, ví dụ 20 job pending/retry có nextAttemptAt <= now. Transaction nhận từng job: đọc lại state, version và lease; chỉ một worker được claim.
4. Commit claim trước khi gọi Zalo. Revalidate lịch, kết nối và hạn gửi; gửi qua adapter với timeout.
5. Ghi provider message ID và trạng thái bằng leaseToken/version tương ứng, không để worker cũ ghi đè kết quả worker mới.
6. Lỗi 429/5xx retry có jitter/backoff 1–5–15 phút; tối đa 3 lần retry. Lỗi quyền/token/người nhận dừng và báo tình trạng kết nối.
7. Thu hồi job processing quá lease bằng query riêng. Quá expiresAt, ví dụ trễ trên 15 phút, ghi expired và thông báo trong app.

Scheduled function có thể được gọi lại hoặc chạy đồng thời. maxInstances/concurrency là giới hạn tài nguyên, **không thay thế transaction và lease**. Không dùng Firestore TTL để kích hoạt nhắc đúng giờ; TTL chỉ phù hợp dọn dữ liệu, callback không có thời điểm chính xác.

Mục tiêu thử nghiệm: thường gửi trong khoảng 1–2 phút quanh mốc nhắc, không phải SLA. Zalo nhận request thành công không có nghĩa người dùng đã đọc. Nếu request timeout sau khi provider đã nhận, có thể gửi trùng khi retry; lưu unknown và xử lý thận trọng, không hứa exactly-once. Lịch sửa khi lệnh gửi đã bắt đầu vẫn có cửa sổ race.

Ghép nối Zalo: người dùng đăng nhập lấy mã một lần rồi gửi mã cho Bot MyOS. Mã được hash, hết hạn và consume bằng transaction; chỉ UID đã xác thực được kết nối. Bot Token ở Secret Manager, chatId chỉ ở collection server-only. Không lấy người nhắn đầu tiên làm chủ sở hữu.

Bước đầu poll getUpdates theo lịch phù hợp hạn mức; giữ cursor/lease bền vững, xử lý cập nhật idempotent. Chưa cần long polling vô hạn. Nếu chuyển webhook, kiểm tra cơ chế xác thực nhà cung cấp trước khi mở endpoint.

Nguồn: [Tạo Zalo Bot](https://docs.zaloplatforms.com/docs/BOT/create_bot), [sendMessage](https://docs.zaloplatforms.com/docs/BOT/apis/sendMessage).

Chỉ bật production sau thử gửi sau 10 phút, ngày hôm sau khi không tương tác, token lỗi, người nhận ngừng kết nối và kiểm tra hạn mức/phí. Nếu Zalo chưa đáp ứng, vẫn lưu lịch/job và thông báo trong app; email/Web Push là kênh bổ sung sau.

## 8. Hosting, vùng triển khai và ngân sách

### Phương án ưu tiên

| Thành phần | Nơi triển khai |
| --- | --- |
| Next.js có server | Vercel (người dùng deploy) |
| Database | Cloud Firestore Standard, Native mode |
| Đăng nhập | Firebase Authentication |
| Ảnh/tài liệu | Cloud Storage for Firebase |
| Worker | Cloud Functions gen 2 + Cloud Scheduler |
| Secrets | Secret Manager |
| Source | GitHub private repository |

Đề xuất **Singapore, asia-southeast1**, cho Firestore và compute khi dịch vụ hỗ trợ; chọn bucket cùng vùng khi tạo. App Hosting hiện có Singapore. Vị trí từng tài nguyên phải được cấu hình riêng, không giả định chọn project region sẽ đặt tất cả dịch vụ cùng nơi. [App Hosting regions](https://firebase.google.com/docs/app-hosting/about-app-hosting), [Firestore locations](https://firebase.google.com/docs/firestore/locations)

### Nếu muốn Firebase Hosting truyền thống

Có thể đổi frontend thành **React + Vite SPA**, host static trên Firebase Hosting, dùng Firebase Auth/Firestore Web SDK và callable/HTTP Functions cho nghiệp vụ server. Đây là phương án hợp lý nếu không cần Next.js server rendering.

Next.js static export cũng cần bỏ/thay Server Actions và các khả năng cần server; không upload build tĩnh rồi mong API/session server tiếp tục chạy. Người dùng đã chọn Vercel để giữ Next.js có server.

### Chi phí

- App Hosting cần Blaze. Chi phí gồm compute, build, bandwidth, artifacts/logs/secrets tùy mức dùng; có allowance miễn phí. [App Hosting costs](https://firebase.google.com/docs/app-hosting/costs)
- Cloud Storage for Firebase hiện cần Blaze; hạn mức miễn phí phụ thuộc bucket và vùng, không mặc định bucket Singapore có mọi quota miễn phí của vùng Mỹ. [Storage billing requirements](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)
- Firestore tính phí đọc/ghi/xóa, index/storage và một số loại truy vấn. Một database đủ điều kiện hiện có quota miễn phí 50.000 reads, 20.000 writes và 20.000 deletes/ngày, 1 GiB lưu trữ; backup/PITR không nằm trong quota miễn phí. [Firestore pricing](https://firebase.google.com/docs/firestore/pricing)
- Quét worker mỗi phút khoảng 43.200 lần/30 ngày; mỗi query rỗng vẫn có chi phí đọc tối thiểu. Poll Zalo và heartbeat tạo thêm tải. Listener cũng phát sinh reads khi document thay đổi/reconnect.
- Ngân sách thử nghiệm đề xuất 5–10 USD/tháng để theo dõi, **đây là mức dự trù, không phải báo giá hoặc giới hạn cứng**. Chưa thể chốt hóa đơn trước khi đo cấu hình, storage, backup và traffic. Phí Zalo/domain tính riêng.
- Đặt budget alerts và giới hạn maxInstances; minInstances = 0 ban đầu nếu chấp nhận cold start. Budget alert không tự khóa tổng chi phí; giới hạn compute cũng không chặn mọi phí Firestore/Storage. Kiểm tra bill sau tuần thử đầu tiên.

Local dùng Emulator Suite; cloud thử nghiệm bắt đầu bằng tài nguyên nhỏ. Không cần gói cố định 25 USD/tháng của thiết kế cũ, nhưng Blaze có thể phát sinh tiền theo mức dùng.

## 9. Deploy và quản lý môi trường

Tách local/emulator, staging và production bằng Firebase project riêng; alias không được tự động mặc định vào production. Không dùng dữ liệu riêng trong seed, E2E hoặc preview.

1. Khởi tạo Next.js/workspace, Functions, Emulator Suite, rules, indexes và CI.
2. Cấu hình Auth Email/Password và session; test quyền của hai UID.
3. Tạo staging, region và billing sau khi người dùng chọn cấu hình; tạo service account quyền tối thiểu.
4. CI chạy lint/typecheck, test domain/rules/transactions, build web/worker.
5. Deploy indexes và rules tương thích; chờ index ready, chạy migration nếu có; deploy Functions khi đến phạm vi worker, web qua Vercel theo yêu cầu người dùng.
6. Smoke test lịch, job, upload và ghép nối bằng bot thử. Staging không gửi dữ liệu mẫu vào kênh production.
7. Production bật scheduler và gửi thật sau kiểm tra secrets/IAM. Theo dõi logs, job lỗi, lease và bill.

Rollback web/Functions không rollback document schema. Dùng schemaVersion, migration idempotent và expand–migrate–contract; giữ reader tương thích trước khi xóa field cũ. Deploy rules đã test và quản lý scheduler tên ổn định để tránh lịch chạy trùng.

Biến cấu hình: NEXT_PUBLIC_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID cho browser; APP_URL và project ID cho server. ZALO_BOT_TOKEN là secret server. NOTIFICATION_SEND_ENABLED tắt gửi thật trong môi trường thử.

Firebase web config/API key không phải khóa Admin; dữ liệu được bảo vệ bằng Auth/Rules. Production dùng service identity/Application Default Credentials, không commit service-account JSON. CI ưu tiên Workload Identity Federation hoặc credentials được nền tảng quản lý; không cấp Owner để tiện deploy.

## 10. Quyền, dữ liệu riêng và sao lưu

- Firestore Rules mặc định deny; chỉ grant collection/field cần thiết cho UID đúng đã xác thực. Phải viết match rõ cho subcollections; không dùng wildcard cho phép mọi dữ liệu dưới user.
- Browser không được ghi notificationJobs, integrationConnections, pairings hoặc dữ liệu tổng hợp do server quản lý. Bản đầu server thực hiện các ghi nghiệp vụ; rules cho đọc giới hạn nếu cần.
- Server Admin SDK bỏ qua Rules: kiểm tra session, ownership ở service và cấp IAM tối thiểu. Test server authorization riêng với test Rules.
- App Check là lớp bổ sung cho endpoint/SDK hỗ trợ, không thay Auth/ownership. Endpoint server có CSRF/rate limit theo tính chất thao tác.
- Storage path users/{uid}/attachments/{attachmentId}/...; Rules kiểm tra UID đã xác thực, MIME và size. Upload trực tiếp bằng SDK có Auth; server finalize xác minh object.
- Với tài liệu riêng, cấp signed URL ngắn hạn sau khi xác thực hoặc tải qua SDK có Rules; tránh dùng download-token URL dài hạn như URL công khai trong danh mục.
- Nội dung rich text/HTML xuất từ editor được sanitize. PWA không mặc định cache file riêng; đăng xuất xóa dữ liệu client. Không log Bot Token, session, signed URL hoặc toàn văn ghi chú.
- Logs vận hành giữ ID/mã lỗi/thời gian; retention dự kiến 30 ngày. Collection job lớn được dọn riêng, không dùng TTL làm scheduler.

Mục tiêu nội bộ: **RPO 24 giờ**, **RTO một ngày**, cần kiểm chứng restore. Firestore export/backup, Storage object backup và Auth user export là các phần riêng. Backup Firestore không chứa byte ảnh/PDF hoặc user Auth.

Dùng managed export/backup có billing phù hợp, lưu ở bucket backup riêng và giữ policy retention; sao chép file kèm manifest/checksum. Không cấp client quyền bucket backup. Rules/indexes/migrations trong Git; secrets phục hồi theo kế hoạch riêng. Firestore export/import có chi phí đọc/ghi và yêu cầu billing/IAM. [Export/import](https://firebase.google.com/docs/firestore/manage-data/export-import)

Restore thử hàng tháng: Auth UID phải khớp đường dẫn users/{uid}; kiểm tra quyền, lịch lặp/ngoại lệ, tiến độ dự án, nội dung ghi chú và tải ảnh thật. Không chỉ kiểm tra file export tồn tại.

## 11. Kiểm thử và vận hành

| Hạng mục | Kiểm tra cần có |
| --- | --- |
| Quyền/session | Hai UID, deny dữ liệu chéo, kiểm tra cả Rules và server; CSRF, cookie thu hồi |
| Tổng quan | Các tổng số/tiến độ và lịch tiếp theo khớp nguồn, trạng thái trống và link đúng |
| Lịch | Timezone, cả ngày, qua đêm, trùng giờ, event nhiều ngày; thêm/kéo thả/lưu thất bại |
| Thời khóa biểu | Nhiều thứ trong tuần, ngày hiệu lực, một buổi/toàn chuỗi/từ buổi này, nghỉ và đổi giờ |
| Xuất lịch | .ics Unicode, UID, DATE/timezone, RRULE/EXDATE/override; thử nhập vào trình lịch thật |
| Dự án | Tiến độ thủ công/checklist, zero items, milestone không đếm trùng, lưu trữ |
| Ghi chú | Rich text, dán nội dung, ảnh nhiều tệp, autosave, conflict hai thiết bị, thùng rác |
| Đính kèm | Upload dở, quyền, MIME/size, URL hết hạn, ảnh mồ côi và khôi phục ghi chú |
| Cài đặt | Tên hiển thị/username/email phân biệt, timezone, nhắc mặc định, kết nối/ngắt Zalo |
| Nhắc lịch | Hai worker, lease/retry, sửa/hủy một occurrence hoặc series, timeout unknown |
| Firestore | Composite indexes, pagination, schema/migration, document size |
| E2E | Dự án → ghi chú có ảnh → thời khóa biểu → nhắc → đánh dấu → Tổng quan |
| Khôi phục | Firestore + Storage + Auth UID; series/exceptions, rich text và ảnh còn đúng |

Worker heartbeat khoảng mỗi 5 phút; Cloud Monitoring kiểm tra log/metric chạy lịch và job trễ, có cảnh báo độc lập khi worker dừng. Tình trạng kết nối hoặc nhắc lỗi nằm trong Tổng quan/Cài đặt. Đo thêm reads của autosave, revision, lịch lặp và tải ảnh trước khi tối ưu.

## 12. Lộ trình thực hiện theo phạm vi mới

Kế hoạch thực hiện chi tiết: [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md), gồm 5 module nghiệp vụ, 8 giai đoạn và các mốc bàn giao. Mục này mô tả phạm vi tổng quát; kế hoạch chi tiết xác định thứ tự làm từng phần.

**Bước 0 — Đã chuẩn bị:** bộ khung thư mục và tài liệu. **G1 đã triển khai local:** framework, layout 5 mục, trang khung, Firebase lazy configuration và CI. Auth, Rules, staging, nghiệp vụ và deploy vẫn chưa triển khai; chi tiết theo IMPLEMENTATION_PLAN.md.

1. **Nền móng:** Next.js, Firebase Auth, session/UID, Rules, schema/indexes, CI, staging và shell đúng năm mục menu.
2. **Bản dùng hằng ngày:** Tổng quan cơ bản; Lịch một lần và thời khóa biểu tuần có ngày hiệu lực/ngoại lệ; Dự án và tiến độ; Ghi chú rich text/ảnh/autosave; Cài đặt hồ sơ/timezone; xuất .ics.
3. **Nhắc lịch:** Thử Zalo ngay từ sớm song song nền móng, rồi tích hợp scheduler, ghép nối và retry khi đạt; lời nhắc trong app hoạt động độc lập.
4. **Hoàn thiện:** Các kiểu lặp tháng, sửa chuỗi từ một buổi, checklist/mốc dự án, folder/tag/tìm kiếm, revision/thùng rác, in lịch và backup/restore.
5. **Thông minh tùy chọn:** Gợi ý tạo lịch từ ghi chú có xác nhận, OCR, tóm tắt/gợi ý tag; PWA và đồng bộ Google Calendar nếu sau này cần. Mỗi nâng cấp vẫn thuộc năm phân hệ.

Lịch lặp theo tuần và ghi chú hình ảnh là nhu cầu cốt lõi, được đưa vào bản dùng hằng ngày. Không chốt số tuần trước khi biết thời gian và ngân sách; mỗi bước có luồng dùng được và tiêu chí nghiệm thu.

## 13. Các quyết định còn mở

| Nội dung | Mặc định hiện tại |
| --- | --- |
| Database | Firestore Standard Native mode |
| Hosting | App Hosting cho Next.js; Hosting static là phương án SPA thay thế |
| Người dùng | Tự đăng ký, dữ liệu cách ly theo UID |
| Region | Singapore khi từng dịch vụ hỗ trợ |
| Billing | Blaze cho bộ chức năng đầy đủ; dự trù thử 5–10 USD/tháng |
| Nội dung ghi chú | Rich text + ảnh, đính kèm PDF/file; size và retention có giới hạn |
| Tiến độ dự án | Thủ công hoặc checklist; chọn chế độ mỗi dự án |
| Thời khóa biểu | Lặp tuần và ngoại lệ là phạm vi cốt lõi |
| Xuất lịch | .ics + in lịch; chưa đồng nghĩa đồng bộ Google |
| OCR/AI | Tùy chọn nâng cấp, cần chọn provider và chi phí |
| Offline | Chưa hỗ trợ ghi offline ở MVP |
| Zalo | Chưa xác nhận quyền/phí/hạn mức trên tài khoản thực |
| Full-text search | Chưa cam kết; MVP prefix/tag |
| Dữ liệu bắt buộc ở Việt Nam | Chưa có yêu cầu; cần đổi thiết kế nếu phát sinh |

Thay đổi từ phiên bản 1.1: giới hạn toàn bộ sản phẩm vào Tổng quan, Lịch, Dự án, Ghi chú và Cài đặt; cập nhật routing, schema, tests và lộ trình tương ứng. Giữ Firebase; lịch lặp và ghi chú ảnh là nhu cầu cốt lõi. Các quyết định triển khai tiếp được ghi vào docs/decisions/.

## 14. Áp dụng Next.js Learn vào MyOS

Đã đọc 16 chapter của [Next.js Learn — Dashboard App](https://nextjs.org/learn/dashboard-app), đối chiếu ngày 06/10/2026. Bảng dưới đây là quyết định áp dụng cho dự án; chưa phải mã ứng dụng đã triển khai. Khóa học minh họa bằng dashboard hóa đơn, PostgreSQL, NextAuth và Vercel. MyOS giữ **Next.js + React + TypeScript, Firestore, Firebase Auth và Vercel**, với đúng 5 phân hệ ở mục 5.

### 14.1. Đối chiếu toàn bộ chapter

| Chapter chính thức | Áp dụng cho MyOS |
| --- | --- |
| 1. [Getting Started](https://nextjs.org/learn/dashboard-app/getting-started) | Khởi tạo App Router và TypeScript; pnpm workspace cho web, worker, domain. Dữ liệu mẫu chỉ trong Emulator. |
| 2. [CSS Styling](https://nextjs.org/learn/dashboard-app/css-styling) | Tailwind, global CSS tại root layout; dùng hệ component shadcn/ui nhất quán, hỗ trợ mobile. |
| 3. [Optimizing Fonts and Images](https://nextjs.org/learn/dashboard-app/optimizing-fonts-images) | next/font có tiếng Việt; next/image với kích thước rõ ràng. Ảnh ghi chú cần luồng truy cập riêng tư. |
| 4. [Creating Layouts and Pages](https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages) | Root layout và layout vùng đăng nhập; 5 page riêng, chung sidebar/header; route chi tiết theo ID. |
| 5. [Navigating Between Pages](https://nextjs.org/learn/dashboard-app/navigating-between-pages) | Link cho điều hướng nội bộ; usePathname trong menu client để đánh dấu mục đang mở. |
| 6. [Setting Up Your Database](https://nextjs.org/learn/dashboard-app/setting-up-your-database) | Thay SQL bằng Firestore repository, indexes và Emulator. Seed bằng script cục bộ, không tạo endpoint seed công khai. |
| 7. [Fetching Data](https://nextjs.org/learn/dashboard-app/fetching-data) | Server Components gọi service trực tiếp; các truy vấn độc lập chạy song song sau xác thực, có giới hạn đọc. |
| 8. [Static and Dynamic Rendering](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering) | Dữ liệu cá nhân đọc theo session lúc request. Tách shell khỏi dữ liệu; không build sẵn dữ liệu người dùng. |
| 9. [Streaming](https://nextjs.org/learn/dashboard-app/streaming) | loading.tsx cho route; Suspense cho các khối Tổng quan, skeleton phù hợp nội dung, lỗi từng khối có đường thử lại. |
| 10. [Adding Search and Pagination](https://nextjs.org/learn/dashboard-app/adding-search-and-pagination) | Filter qua URL khi phù hợp, debounce; Firestore dùng cursor thay SQL OFFSET. Đổi filter thì reset cursor. |
| 11. [Mutating Data](https://nextjs.org/learn/dashboard-app/mutating-data) | Server Actions cho CRUD, Zod phía server, kiểm tra quyền sở hữu, cập nhật UI sau lưu và redirect khi cần. |
| 12. [Handling Errors](https://nextjs.org/learn/dashboard-app/error-handling) | Lỗi form có thông báo cụ thể; error.tsx cho lỗi bất ngờ, notFound cho tài nguyên không tồn tại/không được phép xem. |
| 13. [Improving Accessibility](https://nextjs.org/learn/dashboard-app/improving-accessibility) | Label, focus, aria-live, báo lỗi theo trường; pending khi lưu. Form đơn giản dùng useActionState khi phù hợp. |
| 14. [Adding Authentication](https://nextjs.org/learn/dashboard-app/adding-authentication) | Firebase Auth và session cookie; DAL kiểm tra session/quyền cho từng thao tác, không chỉ kiểm tra trong layout. |
| 15. [Adding Metadata](https://nextjs.org/learn/dashboard-app/adding-metadata) | Title theo phân hệ, favicon, tiếng Việt; trang cá nhân noindex, không đưa nội dung riêng tư vào metadata/OG. |
| 16. [Next Steps](https://nextjs.org/learn/dashboard-app/next-steps) | Đối chiếu API hiện hành, khóa phiên bản tương thích App Hosting; triển khai theo roadmap, đo hiệu năng và kiểm tra luồng thật. |

### 14.2. Routing và layout

Root **src/app/layout.tsx** khai báo html lang="vi", body, font và global CSS. **src/app/(private)/layout.tsx** tạo khung sidebar/header cho 5 phân hệ; mỗi page phụ trách nội dung màn hình. Nhóm **(private)** và **(auth)** chỉ tổ chức mã, không xuất hiện trong URL. Layout giữ khung giao diện khi điều hướng, tránh dựng lại sidebar ở từng page.

| URL | Phân hệ | Vai trò |
| --- | --- | --- |
| /dashboard | Tổng quan | Lịch gần nhất, tiến độ dự án, ghi chú ghim |
| /calendar | Lịch | Bộ lịch, thời khóa biểu, nhắc lịch và xuất lịch |
| /projects | Dự án | Danh sách và tiến độ |
| /projects/[projectId] | Dự án | Nội dung, checklist, mốc và cập nhật |
| /notes | Ghi chú | Danh sách/thư mục, tìm kiếm phù hợp khả năng Firestore |
| /notes/[noteId] | Ghi chú | Soạn thảo nội dung và ảnh |
| /settings | Cài đặt | Hồ sơ, tùy chọn, tài khoản và kết nối |
| /login | Đăng nhập | Màn hình kỹ thuật ngoài 5 phân hệ |

Điều hướng dùng Link; chỉ component menu cần usePathname. Bộ lọc động đọc ở page thay vì dựa vào layout giữ nguyên trạng thái. Với API Next.js hiện hành, **params và searchParams là Promise**, cần await trước khi dùng; không chép kiểu đồng bộ từ ví dụ phiên bản cũ. [Tài liệu page](https://nextjs.org/docs/app/api-reference/file-conventions/page)

### 14.3. Ranh giới server và client

Page/layout mặc định là **Server Components**. Chỉ đặt **'use client'** ở phần cần state, event handler hoặc API trình duyệt; không chuyển toàn bộ ứng dụng sang client chỉ vì có sidebar tương tác.

| Phân hệ | Phần server | Phần client |
| --- | --- | --- |
| Tổng quan | Xác thực, truy vấn các khối dữ liệu, dựng nội dung ban đầu | Tạo nhanh, menu, tương tác nhỏ |
| Lịch | Query khoảng ngày đã chọn, mở rộng lịch lặp trong khoảng, quyền truy cập | FullCalendar, chọn ngày, kéo thả, form lịch |
| Dự án | Danh sách/chi tiết đã lọc theo UID, tính tiến độ từ dữ liệu | Bộ lọc, checklist, dialog sửa |
| Ghi chú | Danh sách/chi tiết, metadata file đã được phép truy cập | Tiptap, autosave, upload, giữ bản nháp khi lỗi |
| Cài đặt | Hồ sơ và tình trạng kết nối có thể hiển thị | Form, chọn tùy chọn, thao tác kết nối/đăng xuất |

Firebase Admin, session và repository server import **server-only**. Không truyền Admin SDK, secret, DocumentSnapshot hoặc object Firestore vào client; chuyển sang DTO chỉ chứa trường cần thiết, timestamp thành chuỗi ISO/millisecond, document reference thành ID. Browser Firebase SDK chỉ dùng cho các luồng được thiết kế rõ như đăng nhập và upload.

Luồng đọc: **Server page → requireUser/DAL → service → Firestore repository → DTO → UI**. Server Components không gọi HTTP vòng về chính Route Handler của ứng dụng để đọc cùng dữ liệu. Sau xác thực, dùng Promise.all cho các truy vấn độc lập; quan hệ phụ thuộc thì đọc tuần tự. Tải theo khoảng ngày/limit, không kéo toàn bộ collections để lọc trên trình duyệt.

### 14.4. Streaming, trạng thái và lỗi

Tổng quan dùng Suspense riêng cho lịch gần nhất, tiến độ dự án và ghi chú ghim, để một truy vấn chậm không chặn mọi nội dung. loading.tsx tạo skeleton cùng bố cục; không thay dữ liệu chưa tải bằng số 0 như kết quả thật. Phân biệt đang tải, danh sách trống, lỗi, lưu thành công và chưa lưu.

error.tsx là Client Component, thông báo dễ hiểu và có thử lại; log server kèm ID để tra cứu, không hiển thị stack trace/secrets. Error boundary của segment không bắt lỗi layout cùng segment; global-error.tsx xử lý lỗi root với giao diện html/body tối giản. Trang chi tiết dùng notFound nếu document không tồn tại hoặc không thuộc UID đã xác thực. Lỗi validation/conflict autosave trả trạng thái có cấu trúc để form giữ nội dung đang nhập.

### 14.5. Form và Server Actions

Luồng ghi: **Form/client → service → repository HTTP → Route Handler → requireUser/CSRF → Zod/transaction → Firestore → làm mới UI**. Action kiểm tra lại session, quyền sở hữu và dữ liệu mỗi lần gọi; ID gửi từ client là đầu vào chưa được tin cậy.

Form đơn giản có thể dùng useActionState/useFormStatus cho lỗi và pending. Form lịch phức tạp tiếp tục dùng React Hook Form + Zod; chọn một nơi quản lý trạng thái form, tránh hai cơ chế giữ giá trị cạnh tranh. Vô hiệu hóa gửi trùng khi pending, báo lỗi theo trường, focus đúng chỗ và giữ dữ liệu sau lỗi. Client validation hỗ trợ trải nghiệm, server validation quyết định dữ liệu được lưu.

Sau lưu dùng revalidatePath hoặc trả DTO cập nhật theo luồng cụ thể. Thao tác lịch/dự án/ghi chú có thể ảnh hưởng Tổng quan, cần làm mới các phần liên quan. **revalidatePath không tự xóa cache của Firebase SDK hoặc tự cập nhật mọi projection**; service vẫn quản lý transaction, version và invalidation. redirect đặt ngoài catch rộng để không nuốt ngoại lệ điều hướng.

### 14.6. Tìm kiếm và phân trang với Firestore

URL lưu trạng thái như khoảng ngày, chế độ lịch, nhóm, trạng thái dự án khi cần chia sẻ/bookmark. Debounce khoảng 300 ms cho bộ lọc gõ chữ; đổi điều kiện phải reset pagination. Không đưa token, nội dung ghi chú nhạy cảm hoặc thông tin bí mật vào URL.

Phân trang danh sách dùng **orderBy + limit + startAfter**; thứ tự phải ổn định, có ID làm khóa phân biệt khi trường sắp xếp trùng. Cursor được kiểm tra kiểu, phạm vi UID và điều kiện query ở server; chỉ dùng lại khi query không đổi. UI ưu tiên tiếp/trước hoặc tải thêm; không hứa nhảy đến trang bất kỳ như SQL OFFSET. [Firestore query cursors](https://firebase.google.com/docs/firestore/query-data/query-cursors)

Firestore không cung cấp tìm kiếm toàn văn như SQL/full-text engine. Bản đầu giới hạn tìm theo tên/tiêu đề đã chuẩn hóa và bộ lọc có index; nếu cần tìm sâu trong nội dung ghi chú thì thiết kế giải pháp riêng, không tải mọi ghi chú mỗi lần gõ.

### 14.7. Xác thực, ảnh và metadata

Layout có thể chuyển người chưa đăng nhập về login, nhưng **không phải ranh giới bảo vệ dữ liệu**. DAL, Server Actions và Route Handlers đều kiểm tra Firebase session và quyền; Firebase Admin bỏ qua Security Rules nên kiểm tra phía server vẫn bắt buộc. Nếu dùng Proxy để điều hướng sớm thì đó là lớp bổ trợ, không thay DAL. [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication)

next/font chọn font hỗ trợ dấu tiếng Việt, giảm dịch chuyển bố cục. next/image dùng cho tài nguyên phù hợp; ảnh ghi chú riêng tư không mặc định đưa qua optimizer/cache dùng chung. Default image loader không chuyển tiếp header xác thực: phương án ban đầu là endpoint ảnh kiểm tra session/quyền, response private/no-store và Image unoptimized khi cần. Nếu dùng signed URL thì thời hạn ngắn, coi URL là quyền truy cập tạm thời; không lưu vào metadata/public log. [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)

Metadata dùng tên chung như “Lịch | MyOS”, tránh tên ghi chú/dự án riêng tư trong OG công khai. noindex/nofollow chỉ là chỉ dẫn cho crawler, không thay xác thực.

### 14.8. Tiêu chí kiểm tra khi bắt đầu lập trình

- Khung sidebar/header thống nhất ở 5 URL, mục menu active đúng; mobile và bàn phím sử dụng được.
- Truy cập page, action và API trực tiếp khi chưa đăng nhập hoặc sai UID đều bị chặn.
- Khối Tổng quan chậm có skeleton riêng; lỗi/empty state không giả thành số liệu thật.
- Form giữ nội dung khi validation hoặc lưu lỗi; pending tránh gửi lặp; lưu xong cập nhật đúng các màn hình liên quan.
- Cursor không bỏ/trùng dữ liệu do khóa sắp xếp bằng nhau; đổi filter reset cursor; query phù hợp indexes.
- Ảnh riêng tư không truy cập được sau khi thiếu quyền; mã client không chứa Firebase Admin hoặc secret.
- Build, lint, typecheck và E2E các luồng chính chạy trên cấu hình tương thích Firebase App Hosting.

Các tiêu chí này bổ sung mục 11 và roadmap mục 12, giữ nguyên phạm vi sản phẩm ở mục 5.
