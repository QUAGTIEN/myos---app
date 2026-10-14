# Sunflower — Kiến trúc source và cây thư mục

Ngày rà soát: 14/10/2026. Cơ sở: `AGENTS.md`, `DESIGN.md`, `STRUCTURE.md`, `REFERENCE_GUIDE.md`, README, package/config và toàn bộ source hoạt động trong `src/`, `scripts/`.

`AGENTS.md` duy nhất nằm ở gốc workspace, phía trên `sunflower-website/` (`../../AGENTS.md` tính từ thư mục tài liệu này). Chỉ dẫn áp dụng cho toàn bộ dự án bên dưới.

Tài liệu có một nguồn duy nhất tại `sunflower-website/docs/`; xem [INDEX.md](INDEX.md). Tài liệu ERP gốc được giữ nguyên trong [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) để đọc bối cảnh, không phải đặc tả source website. Bộ ảnh tham chiếu duy nhất nằm ở `reference/desktop/` tại gốc workspace.

## 1. Phạm vi hệ thống

Website thương hiệu Sunflower: corporate website, giới thiệu sản phẩm/giải pháp, tạo cơ hội liên hệ B2B. Đây là ứng dụng Next.js riêng; chưa kết nối Sunflower ERP, Firebase, CMS hoặc cơ sở dữ liệu.

Stack hiện tại: Next.js 16.4.0 App Router, React 19.3.0, TypeScript, Tailwind CSS 4.3.3. Inter Variable self-host qua Fontsource; license được lưu tại `public/licenses/inter-OFL.txt`.

Build là static export: `output: 'export'`, `trailingSlash: true`; kết quả nằm trong `out/`. `scripts/preview.mjs` phục vụ `out/` tại cổng 4173. Dev chạy tại cổng 3000. Cấu hình Sites giữ project hiện tại, quyền riêng tư và static directory `out`.

## 2. Cây thư mục đã khởi tạo

