# Sunflower — Kế hoạch triển khai website

Ngày lập: 14/10/2026. Trạng thái: đã chốt bộ đầu vào G0 tạm cho bản xem theo chỉ định người dùng — copy bảy trang, 9 ảnh sản phẩm, 5 ảnh Unsplash minh họa doanh nghiệp, 1 ảnh văn phòng và video/poster Hero. Tiếp tục bằng bộ này; người dùng bổ sung/chỉnh sửa ảnh sau, không chờ đủ bộ media. Chủ doanh nghiệp xác nhận đủ 13 nhóm sản phẩm và cho phép dữ liệu liên hệ minh họa để xem bố cục. Đầu vào chính thức vẫn cần hoàn thiện trước công khai; chưa nghiệm thu G1 hoặc triển khai các trang còn lại.

Cơ sở: AGENTS.md duy nhất tại gốc workspace; DESIGN.md, STRUCTURE.md, REFERENCE_GUIDE.md, ARCHITECTURE.md và source hiện tại. Kế hoạch này tổ chức công việc, không thay thế design tokens hoặc bổ sung sitemap/chức năng ngoài tài liệu đã duyệt.

## 1. Mục tiêu và điểm xuất phát

Website giới thiệu doanh nghiệp Sunflower, sản phẩm tem nhãn/bao bì và giải pháp cho khách hàng B2B. Khách cần hiểu doanh nghiệp làm gì, xem sản phẩm, đánh giá năng lực thực tế và gửi nhu cầu báo giá.

Chất lượng thị giác là điều kiện hoàn thành của từng module. Việc có đủ section hoặc build thành công chưa đủ để nghiệm thu giao diện.

Hiện có:

- Next.js App Router, React, TypeScript, Tailwind và font Inter self-host.
- Bảy route đã tạo, design tokens trong globals.css, Container và Header có menu mobile.
- VideoHero có nguồn video iStock preview do người dùng chọn và poster tương ứng. Đã kiểm tra playback/pause/play trên trình duyệt; logic reduced motion và mạng hạn chế giữ poster, chưa kiểm tra các tùy chọn này bằng emulation.
- Sáu trang con chỉ có tiêu đề và metadata; chưa có catalogue, gallery, Footer hay form.
- Static export ra out/; đang giữ noindex. Chưa có backend gửi yêu cầu báo giá.
- Tám ảnh Sonoco tại reference/desktop/ ở gốc workspace. Đây là tài liệu nghiên cứu, không phải media của website.

Hiện thiếu logo chính thức, bản Hero HD được cấp phép, ảnh Sunflower, thông số chi tiết và đích nhận yêu cầu. Copy bảy trang đã được soạn trong CONTENT.md; dữ liệu liên hệ đang là minh họa theo chỉ định người dùng. Video đang dùng là preview 768×432 có watermark, không phải footage cơ sở Sunflower. Không tái tạo legacy-demo hoặc ảnh nhà máy/dự án giả để lấp chỗ trống. Phần chưa đủ dữ liệu ghi trong tài liệu tiến độ; không coi là đã hoàn thành.

## 2. Nguyên tắc thực hiện

