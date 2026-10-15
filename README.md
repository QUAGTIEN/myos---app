# Sunflower — Corporate Website

Chỉ dẫn làm việc dùng một file duy nhất ở gốc workspace: `../AGENTS.md`. File này áp dụng cho toàn bộ source trong `sunflower-website/`.

Phạm vi hiện tại: G1–G6 đã có đủ giao diện/nội dung bảy trang; G7.1 đã rà và sửa lỗi cho bản xem riêng tư. Giữ sitemap 7 trang. Chủ dự án tiếp tục hoãn G5.2 gửi báo giá thật; thông tin doanh nghiệp/media chính thức và điều kiện phát hành công khai vẫn chờ bổ sung.

G7.1 sửa thao tác Enter để xem lại form, bảo đảm reveal hiển thị sau cuộn nhanh/focus bàn phím, dừng JavaScript scene khi đổi sang reduced-motion/mobile và giữ scene tĩnh khi thiếu IntersectionObserver. Trang 404 tiếng Việt có lối về Trang chủ/Sản phẩm; không phải trang thứ tám trong sitemap. Metadata bảy trang dùng chung helper page-metadata.ts (canonical, OG Việt Nam, title/description riêng), tiếp tục noindex. Lint/typecheck/build đạt; kiểm tra 35 layout, 39 link nội bộ, 26 tương tác và 33 trường hợp form. Bằng chứng/giới hạn và các mục chờ công khai ở IMPLEMENTATION_PLAN.md.

G6 nối CapabilitiesFeature → SolutionsByIndustry → FeaturedProjects → ProcessPreview trước ContactCTA. Trang chủ có chín section và Footer chung: ảnh panorama ngành in với ba hình thức cung ứng/thực hiện, ba nhu cầu chọn lọc, ba mẫu catalogue minh họa và sáu bước phối hợp. Các section mới là Server Components, dùng lại supplyModels/solutions/projectSamples/productionSteps và media registries; home.ts chỉ giữ copy mở đầu và slug chọn lọc. Không có bộ catalogue hoặc asset song song. CTA cuối Trang chủ dùng nền xanh/nút cam; các trang con giữ variant sáng. Motion tái sử dụng hệ thống đã có, mobile giảm khoảng dịch chuyển còn 12px.

G5.1 có ba mục đích trao đổi, thông tin liên hệ, 13 lựa chọn sản phẩm, 5 nhu cầu và trường báo giá theo mục đích. URL từ catalogue/giải pháp/mẫu được đối chiếu dữ liệu trước khi điền; giá trị sai hoặc trùng không được hiển thị như lựa chọn hợp lệ. Form kiểm tra thông tin và cho xem lại ngay trên trang, giữ nội dung khi quay lại sửa. Theo lựa chọn của chủ dự án ngày 15/10/2026, chưa kết nối endpoint: không gửi, không lưu vào trình duyệt và không báo tiếp nhận thành công. Nút gửi thật ở trạng thái khóa. Lint/typecheck/build và QA tập trung đã đạt; bằng chứng/giới hạn ở IMPLEMENTATION_PLAN.md.

G4 dùng EditorialHero/RouteLinks chung và các section Server Components. Giới thiệu trình bày mô hình, cách làm việc, nguyên tắc và bốn bộ phận; Năng lực có ba hình thức thực hiện, scene 3D, quy trình sáu bước, đối chiếu mẫu và phối hợp giao nhận. `/du-an` mang tiêu đề Mẫu thành phẩm, dùng sáu hình catalogue minh họa với bộ lọc thật, product/solution links và context CTA. Không dựng dự án khách hàng, lịch sử, model máy hay chứng chỉ khi thiếu dữ liệu. Trạng thái QA/bằng chứng tại IMPLEMENTATION_PLAN.md.

G3 đã triển khai `/san-pham` với Hero có CSS 3D scene, mục lục anchor, 13 nhóm trong 4 cụm, thông tin ứng dụng, disclosure hướng dẫn hỏi hàng và CTA theo slug. `/giai-phap` có Hero ảnh, 5 nhu cầu, các đoạn ảnh–chữ xen kẽ và liên kết tới đúng sản phẩm. Source dùng lại tokens/reveal controller; không cài dependency mới. Theo yêu cầu người dùng, không chạy lint, typecheck riêng, browser tests hoặc screenshot trong lượt G3; build chỉ phục vụ đóng gói bản demo. G5.1 đã bổ sung nhận/prefill ngữ cảnh tại Liên hệ và kiểm tra ba hành trình CTA liên quan.

