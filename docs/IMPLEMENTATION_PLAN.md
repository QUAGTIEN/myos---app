# Sunflower — Kế hoạch triển khai website

Ngày lập/cập nhật: 14/10/2026. G0 bản xem đã chốt; G1 đã code/QA; G2 đã triển khai section Trang chủ, Footer và hoàn tất lượt G2.Motion bằng CSS/browser APIs. Nội dung sáu trang con và đầu vào phát hành công khai vẫn chưa hoàn tất.

Cơ sở: AGENTS.md duy nhất tại gốc workspace; DESIGN.md, STRUCTURE.md, REFERENCE_GUIDE.md, ARCHITECTURE.md và source hiện tại. Kế hoạch này tổ chức công việc, không thay thế design tokens hoặc bổ sung sitemap/chức năng ngoài tài liệu đã duyệt.

## 1. Mục tiêu và điểm xuất phát

Website giới thiệu doanh nghiệp Sunflower, sản phẩm tem nhãn/bao bì và giải pháp cho khách hàng B2B. Khách cần hiểu doanh nghiệp làm gì, xem sản phẩm, đánh giá năng lực thực tế và gửi nhu cầu báo giá.

Chất lượng thị giác là điều kiện hoàn thành của từng module. Việc có đủ section hoặc build thành công chưa đủ để nghiệm thu giao diện.

Hiện có:

- Next.js App Router, React, TypeScript, Tailwind và font Inter self-host.
- Bảy route đã tạo, design tokens trong globals.css, Container và Header có menu mobile.
- VideoHero dùng iStock preview/poster. Kết quả QA G1 được ghi ở báo cáo G1; không dùng chúng để xác nhận motion/3D chưa triển khai hoặc giao diện G2 chưa kiểm tra.
- Trang chủ đã có section G2; Footer dùng chung cả bảy route. Sáu trang con vẫn chỉ có tiêu đề/metadata cùng Footer; catalogue, giải pháp, nội dung chi tiết và form chưa triển khai.
- Static export ra out/; đang giữ noindex. Chưa có backend gửi yêu cầu báo giá.
- Tám ảnh Sonoco tại reference/desktop/ ở gốc workspace. Đây là tài liệu nghiên cứu, không phải media của website.

Hiện thiếu logo chính thức, bản Hero HD được cấp phép, ảnh Sunflower, thông số chi tiết và đích nhận yêu cầu. Copy bảy trang đã được soạn trong CONTENT.md; dữ liệu liên hệ đang là minh họa theo chỉ định người dùng. Video đang dùng là preview 768×432 có watermark, không phải footage cơ sở Sunflower. Không tái tạo legacy-demo hoặc ảnh nhà máy/dự án giả để lấp chỗ trống. Phần chưa đủ dữ liệu ghi trong tài liệu tiến độ; không coi là đã hoàn thành.

## 2. Nguyên tắc thực hiện

1. Giữ đủ bảy trang: Trang chủ, Giới thiệu, Sản phẩm, Giải pháp, Năng lực, Dự án và Liên hệ. Không tự thêm trang chi tiết, blog, giỏ hàng, login hoặc tích hợp ERP.
2. Dùng màu, typography, spacing và grid đã duyệt trong DESIGN.md. Đường cong navy, ảnh lớn và nhịp editorial lấy nguyên tắc từ Sonoco, sử dụng nội dung và tài sản Sunflower.
3. Mỗi đợt chỉ xử lý một module hoặc 2–3 section có quan hệ rõ. Thiết kế và kiểm tra desktop/mobile ngay trong đợt đó.
4. Tái sử dụng source đang có. Chỉ tạo component chung khi có hai cách dùng có ý nghĩa hoặc cần tách logic phức tạp; không tạo trước hàng loạt component rỗng.
5. Nội dung sản phẩm, giải pháp và dự án có một nguồn dữ liệu dùng chung cho trang chủ và trang con. Chỉ render dữ liệu được phép công bố.
6. Animation và khối 3D là yêu cầu thiết kế chính theo chỉ định mới. Phải có nhiều kiểu chuyển động phối hợp và điểm nhấn sản phẩm có chiều sâu; giao diện truyền thống/tĩnh hoặc chỉ fade-in không đạt. Áp dụng contract tại DESIGN.md mục 8; không dùng hiệu ứng để che ảnh yếu, nội dung mỏng hoặc bố cục kém.
7. Sau khi một hướng đã được duyệt, không tự thay font, palette hoặc ngôn ngữ bố cục ở module tiếp theo. Nếu cần thay đổi lớn, trình bày phương án cụ thể và ảnh hưởng trước.
8. Có thể tiếp tục công việc độc lập khi thiếu một đầu vào, nhưng không nghiệm thu phần phụ thuộc đầu vào đó. Ví dụ: thiếu video vẫn chuẩn hóa tokens được; Hero cinematic vẫn chưa hoàn thành.

## 3. Lộ trình tổng thể