`[chờ]` là thư mục đã tạo với `.gitkeep`, chưa có chức năng triển khai. G2 đã bổ sung Footer, ProductGallery và các component editorial/CTA; InquiryForm còn chờ. Không tạo component rỗng.

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
│   ├── CONTENT.md                  # G0: copy bảy trang, chưa đưa toàn bộ lên UI
│   ├── PROJECT_OVERVIEW.md         # Bối cảnh ERP gốc
│   └── INDEX.md                    # Bản đồ tài liệu
├── public/
│   ├── images/
│   │   ├── brand/                  # [chờ] Logo gốc
│   │   ├── hero/hero-poster.webp    # Poster trích từ video người dùng cung cấp
│   │   ├── company/                # 5 JPG gốc + 5 WebP delivery, G2 render với caption/credit
│   │   ├── products/               # 9 PNG gốc + 9 WebP delivery; thiếu ảnh 4 nhóm
│   │   ├── solutions/              # [chờ] Ảnh ứng dụng
│   │   ├── capabilities/           # [chờ] Ảnh năng lực thực tế
│   │   ├── projects/               # [chờ] Thành phẩm được phép công bố
│   │   └── contact/office-interior.png # Ảnh văn phòng người dùng gửi, chưa render
│   ├── videos/hero/hero-desktop.mp4 # Video minh họa người dùng chọn
│   └── licenses/inter-OFL.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Font, metadata, Header/Footer, skip link
│   │   ├── globals.css             # Tokens và styles responsive
│   │   ├── page.tsx                # Trang chủ: Hero + 4 section G2
│   │   ├── gioi-thieu/page.tsx
│   │   ├── san-pham/page.tsx
│   │   ├── giai-phap/page.tsx
│   │   ├── nang-luc/page.tsx
│   │   ├── du-an/page.tsx
│   │   └── lien-he/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Container.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/{Arrow,ActionLink}.tsx
│   │   ├── media/{VideoHero,CompanyPhoto}.tsx
│   │   ├── editorial/SectionHeading.tsx
│   │   ├── motion/MotionController.tsx # Reveal progressive-enhancement dùng chung
│   │   ├── products/
│   │   │   ├── ProductGallery.tsx      # Gallery Home
│   │   │   ├── ProductImage.tsx        # Ảnh catalogue/use case, giới hạn kích thước nguồn
│   │   │   └── ProductDepthScene.tsx   # CSS 3D Home + compact ProductsHero
│   │   ├── capabilities/           # [chờ] UI quy trình/năng lực
│   │   ├── projects/               # [chờ] UI thư viện thành phẩm
│   │   └── contact/ContactCTA.tsx   # InquiryForm G5 chờ
│   ├── sections/
│   │   ├── home/                   # BrandIntroduction, FeaturedProductCategories, WhySunflower
│   │   ├── about/                  # [chờ] Composition Giới thiệu
│   │   ├── products/               # ProductsHero, ProductCatalogue, SpecificationsGuide
│   │   ├── solutions/              # SolutionsHero, SolutionsOverview, UseCaseSections, RelatedProducts
│   │   ├── capabilities/           # [chờ] Composition Năng lực
│   │   ├── projects/               # [chờ] Composition Dự án
│   │   └── contact/                # [chờ] Composition Liên hệ
│   ├── content/
│   │   ├── navigation.ts           # Sitemap và main navigation
│   │   ├── hero.ts                 # Copy, CTA và cấu hình Hero media
│   │   ├── product-media.ts        # Ánh xạ 9 ảnh thật: slug, path, kích thước, alt
│   │   ├── company-media.ts        # 5 ảnh minh họa: path, kích thước, alt, caption, credit
│   │   ├── contact-media.ts        # officeMedia dùng chung cho Liên hệ/Giới thiệu
│   │   ├── products.ts             # 13 nhóm, 4 cụm, ứng dụng và hướng dẫn inquiry dùng chung
│   │   ├── solutions.ts            # 5 nhu cầu G0, product slugs và media references
│   │   ├── home.ts                 # Copy/selection/IDs ảnh của section Home
│   │   └── company.ts              # Brand/CTA/contact minh họa dùng chung
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
  ├── MotionController → IntersectionObserver / reduced-motion fallback
  ├── Header ← content/navigation.ts
  ├── route page
       ├── / → VideoHero + BrandIntroduction + FeaturedProductCategories + WhySunflower + ContactCTA
       ├── /san-pham → ProductsHero + ProductCatalogue + SpecificationsGuide + ContactCTA
       ├── /giai-phap → SolutionsHero + SolutionsOverview + UseCaseSections + RelatedProducts + ContactCTA
       └── 4 route còn lại → main + Container + H1 (chờ G4–G5)
  └── Footer ← company.ts + navigation.ts
