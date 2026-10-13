# Header & Cinematic Hero — Visual / Functional QA

Ngày: 14/10/2026. Phạm vi: Header + Hero, sáu trang con chỉ có khung chờ. Tham chiếu chính: REF-01; đã phân tích cả tám ảnh trong `HEADER_HERO_AUDIT.md`.

## 1. Đã triển khai

- Next.js App Router + React + TypeScript + Tailwind CSS. Các Server Components compose trang; Header và VideoHero là Client Components vì có menu/prefs/media controls.
- Tokens màu, khoảng cách, kiểu chữ theo `DESIGN.md`; Inter self-host có Vietnamese.
- Header một dòng, logo chữ tạm, năm link + CTA, hai trạng thái over-hero / solid, menu dialog và vòng keyboard focus.
- Hero: geometry CSS nguyên bản, nội dung Sunflower, vùng media riêng, CTA xanh + liên kết thứ cấp.
- Video-ready: source có cấu hình, muted/loop/playsInline/autoplay, onPlaying/onPause/onError, xử lý play bị chặn, poster, reduced motion và connection Save-Data/2G. Khi nguồn rỗng, không tạo `<video>` và control được ghi rõ không khả dụng.
- Sitemap giữ đúng `/`, `/gioi-thieu`, `/san-pham`, `/giai-phap`, `/nang-luc`, `/du-an`, `/lien-he`. Không có blog, checkout, ERP/login hay section ngoài phạm vi.
- Sáu trang con có H1/title/description riêng và thông báo chờ triển khai. Không dựng form tiếp nhận giả.

## 2. Đối chiếu với REF-01

| Hạng mục | Quan sát từ Sonoco | Sunflower / khác biệt | Kết luận |
|---|---|---|---|
| Bố cục | Đường cong xanh lớn, logo ở góc sáng, media khoảng 40% từ trái, H1 vượt ranh giới media | Geometry ellipse CSS riêng; media trái 42% ở 1440; H1 thấp bên trái, có chồng vùng media | Giữ logic phân cấp, không trace composition |
| Màu | Xanh nhìn thấy gần `#00488E`, nền sáng, CTA xanh | Dùng nguyên `--brand-navy: #12345F`, `--brand-green: #8ABD37`, `--surface-blue: #EAF1F7` | Navy tối hơn là khác biệt có chủ ý theo DESIGN; không sửa tokens |
| Typography | Headline uppercase, lớn/đậm, nhiều dòng; font thật chưa được xác định từ ảnh | Inter 700, sentence case tiếng Việt. H1 77.76px / 1.06 ở 1440, 42.55px / 1.08 ở 390 | Không giả định font Sonoco; giữ hệ chữ và độ lớn theo DESIGN |
| Spacing | Utility row + main nav; khoảng trống trên media; H1 và CTA lower-left | Header 88px một dòng, gutter 64px desktop / 20px mobile; media top 180px ở 1440×900 | Bỏ utility items không phù hợp Sunflower; giữ nhịp mở thoáng |
| CTA | CTA xanh dạng pill/gradient | CTA xanh phẳng, chữ deep navy, radius 6px; secondary link nhẹ | Theo token và contrast, không sao chép button style độc quyền |
| Media | Ảnh thật trong vùng video, có pause icon | Poster SVG phi ảnh chụp có nhãn chờ media; không có footage thực | Chưa thể đánh giá chất lượng cinematic tương đương, phải bổ sung footage |
| Responsive | Chỉ có ảnh desktop | Mobile 3 dòng, copy trước media; tablet portrait xếp dọc; landscape tablet dùng gradient bảo vệ text; desktop lớn nới H1 | Đây là thiết kế Sunflower đề xuất, không tuyên bố là mobile Sonoco |

## 3. Vòng điều chỉnh thực tế

1. Lượt đầu desktop giữ cấu trúc tốt; mobile ngắt thành bốn dòng với từ cuối bị đứng riêng, Hero cao khoảng 865px ở viewport 844px.
2. Chỉnh phân đoạn H1: desktop hai dòng; mobile ba dòng. Mobile sau sửa Hero 844px, CTA kết thúc khoảng 527px, media kết thúc 820px.
3. Tăng gradient navy ở vùng văn bản giao media để chữ trắng không đặt trên vùng poster quá sáng. Không thay màu tokens.
4. Tablet 768/1024: arc ban đầu đi qua chữ trắng. Bỏ arc ở <=1099, bảo vệ text bằng navy. Tablet portrait 768 xếp media bên dưới để không che gần hết chủ thể, height 88svh để giảm khoảng trống thừa.
5. Desktop 1920: giới hạn H1 800px khiến title xuống bốn dòng và đẩy CTA quá thấp. Nới vùng title lên 1000px tại >=1700; H1 trở lại hai dòng, CTA kết thúc khoảng 875px trong 1080px.
6. Sửa wordmark chấm xuống dòng trong menu; bổ sung focus loop Tab/Shift+Tab, Escape đóng và trả focus về trigger.

Ảnh trước: `qa/desktop-1440-before.jpg`, `qa/mobile-390-before.jpg`. Ảnh cuối: `qa/final-1440x900.jpg`, `qa/final-390x844.jpg`; các breakpoint bổ sung và số đo ở `qa/viewport-results.json`.

## 4. Kiểm tra đã chạy

- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; export seven public routes và trang 404 framework.
- `node --check scripts/preview.mjs`: PASS.
- HTTP production preview: cả bảy route trả 200 và title riêng.
- Browser production review: 390×844, 768×1024, 1024×768, 1440×900, 1920×1080. Không horizontal overflow ở các viewport này.
- CTA sản phẩm và báo giá: đi đúng `/san-pham/`, `/lien-he/`; header solid và active nav trên trang con.
- Menu: mở/đóng, khóa cuộn nền, Escape, focus return, Tab/Shift+Tab tại ranh giới, đóng khi chọn route.
- Poster tải được; nguồn video rỗng không giả đang playback. Không form gửi giả thành công.
- Browser console production: không error/warn ghi nhận tại lượt kiểm tra.
- Base contrast tokens: White/Navy 12.48:1; Deep navy/Green 6.77:1; Foreground/White 14.55:1. Tương phản trên nhiều video frame thật vẫn chờ asset.
- Semantic headings, skip link, alt của poster minh hoạ, controls có label, focus-visible, `lang=vi`, metadata/OG cơ bản, noindex bản demo.

## 5. Chưa xác minh / cần bổ sung

- Logo gốc của Sunflower.
- Footage 16:9 được cấp phép và poster tương ứng; optional mobile portrait.
- Chất lượng cinematic, focal-point/crop trên footage thật, transfer/LCP và autoplay/pause trên file thực. Chưa tuyên bố đã kiểm thử các mục này khi không có nguồn video.
- Tính năng reduced-motion/Save-Data có xử lý trong code; chưa emulation hành vi thực trên đầy đủ thiết bị/mạng.
- Nội dung chi tiết sáu trang con, 13 nhóm sản phẩm, quy cách, dự án/ảnh xưởng, liên hệ và backend intake theo STRUCTURE: chưa triển khai trong slice này.

Không dùng ảnh, logo, video hoặc nội dung Sonoco trong `public/` hoặc output. Bộ screenshot tham chiếu vẫn ở workspace của người dùng. Bản demo trước được giữ trong `legacy-demo/`, không được xuất vào website mới.
