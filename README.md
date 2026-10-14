# Sunflower — Corporate Website

Chỉ dẫn làm việc dùng một file duy nhất ở gốc workspace: `../AGENTS.md`. File này áp dụng cho toàn bộ source trong `sunflower-website/`.

Phạm vi hiện tại: G1 Header/VideoHero và G2 các section Trang chủ + Footer dùng chung. Giữ sitemap 7 trang; sáu trang con vẫn chỉ có tiêu đề/metadata và Footer, chưa triển khai nội dung/chức năng G3–G5.

G1 đã hoàn tất code và QA: Header/menu responsive, Hero xanh tươi/nút cam, poster và Pause/Play/Retry hoạt động. Đã chụp và xem lại đủ năm viewport, sửa media gây cuộn ngang/cắt chữ rồi kiểm tra lại. Lint/typecheck/build đạt. QA Chromium headless có menu/focus, reduced motion, tín hiệu tiết kiệm dữ liệu và lỗi media; bằng chứng/giới hạn tại [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md). G2 đã bắt đầu theo chỉ định tiếp theo của chủ dự án.

Stack: Next.js App Router, React, TypeScript, Tailwind CSS. Font Inter được self-host từ gói Fontsource, có Vietnamese subset, không phụ thuộc tải font khi build.

G2 đã ghép BrandIntroduction → FeaturedProductCategories (4 nhóm) → WhySunflower → ContactCTA dưới Hero và Footer trên cả bảy route. Copy sản phẩm dùng chung ở `src/content/products.ts`; copy thương hiệu/liên hệ ở `src/content/company.ts`; selection Trang chủ ở `src/content/home.ts`. Không chạy lại lint/typecheck riêng, browser tests hoặc chụp screenshot theo yêu cầu của người dùng; chỉ build để tạo bản xem thử. Chưa nghiệm thu UI/responsive G2.

## Chạy

```text
npm install
npm run dev
```

Mở http://127.0.0.1:3000. Bản production: `npm run build`, `npm run preview`, mở http://127.0.0.1:4173.

## Kiểm tra

```text
npm run lint
npm run typecheck
npm run build
```

## Thiết kế

Tài liệu được quản lý tại một nơi: [docs/INDEX.md](docs/INDEX.md). Khi cập nhật, sửa file chính và dùng liên kết từ nơi khác; không tạo thêm bản sao tài liệu.

`docs/DESIGN.md` là nguồn tokens chính. `docs/STRUCTURE.md` quy định bảy trang và chức năng. `docs/REFERENCE_GUIDE.md` hướng dẫn phân tích và áp dụng bộ ảnh Sonoco; ảnh tham chiếu gốc vẫn nằm ngoài `public/`.

Theo yêu cầu mới nhất, Header + Hero dùng xanh tươi `#00488E`, nút cam `#F58A2B` và góc nền trắng ngà. Vẫn bật bằng `data-accent="warm"` trong `src/app/layout.tsx`; thay thế bản nút vàng trước đó, không tạo theme/demo riêng. Token, contrast và lớp phủ video nhẹ hơn được ghi tại `docs/DESIGN.md`; chưa xác nhận đây là màu nhận diện pháp lý của Sunflower.

Kế hoạch triển khai theo module, đầu vào và tiêu chí nghiệm thu: [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

Copy G0 cho bảy trang được quản lý tại [docs/CONTENT.md](docs/CONTENT.md): mô hình thương mại kết hợp thiết kế/gia công/sản xuất, 13 nhóm sản phẩm đã xác nhận, quy trình theo overview và địa bàn do chủ doanh nghiệp cung cấp. Dữ liệu liên hệ hiện là minh họa có nhãn để thay bằng thông tin chính thức sau.

## Cây thư mục và kiến trúc

Đã khởi tạo thư mục section cho bảy trang, các nhóm component, thư mục hỗ trợ và media theo `docs/STRUCTURE.md`. Xem `docs/ARCHITECTURE.md` để biết cây thư mục thực tế, luồng render, vai trò từng tầng và trạng thái triển khai. `.gitkeep` giữ các thư mục chờ trong Git; các thư mục còn chờ chưa có nội dung/functionality. G2 đã có section Home và component editorial/gallery/CTA/Footer như ARCHITECTURE.md mô tả.

## Media cần bổ sung

Người dùng đã chỉ định tận dụng bộ hiện có trước: **15 ảnh nội dung + video/poster Hero**, ảnh bổ sung/chỉnh sửa sau. Bộ đầu vào tạm cho bản xem đã được chốt trong [docs/MEDIA_BRIEF.md](docs/MEDIA_BRIEF.md), không chờ đủ 35 ảnh để tiếp tục module giao diện. Ảnh văn phòng mới nằm tại [public/images/contact/office-interior.png](public/images/contact/office-interior.png), khai báo dùng chung trong [src/content/contact-media.ts](src/content/contact-media.ts); chưa render section Liên hệ/Giới thiệu.

G0 đã nhận 5 JPG Unsplash minh họa ngành in trong [public/images/company/](public/images/company/), đăng ký tại [src/content/company-media.ts](src/content/company-media.ts). Giữ kích thước gốc, alt, caption minh họa và credit; mỗi ảnh lưu một lần để tái sử dụng. Vị trí section dự kiến nằm trong MEDIA_BRIEF.md. G2 render các ảnh qua WebP delivery derivatives, kèm caption/credit; JPG gốc giữ để quản lý nguồn. Bộ ảnh này không xác thực xưởng/nhân viên Sunflower.

G0 đã nhận 9 ảnh sản phẩm trong [public/images/products/](public/images/products/). Bảng ánh xạ dùng chung cho Trang chủ/Sản phẩm tại [src/content/product-media.ts](src/content/product-media.ts), gồm slug, đường dẫn, kích thước gốc và alt. Ảnh giữ nguyên nguồn PNG; G2 dùng WebP của 4 nhóm Tem trắng cuộn, Tem màu cuộn, Mực in, Tem dệt trong ProductGallery Trang chủ. Catalogue G3 chưa triển khai. Còn thiếu ảnh Máy quét, Hộp, Tem vải nilon và Satin. Nguồn/trạng thái sử dụng và lưu ý ảnh nhỏ được ghi tại [docs/MEDIA_BRIEF.md](docs/MEDIA_BRIEF.md).

Header dùng tên thương hiệu dạng chữ, chưa có logo gốc. Hero đã tích hợp video iStock preview do người dùng cung cấp (768×432, 21,81 giây, có watermark), kèm poster trích từ video. Đây là footage minh họa ngành in, không phải hình ảnh xưởng Sunflower. Desktop/mobile dùng chung nguồn; chưa có bản mobile riêng. Xem nguồn và trạng thái quyền sử dụng tại `docs/MEDIA_BRIEF.md`. Cần thay bằng bản HD được cấp phép trước khi công khai. Không có tài nguyên Sonoco trong `public/`.

Cấu hình tại `src/content/hero.ts`. Khi có media: đặt file được cấp phép trong `public/videos/hero/` và poster tương ứng trong `public/images/hero/`, sửa `desktopSrc`/`mobileSrc`/`poster`. Kiểm thử lại playback, autoplay bị chặn, pause/play, reduced motion, Save-Data và tương phản nhiều frame. Không dùng footage giả hoặc stock để giới thiệu như xưởng Sunflower.

## Triển khai

Build xuất `out/`, Sites giữ cùng project ID và quyền riêng tư. Không tích hợp ERP/Firebase, không thu hoặc gửi dữ liệu liên hệ. Website đang phát triển và giữ `noindex` cho đến khi có nội dung được xác nhận.
