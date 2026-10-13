# Sunflower — Kiến trúc source và cây thư mục

Ngày rà soát: 14/10/2026. Cơ sở: `AGENTS.md`, `DESIGN.md`, `STRUCTURE.md`, `REFERENCE_GUIDE.md`, README, package/config và toàn bộ source hoạt động trong `src/`, `scripts/`.

`AGENTS.md` duy nhất nằm ở gốc workspace, phía trên `sunflower-website/` (`../../AGENTS.md` tính từ thư mục tài liệu này). Chỉ dẫn áp dụng cho toàn bộ dự án bên dưới.

Tài liệu có một nguồn duy nhất tại `sunflower-website/docs/`; xem [INDEX.md](INDEX.md). Tài liệu ERP gốc được giữ nguyên trong [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) để đọc bối cảnh, không phải đặc tả source website. Bộ ảnh tham chiếu duy nhất nằm ở `reference/desktop/` tại gốc workspace.

## 1. Phạm vi hệ thống

Website thương hiệu Sunflower: corporate website, giới thiệu sản phẩm/giải pháp, tạo cơ hội liên hệ B2B. Đây là ứng dụng Next.js riêng; chưa kết nối Sunflower ERP, Firebase, CMS hoặc cơ sở dữ liệu.

Stack hiện tại: Next.js 16.4.0 App Router, React 19.3.0, TypeScript, Tailwind CSS 4.3.3. Inter Variable self-host qua Fontsource; license được lưu tại `public/licenses/inter-OFL.txt`.

Build là static export: `output: 'export'`, `trailingSlash: true`; kết quả nằm trong `out/`. `scripts/preview.mjs` phục vụ `out/` tại cổng 4173. Dev chạy tại cổng 3000. Cấu hình Sites giữ project hiện tại, quyền riêng tư và static directory `out`.

## 2. Cây thư mục đã khởi tạo

`[chờ]` là thư mục đã tạo với `.gitkeep`, chưa có chức năng triển khai. Các component như Footer, ProductGallery, InquiryForm sẽ được bổ sung khi đến giai đoạn tương ứng; không tạo file component rỗng hoặc khai báo đã hoàn thiện.

```text
sunflower-website/
├── .openai/hosting.json
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── next-env.d.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── docs/
│   ├── DESIGN.md
│   ├── STRUCTURE.md
│   ├── REFERENCE_GUIDE.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── MEDIA_BRIEF.md               # G0: danh sách ảnh/video đề xuất
│   ├── PROJECT_OVERVIEW.md         # Bối cảnh ERP gốc
│   └── INDEX.md                    # Bản đồ tài liệu
├── public/
│   ├── images/
│   │   ├── brand/                  # [chờ] Logo gốc
│   │   ├── hero/hero-poster.webp    # Poster trích từ video người dùng cung cấp
│   │   ├── company/                # [chờ] Ảnh doanh nghiệp
│   │   ├── products/               # [chờ] Ảnh nhóm sản phẩm
│   │   ├── solutions/              # [chờ] Ảnh ứng dụng
│   │   ├── capabilities/           # [chờ] Ảnh năng lực thực tế
│   │   ├── projects/               # [chờ] Thành phẩm được phép công bố
│   │   └── contact/                # [chờ] Ảnh liên hệ
│   ├── videos/hero/hero-desktop.mp4 # Video minh họa người dùng chọn
│   └── licenses/inter-OFL.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Font, metadata, Header, skip link
│   │   ├── globals.css             # Tokens và styles responsive
│   │   ├── page.tsx                # Trang chủ: VideoHero
│   │   ├── gioi-thieu/page.tsx
│   │   ├── san-pham/page.tsx
│   │   ├── giai-phap/page.tsx
│   │   ├── nang-luc/page.tsx
│   │   ├── du-an/page.tsx
│   │   └── lien-he/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Container.tsx
│   │   ├── ui/Arrow.tsx
│   │   ├── media/VideoHero.tsx
│   │   ├── editorial/              # [chờ] UI editorial dùng chung
│   │   ├── products/               # [chờ] UI danh mục/lọc
│   │   ├── capabilities/           # [chờ] UI quy trình/năng lực
│   │   ├── projects/               # [chờ] UI thư viện thành phẩm
│   │   └── contact/                # [chờ] UI biểu mẫu
│   ├── sections/
│   │   ├── home/                   # [chờ] Composition Trang chủ
│   │   ├── about/                  # [chờ] Composition Giới thiệu
│   │   ├── products/               # [chờ] Composition Sản phẩm
│   │   ├── solutions/              # [chờ] Composition Giải pháp
│   │   ├── capabilities/           # [chờ] Composition Năng lực
│   │   ├── projects/               # [chờ] Composition Dự án
│   │   └── contact/                # [chờ] Composition Liên hệ
│   ├── content/
│   │   ├── navigation.ts           # Sitemap và main navigation
│   │   └── hero.ts                 # Copy, CTA và cấu hình Hero media
│   ├── lib/                        # [chờ] Validation/adapters/utilities
│   ├── hooks/                      # [chờ] Hooks khi có nhu cầu tái sử dụng
│   └── types/                      # [chờ] Models dùng chung
└── scripts/preview.mjs
```

`.next/`, `node_modules/`, `out/` là thư mục sinh tự động hoặc dependency, đã được ignore. Không chỉnh trực tiếp output để phát triển tính năng.

## 3. Luồng render và dữ liệu hiện tại

```text
app/layout.tsx
  ├── Inter + globals.css + metadata/noindex
  ├── Header ← content/navigation.ts
  └── route page
       ├── / → VideoHero ← content/hero.ts → public/images|videos/hero
       └── 6 route còn lại → main + Container + H1 (chưa có nội dung chi tiết)
```