G1 đã hoàn tất code và QA: Header/menu responsive, Hero xanh tươi/nút cam, poster và Pause/Play/Retry hoạt động. Đã chụp và xem lại đủ năm viewport, sửa media gây cuộn ngang/cắt chữ rồi kiểm tra lại. Lint/typecheck/build đạt. QA Chromium headless có menu/focus, reduced motion, tín hiệu tiết kiệm dữ liệu và lỗi media; bằng chứng/giới hạn tại [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md). G2 và lượt G2.Motion đã hoàn tất trên Trang chủ.

Stack: Next.js App Router, React, TypeScript, Tailwind CSS. Font Inter được self-host từ gói Fontsource, có Vietnamese subset, không phụ thuộc tải font khi build.

G2 đã ghép BrandIntroduction → FeaturedProductCategories (4 nhóm) → WhySunflower → ContactCTA dưới Hero và Footer trên cả bảy route. Copy sản phẩm dùng chung ở `src/content/products.ts`; copy thương hiệu/liên hệ ở `src/content/company.ts`; selection Trang chủ ở `src/content/home.ts`. G2.Motion đã được QA tập trung desktop/mobile theo IMPLEMENTATION_PLAN.md.

## Chạy

```text
npm install
npm run dev
```

Mở http://127.0.0.1:3000. Bản production: `npm run build`, `npm run preview`, mở http://127.0.0.1:4173. `postbuild` chạy `scripts/finalize-export.mjs` để thêm alias tệp segment payload khi export trên Windows; nội dung điều hướng tĩnh được phục vụ đúng trên cả preview và Sites. Alias chỉ nằm trong output, không tạo source hoặc tài liệu trùng.

## Kiểm tra

```text
npm run lint
npm run typecheck
npm run build
```

## Thiết kế

