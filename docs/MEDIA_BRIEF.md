# Sunflower — G0: Danh sách ảnh và video cần chuẩn bị

Ngày lập: 14/10/2026. Trạng thái: đã nhận và tích hợp video Hero minh họa người dùng chọn; đã nhận 9 ảnh catalogue, 5 ảnh Unsplash minh họa doanh nghiệp/ngành in và 1 ảnh văn phòng, đưa vào source G0. Người dùng chỉ định tiếp tục bằng bộ hiện có, bổ sung/chỉnh sửa ảnh sau; không chờ đủ bộ 35 ảnh để làm bản xem. Logo và ảnh xác thực cơ sở/nhân sự Sunflower vẫn đang chờ. Tài liệu này chi tiết hóa các vị trí ảnh trong [STRUCTURE.md](STRUCTURE.md) theo art direction của [DESIGN.md](DESIGN.md), không bổ sung trang/section.

### Đầu vào chiều sâu/3D theo hướng mới — CSS scene đã triển khai, chưa có asset 3D ngoài

Yêu cầu hiện đại/mạnh mẽ với animation và khối 3D được chốt ở [DESIGN.md mục 8](DESIGN.md#8-motion--interaction-system); MWDT là tham chiếu phụ về sản phẩm vượt ranh giới section. Những tài nguyên sau phục vụ lượt G2.Motion, không tăng số route hoặc mặc định tăng bộ ảnh G0:

- **Scene 3D tự tạo:** cuộn tem, khối hộp hoặc các lớp giấy có chiều dày, perspective và artwork nguyên bản. Có thể dựng bằng CSS/layered geometry trong source, không đòi thêm repo, ảnh hay model mới để bắt đầu. Đây là minh họa hình khối sản phẩm, không chứng minh quy cách/năng lực thực tế.
- **Packshot hỗ trợ 2.5D:** khi có ảnh đủ lớn/tách nền được phép dùng, tái sử dụng một đường dẫn cho các layer; giữ hình dáng/nhãn gốc, không phóng lớn ảnh 218px làm điểm nhấn. Đánh giá từng ảnh hiện có trước khi yêu cầu bổ sung. Tách nền/biến thể là công việc asset riêng chưa thực hiện ở lượt docs này.
- **Nếu cần model WebGL về sau:** xác nhận model nguồn, quyền sử dụng, artwork, kích thước/phần nào là minh họa, bản tối ưu và poster tĩnh. Không tự coi ảnh packshot là model 3D hoặc tuyên bố asset đã tồn tại. Không lấy model/render từ MWDT hay Sonoco.
- **Fallback và nguồn:** mỗi scene phải có trạng thái tĩnh khi giảm chuyển động/touch/asset lỗi. Model/texture nếu được bổ sung phải ghi nguồn/quyền và dùng chung, không sao chép theo từng trang. Minh họa 3D không thay ảnh bằng chứng nhà xưởng hoặc dự án thật.

Source chưa có model hoặc packshot tách nền mới. G2.Motion đã triển khai scene cuộn tem/lớp giấy/dải nhãn bằng CSS geometry, có caption minh họa và không cần thêm asset. Packshot hoặc model thật vẫn là lựa chọn tương lai khi có quyền sử dụng và nhu cầu cụ thể.

### G6 — tái sử dụng bộ ảnh hiện có

Không thêm hoặc nhân bản media. CapabilitiesFeature dùng `printing-press` qua CompanyPhoto, giữ caption minh họa và credit trên ảnh. SolutionsByIndustry dùng ảnh đã ánh xạ cho ba nhu cầu nhận diện sản phẩm, may mặc và bao bì. FeaturedProjects dùng `bang-dinh`, `tem-trang-to`, `tem-det` qua ProductImage với contain/giới hạn kích thước nguồn. Bộ ba này được gọi là mẫu catalogue minh họa, không phải dự án khách hàng; không đưa ảnh 218px vào gallery lớn. Những giới hạn nguồn/quyền công khai hiện có vẫn áp dụng khi dùng lại trên Trang chủ.

### Tài nguyên Hero đã nhận

- Nguồn: `istockphoto-1139033230-640_adpp_is.mp4`, do người dùng cung cấp và yêu cầu sử dụng làm Hero.
- Thông số kiểm tra: H.264, 768×432 (16:9), khoảng 23,98 fps, 21,81 giây, file nguồn 2.928.289 byte; không có audio stream.
- Nội dung: công đoạn máy in, có watermark iStock. Đây là footage minh họa; không xác nhận đó là cơ sở hay thiết bị Sunflower.
- Video dùng trên website: `public/videos/hero/hero-desktop.mp4`, giữ nguyên độ phân giải/nội dung, remux faststart để tải thuận tiện, không xóa watermark.
- Poster: `public/images/hero/hero-poster.webp`, trích từ 0,2 giây của cùng video; desktop/mobile hiện dùng cùng tài nguyên.
- Trạng thái quyền sử dụng: đã có chỉ định sử dụng từ người dùng; chưa có bằng chứng giấy phép iStock cho bản công khai. Cần bản HD được cấp phép, không watermark trước khi phát hành công khai. Bản hiện tại dùng để xem giao diện với quyền truy cập riêng tư hiện có.

### Ảnh sản phẩm đã nhận — 14/10/2026

Nguồn: 9 ảnh PNG người dùng đính kèm trong cuộc trò chuyện và yêu cầu đưa vào phần sản phẩm. Đã lưu mỗi ảnh một lần tại `public/images/products/`, giữ nguyên byte, kích thước, màu sắc và chữ/logo trong ảnh. File nguồn đính kèm không bị di chuyển hoặc xóa. Bảng ánh xạ dùng trong source: [product-media.ts](../src/content/product-media.ts), gồm slug, đường dẫn, kích thước và alt; chưa render catalogue trên giao diện ở giai đoạn G0.

| Ảnh đính kèm | ID | Nhóm được ánh xạ | File thực tế | Kích thước nguồn |
|---|---|---|---|---|
| 1 | P04 | Tem trắng tờ — nhãn chưa in nội dung, thấy đường bế | [tem-trang-to.png](../public/images/products/tem-trang-to.png) | 550×413 |
| 2 | P01 | Tem trắng cuộn | [tem-trang-cuon.png](../public/images/products/tem-trang-cuon.png) | 550×413 |
| 3 | P02 | Tem màu cuộn | [tem-mau-cuon.png](../public/images/products/tem-mau-cuon.png) | 635×322 |
| 4 | P05 | Mực in — ribbon chuyển nhiệt | [muc-in.png](../public/images/products/muc-in.png) | 1200×900 |
| 5 | P06 | Máy in tem nhãn | [may-in.png](../public/images/products/may-in.png) | 400×400 |
| 6 | P09 | Thẻ bài — có lỗ treo | [the-bai.png](../public/images/products/the-bai.png) | 218×218 |
| 7 | P03 | Tem màu tờ — các mẫu nhãn phẳng in màu | [tem-mau-to.png](../public/images/products/tem-mau-to.png) | 218×218 |
| 8 | P10 | Tem dệt | [tem-det.png](../public/images/products/tem-det.png) | 1086×815 |
| 9 | P13 | Băng dính in dùng đóng gói | [bang-dinh.png](../public/images/products/bang-dinh.png) | 1980×1080 |

- Trạng thái: **đã nhận, đã phân loại và lưu source; minh họa catalogue**. Người dùng chỉ định sử dụng cho phần sản phẩm. Chưa có thông tin nguồn gốc/giấy phép của từng ảnh cho bản công khai; không xem việc gửi ảnh là bằng chứng Sunflower sản xuất các mẫu trong ảnh.
- Một số ảnh có tên/nhãn hiệu bên thứ ba như Avery, Zebra, TSC, Mizuno, YARDSALE.NZ và GUZMAN. Giữ nguyên ảnh; không dùng chúng làm logo khách hàng, dự án Sunflower hoặc bằng chứng quan hệ phân phối chính thức. Model/quy cách chưa được xác nhận từ ảnh.
- Ảnh 6 và 7 chỉ 218×218 px: dùng minh họa nhỏ khi xem bố cục, cần nguồn lớn hơn cho catalogue với ảnh lớn. Ảnh 5 là 400×400 px; ảnh 1–3 cũng cần đánh giá theo kích thước hiển thị và mật độ điểm ảnh. Không upscale để giả độ nét hoặc dùng các ảnh này làm full-bleed Hero.
- Khi dựng UI, ưu tiên `object-contain`, giữ tỷ lệ gốc và đầy đủ hình dạng sản phẩm. Ảnh 1 được xếp vào nhãn tờ chưa in nội dung; màu giấy/đế không được diễn giải thành quy cách vật liệu đã xác nhận. Ảnh 7 là mẫu nhãn phẳng, không xác nhận nguyên tờ sản xuất. Ảnh 9 đại diện băng dính, không thay thế ảnh riêng của nhóm Hộp.
- Tổng PNG khoảng 5,75 MB; chưa xuất định dạng web/biến thể responsive ở lượt nhập nguồn này. Do static export đang dùng `images.unoptimized`, cần tối ưu encoding và chọn kích thước thực khi triển khai gallery; tránh tải toàn bộ bộ nguồn cho các thumbnail.
- Đã có **9/13 ảnh đại diện nhóm sản phẩm**. Còn thiếu **Máy quét, Hộp, Tem vải nilon, Satin**; bổ sung sau theo chỉ định người dùng. Mục tiêu 35 ảnh nội dung bên dưới vẫn là kế hoạch phiên bản đầy đủ; video/poster được tính riêng.

### Bộ ảnh minh họa doanh nghiệp đã nhận — 14/10/2026

Nguồn: 5 JPG người dùng cung cấp từ thư mục OneDrive và yêu cầu dùng cho doanh nghiệp. Tên nguồn mang tên tác giả và ID ảnh Unsplash; lưu các thông tin này trong [company-media.ts](../src/content/company-media.ts). Mỗi ảnh có đường dẫn, kích thước gốc, alt, loại `stock-illustration`, caption “Ảnh minh họa ngành in” và credit. Đã sao chép nguyên byte vào `public/images/company/`; bản gốc OneDrive giữ nguyên. Chưa render các section sử dụng ảnh.

| Ảnh | Tác giả / ID theo tên file nguồn | File đã lưu | Kích thước gốc | Vị trí minh họa dự kiến |
|---|---|---|---|---|
| 1 | Aleksandr Galichkin / QRykXu51r_0 | [printing-workshop-unsplash.jpg](../public/images/company/printing-workshop-unsplash.jpg) | 3168×4752 | Giới thiệu → OurStory: ảnh dọc kể bối cảnh ngành in |
| 2 | Bank Phrom / Tzm3Oyu_6sk | [printing-press-unsplash.jpg](../public/images/company/printing-press-unsplash.jpg) | 6016×4016 | Trang chủ → BrandIntroduction; Giới thiệu → InteriorPageHero |
| 3 | Daulet Turubayev / RAwn1QFwfss | [press-operators-unsplash.jpg](../public/images/company/press-operators-unsplash.jpg) | 6000×4000 | Năng lực → CollaborationAndDelivery: minh họa phối hợp/vận hành |
| 4 | Geri Sakti / CYrYxz-uvE4 | [large-format-printing-unsplash.jpg](../public/images/company/large-format-printing-unsplash.jpg) | 5184×3456 | Minh họa công đoạn in trong ProductionProcess, khi nội dung tương ứng phù hợp |
| 5 | Pierre Bamin / X16N5J0uRD4 | [print-color-samples-unsplash.jpg](../public/images/company/print-color-samples-unsplash.jpg) | 5472×3648 | Giới thiệu → CompanyOverview; minh họa trao đổi mẫu/màu trong ProductionProcess |

- Bộ này là **ảnh stock minh họa**, không phải ảnh xác thực xưởng, thiết bị, nhân viên hoặc mẫu thành phẩm của Sunflower. Caption minh họa phải hiện khi dựng section; credit ghi tác giả/Unsplash. Không đặt ảnh 3 dưới tiêu đề “Đội ngũ Sunflower”, không dùng ảnh 4 để tự công bố năng lực in khổ lớn.
- Trạng thái nguồn/quyền: người dùng chỉ định sử dụng; tác giả/ID được ghi từ tên file. Chưa đối chiếu trang nguồn và điều kiện sử dụng từng ảnh trong lượt nhập này. Không tự ghi “ảnh do Sunflower chụp” hoặc “đã xác minh giấy phép”.
- Tất cả nằm một lần trong `company/` vì thuộc bộ minh họa doanh nghiệp. Nếu dùng tại trang Năng lực/Trang chủ, tham chiếu cùng đường dẫn; không sao chép sang `capabilities/` hoặc tạo ảnh `home-*`.
- Ảnh 1 tỷ lệ dọc 2:3, hợp panel dọc; không ép thành Hero ngang. Ảnh 2–5 gần 3:2, hợp editorial split. Khi crop ảnh 3 giữ người và bảng điều khiển; ảnh 4 giữ cụm máy/vật liệu, ảnh 5 giữ các dải màu bên trái. Điểm crop cuối cần kiểm tra trên layout desktop/mobile.
- Tổng nguồn JPG khoảng **15,48 MB**. Giữ bản gốc trong lượt nhập này; trước khi render cần xuất kích thước/encoding web phù hợp vì `images.unoptimized` không tự tối ưu. Không tải nguồn 5–6K cho một ô ảnh nhỏ.
- Hiện có **15 ảnh nội dung đã nhận** (9 catalogue + 5 minh họa + 1 văn phòng), cùng video/poster. Năm ảnh stock không được tính là hoàn thành các vị trí ảnh thực tế C01–C04/K01–K06 trong mục tiêu 35 ảnh; ảnh doanh nghiệp/năng lực làm bằng chứng vẫn cần nguồn Sunflower.

### Ảnh văn phòng đã nhận — T01, 14/10/2026

- Nguồn: người dùng đính kèm `codex-clipboard-e84f3c31-4790-4d16-b35d-bfcb0e7740fd.png`, mô tả là ảnh văn phòng và chỉ định tận dụng bộ ảnh hiện có trước.
- File duy nhất: [office-interior.png](../public/images/contact/office-interior.png); giữ nguyên PNG **638×480**, 390.521 byte. Bản đính kèm gốc được giữ nguyên, không crop/upscale hoặc tạo bản sao ở `company/`.
- Ánh xạ: [contact-media.ts](../src/content/contact-media.ts) → `officeMedia`, với đường dẫn, kích thước, alt và nguồn. G4 đã dùng tại Giới thiệu; G5.1 dùng lại cạnh thông tin Liên hệ, caption “Không gian văn phòng”. Giữ cùng một file/registry; không suy ra địa chỉ, diện tích hoặc cơ sở pháp lý từ ảnh.
- Nội dung: bàn làm việc, ghế, vách ngăn xanh và cây xanh trong không gian văn phòng. Caption trung tính “Không gian văn phòng”; chưa có địa chỉ hoặc thông tin nguồn chụp để liên kết ảnh với một địa điểm Sunflower cụ thể. Không suy ra địa chỉ, diện tích hay đội ngũ từ ảnh.
- Ảnh vừa đủ minh họa nhỏ; tránh Hero full-bleed hoặc kéo giãn trên desktop. Khi dựng section, chọn kích thước hiển thị theo nguồn; người dùng sẽ bổ sung bản tốt hơn sau.

### Chốt bộ đầu vào tạm để tiếp tục thiết kế

Theo chỉ định mới nhất, tiếp tục các module bằng **15 ảnh + video/poster đang có**. Các ảnh thiếu là phần bổ sung sau, không phải yêu cầu người dùng tìm đủ mới bắt đầu.

- Catalogue vẫn giữ đủ 13 nhóm đã xác nhận; 4 nhóm chưa có ảnh có thể dùng phần nội dung chữ rõ ràng, không mượn ảnh sai loại hoặc tạo ảnh giả. Gallery nổi bật chọn trong các nhóm có ảnh đủ phù hợp.
- Giới thiệu và nội dung giải thích ngành in dùng lại ảnh doanh nghiệp/stock với caption đúng nguồn. Năng lực sử dụng workflow đã xác nhận và ảnh minh họa phù hợp; ảnh stock không trở thành chứng cứ sở hữu máy móc.
- Giải pháp có thể dùng ảnh sản phẩm tương ứng để giải thích, ghi rõ là minh họa sản phẩm; chưa gọi đó là ảnh ứng dụng thực tế tại khách hàng.
- Trang Dự án vẫn giữ route; khi chưa có bộ thành phẩm/dữ liệu dự án, không dựng case study hoặc khách hàng giả. Nếu dùng ảnh catalogue để xem layout, ghi rõ “Hình ảnh sản phẩm minh họa”.
- Giữ logo dạng chữ hiện tại và dữ liệu liên hệ minh họa có nhãn theo CONTENT.md. Bản xem vẫn giữ quyền riêng tư/noindex; việc tiếp tục thiết kế không đồng nghĩa hoàn thành điều kiện phát hành.

## 1. Số lượng đề xuất

| Nhóm | Số ảnh nội dung | Nơi dùng chính | Dùng lại trên Trang chủ |
|---|---:|---|---|
| Doanh nghiệp | 4 | Giới thiệu | BrandIntroduction |
| Sản phẩm | 13 nhóm đã xác nhận | Sản phẩm | FeaturedProductCategories: chọn 4–6 ảnh |
| Giải pháp/ứng dụng | 5 dự kiến | Giải pháp | SolutionsByIndustry: chọn 3 ảnh |
| Năng lực/sản xuất | 6 | Năng lực | WhySunflower, CapabilitiesFeature, ProcessPreview |
| Dự án/mẫu thành phẩm | 6 | Dự án | FeaturedProjects: chọn 3 ảnh |
| Liên hệ | 1, có thể bỏ nếu chưa có ảnh phù hợp | Liên hệ | Không cần thêm ảnh cho CTA/Footer |
| **Tổng** | **35** | **Ảnh khác nhau, dùng lại giữa các trang** | **Không cần chụp thêm một bộ riêng cho Trang chủ** |

Ngoài 35 ảnh: 1 video Hero desktop, 1 poster trích từ video và logo chính thức. Như vậy dự kiến có 36 hình raster tính cả poster; logo không tính vào số ảnh chụp. Bản mobile của video/poster có thể crop từ cùng nguồn nếu bố cục cho phép; đó là biến thể phục vụ responsive, không phải ảnh nội dung mới.

Đây là mục tiêu chuẩn bị của phiên bản đầy đủ, không phải yêu cầu chụp đủ trước khi bắt đầu. Chủ doanh nghiệp đã xác nhận đủ 13 nhóm sản phẩm; quy cách/model và ảnh thực tế vẫn cần bổ sung. Năm nhóm ứng dụng cần đối chiếu nội dung và ảnh trước khi công bố. Số ảnh cuối có thể giảm nếu ảnh dùng chung hợp lý hoặc ảnh liên hệ không cần thiết; không dùng ảnh giả để đủ số lượng.

## 2. Bộ ưu tiên để bắt đầu G1–G2

| Ưu tiên | Tài nguyên | Số lượng | Mục đích |
|---|---|---:|---|
| P0 / G1 | Logo chính thức | 1 bộ nhận diện; phiên bản sáng/tối nếu đã có | Header, menu mobile, Footer |
| P0 / G1 | Video sản xuất/sản phẩm thật | 1 video dựng cuối | Cinematic Hero Trang chủ |
| P0 / G1 | Poster lấy từ video | 1 hình | Hero trước khi tải video, khi tắt chuyển động hoặc video không phát |
| P1 / G2 | C01: ảnh doanh nghiệp/tổng quan | 1 ảnh | Giới thiệu ngắn |
| P1 / G2 | 5 nhóm sản phẩm ưu tiên | 5 ảnh | Gallery sản phẩm nổi bật |
| P1 / G2 | K02–K05: in, gia công, phối hợp/duyệt mẫu, QC | 4 ảnh | Section navy và minh chứng cách làm việc |

**Bộ khởi động: 10 ảnh nội dung + 1 poster + 1 video + logo.** Mười ảnh là một phần của bộ 35, không cộng thêm. Đề xuất năm nhóm sản phẩm để chọn ban đầu: tem trắng cuộn, tem màu cuộn, tem màu tờ, hộp, thẻ bài. Cả 13 nhóm đã được xác nhận kinh doanh; việc chọn nhóm nổi bật có thể điều chỉnh theo ảnh và ưu tiên giới thiệu của Sunflower.

Nếu chưa có hình một công đoạn, chọn một năng lực khác có thật và có ảnh tương ứng. Màn hình đầu G1 chỉ cần logo/video/poster; bộ 10 ảnh giúp tiếp tục các section G2 ngay sau đó.

## 3. Hero và logo

### H01 — Video Hero

- Vị trí: đầu Trang chủ, phía sau/bên cạnh headline và CTA theo bố cục đã duyệt.
- Nội dung: tem nhãn và quy trình/sản phẩm Sunflower thật; hình rõ về chất liệu, độ chính xác và thành phẩm.
- Đề xuất quay 5–6 đoạn nguồn: góc rộng công đoạn in; cận cuộn nhãn; chi tiết in; bế/cắt/gia công; kiểm tra thành phẩm; sản phẩm hoàn thiện. Chỉ quay công đoạn doanh nghiệp thực sự có.
- Mỗi đoạn nguồn quay ổn định khoảng 6–10 giây để có chỗ dựng. Chọn những đoạn tốt nhất thành một loop khoảng 12–18 giây; không bắt buộc dùng hết mọi cảnh.
- Desktop: ngang 16:9, tối thiểu nguồn Full HD 1920×1080 nếu có; MP4/H.264 tương thích rộng, bản dùng trên web không có tiếng.
- Chủ thể và vùng đặt chữ cần được kiểm tra khi crop. Mobile ưu tiên bản dựng/crop riêng, có thể dùng 9:16 nếu nguồn phù hợp; không kéo giãn video ngang.
- Có thể nhận clip nguồn trước rồi dựng loop sau. Không cần một video quảng cáo dài hoặc thêm video cho từng trang con.

### H02 — Poster Hero

- Một frame đẹp lấy từ H01: nét, chủ thể rõ, hợp với khung hình mở đầu và đủ tương phản khi có overlay chữ.
- Dùng khi đang tải, video lỗi, reduced motion hoặc mạng hạn chế. Không cần chụp thêm một cảnh độc lập.
- Bản desktop ngang 16:9; kiểm tra lại crop mobile.

### B01 — Logo

- Cần bản logo Sunflower được doanh nghiệp duyệt, ưu tiên vector SVG/AI/EPS/PDF hoặc PNG nền trong độ phân giải tốt.
- Nếu đã có phiên bản đặt trên nền sáng và nền navy, cung cấp cùng bộ. Không tự đổi màu hoặc vẽ lại logo để giống Sonoco.

## 4. Danh sách chụp theo vị trí

Tên file dưới đây là tên đề xuất cho bản tối ưu dùng trên web; bảng “Ảnh sản phẩm đã nhận” phía trên ghi file PNG thực tế hiện có. Chưa tạo các file ảnh rỗng hoặc mock trong source.

### A. Doanh nghiệp — 4 ảnh

Ảnh ngang 3:2, ánh sáng tự nhiên, nội dung thật. Không bắt buộc chụp nhân sự nếu chưa có sự đồng ý.

| ID | Nội dung cần chụp | Vị trí sử dụng | Tên file đề xuất |
|---|---|---|---|
| C01 | Tổng quan không gian làm việc/doanh nghiệp, gọn và thể hiện đúng hoạt động | Hero Giới thiệu; BrandIntroduction Trang chủ | company-overview.webp |
| C02 | Trao đổi yêu cầu hoặc duyệt mẫu với bàn mẫu sản phẩm | CompanyOverview/cách tiếp cận công việc | requirements-discussion.webp |
| C03 | Không gian, vật liệu hoặc công việc kể được câu chuyện doanh nghiệp | OurStory, editorial split | company-story.webp |
| C04 | Đội ngũ đang làm việc/phối hợp, hoặc không gian làm việc thực tế | PeopleAndCulture | team-workflow.webp |

C01 và C03 ưu tiên góc rộng có thể đặt trong layout split. C02/C04 tránh hiển thị tài liệu hoặc màn hình có dữ liệu khách hàng.

### B. Sản phẩm — 13 ảnh cho các nhóm đã xác nhận

Mỗi nhóm một ảnh đại diện, chụp bộ sản phẩm có chủ đích trên nền trắng/trắng ngà sạch. Giữ ánh sáng, góc chụp và tỷ lệ đồng nhất; để đủ mép quanh sản phẩm. Chụp nguồn 1:1 hoặc đủ rộng để crop 4:5; chất liệu và mép in phải thấy rõ.

| ID | Nhóm sản phẩm | Cách thể hiện đề xuất | Tên file đề xuất |
|---|---|---|---|
| P01 | Tem trắng cuộn | Cuộn nhãn và dải nhãn mở để thấy bề mặt, kích thước tương đối | tem-trang-cuon.webp |
| P02 | Tem màu cuộn | Cuộn nhãn đã in với một đoạn mở, rõ màu và chất lượng in | tem-mau-cuon.webp |
| P03 | Tem màu tờ | Một vài tờ nhãn, góc nghiêng nhẹ để thấy layout và thành phẩm | tem-mau-to.webp |
| P04 | Tem trắng tờ | Tờ nhãn trắng, ánh sáng đủ để thấy đường bế và bề mặt | tem-trang-to.webp |
| P05 | Mực in | Sản phẩm mực/ribbon thực tế đang cung cấp; xác nhận loại trước khi chụp | muc-in.webp |
| P06 | Máy in | Model thực tế đang cung cấp, góc 3/4, nhãn/đường giấy rõ | may-in.webp |
| P07 | Máy quét | Model thực tế đang cung cấp, góc chụp thấy hình dạng và mặt quét | may-quet.webp |
| P08 | Hộp | Một hộp dựng hoàn chỉnh và một chi tiết/góc mở để thể hiện cấu trúc | hop.webp |
| P09 | Thẻ bài | Bộ thẻ bài sắp lớp, thấy cạnh, dây treo và bề mặt in | the-bai.webp |
| P10 | Tem dệt | Một vài mẫu dệt, thấy sợi và độ sắc của chữ/họa tiết | tem-det.webp |
| P11 | Tem vải nilon | Dải/mẫu nhãn phù hợp, thấy chữ và độ mềm của vật liệu | tem-vai-nilon.webp |
| P12 | Satin | Cuộn/dải satin và mẫu in nếu có, thể hiện bề mặt và ánh vật liệu | satin.webp |
| P13 | Băng dính | Cuộn và đoạn mở, thấy chiều rộng và mặt vật liệu | bang-dinh.webp |

Vị trí: Catalogue trang Sản phẩm; chọn 4–6 ảnh dùng lại ở FeaturedProductCategories Trang chủ. Hero trang Sản phẩm có thể dùng composition từ cùng bộ ảnh, không cần chụp thêm ảnh Hero riêng. Máy in/máy quét ở catalogue là sản phẩm đang cung cấp, không tự coi đó là thiết bị sản xuất của Sunflower.

### C. Giải pháp/ứng dụng — dự kiến 5 ảnh

Khác với packshot, ảnh cần cho thấy tem nhãn/bao bì đang được dùng trong một ngữ cảnh thật và phù hợp với sản phẩm đã xác nhận. Ưu tiên ngang 4:3 hoặc góc rộng có thể crop 16:9 cho Hero trang Giải pháp.

| ID | Ngữ cảnh cần xác nhận | Nội dung cần thấy | Vị trí sử dụng | Tên file đề xuất |
|---|---|---|---|---|
| S01 | Bán lẻ/nhận diện hàng hóa | Tem/nhãn trên sản phẩm hoặc kệ, rõ cách dùng | Use case bán lẻ | retail-labeling.webp |
| S02 | Kho vận/mã vạch | Nhãn trên kiện hàng/hàng hóa trong ngữ cảnh quản lý kho | Use case kho vận | warehouse-labeling.webp |
| S03 | Sản xuất/truy xuất | Nhãn nhận diện linh kiện hoặc sản phẩm trong quy trình phù hợp | Use case công nghiệp | production-identification.webp |
| S04 | May mặc | Thẻ bài, nhãn dệt/vải/satin trên sản phẩm may mặc | Use case may mặc | garment-labeling.webp |
| S05 | Bao bì thương hiệu | Hộp/bao bì hoàn thiện có nhãn/in thực tế | Use case bao bì | branded-packaging.webp |

Chọn một ảnh tốt nhất làm Hero Giải pháp và ba ảnh dùng lại ở SolutionsByIndustry Trang chủ. Không cần chụp đủ năm ngành nếu doanh nghiệp chỉ xác nhận một phần; điều chỉnh số lượng theo phạm vi thật.

### D. Năng lực/sản xuất — 6 ảnh

Đây là ảnh chứng minh công việc thực tế. Ưu tiên ngang 3:2, giữ khung đủ rộng để dùng editorial split hoặc crop trong section navy. Nội dung cần khớp mô tả quy trình và năng lực được duyệt.

| ID | Nội dung cần chụp | Vị trí sử dụng | Tên file đề xuất |
|---|---|---|---|
| K01 | Tổng quan khu vực sản xuất thực tế | Hero Năng lực; ManufacturingGallery | production-overview.webp |
| K02 | Công đoạn in/thiết bị thực tế đang hoạt động | EquipmentAndTechnology; CapabilitiesFeature Trang chủ | printing-process.webp |
| K03 | Bế/cắt/gia công hoàn thiện thực tế | Công đoạn gia công; WhySunflower | finishing-process.webp |
| K04 | Thao tác duyệt mẫu, chuẩn bị hoặc vận hành theo quy trình thật | ProductionProcess; WhySunflower | production-workflow.webp |
| K05 | Kiểm tra màu, đường bế, bề mặt hoặc quy cách thành phẩm | QualityControl; WhySunflower | quality-check.webp |
| K06 | Thành phẩm được đóng gói, sẵn sàng bàn giao | CollaborationAndDelivery; phần cuối quy trình | packed-output.webp |

K02–K05 là bộ ưu tiên ban đầu. CapabilitiesFeature dùng lại một ảnh ngang mạnh nhất. ProcessPreview có thể chỉ dùng số bước và chữ đã xác nhận; không cần chụp một ảnh riêng cho mỗi bước.

### E. Dự án/mẫu thành phẩm — 6 ảnh

Đề xuất chọn ba bộ thành phẩm được phép công bố, mỗi bộ hai góc: một ảnh tổng thể và một ảnh cận chi tiết. Đây là sáu ảnh, không bắt buộc có sáu dự án khách hàng khác nhau.

| ID | Nội dung cần chụp | Vị trí sử dụng | Tên file đề xuất |
|---|---|---|---|
| R01 | Bộ A: tổng thể thành phẩm | FeaturedProjects Trang chủ; ProjectGallery | sample-a-overview.webp |
| R02 | Bộ A: chi tiết chất liệu/độ nét/gia công | Gallery và nội dung giải thích bộ A | sample-a-detail.webp |
| R03 | Bộ B: tổng thể thành phẩm | FeaturedProjects Trang chủ; ProjectGallery | sample-b-overview.webp |
| R04 | Bộ B: chi tiết đặc trưng | Gallery và nội dung giải thích bộ B | sample-b-detail.webp |
| R05 | Bộ C: tổng thể thành phẩm | FeaturedProjects Trang chủ; ProjectGallery | sample-c-overview.webp |
| R06 | Bộ C: chi tiết đặc trưng | Gallery và nội dung giải thích bộ C | sample-c-detail.webp |

Nguồn ảnh ưu tiên ngang 4:3, giữ khoảng dư để crop gallery trên desktop/mobile. Bộ A/B/C là mã quản lý ảnh, không phải tên dự án công bố. Sau khi chọn mẫu, đổi tên file theo loại thành phẩm thực tế. Ảnh catalogue tập trung nhóm sản phẩm; ảnh phần này thể hiện chất lượng một bộ thành phẩm cụ thể, tránh dùng cùng một packshot để tạo cảm giác có thêm dự án.

Tên khách hàng, logo, thiết kế và sản phẩm trong ảnh phải được phép công bố. Nếu chỉ có mẫu nội bộ, giới thiệu là “Mẫu thành phẩm”.

### F. Liên hệ — 1 ảnh tùy chọn

| ID | Nội dung cần chụp | Vị trí sử dụng | Tên file đề xuất |
|---|---|---|---|
| T01 | Khu vực tiếp khách/văn phòng/showroom hoặc mặt tiền đúng địa điểm liên hệ | Trang Liên hệ, cạnh thông tin hoặc lời mời tư vấn | contact-location.webp |

Ảnh ngang 3:2. Nếu chưa có ảnh đủ chất lượng, trang Liên hệ dùng typography và thông tin thật; không cần một ảnh stock để lấp chỗ. Khi bỏ T01, bộ nội dung còn 34 ảnh.

## 5. Quy tắc chụp và chọn ảnh

- Ảnh lớn/editorial: ưu tiên bản gốc cạnh dài khoảng 2400–3200 px trở lên khi có; chất lượng ánh sáng và độ nét quan trọng hơn chỉ tăng kích thước.
- Packshot: nguồn khoảng 2000×2000 px hoặc lớn hơn, giữ sản phẩm đủ lớn nhưng còn khoảng dư để crop. Không upscale ảnh nhỏ để đủ con số.
- Màu vật liệu/tem nhãn cần chính xác, ánh sáng đồng nhất; hạn chế filter hoặc retouch làm sai chất liệu thực tế.
- Ảnh tổng quan cần có chiều sâu; ảnh cận cần thể hiện một chi tiết có ích. Chọn sản phẩm/không gian gọn, không đặt nhiều vật dụng không liên quan trong khung.
- Với mỗi cảnh ưu tiên, chụp thử 2–3 góc hoặc khung rộng/cận để chọn. Số ảnh nguồn có thể nhiều hơn, bộ dùng trên website vẫn chỉ tính những ảnh được chọn.
- Dùng file gốc thay vì screenshot, ảnh có chữ quảng cáo dán lên hoặc file đã bị ứng dụng nhắn tin nén mạnh. Copy và CTA sẽ đặt bằng HTML.
- Kiểm tra biển tên, màn hình, tài liệu, barcode hoặc thiết kế trong khung để chỉ công bố những nội dung được phép.

Mỗi tài nguyên cần ghi: mã ảnh, mô tả chủ thể thật, người cung cấp, quyền công bố, nhóm sản phẩm/công đoạn tương ứng và điểm cần giữ khi crop. Trạng thái là “chưa có / đã nhận / cần chỉnh / được duyệt”. H01/H02 đã nhận và tích hợp cho bản xem giao diện; 9 ảnh sản phẩm, 5 ảnh stock minh họa doanh nghiệp và T01 văn phòng đã nhận theo các bảng phía trên. Bốn nhóm sản phẩm còn lại, ảnh thực tế Sunflower, giải pháp/dự án và logo chưa có media tương ứng; tiếp tục bản xem với bộ hiện tại theo chỉ định người dùng.

## 6. Tổ chức tài nguyên, tránh bản sao

- Ảnh nhận để chuẩn bị G0 đặt vào public/images/brand, hero, company, products, solutions, capabilities, projects, contact theo nhóm hiện có; video vào public/videos/hero/. Chỉ render khi phù hợp chất lượng và trạng thái sử dụng; ảnh nằm trong public không tự có nghĩa đã được duyệt công khai.
- Cùng một ảnh dùng ở Trang chủ và trang con sẽ tham chiếu cùng một file. Không tạo bản sao có tên home-..., about-... chỉ để dùng ở hai nơi.
- Bản crop/độ phân giải khác chỉ xuất khi responsive cần; đó là biến thể có mục đích rõ. Không lưu nhiều file giống nội dung/độ phân giải dưới các tên khác nhau.
- Không đưa ảnh tham chiếu Sonoco, ảnh QA hoặc dữ liệu ERP vào public/.

G0 đã có danh sách media và bộ copy tại [CONTENT.md](CONTENT.md), với 13 nhóm sản phẩm được chủ doanh nghiệp xác nhận. Cần tiếp tục nhận tài nguyên, đối chiếu thông số/model và xác nhận ảnh/nội dung được phép công bố trước khi nghiệm thu đầu vào các module liên quan.


## G2 — Delivery derivatives

G2 giữ các originals đã nhận và xuất bản WebP web từ cùng ảnh, không thêm ảnh mới hoặc sao chép theo trang. Registries company-media.ts/product-media.ts thêm webSrc; nguồn, alt, caption và credit vẫn ở một nơi. Company: cả 5 JPG có WebP, workshop rộng 1000px, bốn ảnh landscape rộng 1200px. Products: Tem trắng cuộn, Tem màu cuộn, Mực in, Tem dệt có WebP tối đa 1000px, không phóng lớn ảnh nhỏ. Render lazy dưới Hero; không đổi video/poster.

BrandIntroduction dùng workshop; WhySunflower dùng large-format-printing, print-color-samples, press-operators, printing-press — tất cả caption Ảnh minh họa ngành in + credit. ProductGallery dùng bốn ảnh đủ kích thước trên; không dùng ảnh 218px làm ảnh lớn. Chưa có visual/crop QA mới do người dùng yêu cầu bỏ kiểm thử lượt G2.

## G3 — Tái sử dụng media trên Sản phẩm/Giải pháp

Bổ sung WebP delivery cho Tem màu tờ, Tem trắng tờ, Máy in, Thẻ bài và Băng dính: tối đa 1600px, quality 86, không upscale. Cả 9 PNG nguồn được giữ; product-media.ts là registry chung. ProductImage giữ object-contain và không vượt kích thước nguồn; hai ảnh 218px không được kéo thành ảnh lớn. Bốn nhóm Máy quét/Hộp/Tem vải nilon/Satin dùng bố cục chữ có hướng dẫn inquiry, không có ảnh giả hoặc ảnh nhóm khác.

SolutionsHero tái dùng Băng dính làm ảnh bao bì minh họa. Các use case lần lượt dùng Tem màu cuộn, Tem trắng cuộn, Printing press (Bank Phrom/Unsplash), Tem dệt và Băng dính. Đây là hình minh họa sản phẩm/ngành in, không phải bằng chứng dự án hoặc nhà máy Sunflower. Chưa có ảnh ứng dụng chuyên biệt trong solutions/ và không sao chép registry sang thư mục đó. Theo yêu cầu người dùng, chưa chạy crop/visual QA G3.

## G4 — Giới thiệu, Năng lực và Mẫu thành phẩm

Giới thiệu tái dùng printing-press cho Hero, printing-workshop cho WorkingStory và officeMedia cho phần phối hợp bộ phận. Ảnh stock có caption/credit; ảnh văn phòng giữ caption trung tính, không xác nhận địa chỉ hoặc diện tích. Năng lực dùng print-color-samples ở Hero và press-operators ở phần giao nhận như ảnh minh họa ngành in; scene vật liệu/tem là CSS illustration cũ, không thêm model hoặc packshot.

Mẫu thành phẩm chọn sáu ảnh catalogue: Tem màu cuộn, Tem dệt, Băng dính, Tem trắng cuộn, Thẻ bài và Tem trắng tờ. Hero tái dùng Tem dệt/Băng dính, không sao chép sang projects/. ProductImage giữ contain và cap kích thước nguồn, đặc biệt thẻ bài 218px. Cả trang và từng mẫu ghi Hình ảnh sản phẩm minh họa; chưa công bố khách hàng, brief hoặc vai trò Sunflower trên các mẫu này.

Không có ảnh nhà máy/thiết bị thật, case khách hàng hoặc nguồn mới trong G4. Các hạng mục bằng chứng vẫn chờ đầu vào. Bộ hiện tại đã được xem trong screenshot desktop/mobile G4; không coi việc duyệt bố cục là xác minh giấy phép công khai của từng ảnh.