1. Giữ đủ bảy trang: Trang chủ, Giới thiệu, Sản phẩm, Giải pháp, Năng lực, Dự án và Liên hệ. Không tự thêm trang chi tiết, blog, giỏ hàng, login hoặc tích hợp ERP.
2. Dùng màu, typography, spacing và grid đã duyệt trong DESIGN.md. Đường cong navy, ảnh lớn và nhịp editorial lấy nguyên tắc từ Sonoco, sử dụng nội dung và tài sản Sunflower.
3. Mỗi đợt chỉ xử lý một module hoặc 2–3 section có quan hệ rõ. Thiết kế và kiểm tra desktop/mobile ngay trong đợt đó.
4. Tái sử dụng source đang có. Chỉ tạo component chung khi có hai cách dùng có ý nghĩa hoặc cần tách logic phức tạp; không tạo trước hàng loạt component rỗng.
5. Nội dung sản phẩm, giải pháp và dự án có một nguồn dữ liệu dùng chung cho trang chủ và trang con. Chỉ render dữ liệu được phép công bố.
6. Animation chỉ bổ sung khi có tác dụng rõ. Không dùng hiệu ứng để che ảnh yếu, bố cục thiếu cân đối hoặc nội dung mỏng.
7. Sau khi một hướng đã được duyệt, không tự thay font, palette hoặc ngôn ngữ bố cục ở module tiếp theo. Nếu cần thay đổi lớn, trình bày phương án cụ thể và ảnh hưởng trước.
8. Có thể tiếp tục công việc độc lập khi thiếu một đầu vào, nhưng không nghiệm thu phần phụ thuộc đầu vào đó. Ví dụ: thiếu video vẫn chuẩn hóa tokens được; Hero cinematic vẫn chưa hoàn thành.

## 3. Lộ trình tổng thể

| Giai đoạn | Phạm vi | Bàn giao | Điều kiện chuyển tiếp |
|---|---|---|---|
| G0 | Chốt nội dung và media | Danh mục đầu vào, nội dung từng trang, media ưu tiên | Có đầu vào tối thiểu để thiết kế màn hình đầu bằng tài sản thật |
| G1 | Nền tảng + Header + Hero | Màn hình đầu desktop/mobile, menu và video hoạt động | Duyệt chất lượng Header/Hero; sửa xong lỗi đọc chữ, bố cục, crop và responsive |
| G2 | Ngôn ngữ section + khung dùng chung | Giới thiệu ngắn, nhóm sản phẩm nổi bật, một section navy, ContactCTA/Footer | Chốt được nhịp sáng/tối, tỷ lệ ảnh/chữ và component dùng chung |
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

**Trạng thái 14/10/2026:** đã cập nhật source G1 Header/VideoHero, giữ palette warm và media G0. Lint/typecheck/build cùng kiểm tra HTTP/static export đạt; chưa nghiệm thu UI vì browser automation không khởi tạo được. Không triển khai G2 hoặc các trang còn lại trong lượt này.

Công việc:

- Rà lại tokens đang có với DESIGN.md; thống nhất Container, khoảng cách, heading, CTA và focus.
- Hoàn thiện Header hiện tại: logo thật, năm mục chính, CTA báo giá, trạng thái trên Hero và trạng thái nền đặc, menu mobile.
- Hoàn thiện VideoHero dựa trên REF-01: đường cong navy nguyên bản, tỷ lệ text/media, H1 tiếng Việt, CTA và điểm nhấn footage.
- Chọn crop desktop/mobile dựa trên chủ thể thật. Mobile có bố cục riêng, không chỉ giảm cỡ chữ desktop.
- Kiểm tra muted/autoplay, pause/play, video lỗi, autoplay bị chặn, đổi viewport, reduced motion và Save-Data; dùng poster thật khi không phát.

File/module dự kiến: src/app/globals.css, src/app/layout.tsx, src/components/layout/Header.tsx, Container.tsx, src/components/media/VideoHero.tsx, src/content/hero.ts và media Hero.

Nghiệm thu: H1 và CTA chính đọc được ngay; Header không xung đột với ảnh; chủ thể video không bị crop mất; thao tác menu/video bằng bàn phím hoạt động. Đối chiếu 1440×900 và 390×844, sửa và kiểm tra lại. Chưa có footage/poster thật thì chưa nghiệm thu chất lượng cinematic.

#### Báo cáo G1 — 14/10/2026

Đã đọc các tài liệu theo contract và mở đủ tám ảnh tham chiếu. REF-01 định hướng Hero; REF-02/06/08 bổ sung ngữ cảnh Header nền trắng. Các pattern khác vẫn thuộc module tương ứng, không ghép thành section mới trong G1.