Hướng mới đã được chốt: **chuyên nghiệp/sạch sẽ nhưng phải hiện đại, mạnh mẽ, bắt mắt với nhiều animation và khối 3D; không dùng thiết kế truyền thống/cũ kỹ**. Sonoco là tham chiếu chính về bố cục, MWDT bổ sung chiều sâu và cách làm nổi bật sản phẩm. Giữ xanh tươi/cam, video Hero và bảy route. Contract effect duy nhất ở [DESIGN.md mục 8](docs/DESIGN.md#8-motion--interaction-system); kết quả G2.Motion được ghi trong [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md). Hệ thống hiện dùng CSS, IntersectionObserver và JavaScript nhẹ, không có repo/thư viện animation hoặc WebGL mới.

Tài liệu được quản lý tại một nơi: [docs/INDEX.md](docs/INDEX.md). Khi cập nhật, sửa file chính và dùng liên kết từ nơi khác; không tạo thêm bản sao tài liệu.

`docs/DESIGN.md` là nguồn tokens chính. `docs/STRUCTURE.md` quy định bảy trang và chức năng. `docs/REFERENCE_GUIDE.md` hướng dẫn phân tích và áp dụng bộ ảnh Sonoco; ảnh tham chiếu gốc vẫn nằm ngoài `public/`.

Theo yêu cầu mới nhất, Header + Hero dùng xanh tươi `#00488E`, nút cam `#F58A2B` và góc nền trắng ngà. Vẫn bật bằng `data-accent="warm"` trong `src/app/layout.tsx`; thay thế bản nút vàng trước đó, không tạo theme/demo riêng. Token, contrast và lớp phủ video nhẹ hơn được ghi tại `docs/DESIGN.md`; chưa xác nhận đây là màu nhận diện pháp lý của Sunflower.

Kế hoạch triển khai theo module, đầu vào và tiêu chí nghiệm thu: [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

Copy G0 cho bảy trang được quản lý tại [docs/CONTENT.md](docs/CONTENT.md): mô hình thương mại kết hợp thiết kế/gia công/sản xuất, 13 nhóm sản phẩm đã xác nhận, quy trình theo overview và địa bàn do chủ doanh nghiệp cung cấp. Dữ liệu liên hệ hiện là minh họa có nhãn để thay bằng thông tin chính thức sau.

## Cây thư mục và kiến trúc

Đã khởi tạo thư mục section cho bảy trang, các nhóm component, thư mục hỗ trợ và media theo `docs/STRUCTURE.md`. Xem `docs/ARCHITECTURE.md` để biết cây thư mục thực tế, luồng render, vai trò từng tầng và trạng thái triển khai. `.gitkeep` giữ các thư mục chờ trong Git; các thư mục còn chờ chưa có nội dung/functionality. G2 đã có section Home và component editorial/gallery/CTA/Footer như ARCHITECTURE.md mô tả.

## Media cần bổ sung

Người dùng đã chỉ định tận dụng bộ hiện có trước: **15 ảnh nội dung + video/poster Hero**, ảnh bổ sung/chỉnh sửa sau. Bộ đầu vào tạm cho bản xem đã được chốt trong [docs/MEDIA_BRIEF.md](docs/MEDIA_BRIEF.md), không chờ đủ 35 ảnh để tiếp tục module giao diện. Ảnh văn phòng nằm tại [public/images/contact/office-interior.png](public/images/contact/office-interior.png), khai báo dùng chung trong [src/content/contact-media.ts](src/content/contact-media.ts) và được dùng tại Giới thiệu/Liên hệ với caption trung tính, không tạo bản sao theo trang.

G0 đã nhận 5 JPG Unsplash minh họa ngành in trong [public/images/company/](public/images/company/), đăng ký tại [src/content/company-media.ts](src/content/company-media.ts). Giữ kích thước gốc, alt, caption minh họa và credit; mỗi ảnh lưu một lần để tái sử dụng. Vị trí section dự kiến nằm trong MEDIA_BRIEF.md. G2 render các ảnh qua WebP delivery derivatives, kèm caption/credit; JPG gốc giữ để quản lý nguồn. Bộ ảnh này không xác thực xưởng/nhân viên Sunflower.

G0 đã nhận 9 ảnh sản phẩm trong [public/images/products/](public/images/products/). Bảng ánh xạ dùng chung tại [src/content/product-media.ts](src/content/product-media.ts), gồm slug, đường dẫn, kích thước gốc và alt. Giữ PNG nguồn và WebP delivery cho cả 9 nhóm; G3 không phóng lớn ảnh thumbnail. Máy quét, Hộp, Tem vải nilon và Satin chưa có ảnh riêng nên dùng bố cục nội dung. Giải pháp tái sử dụng registry, không sao chép ảnh theo trang. Nguồn/trạng thái sử dụng được ghi tại [docs/MEDIA_BRIEF.md](docs/MEDIA_BRIEF.md).

Header dùng tên thương hiệu dạng chữ, chưa có logo gốc. Hero đã tích hợp video iStock preview do người dùng cung cấp (768×432, 21,81 giây, có watermark), kèm poster trích từ video. Đây là footage minh họa ngành in, không phải hình ảnh xưởng Sunflower. Desktop/mobile dùng chung nguồn; chưa có bản mobile riêng. Xem nguồn và trạng thái quyền sử dụng tại `docs/MEDIA_BRIEF.md`. Cần thay bằng bản HD được cấp phép trước khi công khai. Không có tài nguyên Sonoco trong `public/`.

Cấu hình tại `src/content/hero.ts`. Khi có media: đặt file được cấp phép trong `public/videos/hero/` và poster tương ứng trong `public/images/hero/`, sửa `desktopSrc`/`mobileSrc`/`poster`. Kiểm thử lại playback, autoplay bị chặn, pause/play, reduced motion, Save-Data và tương phản nhiều frame. Không dùng footage giả hoặc stock để giới thiệu như xưởng Sunflower.

## Triển khai

Build xuất `out/`, Sites giữ cùng project ID và quyền riêng tư. Không tích hợp ERP/Firebase, không thu hoặc gửi dữ liệu liên hệ. Website đang phát triển và giữ `noindex` cho đến khi có nội dung được xác nhận.