- `Header`: Client Component. Theo dõi pathname và scroll; desktop navigation; menu dialog trên màn hình nhỏ; khóa cuộn nền; vòng Tab/Shift+Tab; Escape và trả focus; đóng khi chọn link hoặc chuyển sang desktop.
- `VideoHero`: Client Component. Theo dõi reduced motion, mobile và trạng thái mạng; chọn nguồn desktop/mobile; giữ poster khi thiếu nguồn, mạng hạn chế hoặc lỗi; có trạng thái playback và pause/play.
- `heroMedia.poster` và `desktopSrc` đã trỏ tới poster/video iStock preview do người dùng cung cấp; `mobileSrc` là `null` và fallback cùng nguồn desktop. Caption ghi rõ footage minh họa ngành in. Video 768×432, 21,81 giây và có watermark, chưa có xác nhận giấy phép công khai; chưa phải footage Sunflower thực tế.
- `app/layout.tsx` và các route là Server Components theo mặc định. `Container`, `Arrow` là UI dùng chung không có state trình duyệt.
- Design tokens ở `globals.css`, ánh xạ vào Tailwind. Không có nguồn màu độc lập khác.
- Navigation có bảy route; main navigation có năm mục, CTA Header dẫn `/lien-he`.

Video Hero đã được kiểm tra trong trình duyệt tại 390×844, 768×1024, 1024×768, 1440×900 và 1920×1080: tải/playback, muted, loop, pause/play, poster tải được và không tràn ngang. Lint/typecheck/build đạt. Reduced motion và Save-Data được giữ trong logic nhưng chưa kiểm tra qua emulation trình duyệt. Ảnh kiểm tra lưu tạm ngoài source; không tái tạo thư mục QA/demo.

## 4. Vai trò từng tầng

| Tầng | Trách nhiệm | Không đặt vào đây |
|---|---|---|
| `app/` | Route, metadata, composition đầu vào | Toàn bộ UI/phân hệ trong một page lớn |
| `sections/` | Bố cục nội dung theo trang | Business logic dùng chung |
| `components/` | UI có mục đích rõ, media và tương tác | Số liệu hoặc dữ liệu doanh nghiệp bịa |
| `content/` | Copy, catalogue và dữ liệu công khai được xác nhận | Thông tin khách hàng/PO nội bộ |
| `types/` | Models TypeScript dùng chung khi triển khai | Schema giả định chưa cần thiết |
| `lib/` | Validation, helpers, approved adapters | Secret viết trực tiếp vào frontend |
| `hooks/` | Logic client thật sự cần tái sử dụng | Hook rỗng hoặc abstraction chỉ dùng một lần |
| `public/` | Media được phép công bố | Ảnh tham chiếu Sonoco hoặc dữ liệu ERP |

Component chỉ được viết khi đến slice triển khai hoặc có nhu cầu tái sử dụng. Thư mục khung được tạo theo yêu cầu khởi tạo cây thư mục của người dùng, không có nghĩa tất cả tính năng đã hoàn thành.

## 5. Bảy trang và chức năng được giữ trong kế hoạch

| Route | Trạng thái hiện tại | Chức năng theo STRUCTURE, chưa triển khai đầy đủ |
|---|---|---|
| `/` | Header + Hero | Introduction, nhóm sản phẩm, năng lực, giải pháp, dự án, quy trình và CTA |
| `/gioi-thieu` | Route + tiêu đề + metadata | Company story, giá trị, con người và liên kết liên quan |
| `/san-pham` | Route + tiêu đề + metadata | Catalogue, category navigation/filter và inquiry context |
| `/giai-phap` | Route + tiêu đề + metadata | Bài toán → giải pháp → sản phẩm liên quan → liên hệ |
| `/nang-luc` | Route + tiêu đề + metadata | Năng lực, máy móc, quy trình, QC và ảnh minh chứng được xác nhận |
| `/du-an` | Route + tiêu đề + metadata | Gallery thành phẩm/dự án và bộ lọc khi có dữ liệu thật |
| `/lien-he` | Route + tiêu đề + metadata | Liên hệ được xác nhận và intake/báo giá có endpoint thật |

Danh mục 13 nhóm trong STRUCTURE là danh sách làm việc chờ xác nhận, chưa phải catalogue công bố. Context link tương lai dùng slug đã kiểm tra; không dùng ID nội bộ. Không có checkout, login, API route, form gửi hoặc database trong source hiện tại.

## 6. Điều kiện để triển khai tiếp

- Logo gốc, video/poster được cấp phép, nội dung và ảnh thực tế theo media inventory.
- Xác nhận dữ liệu sản phẩm, năng lực, dự án và kênh liên hệ.
- Vì app hiện xuất static, xử lý intake server cần endpoint/backend được duyệt hoặc thay đổi deployment architecture có chủ đích. Không tự thêm API route động vào static export hoặc giả trạng thái đã gửi.
- Sitemap/robots công khai, trang chi tiết và biểu mẫu/backend sẽ được thêm theo phạm vi được duyệt; website đang phát triển hiện giữ noindex.

## 7. Trạng thái sau khi dọn source

Cây thư mục bảy trang và design tokens được giữ. Đã loại bỏ demo HTML cũ, ảnh/báo cáo QA, poster minh hoạ, component PendingPage và thông báo bản thử trong menu. Sáu trang con chỉ giữ cấu trúc semantic, tiêu đề và metadata; chưa triển khai catalogue, Footer hoặc biểu mẫu. `scripts/preview.mjs` là công cụ phục vụ static export thực tế, được giữ cùng các script lint/typecheck/build.
