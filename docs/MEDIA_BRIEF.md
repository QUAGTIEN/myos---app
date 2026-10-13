# Sunflower — G0: Danh sách ảnh và video cần chuẩn bị

Ngày lập: 14/10/2026. Trạng thái: đã nhận và tích hợp video Hero minh họa người dùng chọn; ảnh/logo doanh nghiệp vẫn đang chờ. Tài liệu này chi tiết hóa các vị trí ảnh trong [STRUCTURE.md](STRUCTURE.md) theo art direction của [DESIGN.md](DESIGN.md), không bổ sung trang/section.

### Tài nguyên Hero đã nhận

- Nguồn: `istockphoto-1139033230-640_adpp_is.mp4`, do người dùng cung cấp và yêu cầu sử dụng làm Hero.
- Thông số kiểm tra: H.264, 768×432 (16:9), khoảng 23,98 fps, 21,81 giây, file nguồn 2.928.289 byte; không có audio stream.
- Nội dung: công đoạn máy in, có watermark iStock. Đây là footage minh họa; không xác nhận đó là cơ sở hay thiết bị Sunflower.
- Video dùng trên website: `public/videos/hero/hero-desktop.mp4`, giữ nguyên độ phân giải/nội dung, remux faststart để tải thuận tiện, không xóa watermark.
- Poster: `public/images/hero/hero-poster.webp`, trích từ 0,2 giây của cùng video; desktop/mobile hiện dùng cùng tài nguyên.
- Trạng thái quyền sử dụng: đã có chỉ định sử dụng từ người dùng; chưa có bằng chứng giấy phép iStock cho bản công khai. Cần bản HD được cấp phép, không watermark trước khi phát hành công khai. Bản hiện tại dùng để xem giao diện với quyền truy cập riêng tư hiện có.

## 1. Số lượng đề xuất

| Nhóm | Số ảnh nội dung | Nơi dùng chính | Dùng lại trên Trang chủ |
|---|---:|---|---|
| Doanh nghiệp | 4 | Giới thiệu | BrandIntroduction |
| Sản phẩm | 13 dự kiến | Sản phẩm | FeaturedProductCategories: chọn 4–6 ảnh |
| Giải pháp/ứng dụng | 5 dự kiến | Giải pháp | SolutionsByIndustry: chọn 3 ảnh |
| Năng lực/sản xuất | 6 | Năng lực | WhySunflower, CapabilitiesFeature, ProcessPreview |
| Dự án/mẫu thành phẩm | 6 | Dự án | FeaturedProjects: chọn 3 ảnh |
| Liên hệ | 1, có thể bỏ nếu chưa có ảnh phù hợp | Liên hệ | Không cần thêm ảnh cho CTA/Footer |
| **Tổng** | **35** | **Ảnh khác nhau, dùng lại giữa các trang** | **Không cần chụp thêm một bộ riêng cho Trang chủ** |

Ngoài 35 ảnh: 1 video Hero desktop, 1 poster trích từ video và logo chính thức. Như vậy dự kiến có 36 hình raster tính cả poster; logo không tính vào số ảnh chụp. Bản mobile của video/poster có thể crop từ cùng nguồn nếu bố cục cho phép; đó là biến thể phục vụ responsive, không phải ảnh nội dung mới.

Đây là mục tiêu chuẩn bị của phiên bản đầy đủ, không phải yêu cầu chụp đủ trước khi bắt đầu. 13 nhóm sản phẩm và 5 nhóm ứng dụng vẫn cần xác nhận. Số ảnh cuối có thể giảm nếu một nhóm không được công bố, ảnh có thể dùng chung hợp lý hoặc ảnh liên hệ không cần thiết; không dùng ảnh giả để đủ số lượng.

## 2. Bộ ưu tiên để bắt đầu G1–G2

| Ưu tiên | Tài nguyên | Số lượng | Mục đích |
|---|---|---:|---|
| P0 / G1 | Logo chính thức | 1 bộ nhận diện; phiên bản sáng/tối nếu đã có | Header, menu mobile, Footer |
| P0 / G1 | Video sản xuất/sản phẩm thật | 1 video dựng cuối | Cinematic Hero Trang chủ |
| P0 / G1 | Poster lấy từ video | 1 hình | Hero trước khi tải video, khi tắt chuyển động hoặc video không phát |
| P1 / G2 | C01: ảnh doanh nghiệp/tổng quan | 1 ảnh | Giới thiệu ngắn |
| P1 / G2 | 5 nhóm sản phẩm ưu tiên | 5 ảnh | Gallery sản phẩm nổi bật |
| P1 / G2 | K02–K05: in, gia công, phối hợp/duyệt mẫu, QC | 4 ảnh | Section navy và minh chứng cách làm việc |