| Giai đoạn | Phạm vi | Bàn giao | Điều kiện chuyển tiếp |
|---|---|---|---|
| G0 | Chốt nội dung và media | Danh mục đầu vào, nội dung từng trang, media ưu tiên | Có đầu vào tối thiểu để thiết kế màn hình đầu bằng tài sản thật |
| G1 | Nền tảng + Header + Hero | Màn hình đầu desktop/mobile, menu và video hoạt động | Duyệt chất lượng Header/Hero; sửa xong lỗi đọc chữ, bố cục, crop và responsive |
| G2 | Ngôn ngữ section + khung dùng chung | Giới thiệu ngắn, nhóm sản phẩm nổi bật, một section navy, ContactCTA/Footer | Chốt được nhịp sáng/tối, tỷ lệ ảnh/chữ và component dùng chung |
| G2.Motion | Hoàn thiện hướng hiện đại trên G1–G2 | Reveal/choreography, interaction và điểm nhấn khối 3D sản phẩm | Có khác biệt thị giác rõ, nhiều loại motion phối hợp, static fallback mạnh; trạng thái kiểm tra được báo đúng |
| G3 | Sản phẩm + Giải pháp | Hai trang nội dung và hành trình chọn nhu cầu → liên hệ | Catalogue chính xác; điều hướng/lọc có tác dụng; liên kết ngữ cảnh đúng |
| G4 | Giới thiệu + Năng lực + Dự án | Ba trang chứng minh doanh nghiệp bằng nội dung/ảnh được duyệt | Mỗi trang có mục đích riêng; mọi bằng chứng có nguồn và quyền công bố |
| G5 | Liên hệ + báo giá | Trang liên hệ, form và luồng gửi thật | Endpoint nhận được yêu cầu; xử lý lỗi đúng; thông tin liên hệ đã xác nhận |
| G6 | Hoàn thiện Trang chủ | Câu chuyện trang chủ đầy đủ, lấy dữ liệu từ các module đã hoàn thiện | Nội dung, nhịp section và CTA nhất quán với sáu trang con |
| G7 | Kiểm tra tổng thể + phát hành | Bản cuối đã đối chiếu UI, kiểm tra chức năng và vận hành | Hết lỗi chặn phát hành; người dùng duyệt bản cụ thể trước khi công khai |

G2 tạo phần đầu trang chủ và các pattern cần thiết. G6 ghép các phần giới thiệu năng lực, giải pháp, dự án và quy trình từ dữ liệu đã hoàn thiện; giữ thứ tự trong STRUCTURE.md. Không tạo hai phiên bản trang chủ song song.

## 4. Chi tiết từng giai đoạn

### G0 — Nội dung và tài sản hình ảnh

Đề xuất ảnh/video, thứ tự chuẩn bị và trạng thái tài nguyên đã nhận được quản lý tại [MEDIA_BRIEF.md](MEDIA_BRIEF.md). Đã nhập 9/13 ảnh nhóm sản phẩm, giữ nguyên nguồn PNG và đăng ký tại [product-media.ts](../src/content/product-media.ts). Thiếu Máy quét, Hộp, Tem vải nilon, Satin; ảnh thẻ bài và tem màu tờ cần bản lớn hơn cho gallery. Chưa render catalogue hoặc nghiệm thu chất lượng ảnh trên layout.

Copy bảy trang được quản lý tại [CONTENT.md](CONTENT.md). Đã xác nhận mô hình thương mại/sản xuất, bốn bộ phận, 13 nhóm sản phẩm và phạm vi hoạt động theo thông tin chủ doanh nghiệp. Liên hệ dùng dữ liệu minh họa có nhãn; chưa bật các kênh gửi yêu cầu thật.

Đã nhập 5 JPG Unsplash người dùng cung cấp vào `public/images/company/`, đăng ký tại [company-media.ts](../src/content/company-media.ts) kèm alt, kích thước, caption minh họa và credit. Đây là tài nguyên minh họa để chuẩn bị bố cục, không thay thế ảnh bằng chứng doanh nghiệp/năng lực. Chưa render section; cần tối ưu nguồn lớn và kiểm tra crop khi đến module giao diện.

Đã nhận ảnh văn phòng T01 tại `public/images/contact/office-interior.png`, đăng ký `officeMedia` trong [contact-media.ts](../src/content/contact-media.ts), có thể dùng chung ở Liên hệ/Giới thiệu. Người dùng chỉ định tận dụng bộ ảnh hiện có trước và bổ sung sau. Cách xử lý các vị trí thiếu ảnh được chốt trong mục “Chốt bộ đầu vào tạm để tiếp tục thiết kế” của MEDIA_BRIEF.md; tiếp tục module giao diện với bộ này, giữ đầy đủ bảy route và caption nguồn.

Công việc:

- Chốt thông điệp Hero và giới thiệu ngắn: Sunflower cung cấp gì, cho ai, khách nên thực hiện hành động nào.
- Lập danh sách nội dung theo từng section của bảy trang; phân biệt dữ liệu đã xác nhận với dữ liệu đang chờ.
- Kiểm tra logo, chất lượng ảnh/video, quyền sử dụng, điểm cần crop và khả năng dùng lại trên trang chủ.
- Tên 13 nhóm sản phẩm trong STRUCTURE.md đã được xác nhận; tiếp tục đối chiếu thông số, model và ảnh của từng nhóm trước khi công bố chi tiết.
- Xác nhận kênh liên hệ và phương án nhận báo giá trước G5; quyết định này có thể thực hiện trong khi làm các module nội dung.