Files thay đổi: `src/components/layout/Header.tsx`, `src/components/media/VideoHero.tsx`, `src/content/hero.ts`, `src/app/globals.css`; copy/tài liệu canonical được cập nhật tại chỗ.

| Tiêu chí | Đối chiếu định hướng với reference, từ source | Trạng thái |
|---|---|---|
| Bố cục | Giữ đường cong navy nguyên bản, chữ lớn bên trái và media từ 40% chiều rộng; khung dựa trên 16:9 thay cho chiều cao cố định cắt mạnh footage | Đã sửa source; chưa so screenshot kết quả |
| Màu | Theo phản hồi ảnh mới của người dùng: xanh chính tươi hơn và nút cam theo DESIGN.md, thay bản navy/vàng trước. Bỏ lớp tối dưới video, rút ngắn vùng fade ngang; caption vẫn có nền deep navy nhỏ | Đã cập nhật source theo yêu cầu; cần xem ảnh kết quả mới |
| Typography | Inter tiếng Việt, câu đầy đủ chia ba cụm; bỏ dòng riêng “cho”. Giữ clamp desktop và cân lại cỡ chữ mobile | Đã sửa source; chưa đo text wrap thực tế |
| Spacing | Đưa copy lên 35svh có giới hạn; gutters 64/40/32/20px theo breakpoint, giảm khoảng trống mobile; Header 88/76px | Cần kiểm tra trực quan trên các viewport |
| Responsive | Header dưới 1200px dùng dialog. Mobile/tablet dọc xếp chữ trước, video 16:9 phía dưới; không có reference mobile nên đây là adaptation Sunflower | Chưa xác nhận overflow/crop bằng trình duyệt |
| Tương tác | Focus/menu đóng theo route/breakpoint; autoplay promise được xử lý, poster giữ đến `playing`; reduced-motion và Save-Data ngăn mount video | Đã sửa logic; cần kiểm tra runtime |

Kiểm tra đã thực hiện:

- `npm run lint`, `npm run typecheck`, `npm run build`: đạt.
- Dev HTTP 200; static preview kiểm tra đủ 7 route HTTP 200, title riêng, mỗi trang một H1 và noindex. Hero chỉ xuất hiện ở Trang chủ; SSR có poster, chưa có thẻ video trước khi kiểm tra tùy chọn người dùng. Poster/video trả đúng MIME và số byte.
- Contrast sau chỉnh màu theo phản hồi: chữ deep navy trên cam 6,15:1, trên hover cam đậm 4,77:1; caption trắng/deep navy 15,11:1, chữ trắng/xanh chính 9,06:1. Trắng trên lớp xanh 86% phủ nền trắng là 6,36:1; đây là phép tính cho màu overlay, không thay thế kiểm tra toàn bộ video frame. Focus trắng trên Hero và xanh trên nền sáng.
- Không thêm dependency, thư mục test/demo, ảnh tham chiếu vào public hoặc asset trùng; media Hero giữ nguyên, video 2.925.394 byte và poster 24.172 byte.

Giới hạn: CUA và Windows computer-use/node runtime đều trả `failed to write kernel assets: The system cannot find the path specified. (os error 3)`. Chưa có screenshot 1440×900/390×844, chưa kiểm tra trực quan 768/1024/1920, keyboard/menu/video mới, autoplay blocked, reduced-motion/Save-Data hoặc console trong trình duyệt. Không dùng kết quả browser QA của phiên bản cũ để nghiệm thu phiên bản này. Bản xem riêng tư có thể tiếp tục cập nhật; G1 vẫn cần vòng screenshot → điều chỉnh → kiểm tra lại khi công cụ hoạt động.

Logo vẫn là wordmark tạm; video iStock preview có watermark và độ phân giải 768×432. Đây là đầu vào G0 đã chốt cho bản xem, chưa phải media phát hành công khai.