**Bộ khởi động: 10 ảnh nội dung + 1 poster + 1 video + logo.** Mười ảnh là một phần của bộ 35, không cộng thêm. Đề xuất năm nhóm sản phẩm để chọn ban đầu: tem trắng cuộn, tem màu cuộn, tem màu tờ, hộp, thẻ bài; thay thế bằng nhóm Sunflower thực sự muốn giới thiệu sau khi xác nhận.

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

Tên file dưới đây là tên đề xuất cho bản tối ưu dùng trên web. Chưa tạo các file ảnh rỗng hoặc mock trong source.

### A. Doanh nghiệp — 4 ảnh

Ảnh ngang 3:2, ánh sáng tự nhiên, nội dung thật. Không bắt buộc chụp nhân sự nếu chưa có sự đồng ý.

| ID | Nội dung cần chụp | Vị trí sử dụng | Tên file đề xuất |
|---|---|---|---|
| C01 | Tổng quan không gian làm việc/doanh nghiệp, gọn và thể hiện đúng hoạt động | Hero Giới thiệu; BrandIntroduction Trang chủ | company-overview.webp |
| C02 | Trao đổi yêu cầu hoặc duyệt mẫu với bàn mẫu sản phẩm | CompanyOverview/cách tiếp cận công việc | requirements-discussion.webp |
| C03 | Không gian, vật liệu hoặc công việc kể được câu chuyện doanh nghiệp | OurStory, editorial split | company-story.webp |
| C04 | Đội ngũ đang làm việc/phối hợp, hoặc không gian làm việc thực tế | PeopleAndCulture | team-workflow.webp |

C01 và C03 ưu tiên góc rộng có thể đặt trong layout split. C02/C04 tránh hiển thị tài liệu hoặc màn hình có dữ liệu khách hàng.

### B. Sản phẩm — dự kiến 13 ảnh

Mỗi nhóm một ảnh đại diện, chụp bộ sản phẩm có chủ đích trên nền trắng/trắng ngà sạch. Giữ ánh sáng, góc chụp và tỷ lệ đồng nhất; để đủ mép quanh sản phẩm. Chụp nguồn 1:1 hoặc đủ rộng để crop 4:5; chất liệu và mép in phải thấy rõ.

| ID | Nhóm cần xác nhận | Cách thể hiện đề xuất | Tên file đề xuất |
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

Mỗi tài nguyên cần ghi: mã ảnh, mô tả chủ thể thật, người cung cấp, quyền công bố, nhóm sản phẩm/công đoạn tương ứng và điểm cần giữ khi crop. Trạng thái là “chưa có / đã nhận / cần chỉnh / được duyệt”. H01/H02 đã nhận và tích hợp cho bản xem giao diện; các ảnh nội dung và logo còn là đề xuất chưa có media.

## 6. Tổ chức tài nguyên, tránh bản sao

- Ảnh đã duyệt và tối ưu đặt vào public/images/brand, hero, company, products, solutions, capabilities, projects, contact theo nhóm hiện có; video vào public/videos/hero/.
- Cùng một ảnh dùng ở Trang chủ và trang con sẽ tham chiếu cùng một file. Không tạo bản sao có tên home-..., about-... chỉ để dùng ở hai nơi.
- Bản crop/độ phân giải khác chỉ xuất khi responsive cần; đó là biến thể có mục đích rõ. Không lưu nhiều file giống nội dung/độ phân giải dưới các tên khác nhau.
- Không đưa ảnh tham chiếu Sonoco, ảnh QA hoặc dữ liệu ERP vào public/.

G0 mới hoàn thành phần đề xuất danh sách media. Cần tiếp tục chọn nhóm sản phẩm/ứng dụng thật, nhận tài nguyên và xác nhận nội dung/quyền công bố trước khi nghiệm thu đầu vào các module liên quan.