Đầu vào ưu tiên cho G1–G2: logo gốc; footage Hero và poster lấy từ footage; 4–6 ảnh nhóm sản phẩm nổi bật; ảnh/copy giới thiệu; thông tin liên hệ và vài năng lực được xác nhận. Các ảnh còn lại bổ sung theo module. Mục tiêu 35 ảnh trong tài liệu là dự kiến nội dung, không phải lý do bắt chờ đủ cả bộ mới làm phần đầu.

Vị trí làm việc: src/content/ và public/images/, public/videos/ theo cây thư mục hiện tại. Chỉ tạo dữ liệu/file khi có đầu vào phù hợp.

Nghiệm thu: biết rõ tài nguyên nào dùng cho section nào, phần nào chưa đủ dữ liệu và ai cần xác nhận. Không có media tham chiếu Sonoco được đưa vào public/.

### G1 — Nền tảng và màn hình đầu

**Trạng thái 14/10/2026:** hoàn tất code và QA G1 trên production local, screenshot đủ năm viewport. Giữ xanh tươi/cam và media G0. Bản xem riêng tư để chủ dự án duyệt thiết kế; chưa triển khai G2 hoặc nội dung sáu trang con.

Công việc:

- Rà lại tokens đang có với DESIGN.md; thống nhất Container, khoảng cách, heading, CTA và focus.
- Hoàn thiện Header hiện tại: logo thật, năm mục chính, CTA báo giá, trạng thái trên Hero và trạng thái nền đặc, menu mobile.
- Hoàn thiện VideoHero dựa trên REF-01: đường cong navy nguyên bản, tỷ lệ text/media, H1 tiếng Việt, CTA và điểm nhấn footage.
- Chọn crop desktop/mobile dựa trên chủ thể thật. Mobile có bố cục riêng, không chỉ giảm cỡ chữ desktop.
- Kiểm tra muted/autoplay, pause/play, video lỗi, autoplay bị chặn, đổi viewport, reduced motion và Save-Data; dùng poster thật khi không phát.

File/module dự kiến: src/app/globals.css, src/app/layout.tsx, src/components/layout/Header.tsx, Container.tsx, src/components/media/VideoHero.tsx, src/content/hero.ts và media Hero.

Nghiệm thu: H1 và CTA chính đọc được ngay; Header không xung đột với ảnh; chủ thể video không bị crop mất; thao tác menu/video bằng bàn phím hoạt động. Đối chiếu 1440×900 và 390×844, sửa và kiểm tra lại. Chưa có footage/poster thật thì chưa nghiệm thu chất lượng cinematic.

#### Báo cáo G1 — 14/10/2026

Hoàn tất code và QA Header, Container/tokens/font, VideoHero trong phạm vi G1. Giữ bảy route; sáu trang con vẫn chỉ có tiêu đề/metadata. Không thêm Footer, section dưới Hero, form, dependency hoặc thư mục test/demo. Đã mở đủ tám ảnh Sonoco; REF-01 là đối chiếu chính, pattern khác giữ cho module tương ứng.

Files lượt hoàn thiện: `src/app/globals.css`, `src/components/layout/Header.tsx`, `src/components/media/VideoHero.tsx`, bảy `app/**/page.tsx` (focus main cho skip link), `src/content/navigation.ts` (bỏ mô tả năng lực chưa xác minh), `scripts/preview.mjs` (HTTP byte range cho video). Tài liệu canonical cập nhật tại chỗ.

| Tiêu chí | Đối chiếu screenshot thực tế với REF-01 | Kết quả / khác biệt chủ đích |
|---|---|---|
| Bố cục | Media desktop bắt đầu ở 40% chiều rộng; H1 bên trái vượt nhẹ ranh giới ảnh/xanh, đường cong nguyên bản | 1440: media x=576, rộng 800, cao 520; 1920: x=768, rộng 992, cao 558. Sunflower có paragraph và hai CTA, không thêm badge tròn/utility links của Sonoco |
| Màu | Xanh tươi tương ứng sắc xanh quan sát trong ảnh tham chiếu | Computed RGB(0,72,142), CTA RGB(245,138,43). Cam thay xanh lá theo yêu cầu; góc trắng ngà thay vùng xanh nhạt của reference. Caption/control deep navy nhỏ |
| Typography | Chữ trắng đậm, ba dòng rõ thứ bậc | Inter tiếng Việt, sentence case; 77,76px ở 1440 và 96px ở 1920, mobile 40,17px. Không sao chép font/all-caps tiếng Anh của Sonoco |
| Spacing | Cùng hệ gutter, chữ/CTA thẳng hàng; media rộng bên phải | Header 88px desktop/tablet, 76px mobile; gutters 64/40/32/20px. Header một hàng gọn hơn reference; nút radius 6px theo DESIGN, không dùng pill Sonoco |
| Responsive | Desktop arc/split; 390 và tablet dọc xếp chữ trước, video sau | Không có reference mobile để tuyên bố giống Sonoco. Adaptation Sunflower: video 16:9 do chưa có nguồn portrait, menu dialog dưới 1200px; CTA trong màn hình đầu |
| Media | Đã xem poster và frame 1/8/16 giây | Chữ không mất trên các frame đã xem, footage còn nhìn rõ. Nguồn 768×432 chưa sắc nét tương đương footage HD của reference; không upscale file để giả độ nét |