```

- `Header`: Client Component. Theo dõi pathname và scroll; desktop navigation; menu dialog trên màn hình nhỏ; khóa cuộn nền; vòng Tab/Shift+Tab; Escape và trả focus; đóng khi chọn link hoặc chuyển sang desktop.
- `MotionController`: Client Component nhỏ đặt ở layout, quan sát các phần tử `data-reveal`, chạy một lần khi vào viewport và giữ nội dung server-rendered hiển thị khi JavaScript/IntersectionObserver/reduced-motion không phù hợp. Không chứa copy hoặc dữ liệu trang.
- `ProductDepthScene`: Client Component ở Home và ProductsHero (compact). Markup dựng cuộn tem, lớp giấy và dải nhãn; CSS chịu trách nhiệm perspective/độ dày. JavaScript chỉ cập nhật tilt con trỏ và scroll offset giới hạn khi scene nằm trong viewport; touch/reduced-motion dùng trạng thái tĩnh.
- `VideoHero`: Client Component. Theo dõi reduced motion, mobile và trạng thái mạng; server render poster, chỉ mount nguồn video sau khi kiểm tra tùy chọn người dùng. Hàm nội bộ `HeroPlayback` quản lý play/pause, lỗi media và autoplay bị chặn; remount khi đổi nguồn để reset trạng thái. Poster chỉ được video che khi `playing`; gradient và caption có lớp riêng. Không tạo component/engine video bên ngoài.
- `heroMedia.poster` và `desktopSrc` đã trỏ tới poster/video iStock preview do người dùng cung cấp; `mobileSrc` là `null` và fallback cùng nguồn desktop. Caption ghi rõ footage minh họa ngành in. Video 768×432, 21,81 giây và có watermark, chưa có xác nhận giấy phép công khai; chưa phải footage Sunflower thực tế.
- `app/layout.tsx` và các route là Server Components theo mặc định. `Container`, `Arrow` là UI dùng chung không có state trình duyệt.
- Design tokens ở `globals.css`, ánh xạ vào Tailwind. Không có nguồn màu độc lập khác.
- Navigation có bảy route; main navigation có sáu mục, gồm Trang chủ, CTA Header dẫn `/lien-he`.
- `content/product-media.ts` đăng ký 9 ảnh người dùng gửi và WebP delivery. ProductCatalogue và UseCaseSections dùng chung registry; ProductImage giữ ảnh trong khung contain, giới hạn theo kích thước nguồn. Không tạo bản sao theo trang. Nguồn, chất lượng và bốn nhóm còn thiếu được quản lý tại [MEDIA_BRIEF.md](MEDIA_BRIEF.md).
- `content/company-media.ts` đã đăng ký 5 ảnh Unsplash người dùng gửi trong `public/images/company/`, giữ kích thước JPG gốc và credit từ tên nguồn. Đây là ảnh minh họa ngành in, không phải bằng chứng cơ sở/nhân sự Sunflower; caption và loại stock được ghi rõ. G2 render qua webSrc ở BrandIntroduction/WhySunflower; phân bổ và derivatives tại MEDIA_BRIEF.md. Các trang tái sử dụng cùng đường dẫn, không sao chép sang thư mục năng lực.
- `content/contact-media.ts` đăng ký ảnh văn phòng 638×480 tại `public/images/contact/office-interior.png`. Liên hệ/Giới thiệu sẽ dùng chung `officeMedia`; chưa render và không suy ra địa chỉ từ ảnh. Bộ 15 ảnh cùng video/poster là đầu vào tạm để tiếp tục thiết kế theo chỉ định người dùng, không cần chờ thêm ảnh; phần xác thực trước công khai vẫn được quản lý trong MEDIA_BRIEF.md.

G1 đã hoàn tất code và QA production static preview: screenshot thực tế tại đủ năm viewport, kiểm tra thêm 320px. Đã sửa media vượt chiều ngang sau focus, xác nhận menu/keyboard/scroll Header/Pause/Play/loop/Retry và poster fallback. Reduced motion dùng browser preference; Save-Data/2G dùng tín hiệu mô phỏng. Lint/typecheck/build đạt. scripts/preview.mjs hỗ trợ Content-Length, HEAD và byte range cho playback/seek local. Bằng chứng/giới hạn tại IMPLEMENTATION_PLAN.md; ảnh QA ngoài source/public, không tạo lại thư mục test/demo.

G2 đã triển khai code các section và Footer, dùng Server Components/typed content. Theo yêu cầu người dùng, không chạy lại bộ kiểm thử hoặc screenshot G2; chỉ build để cập nhật bản xem. Không lấy QA G1 làm bằng chứng nghiệm thu UI G2.

## 4. Vai trò từng tầng

### Motion/3D — kiến trúc G2.Motion đã triển khai

Hướng thiết kế mới yêu cầu giao diện hiện đại/mạnh mẽ/bắt mắt, nhiều animation phối hợp và khối sản phẩm có chiều sâu; contract tại DESIGN.md mục 8, kết quả tại G2.Motion trong IMPLEMENTATION_PLAN.md.

- Source hiện có reveal controller, phrase/media Hero choreography, image-mask, gallery/card stagger, menu/CTA feedback và scene CSS 3D có parallax/tilt giới hạn. Không có model viewer hoặc WebGL.
- Native CSS + IntersectionObserver + JavaScript nhẹ chỉ nằm ở controller/scene cần DOM, scroll và pointer. Copy, metadata và composition tiếp tục là Server Components. Không thêm repo ngoài hoặc animation dependency.
- Motion/depth tokens nằm cùng globals.css, không tạo theme/source song song. Scene nằm trong `components/products/` vì gắn trực tiếp với ngữ nghĩa tem nhãn.
- Server HTML và no-JS phải đọc/bấm được, asset lỗi có fallback; reduced motion vẫn giữ bố cục mạnh và chiều sâu tĩnh. Không làm form/backend hoặc bảy route phụ thuộc animation init.

G2.Motion không sửa package hoặc media. TypeScript/build và browser QA tập trung được ghi tại IMPLEMENTATION_PLAN.md; chưa lặp toàn bộ kiểm thử G1.

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
| `/` | Header/Hero + section G2 + Footer + G2.Motion/scene 3D | Năng lực, giải pháp, dự án, quy trình và phần còn lại ở G6 |
| `/gioi-thieu` | Route + tiêu đề + metadata | Company story, giá trị, con người và liên kết liên quan |
| `/san-pham` | G3 code: Hero/3D, 13 nhóm, anchor, hướng dẫn quy cách, CTA slug, metadata | Chờ QA trực quan; nhận/prefill context tại G5 |
| `/giai-phap` | G3 code: Hero ảnh, 5 nhu cầu, product cross-links, CTA slug, metadata | Chờ QA trực quan; nhận/prefill context tại G5 |
| `/nang-luc` | Route + tiêu đề + metadata | Năng lực, máy móc, quy trình, QC và ảnh minh chứng được xác nhận |
| `/du-an` | Route + tiêu đề + metadata | Gallery thành phẩm/dự án và bộ lọc khi có dữ liệu thật |
| `/lien-he` | Route + tiêu đề + metadata | Liên hệ được xác nhận và intake/báo giá có endpoint thật |

Danh mục 13 nhóm trong STRUCTURE đã được chủ doanh nghiệp xác nhận; thông số/model còn chờ. Catalogue G3 có 9 ảnh và 4 nhóm trình bày bằng chữ; dữ liệu/slugs từ products.ts dùng chung Home và solutions.ts. Các CTA G3 tạo context từ slug catalogue/nhu cầu, không có ID nội bộ; G5 mới nhận/prefill ở Liên hệ. Copy G0 được quản lý tại CONTENT.md. Không có checkout, login, API route, form gửi hoặc database trong source hiện tại.

## 6. Điều kiện để triển khai tiếp

- Logo gốc, video/poster được cấp phép, nội dung và ảnh thực tế theo media inventory.
- Xác nhận dữ liệu sản phẩm, năng lực, dự án và kênh liên hệ.
- Vì app hiện xuất static, xử lý intake server cần endpoint/backend được duyệt hoặc thay đổi deployment architecture có chủ đích. Không tự thêm API route động vào static export hoặc giả trạng thái đã gửi.
- Sitemap/robots công khai, trang chi tiết và biểu mẫu/backend sẽ được thêm theo phạm vi được duyệt; website đang phát triển hiện giữ noindex.

## 7. Trạng thái sau khi dọn source

Cây thư mục bảy trang và design tokens được giữ. Đã loại bỏ demo HTML cũ, ảnh/báo cáo QA, poster minh hoạ, component PendingPage và thông báo bản thử trong menu. G3 bổ sung nội dung Sản phẩm/Giải pháp trên source chính; bốn trang còn lại chờ G4–G5. Theo yêu cầu người dùng, không chạy lại kiểm thử/browser QA ở lượt G3; build chỉ để tạo bản triển khai. `scripts/preview.mjs` phục vụ static export; không tạo lại source demo để thử hướng motion/3D.