Phản hồi màu 14/10/2026: đã đối chiếu hai ảnh người dùng gửi (Sonoco và Sunflower); nền trước sẫm hơn ảnh tham chiếu và các CTA còn vàng. Điều chỉnh chỉ ở tokens/focus/overlay trong globals.css và tài liệu canonical, giữ bố cục, typography, video cùng chức năng G1. Bản màu đang hoạt động được quy định tại DESIGN.md, không tạo theme hoặc bộ source mới. CUA vẫn lỗi khởi tạo khi thử lại ở lượt này; ảnh người dùng là bằng chứng cho bản trước chỉnh màu, không thay thế screenshot/QA của bản mới.

### G2 — Các section đại diện và component chung

Chia ba đợt:

1. BrandIntroduction và FeaturedProductCategories: đoạn giới thiệu ngắn trên nền sáng, 4–6 nhóm sản phẩm với ảnh lớn và thứ tự rõ.
2. WhySunflower: một section navy dùng năng lực đã xác nhận, tham chiếu REF-02. Nếu chưa có bằng chứng cho nội dung này, giữ việc triển khai ở trạng thái chờ; không thay bằng số liệu hoặc card chung chung.
3. ContactCTA và Footer dùng chung, với thông tin liên hệ thật và đủ liên kết bảy trang.

Chốt các pattern thực sự cần dùng lại: tiêu đề section, ảnh–chữ editorial, gallery sản phẩm, CTA cuối trang. Pattern có thể dùng chung cấu trúc, nhưng mỗi section vẫn có tỷ lệ và câu chuyện riêng.

File/module dự kiến: src/sections/home/, components/editorial/, components/products/, components/layout/Footer.tsx, components/contact/ContactCTA.tsx, src/content/ và app/layout.tsx.

Nghiệm thu: khi cuộn từ Hero xuống, bố cục có nhịp và chuyển màu hợp lý; ảnh là điểm nhấn; tiêu đề, nội dung và CTA thẳng hàng theo grid. Không lặp liên tiếp nhiều grid card giống nhau. Đây là mốc duyệt ngôn ngữ giao diện trước khi triển khai rộng các trang con.

### G3 — Sản phẩm và Giải pháp

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
- Tương tác: nút/link/filter/form có kết quả thật; focus và trạng thái rõ; chuyển động tiết chế.

Mỗi vòng đối chiếu ghi “đạt / cần sửa / chưa thể đánh giá do thiếu đầu vào” theo các tiêu chí trên. Không tự chấm một điểm số đẹp tổng quát để thay thế việc chỉ ra và sửa khác biệt cụ thể.

## 7. Checklist tiến độ

- [x] G0 bản xem: content/media map và bộ ảnh tạm đã chốt theo chỉ định người dùng.
- [ ] G0 công khai: hoàn thiện dữ liệu chính thức, media phù hợp và trạng thái quyền sử dụng.
- [ ] G1: Header/Hero đã duyệt và kiểm tra với footage/poster thật.
- [ ] G2: section sáng/tối và component chung đã duyệt.
- [ ] G3.1: Sản phẩm hoàn thiện.
- [ ] G3.2: Giải pháp hoàn thiện.
- [ ] G4.1: Giới thiệu hoàn thiện.
- [ ] G4.2: Năng lực hoàn thiện.
- [ ] G4.3: Dự án/Mẫu thành phẩm hoàn thiện.
- [ ] G5: Liên hệ và báo giá gửi thật, giữ đúng ngữ cảnh.
- [ ] G6: Trang chủ đầy đủ, dữ liệu nhất quán với trang con.
- [ ] G7: UI/functional QA, build, nội dung, media, SEO và phát hành đạt yêu cầu.

Điểm bắt đầu sau khi kế hoạch được duyệt: G0 để chuẩn bị đầu vào tối thiểu, rồi G1 trên Header/VideoHero hiện tại. Không xây lại từ đầu và không triển khai đồng loạt bảy trang.