Vòng điều chỉnh từ screenshot: `aspect-ratio + min-height` khiến chiều rộng media vượt viewport. Khi focus/click Pause, vùng Hero bị cuộn ngang và cắt chữ ở 1024px. Đã giới hạn width theo gutter/breakpoint, chụp lại đủ năm viewport: document và vùng Hero không cuộn ngang, H1/CTA/media không bị cắt. Caption giới hạn cả hai bên, nút giữ 44×44px; video lỗi có nút Retry và poster đến khi phát thành công. Main nhận focus từ skip link; CTA báo giá có aria-current tại Liên hệ.

Kiểm tra đạt:

- `npm run lint`, `npm run typecheck`, `npm run build`; production export đủ bảy route.
- Chrome headless qua Playwright có sẵn, phiên độc lập: 390×844, 768×1024, 1024×768, 1440×900, 1920×1080; bổ sung 320×720. Không có pageerror trên các trang/trạng thái bình thường đã kiểm tra.
- Autoplay muted/loop/playsInline, Pause/Play bằng chuột và Space, tua video, loop thực khi tới cuối. Local server trả byte range 206 đúng, 416 khi range vượt kích thước; video 2.925.394 byte, poster 24.172 byte.
- Menu: Tab/Shift+Tab focus trap, Escape trả focus về trigger, đóng theo route/breakpoint, trả focus về wordmark khi sang desktop, khóa/mở body scroll. Header nền trắng sau cuộn >24px.
- Skip link Enter focus main; bảy route HTTP 200, một H1/route và noindex, CTA đúng đích. Không tải/render Hero video ở trang con. SSR poster-only trước khi kiểm tra preference.
- Reduced motion: poster, không có video request ban đầu, đổi preference trực tiếp mount/unmount đúng. Save-Data/2G: mô phỏng tín hiệu browser, poster và không có video request. Abort media request: poster + Retry; bỏ chặn rồi bấm Retry khôi phục playback thật.
- Contrast tokens: deep navy/cam 6,15:1, hover 4,77:1; trắng/xanh 9,06:1; trắng/deep navy 15,11:1. Trắng trên overlay xanh 86% phủ nền trắng 6,36:1. Đã xem poster và ba frame; không tuyên bố đo pixel mọi frame.

Ảnh QA và JSON ngoài source/public: `C:/Users/pham quang tien/.codex/visualizations/2026/10/14/sunflower-g1/`, gồm `hero-1440x900.png`, `hero-390x844.png` và ba viewport còn lại; thêm ảnh menu/fallback/frame. Không tạo bản sao tài liệu/reference, không lưu credential vào source.

Giới hạn: QA Chromium desktop với viewport/device emulation, chưa kiểm tra mobile thật/Safari/Firefox. Save-Data/2G là tín hiệu mô phỏng, chưa đo mạng di động thực. Chưa tái hiện chính sách chặn autoplay gốc; code xử lý promise rejection và giữ nút Play. CUA vẫn lỗi khởi tạo; Playwright có sẵn đã cung cấp QA thật của phiên bản mới.

G1 hoàn tất cho bản xem theo bộ G0 đã duyệt. Wordmark còn tạm; video iStock preview có watermark/768×432, cần logo và footage HD được cấp phép trước phát hành công khai. Không tuyên bố website hoàn chỉnh hoặc production-ready. Chủ dự án duyệt bản xem trước khi chuyển ngôn ngữ thiết kế sang G2.

### G2 — Các section đại diện và component chung

**Trạng thái lượt G2:** đã triển khai BrandIntroduction, FeaturedProductCategories (4 nhóm có ảnh đủ lớn), WhySunflower với thông tin mô hình/phối hợp đã xác nhận, ContactCTA và Footer dùng chung. Giữ Header/Hero, bảy route và màu xanh tươi/cam. Người dùng yêu cầu không chạy lại kiểm thử để tiết kiệm thời gian: bỏ lint/typecheck riêng và browser/screenshot QA; chỉ build static output phục vụ bản xem. Build production/static export đã đạt; chưa nghiệm thu trực quan G2.

Áp dụng REF-08 cho ảnh–chữ giới thiệu, REF-06 cho gallery mở hai cột, REF-02 cho bố cục ba cột lệch nhịp trên nền xanh. Bốn ảnh minh họa trong WhySunflower có caption/credit, không phải bằng chứng xưởng/nhân sự. Không có metrics/chứng chỉ/client/project giả. Mobile được viết CSS xếp dọc nhưng chưa kiểm tra trong browser ở lượt này.

Component dùng chung: SectionHeading, ActionLink, CompanyPhoto, ProductGallery, ContactCTA, Footer. Tất cả là Server Components; chỉ Header và VideoHero cũ cần client. Dữ liệu 13 nhóm từ CONTENT.md vào products.ts dùng chung cho selection Home và G3 sau này; không dựng catalogue/filter/form trong G2. Footer dùng company.ts, contact minh họa có nhãn, không tel/mailto/map/form.

