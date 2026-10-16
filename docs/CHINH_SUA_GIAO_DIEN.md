# Sunflower — Kế hoạch chỉnh sửa giao diện

> Ngày lập: 15/10/2026.  
> Trạng thái: Đã triển khai sáu lượt code giao diện, cập nhật 16/10/2026. Lượt 5 hoàn thiện Home/CTA/Footer, lượt 6 mở rộng hệ chữ/màu/ảnh cong sang sáu trang con; gỡ nhãn minh họa theo yêu cầu. Cần chủ dự án nghiệm thu thiết kế; đầu vào công khai và kiểm tra môi trường khác vẫn chờ. Đây không phải xác nhận website sẵn phát hành công khai.
> Mục tiêu: Hiện đại, nhiều hiệu ứng, bắt mắt, chuyên nghiệp và đột phá; không nghiệm thu một giao diện vẫn quá an toàn.

Tài liệu này tổ chức công việc khắc phục bốn vấn đề của bản demo hiện tại. Đây không phải bản sao hoặc tài liệu thay thế [DESIGN.md](DESIGN.md), [STRUCTURE.md](STRUCTURE.md) và [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Khi triển khai, cập nhật token/contract thiết kế tại DESIGN.md, tiến độ và kết quả kiểm tra tại IMPLEMENTATION_PLAN.md; file này giữ phạm vi và checklist của đợt chỉnh sửa.

## Phạm vi và nguyên tắc chung

- Giữ bảy trang và thứ tự nội dung đã duyệt trong STRUCTURE.md. Làm Trang chủ trước, sau đó áp dụng có chọn lọc lên các trang con.
- Giữ cinematic video Hero, hệ màu xanh–cam đang hoạt động và nội dung kinh doanh đã xác nhận. Đổi cách dàn dựng để tăng sức hút, không dựng lại website từ đầu.
- Dùng hình thái của ngành in làm ngôn ngữ xuyên suốt: cuộn tem, dải nhãn, mép bóc decal, lớp giấy, đường bế và chất liệu. Hình khối, màu, chữ và chuyển động phải cùng phục vụ câu chuyện này.
- Sonoco tiếp tục là tham chiếu chính về kỷ luật bố cục và tính chuyên nghiệp. Packwire bổ sung cách trình bày sản phẩm trong Hero; BFS bổ sung tương tác khám phá; MWDT bổ sung chuyển động và chiều sâu qua ranh giới section.
- Không sao chép tài sản hoặc bố cục nguyên bản của các trang tham chiếu. Không biến minh họa thành bằng chứng về nhà máy, cấu tạo kỹ thuật hay dự án khách hàng của Sunflower.
- Mỗi section có một ý tưởng chuyển động chủ đạo; mức độ chuyển động phụ thuộc vai trò nội dung. Form, điều hướng và CTA luôn dễ đọc, dễ thao tác.

| Module | Vấn đề cần sửa | Kết quả cần thấy | Trạng thái |
|---|---|---|---|
| M1 | Ít hiệu ứng | Chuyển động có diễn biến, có tương tác và gắn với sản phẩm | Hero/loupe/ảnh theo cụm; lượt 5–6 thêm đường quy trình và mở dải nhãn, tái dùng observer ở trang con |
| M2 | Phối màu dễ đoán | Màu phối theo lớp và điểm nhấn, giảm nhịp xanh–trắng lặp lại | Trường màu cục bộ, ảnh màu, nhịp ngà/xanh xuyên Home và sáu Hero; nguồn token giữ nguyên |
| M3 | Khối vuông nhiều | Sản phẩm thoát khung, bố cục bất đối xứng và có chiều sâu | Hero/gallery/giấy lệch; dải ba nhãn nổi qua biên Quy trình–CTA, khung ảnh/catalogue trang con có hình học riêng |
| M4 | Chữ an toàn, nhạt nhẽo | Chữ trở thành thành phần thiết kế có cá tính và nhịp điệu | Ba variant section, sáu H1 theo cụm, CTA lớn và chữ thương hiệu Footer; H2/CTA giữ ngữ nghĩa |

**Kiểm chứng lượt 5–6:** xem IMPLEMENTATION_PLAN.md cho 42 bố cục route, 22 điểm section, HTTP/anchor, filter/viewer/form và giới hạn thực. Nguồn/quyền chuyển về docs/media registry theo yêu cầu bỏ nhãn thừa; form vẫn báo chưa gửi. Checklist dưới đây là tiêu chí đầy đủ, không dùng code đã xong để tự chứng nhận mọi điều kiện nghiệm thu/thiết bị thật.

**Kiểm chứng lượt 4:** ba section Home đã có source và QA production local sáu viewport. Token/contract tại DESIGN.md mục 8; bằng chứng/giới hạn tại IMPLEMENTATION_PLAN.md. Không đánh dấu checklist toàn module bằng kết quả ba section.

## Module M1 — Tăng hiệu ứng và tương tác có chủ đích

### Hiện trạng và mục tiêu

Bản hiện tại đã có video, reveal, phản hồi hover và cảnh tem CSS 3D. Tuy nhiên, nhiều hiệu ứng chỉ diễn ra khi nội dung xuất hiện; cảnh tem chủ yếu nghiêng và dịch chuyển nhẹ. Cần tạo chuyển động có mở đầu, diễn biến và điểm kết thúc, đủ rõ để người xem cảm nhận được tính hiện đại.

### Hạng mục chỉnh sửa

1. **Dàn dựng Hero thành một chuỗi thống nhất.** Chữ mở theo cụm nghĩa, video hiện qua vùng mask, cuộn tem tiền cảnh xoay về góc nhìn chính và dải nhãn mở ra. CTA xuất hiện sớm, không bị khóa để chờ animation kết thúc. Giữ Pause/Play và poster fallback của video.
2. **Cảnh cuộn tem chuyển động theo cuộn trang.** Trong một quãng cuộn ngắn, thay đổi góc nhìn, mở dải nhãn và tách/ghép các lớp minh họa. Các phần có chuyển động riêng, không chỉ dịch chuyển cả cụm. Khi ra khỏi vùng cảnh, chuyển động dừng; trang vẫn cuộn tự nhiên.
3. **Kính lúp khám phá chất liệu.** Áp dụng cho ảnh trong phần Mẫu thành phẩm và chọn lọc tại Sản phẩm/Dự án. Desktop có vùng kính theo chuột, mở chi tiết bề mặt hoặc đường bế. Giữ con trỏ mặc định; không tạo custom cursor toàn site. Mobile và bàn phím dùng nút “Xem cận cảnh” với trạng thái đóng rõ ràng.
4. **Tạo nhịp tương tác khác nhau.** Gallery dùng lớp ảnh và chiều sâu; ảnh editorial dùng mask; quy trình dùng đường nối và đánh dấu bước khi đi qua. Tránh áp một fade-in giống nhau cho mọi section.
5. **Phản hồi thao tác đồng bộ.** Nút, mũi tên, lựa chọn sản phẩm và bộ lọc có phản hồi ngắn, rõ. Hiệu ứng không làm thay đổi vị trí mục tiêu khi người dùng chuẩn bị bấm.

### Phạm vi source dự kiến

- `src/components/media/VideoHero.tsx` — chuỗi Hero và phối hợp media.
- `src/components/products/HeroLabelSculpture.tsx`, `src/lib/hero-motion.ts` — đã triển khai minh họa Hero và vòng đời choreography lượt 2; khác cảnh CSS 3D dưới trang.
- `src/components/products/ProductDepthScene.tsx` — chuyển động từng phần của cảnh tem.
- `src/components/motion/MotionController.tsx` — điều phối reveal và vòng đời chuyển động.
- `src/components/products/ProductImage.tsx`, `src/components/projects/ProjectGallery.tsx` — tích hợp tương tác cận cảnh nếu phù hợp; tách component kính lúp dùng chung khi cần.
- `src/sections/home/`, `src/app/globals.css` — áp dụng choreography và token tập trung.

### Đầu vào và giới hạn

Ảnh cận cảnh cần đủ độ phân giải; phóng lớn ảnh thumbnail không đáp ứng yêu cầu. Ưu tiên CSS, IntersectionObserver và requestAnimationFrame hiện có. Chỉ cân nhắc thêm một animation engine khi choreography thực tế vượt khả năng triển khai và bảo trì bằng công cụ hiện tại; không mặc định thêm WebGL.

### Tiêu chí nghiệm thu

- [ ] Hero, cảnh vật liệu và vùng khám phá sản phẩm có ba trải nghiệm khác nhau, nhìn thấy rõ khi duyệt trang bình thường.
- [x] Cảnh tem Hero có biến đổi tương đối giữa cuộn, dải nền, nhãn bóc và phần in cuối; đã kiểm tra trên desktop/mobile ở lượt 2.
- [x] Kính lúp hiển thị chi tiết có sẵn từ PNG gốc đủ độ phân giải; viewer thủ công với ảnh gốc/cuộn ảnh cho touch và bàn phím. Đã kiểm chứng click/keyboard và kích thước mobile, chưa thiết bị touch thật.
- [ ] Không scroll hijacking, ép chờ reveal hoặc che CTA; chuyển động dừng ngoài vùng nhìn.
- [ ] Reduced-motion/no-JS giữ nội dung, bố cục có chiều sâu và đường đi thiết yếu; tương tác cần JS có fallback rõ ràng.

**Kiểm chứng lượt 2:** riêng Hero đã có bật/tắt bằng chuột và Enter, dừng ngoài vùng nhìn, không khóa scroll/CTA; SSR giữ hình/copy/poster. Vòng đời reduced-motion được mô phỏng bằng Node, chưa giả lập media preference thật trong trình duyệt hiện tại. Không đánh dấu các tiêu chí toàn module bằng kết quả Hero. Xem báo cáo hiện hành trong IMPLEMENTATION_PLAN.md.

**Kiểm chứng lượt 3:** viewer chung tại Home (Mực in, Tem dệt, Băng dính) và `/du-an` (Tem dệt, Băng dính); ảnh nhỏ không có zoom giả. Lens giữ con trỏ gốc, bị chặn khi reduced-motion/coarse/no-hover, không chạy vòng lặp liên tục. Đã kiểm hình học nguồn/clamp, modal/focus/scroll, filter/CTA và sáu viewport. Giới hạn kiểm tra native preference, no-JS và ảnh macro ở IMPLEMENTATION_PLAN.md.

## Module M2 — Phá nhịp phối màu dễ đoán

### Hiện trạng và mục tiêu

Màu thường được chia theo toàn bộ section, khiến nhịp xanh–trắng–xanh dễ đoán. Cần tăng chiều sâu và tính liên tục bằng cách phối màu theo lớp ngay trong một bố cục, đồng thời giữ nhận diện xanh–cam và tính chuyên nghiệp.

### Hạng mục chỉnh sửa

1. **Khai thác bộ màu hiện có.** Xanh chính, xanh sâu, trắng, ngà và các sắc nền nhạt có vai trò riêng. Cam vừa dẫn hành động vừa làm chi tiết định hướng, không chỉ xuất hiện ở nút. Dùng semantic token hiện có; token bổ sung phải cập nhật tại DESIGN.md.
2. **Phối nhiều lớp trong cùng section.** Ví dụ: nền ngà, mảng xanh lệch sang một phía, cuộn tem trắng nổi tiền cảnh và chi tiết cam. Màu của ảnh/sản phẩm tham gia bố cục thay vì luôn đặt trong một ô nền đồng nhất.
3. **Nối màu qua ranh giới section.** Dải nhãn hoặc hình sản phẩm đi qua vùng xanh và vùng sáng; ranh giới được xử lý bằng hình học của M3. Giữ thứ tự nội dung và DOM đọc liên tục.
4. **Đa dạng nhịp thị giác.** Phối hợp vùng ảnh tràn khung, vùng editorial nền sáng, sân khấu sản phẩm nền sâu và mảng màu cục bộ. Không mặc định hai section liền nhau phải đổi màu toàn nền.
5. **Dùng ánh sáng theo vật liệu.** Chuyển sắc chỉ hỗ trợ hình khối, bóng và chất liệu; tránh gradient trang trí chung chung, neon hoặc glassmorphism.

### Phạm vi source dự kiến

- `src/app/globals.css` — token và quy tắc bề mặt, màu chữ, điểm nhấn.
- `src/components/media/VideoHero.tsx`, `src/components/contact/ContactCTA.tsx` — nhấn màu ở đầu/cuối hành trình.
- `src/sections/home/` — bố trí mảng màu cục bộ và chuyển tiếp.
- `src/app/layout.tsx` — giữ kích hoạt `data-accent="warm"`; chỉ chỉnh nếu có nhu cầu triển khai cụ thể.

### Đầu vào và giới hạn

Chưa cần bảng màu hoàn toàn mới. Nếu phát sinh nhu cầu thay màu nhận diện hoặc màu CTA đã duyệt, ghi rõ thay đổi trước khi áp dụng. Tương phản phải được kiểm trên tổ hợp thực, bao gồm ảnh/video và trạng thái hover/focus.

### Tiêu chí nghiệm thu

- [ ] Khi xem toàn trang, nhịp thị giác không còn phụ thuộc vào chuỗi section xanh–trắng luân phiên.
- [ ] Hero và khu sản phẩm có phối màu theo lớp; cam có vai trò dẫn mắt rõ, không bị rải tùy tiện.
- [ ] Bảy trang vẫn nhận ra cùng một thương hiệu; màu được quản lý bằng token chung.
- [ ] Chữ, CTA và focus đạt ngưỡng tương phản theo DESIGN.md; không dùng cam sáng làm chữ nhỏ trên nền trắng.
- [ ] Trạng thái tĩnh và mobile giữ được cấu trúc màu có chủ đích.

## Module M3 — Giảm khối vuông, tăng hình khối và chiều sâu

### Hiện trạng và mục tiêu

Nhiều ảnh, video và cảnh 3D bị bao trong khung chữ nhật. Cần thay đổi cấu trúc bố cục, tỷ lệ và sự chồng lớp; chỉ tăng border-radius không giải quyết được vấn đề.

### Hạng mục chỉnh sửa

1. **Sản phẩm thoát khung.** Cuộn tem/dải nhãn có thể vượt mép vùng màu và nối hai section. Loại bỏ cảm giác cảnh 3D là một banner chữ nhật độc lập. Giữ khoảng an toàn cho tiêu đề, CTA và caption.
2. **Hình học lấy từ sản phẩm.** Dùng cung tròn của cuộn tem, đường cong dải nhãn, mép bóc và các tờ giấy xếp lệch. Chọn một hệ hình học thống nhất, không thêm nhiều hình tròn hoặc đa giác rời rạc để trang trí.
3. **Gallery bất đối xứng.** Kết hợp một sản phẩm lớn với các mục nhỏ hơn, ảnh dọc với ảnh ngang và khoảng trống có chủ đích. Giữ nhóm sản phẩm và liên kết dễ tìm; không làm catalogue mất tính tra cứu.
4. **Tăng độ thuyết phục của vật thể.** Làm rõ độ dày, phối cảnh, ánh sáng và bóng tiếp xúc. CSS 3D phải có khối/lớp thực; ảnh tách nền chỉ là lớp hỗ trợ. Mô hình, artwork hoặc render bổ sung phải nguyên bản và có quyền sử dụng.
5. **Thiết kế lại mobile.** Đổi vị trí các lớp, giảm độ chồng và giữ vật thể chính đủ lớn. Không thu nhỏ nguyên bố cục desktop hoặc che tràn ngang bằng `overflow-x: hidden` toàn trang.

### Phạm vi source dự kiến

- `src/components/products/ProductDepthScene.tsx`, `src/components/products/ProductGallery.tsx`.
- `src/components/media/VideoHero.tsx`.
- `src/sections/home/BrandIntroduction.tsx`, `FeaturedProductCategories.tsx`, `WhySunflower.tsx`, `FeaturedProjects.tsx` trong `src/sections/home/`.
- `src/app/globals.css` — hình học, grid, lớp và breakpoint.

### Đầu vào và giới hạn

Ảnh thumbnail hiện có không phù hợp để phóng thành sản phẩm tiền cảnh lớn. Khi thiếu packshot đủ nét, dùng hình khối minh họa nguyên bản có nhãn hoặc giữ ảnh ở kích thước phù hợp. Không dựng máy móc giả, quy cách kỹ thuật giả hoặc dự án khách hàng giả.

### Tiêu chí nghiệm thu

- [ ] Trang chủ có ít nhất một bố cục sản phẩm nổi xuyên ranh giới section.
- [ ] Hero, gallery sản phẩm và khu mẫu thành phẩm có cách tổ chức khác nhau, giảm khung chữ nhật lặp lại.
- [ ] Vật thể có độ dày/phối cảnh/bóng nhất quán và vẫn thuyết phục khi tắt chuyển động.
- [ ] Không chồng lên nội dung thiết yếu, làm mất credit hoặc tạo liên kết khó bấm.
- [ ] Không tràn ngang, ảnh méo hoặc lớp trang trí cản touch/focus ở các viewport kiểm tra.

## Module M4 — Làm chữ có cá tính và sức biểu đạt

### Hiện trạng và mục tiêu

Hệ chữ hiện có phân cấp nhưng chủ yếu thay đổi cỡ chữ và màu. Cần thiết kế quan hệ giữa các dòng, nét chữ, khoảng trống và hình sản phẩm để tạo điểm nhấn rõ; nội dung vẫn cụ thể, dễ đọc và đúng tiếng Việt.

### Hạng mục chỉnh sửa

1. **Dàn lại tiêu đề Hero.** Rút gọn thông điệp, ngắt dòng có chủ đích và tạo tương phản giữa dòng chính/phụ. Có thể thử “Tem nhãn / Tạo dấu ấn.” như copy đề xuất; chưa coi đây là nội dung đã chốt. Phần mô tả tiếp tục giải thích rõ sản phẩm và dịch vụ.
2. **Chữ tham gia bố cục.** Căn lệch theo grid, cho một phần chữ trang trí nằm sau sản phẩm, hoặc đặt dòng nhấn theo hướng của dải nhãn. Nội dung thiết yếu không bị vật thể che; CTA giữ vị trí rõ ràng.
3. **Khai thác Inter trước khi đổi font.** Điều chỉnh weight, tracking, line-height và độ dài dòng có chủ đích. Không áp cùng một kiểu H2 cho toàn bộ Trang chủ. Chữ outline chỉ hỗ trợ trang trí, không mang thông điệp duy nhất.
4. **Chuyển động theo cụm nghĩa.** Mở chữ theo dòng/cụm từ, đồng bộ với sản phẩm và media của M1. Tránh hiệu ứng từng ký tự trên đoạn dài, chạy chữ khiến khó đọc hoặc cắt dấu tiếng Việt bởi mask.
5. **Thiết kế chữ theo vai trò section.** Hero thiên về ấn tượng; giới thiệu thiên về tuyên bố ngắn; gallery ưu tiên tên sản phẩm; quy trình dùng số và nhịp đọc; CTA cuối có câu dẫn mạnh, gọn. Body copy và form ưu tiên khả năng đọc.

### Phạm vi source dự kiến

- `src/components/editorial/SectionHeading.tsx` — biến thể có chủ đích, tránh ép mọi section cùng một bố cục.
- `src/components/media/VideoHero.tsx`, `src/components/contact/ContactCTA.tsx`.
- `src/content/hero.ts`, `src/content/home.ts` — copy hiển thị sau khi chọn phương án; cập nhật copy chính tại CONTENT.md.
- `src/app/globals.css` — token chữ và quy tắc responsive; giữ H1/H2/H3 đúng ngữ nghĩa.

### Đầu vào và giới hạn

Không cần thêm nhiều font để tạo khác biệt. Copy mới không được chứa cam kết hoặc số liệu chưa xác nhận. Bản chữ trang trí lặp lại cần loại khỏi accessibility tree; mỗi route vẫn có một H1, thứ tự đọc và tên liên kết rõ ràng.

### Tiêu chí nghiệm thu

- [ ] Hero có bố cục chữ nhận diện được ngay, khác rõ bản hiện tại ngay cả khi xem ảnh tĩnh.
- [ ] Các section có nhịp chữ khác nhau nhưng dùng chung hệ thống căn lề và token.
- [ ] Không cắt dấu, đè chữ, mất nghĩa hoặc dùng chữ outline khó đọc làm nội dung chính.
- [ ] Mobile có ngắt dòng riêng; kiểm tra tăng cỡ chữ và text spacing không làm mất nội dung/CTA.
- [ ] Reduced-motion/no-JS giữ toàn bộ thông điệp; screen reader không đọc lặp các lớp chữ trang trí.

## Thứ tự triển khai và kiểm tra chung

1. **Làm một lát cắt đại diện:** Hero → chuyển tiếp sang BrandIntroduction. Phối hợp M2/M3/M4 để chốt bố cục tĩnh, sau đó thêm M1. Đây là một phương án trên source chính, không tạo website/demo song song.
2. **Đối chiếu desktop/mobile tại mốc Hero.** Chốt chất lượng màn hình đầu và ngôn ngữ section đại diện theo workflow của AGENTS.md trước khi áp dụng rộng. Không xin duyệt lại bảy trang hoặc từng hiệu ứng trong hướng đã được cho phép.
3. **Hoàn thiện sản phẩm và mẫu thành phẩm:** nâng cảnh tem, gallery và kính lúp; bổ sung/đối chiếu media cần thiết. Nếu thiếu ảnh cận đủ nét, ghi rõ mục chưa thể nghiệm thu thay vì giả chi tiết.
4. **Mở rộng ra phần còn lại và trang con:** giữ chức năng tra cứu, filter, CTA và trạng thái form hiện có; mức độ biểu đạt phù hợp từng trang.
5. **QA và cập nhật trạng thái thực:** chỉ đánh dấu checklist khi đã triển khai và kiểm chứng. Lint, TypeScript và build đạt không tự chứng minh chất lượng thiết kế.

Kiểm tra responsive tại 390×844, 768×1024, 1024×768, 1440×900 và 1920×1080. Rà Hero qua nhiều frame video, thao tác chuột/touch/bàn phím, giảm chuyển động, no-JS, focus, overflow, độ nét ảnh, tài nguyên và khả năng đọc khi chuyển động dừng. Đo lại hiệu năng sau khi thêm media/effect; không tái dùng kết quả QA cũ để xác nhận bản mới.

Lệnh kiểm tra khi có thay đổi source, chạy từ `sunflower-website/`:

```text
npm run lint
npx tsc --noEmit
npm run build
```

## Tham chiếu và đầu vào còn thiếu

- [Bản demo hiện tại](https://sunflower-print-demo-tien.quangtienpham4705.chatgpt.site/): cơ sở nhận diện bốn vấn đề; không thay thế source chính.
- [Sonoco](https://www.sonoco.com/na): bố cục editorial và tính chuyên nghiệp theo định hướng đã duyệt.
- [Packwire](https://packwire.com/): sản phẩm lớn tham gia bố cục Hero.
- [BFS Studio](https://studio.bfs.asia/vi/): vùng khám phá hình ảnh theo vị trí chuột.
- [MWDT](https://mwdtinc.com/): vật thể nổi, chuyển động và chuyển tiếp qua ranh giới section.

Đầu vào cần nâng chất lượng: footage HD được cấp phép; packshot đủ độ phân giải; ảnh macro chất liệu/đường bế; artwork hoặc mô hình nguyên bản nếu cảnh cần thêm tài nguyên. Đối chiếu nguồn và quyền dùng tại [MEDIA_BRIEF.md](MEDIA_BRIEF.md). Có thể bắt đầu thiết kế bố cục với bộ hiện có, nhưng không coi media preview hoặc minh họa là bằng chứng doanh nghiệp đã xác thực.
