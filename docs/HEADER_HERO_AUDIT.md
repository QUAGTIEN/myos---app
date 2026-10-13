# Sunflower — Header & Cinematic Hero / Audit

Ngày: 14/10/2026. Phạm vi được yêu cầu: Header + Hero, không triển khai website hoàn chỉnh.

## Tài liệu và trạng thái dự án

Đã đọc toàn bộ `AGENTS.md`, `docs/DESIGN.md`, `docs/STRUCTURE.md` và hướng dẫn tham chiếu thực tế `reference/Sunflower_REFERENCE_GUIDE.md`. Thư mục ảnh thực tế là `reference/desktop/`, không phải `references/sonoco/desktop/`. Cả tám ảnh tồn tại và đã mở xem riêng.

Workspace ban đầu chỉ có tài liệu/ảnh tham chiếu; không có package.json hoặc source app. Bản demo HTML của giai đoạn trước tồn tại trong kho nguồn Sites riêng tư. Khôi phục để giữ lịch sử và giữ mã demo cũ trong `legacy-demo/`; phiên bản mới nằm trong `sunflower-website/` với Next.js App Router, React, TypeScript và Tailwind. Không chỉnh sửa ứng dụng ERP.

## Khán giả, mục tiêu và thông điệp

Khách hàng B2B, bộ phận mua hàng, chủ thương hiệu và đối tác. Màn hình đầu tiên phải chỉ ra Sunflower làm tem nhãn/in ấn, cung cấp lối đi tới sản phẩm và yêu cầu báo giá. H1 dùng bản nháp cụ thể: “Giải pháp tem nhãn cho từng sản phẩm.” Nội dung chưa bổ sung chứng nhận, quy mô nhà máy hoặc thành tích.

## Quan sát đủ tám ảnh

| REF | Quan sát từ ảnh tĩnh | Ánh xạ Sunflower | Giới hạn |
|---|---|---|---|
| 01 | Mảng xanh cong rất lớn; logo ở vùng sáng; navigation trắng phía trên; media ngang bắt đầu khoảng 40% chiều rộng; H1 trắng lớn chồng ranh giới; CTA xanh; biểu tượng pause | Header + Hero trang chủ | Không thể suy ra playback, timing, hover hoặc mobile |
| 02 | Nền navy, ba cột ảnh lệch nhịp; tiêu đề trắng, mũi tên xanh; ảnh và tiêu đề là nội dung chính | WhySunflower / Năng lực | Chỉ dùng khi có ảnh và bằng chứng thật; chưa triển khai |
| 03 | Text trái, các vòng tròn số liệu bất đối xứng bên phải, nền xanh nhạt và khoảng trắng rộng | Giới thiệu, có điều kiện | Không có số liệu xác minh, không dựng vòng tròn thành tích |
| 04 | Bốn ảnh đứng, tiêu đề trên overlay xanh dưới ảnh, nhãn nhỏ xanh; header trắng | Dự án / Mẫu thành phẩm | Không biến thành blog, không lấy tên/ảnh khách hàng tham chiếu |
| 05 | Ảnh tràn ngang, H1 trắng ở giữa, đoạn ngắn; secondary nav và vùng navy tiếp theo | Giải pháp | Secondary nav chỉ khi có nội dung; chưa triển khai |
| 06 | Hai vùng trắng/xanh nhạt, packshot lớn, text không nằm trong card; nhịp hai cột | Sản phẩm | Catalogue 13 nhóm vẫn chờ xác nhận, không dựng toàn bộ |
| 07 | Đường cong xanh từ vùng sáng ở góc trái; text trái và ảnh ngang phải; nét chấm trang trí phụ | Giới thiệu | Không sao chép geometry hay nội dung môi trường của Sonoco |
| 08 | Nền xanh nhạt trái, trắng phải, ảnh editorial và cột văn bản, khoảng cách rộng | Story / Năng lực | Không bịa lịch sử/năm thành lập |

## Quyết định hình ảnh

1. REF-01 là tham chiếu chính của phạm vi này. Đường cong CSS riêng, không trace hình; vùng media bắt đầu gần 40–43% desktop. H1 ở trái có thể vượt vào mép media, với navy overlay đảm bảo đọc được.
2. Header giữ 5 link `Giới thiệu`, `Sản phẩm`, `Giải pháp`, `Năng lực`, `Dự án` và CTA `/lien-he`; không utility links, search, badge tròn, widget nổi của Sonoco.
3. Dùng đúng các tokens `DESIGN.md`; màu navy `#12345F` tối hơn màu xanh nhìn thấy ở REF-01. Khác biệt này là chủ ý theo tài liệu, không tự đổi tokens.
4. Font Inter với Vietnamese; H1 650–750, desktop clamp 3rem/5.4vw/6rem. Dùng câu tiếng Việt thay vì uppercase dài.
5. Mobile là đề xuất Sunflower vì cả tám tham chiếu đều desktop: header gọn, copy trước media, curve giản lược, menu dạng dialog với focus/close đúng.
6. Không animation UI vào trang, không carousel/glass/gradient CTA. Năng lượng cinematic sẽ đến từ video thật sau khi cung cấp.

## Media thiếu và cách xử lý

Không có logo chính thức, ảnh Sunflower, footage desktop/mobile hoặc poster có bản quyền trong workspace. Dùng wordmark chữ tạm (không sáng tác logo thay thế) và poster SVG bố cục phi ảnh chụp, gắn nhãn “Minh hoạ bố cục — chờ video Sunflower”. Không dùng ảnh Sonoco, không dựng nhà máy hoặc người lao động giả. Phần video dùng HTML5, có cấu hình source rỗng, poster, xử lý lỗi/autoplay, pause/play, reduced-motion và Save-Data. Nút video không giả đang phát khi thiếu nguồn.

## File và phạm vi

- `sunflower-website/package.json`, config Next/TypeScript/Tailwind/ESLint.
- `src/app/globals.css`: design tokens và responsive.
- `src/components/layout/{Header,Container}.tsx`.
- `src/components/media/VideoHero.tsx`: video và fallback thực.
- `src/content/{navigation,hero}.ts`: sitemap 7 đường dẫn và copy/media config.
- `src/app/page.tsx`: chỉ Header + Hero.
- 6 route còn lại: khung chờ nội dung, H1/metadata riêng, đích navigation hoạt động. Không giả form gửi thành công.
- `public/images/hero/hero-poster.svg`: bố cục minh hoạ, không phải sản phẩm hoặc nhà xưởng thực tế.
- `docs/HEADER_HERO_QA.md`: đối chiếu trước/sau và giới hạn xác minh.

## Kiểm tra dự kiến

Lint, TypeScript, production build. Browser review 390×844, 768×1024, 1024×768, 1440×900, 1920×1080. Chụp desktop/mobile trước và sau chỉnh sửa, kiểm tra H1, CTA, media crop, contrast, menu keyboard/focus, route links, overflow, media fallback. Chưa thể kiểm tra chất lượng cinematic hoặc tương phản trên footage thật khi thiếu file video.

## Phê duyệt

Người dùng đã chỉ định triển khai Header + Cinematic Video Hero và vòng QA trong yêu cầu hiện tại. Thực hiện đúng phạm vi này; không yêu cầu phê duyệt lại sitemap, không triển khai những section/trang đầy đủ tiếp theo trước khi màn hình đầu được duyệt.