Tài nguyên G2: 5 WebP từ ảnh company + 4 WebP từ ảnh sản phẩm đã có; giữ originals/provenance, không upsize hoặc sao chép ảnh theo trang. Xem MEDIA_BRIEF.md.

Chia ba đợt:

1. BrandIntroduction và FeaturedProductCategories: đoạn giới thiệu ngắn trên nền sáng, 4–6 nhóm sản phẩm với ảnh lớn và thứ tự rõ.
2. WhySunflower: một section navy dùng năng lực đã xác nhận, tham chiếu REF-02. Nếu chưa có bằng chứng cho nội dung này, giữ việc triển khai ở trạng thái chờ; không thay bằng số liệu hoặc card chung chung.
3. ContactCTA và Footer dùng chung, với thông tin liên hệ thật và đủ liên kết bảy trang.

Chốt các pattern thực sự cần dùng lại: tiêu đề section, ảnh–chữ editorial, gallery sản phẩm, CTA cuối trang. Pattern có thể dùng chung cấu trúc, nhưng mỗi section vẫn có tỷ lệ và câu chuyện riêng.

File/module dự kiến: src/sections/home/, components/editorial/, components/products/, components/layout/Footer.tsx, components/contact/ContactCTA.tsx, src/content/ và app/layout.tsx.

Nghiệm thu: khi cuộn từ Hero xuống, bố cục có nhịp và chuyển màu hợp lý; ảnh là điểm nhấn; tiêu đề, nội dung và CTA thẳng hàng theo grid. Không lặp liên tiếp nhiều grid card giống nhau. Đây là mốc duyệt ngôn ngữ giao diện trước khi triển khai rộng các trang con.

### G2.Motion — Animation, chiều sâu và khối 3D (đã hoàn tất)

Hướng này đã được người dùng chấp thuận và đã được triển khai trên G1/G2 trước khi mở rộng pattern sang G3. Không dựng lại website hoặc thay đổi sitemap. Contract duy nhất về timing, token, 3D và fallback ở [DESIGN.md mục 8](DESIGN.md#8-motion--interaction-system).

Chia ba phần để triển khai rõ ràng:

1. **Choreography và interaction:** tokens dùng chung; phrase reveal cho Hero, sequencing mô tả/CTA, image-mask reveal cho giới thiệu, stagger cho sản phẩm/WhySunflower, chuyển động link/nút/menu. Không nhân cùng một fade-in lên mọi phần tử.
2. **Điểm nhấn 3D:** scene khối tem/giấy/bao bì tự tạo bằng CSS perspective/layered geometry, cân nhắc vị trí chuyển tiếp Hero–Giới thiệu hoặc trong gallery có sẵn. Packshot tách nền hỗ trợ chiều sâu; asset/credit/fallback theo MEDIA_BRIEF.md. Không thay video Hero hoặc tạo section/route thứ tám. Không dùng ảnh phẳng có shadow như bằng chứng đã hoàn tất toàn bộ yêu cầu 3D.
3. **Mở rộng và tinh chỉnh:** áp dụng pattern phù hợp cho G3–G6; mobile giảm biên độ/số hiệu ứng đồng thời, touch không phụ thuộc hover, reduced motion giữ bố cục và chiều sâu tĩnh.

Triển khai mặc định bằng CSS + IntersectionObserver + JavaScript nhẹ trên source hiện tại, không cần repo ngoài. Chỉ thêm client controller/hook khi logic browser thực sự cần; chưa cài animation engine/WebGL. Không thêm file demo/mock, không tạo thêm tài liệu motion song song.

File có thể thay đổi trong lượt code sau: globals.css, Header/VideoHero, section Home và một lớp reveal/scene dùng chung nếu cần. Đây là dự kiến; ARCHITECTURE.md vẫn phản ánh source thực tế. Bàn giao phải có chuyển động nhìn thấy được và tối thiểu một spatial/3D scene mang ngữ nghĩa sản phẩm. Giữ tính đọc được của CTA/caption trong mọi trạng thái.

Kết quả: `MotionController` điều phối reveal theo viewport nhưng giữ server HTML hiển thị khi no-JS/reduced-motion; Hero vào theo cụm chữ/media, ảnh giới thiệu dùng mask, product/Why dùng stagger, menu và CTA có feedback. `ProductDepthScene` dựng cuộn tem, chồng tờ in và dải nhãn bằng CSS perspective/layered geometry; desktop có tilt theo con trỏ và scroll offset giới hạn, mobile dùng bố cục tĩnh đơn giản hơn.

Kiểm tra tập trung: TypeScript và production build đạt. Chromium production preview tại 1440×900 và 390×844 không tràn ngang, toàn bộ reveal đi đến trạng thái hiển thị, scene có mặt ở cả hai breakpoint, tilt desktop thay đổi transform, menu mobile mở/đóng và không có page error. Reduced-motion không mount video, không để nội dung opacity 0. Đã xem lại screenshot desktop/mobile và scene. Theo yêu cầu tiết kiệm thời gian, không lặp toàn bộ ma trận năm viewport, kiểm tra mạng/video của G1 hoặc lint.

### G3 — Sản phẩm và Giải pháp

**Trạng thái G3:** đã code hai route theo phạm vi người dùng xác nhận. ProductsHero tái sử dụng CSS 3D scene dạng compact; ProductCatalogue dùng anchor cho 4 cụm/13 nhóm, application labels, disclosure thông tin cần chuẩn bị và CTA `san-pham` bằng slug công khai. SpecificationsGuide và CTA cuối trang hoàn thiện hành trình. SolutionsHero áp dụng REF-05 với ảnh bao bì minh họa; SolutionsOverview, 5 UseCaseSections và RelatedProducts phân biệt nhu cầu với catalogue, cross-link thẳng tới anchor sản phẩm và chuyển `nhu-cau` sang Liên hệ.

Không thêm filter/search, trang chi tiết, backend hoặc animation dependency. Dữ liệu sản phẩm dùng chung với Home; solutions.ts lấy từ CONTENT.md. Bốn nhóm thiếu ảnh dùng bố cục chữ; 9 ảnh có WebP delivery, không upscale ảnh nhỏ. Ảnh công đoạn có caption/credit, các nhu cầu không được trình bày thành portfolio khách hàng. Giữ xanh tươi/cam, Header solid, responsive CSS và reduced-motion của hệ thống G2.

**Giới hạn nghiệm thu:** người dùng yêu cầu “không cần chạy kiểm lại”; không chạy lint, typecheck riêng, browser/functional tests hay screenshot. Chỉ build để đóng gói triển khai; không coi build là bằng chứng UI/responsive/anchor đã được QA. Trang Liên hệ chưa nhận/prefill URL; phần đó và gửi yêu cầu thật ở G5. Đánh giá trực quan G3 chờ chủ dự án xem bản demo.

Build triển khai hoàn tất ngày 15/10/2026: biên dịch, TypeScript tích hợp trong Next build và static export đủ bảy route đạt. Đã sửa cách đọc media registry để WebP có fallback theo kiểu ProductMedia, tránh nhánh TypeScript `never` khi tất cả ảnh đều có webSrc. Npm được gọi bằng đường dẫn CLI có sẵn do shim Windows của bước build helper lỗi phân giải đường dẫn; không thay package hoặc kiến trúc hosting.

Đợt G3.1 — Sản phẩm:

- Hero trang con, nhóm sản phẩm nổi bật theo REF-06 và catalogue theo danh mục đã xác nhận.
- Ảnh sản phẩm nhất quán về ánh sáng, tỷ lệ và framing; dùng contain khi cần giữ đầy đủ hình dạng cuộn nhãn/sản phẩm.
- Điều hướng nhóm bằng anchor hoặc bộ lọc thực, chọn theo lượng nội dung. Không thêm search khi chưa có nhu cầu.
- Nội dung quy cách/ứng dụng và hướng dẫn chuẩn bị yêu cầu báo giá đã được kiểm tra.
- CTA chuyển sản phẩm đang chọn tới trang liên hệ bằng slug công khai hợp lệ.

Đợt G3.2 — Giải pháp:

- Hero ảnh ứng dụng theo REF-05; các phần bài toán → cách giải quyết → sản phẩm phù hợp → liên hệ.
- Các nhóm ngành/use case trong STRUCTURE.md chỉ được dùng sau khi xác nhận.
- Cross-link tới đúng nhóm sản phẩm và truyền ngữ cảnh nhu cầu tới trang liên hệ.

File/module dự kiến: app/san-pham/, app/giai-phap/, sections/products/, sections/solutions/, components/products/, src/content/products.ts, solutions.ts và types khi cần.

Nghiệm thu: khách phân biệt được sản phẩm với ứng dụng; ảnh đủ lớn để đánh giá; catalogue không gây cảm giác cửa hàng bán lẻ; bộ lọc có trạng thái rỗng/reset nếu dùng; CTA giữ đúng ngữ cảnh. Kiểm tra chức năng nhận/prefill ngữ cảnh đầy đủ tại G5.

### G4 — Giới thiệu, Năng lực và Dự án

Ba module bàn giao riêng:

- G4.1 Giới thiệu: Hero theo REF-07, câu chuyện/định hướng được xác nhận và editorial split theo REF-08. Mốc lịch sử, đội ngũ và giá trị chỉ hiện khi có dữ liệu được duyệt.
- G4.2 Năng lực: phạm vi thiết kế/in/gia công thật, thiết bị, quy trình, QC, ảnh sản xuất và cách phối hợp đơn hàng. REF-02/08 định hướng tỷ lệ ảnh/chữ; quy trình chuyển thành danh sách dọc dễ đọc trên mobile.
- G4.3 Dự án: gallery ảnh lớn theo REF-04, ngữ cảnh brief → công việc → thành phẩm khi được phép. Nếu chỉ có mẫu sản phẩm, dùng tên “Mẫu thành phẩm” phù hợp. Không tự mở route chi tiết.

File/module dự kiến: app/gioi-thieu/, app/nang-luc/, app/du-an/, sections/about/, capabilities/, projects/, các component tương ứng và dữ liệu company/capabilities/projects trong src/content/.

Nghiệm thu: mỗi trang bổ sung thông tin riêng, không chép lại giới thiệu chung; mọi thông số, máy móc, chứng nhận và khách hàng có nguồn. Không triển khai vòng tròn thống kê REF-03 khi chưa có số liệu được xác nhận. Gallery/filter nếu có phải hoạt động; ảnh dự án và tên khách hàng có quyền công bố.

### G5 — Liên hệ và gửi yêu cầu báo giá

Công việc:

- Trang liên hệ rõ ràng, thông tin xác thực, CTA điện thoại/email có đích thực; bản đồ chỉ khi địa chỉ được xác nhận.
- Form theo STRUCTURE.md: mục đích, họ tên, công ty, ít nhất một kênh phone/email, nội dung; trường báo giá bổ sung khi phù hợp.
- Nhận product/solution/project slug từ URL, kiểm tra theo dữ liệu được duyệt; slug sai không tạo lựa chọn giả.
- Chốt và nối endpoint thật. Static export hiện tại không có API runtime; ưu tiên endpoint được duyệt tương thích với kiến trúc này. Nếu cần server runtime, trình bày thay đổi hosting trước khi thực hiện.
- Validation phía client/server, loading, lỗi mạng/lỗi server, bảo vệ gửi lặp và thông báo thành công chỉ khi phía nhận xác nhận.
- Nội dung quyền riêng tư/đồng ý và cách xử lý dữ liệu do doanh nghiệp xác nhận. Có thể trình bày ngay trong trang liên hệ; trang pháp lý riêng cần chốt phạm vi.

File/module dự kiến: app/lien-he/, sections/contact/, components/contact/InquiryForm.tsx, src/content/contact.ts, lib/validation và adapter gửi theo phương án đã duyệt. Không đưa secret vào frontend.

Nghiệm thu: yêu cầu từ mỗi hành trình B2B tới đúng nơi tiếp nhận với đủ ngữ cảnh; kiểm tra thành công, validation và thất bại thật. Trước khi bật công khai, kiểm tra gửi có kiểm soát tới kênh nhận đã được người dùng cho phép.

### G6 — Hoàn thiện câu chuyện Trang chủ

Ghép đủ nội dung theo thứ tự STRUCTURE.md:

Hero → BrandIntroduction → FeaturedProductCategories → WhySunflower → CapabilitiesFeature → SolutionsByIndustry → FeaturedProjects → ProcessPreview → ContactCTA → Footer.

- Dùng lại dữ liệu/ảnh được duyệt ở G3–G5; chọn lọc nội dung, không đưa toàn bộ catalogue lên trang chủ.
- Cân bằng các section sáng/tối, ảnh lớn/đoạn ngắn, nhịp gallery/editorial.
- Rà lại chiều dài copy, tính liên tục của thông điệp và khoảng cách giữa các CTA.
- Hoàn thiện hành trình Trang chủ → Sản phẩm/Giải pháp/Năng lực → Liên hệ.

File/module dự kiến: src/sections/home/, app/page.tsx và dữ liệu chọn lọc trong src/content/. Không tạo dữ liệu homepage độc lập bị lệch với trang con.

Nghiệm thu: trang chủ vừa tạo ấn tượng vừa giúp khách hiểu và chọn đường đi; không có section tồn tại chỉ để lấp khoảng trống. Đối chiếu toàn trang desktop và mobile, kiểm tra lại Header/Hero sau khi trang đã có chiều dài thực.

### G7 — Kiểm tra cuối và phát hành

- Rà toàn bộ bảy trang và đường đi thực tế; kiểm tra lỗi console, tài nguyên mất, anchor, menu, filter, form, loading/error/empty states và 404.
- Kiểm tra tại 390×844, 768×1024, 1024×768, 1440×900 và 1920×1080. Rà thêm màn hình hẹp/zoom để phát hiện text bị cắt và tràn ngang.
- Kiểm tra ảnh/video tối ưu, loading priority, kích thước để tránh layout shift và media ở từng breakpoint. Static export đang dùng images.unoptimized; phải xuất media tối ưu trước hoặc chốt cơ chế tối ưu ảnh thật, không mặc định next/image đã xử lý.
- Keyboard, focus, heading, alt, label, contrast và reduced motion. Kiểm tra chữ Hero trên nhiều frame video.
- Metadata riêng từng trang, canonical/domain thật, Open Graph được phép dùng; sitemap/robots phù hợp với trạng thái công khai. Chỉ bật index khi nội dung và hệ thống đã sẵn sàng.
- Chạy lint, typecheck và production build. Kiểm tra bản deploy thực tế, form destination và media path; không chỉ dựa vào dev server.
- Đưa bản hoàn chỉnh có thể xem và kiểm tra cho người dùng duyệt trước khi công khai; giữ cấu hình truy cập hiện có trong quá trình phát triển.

Nghiệm thu: không còn lỗi làm mất nội dung, cản thao tác, gửi sai yêu cầu, vỡ responsive hoặc công bố thông tin chưa được duyệt. Các điểm chưa xong phải được xử lý hoặc có quyết định phạm vi rõ ràng; không mặc định bỏ qua để gọi là hoàn thành.

## 5. Vòng kiểm soát chất lượng cho mọi module

| Bước | Thực hiện | Bằng chứng bàn giao |
|---|---|---|
| 1. Chuẩn bị | Chọn reference, nội dung thật, media và file bị ảnh hưởng | Brief ngắn, phần phụ thuộc đã rõ |
| 2. Thiết kế | Xác định grid, thứ tự, tỷ lệ ảnh/chữ và mobile | Phương án cụ thể trên source chính; chỉ trình bày trước phần cần duyệt |
| 3. Triển khai | Làm một module hoặc 2–3 section liên quan | Giao diện chạy được, không nhánh demo/mock song song |
| 4. Đối chiếu | Xem screenshot cạnh reference trên desktop/mobile | Nhận xét riêng về bố cục, palette, type, spacing, media và responsive |
| 5. Điều chỉnh | Sửa các điểm không đạt, render lại trạng thái bị ảnh hưởng | Lỗi đã sửa được kiểm chứng, không chỉ ghi nhận |
| 6. Nghiệm thu | Báo cáo đã làm, đã kiểm, còn thiếu; lấy duyệt tại mốc thiết kế | Cập nhật trạng thái thực trước khi chuyển module |

Screenshot đối chiếu có thể lưu tạm ngoài source và trình bày khi nghiệm thu. Không tái tạo thư mục test/demo cũ hoặc đưa ảnh QA vào public/. Việc đã dọn file test/mock không bỏ yêu cầu kiểm tra chất lượng.

Không dừng để xin duyệt từng thay đổi spacing nhỏ. Các mốc cần duyệt tập trung: Header/Hero, ngôn ngữ section đại diện, từng nhóm trang và bản cuối. Thay đổi palette, cấu trúc lớn hoặc đích tiếp nhận dữ liệu cần có quyết định riêng.

## 6. Tiêu chí “đẹp và chuyên nghiệp”

- Bố cục: có điểm nhấn chính rõ, tỷ lệ ảnh/chữ cân đối, cùng hệ alignment và nhịp section; không biến website thành chuỗi card giống nhau.
- Màu: dùng tokens đã duyệt, navy/white/light-neutral có vai trò rõ; green tập trung vào hành động, vàng dùng tiết chế.
- Typography: phân cấp H1/H2/body rõ, dấu tiếng Việt đúng, line break có chủ đích; không mất chữ trên ảnh hoặc ở viewport hẹp.
- Spacing: khoảng trắng theo scale, paragraph dễ đọc, nội dung liên quan gần nhau; không có khoảng rỗng lớn chỉ để kéo dài trang.
- Media: ảnh/video thật, sắc nét, ánh sáng nhất quán, crop đúng chủ thể; sản phẩm và chất liệu thể hiện rõ.
- Responsive: thứ tự và kích thước được thiết kế riêng; không tràn ngang, CTA dễ bấm, ảnh không méo và menu không che mất thao tác.
- Nội dung: cụ thể, đáng tin, phù hợp người mua B2B; không dùng slogan hoặc số liệu không có bằng chứng.
- Tương tác: nút/link/filter/form có kết quả thật; focus rõ; nhiều animation phối hợp và chiều sâu sản phẩm theo DESIGN.md. Không nghiệm thu một giao diện truyền thống/cũ kỹ hoặc chỉ có fade-in cơ bản.

Mỗi vòng đối chiếu ghi “đạt / cần sửa / chưa thể đánh giá do thiếu đầu vào” theo các tiêu chí trên. Không tự chấm một điểm số đẹp tổng quát để thay thế việc chỉ ra và sửa khác biệt cụ thể.

## 7. Checklist tiến độ

- [x] G0 bản xem: content/media map và bộ ảnh tạm đã chốt theo chỉ định người dùng.
- [ ] G0 công khai: hoàn thiện dữ liệu chính thức, media phù hợp và trạng thái quyền sử dụng.
- [x] G1 code/QA: Header/Hero hoàn tất với footage/poster G0, screenshot và tương tác đã kiểm tra; chủ dự án duyệt bản xem trước G2.
- [x] G2 code: section sáng/tối và component chung đã triển khai; bỏ kiểm thử theo yêu cầu người dùng, UI chờ duyệt qua bản xem.
- [x] G2.Motion: choreography, interaction, CSS 3D scene và reduced-motion/no-JS fallback đã code; kiểm tra tập trung desktop/mobile đạt.
- [x] G3.1 code: Sản phẩm đủ 13 nhóm/anchor/CTA; chờ nghiệm thu UI, không chạy kiểm lại theo yêu cầu.
- [x] G3.2 code: Giải pháp đủ 5 nhu cầu/cross-link/CTA; chờ nghiệm thu UI, prefill Liên hệ thuộc G5.
- [ ] G4.1: Giới thiệu hoàn thiện.
- [ ] G4.2: Năng lực hoàn thiện.
- [ ] G4.3: Dự án/Mẫu thành phẩm hoàn thiện.
- [ ] G5: Liên hệ và báo giá gửi thật, giữ đúng ngữ cảnh.
- [ ] G6: Trang chủ đầy đủ, dữ liệu nhất quán với trang con.
- [ ] G7: UI/functional QA, build, nội dung, media, SEO và phát hành đạt yêu cầu.

Điểm bắt đầu sau khi kế hoạch được duyệt: G0 để chuẩn bị đầu vào tối thiểu, rồi G1 trên Header/VideoHero hiện tại. Không xây lại từ đầu và không triển khai đồng loạt bảy trang.
