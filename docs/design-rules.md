# MyOS mobile — Bộ quy tắc thiết kế v2

**Cập nhật bản xem thử v3:** ảnh biển thật trong header, nav 56 px, dialog giữa màn hình. [Thông số và ảnh kiểm tra](mobile-design-update.md) thay quy định v2 về ba thành phần này; chưa sửa ứng dụng MyOS.

11/10/2026 · **Đề xuất sau audit, chờ duyệt thiết kế.** Không phải source đã triển khai. Tài liệu này cùng tokens/spec/component-map thay các đề xuất của bản thử cũ. Phạm vi thiết kế đã mở rộng theo yêu cầu mới: thêm Tổng quan, Ghi chú, Dự án, Cài đặt và tab Chấm công. [Đặc tả mở rộng](mobile-suite-spec.md) và [album](mobile-suite-review.md). Phạm vi code chưa mở rộng.

## 1. Căn cứ và phạm vi

[Audit](mobile-ui-audit.md) là hiện trạng; [reference](design-reference.md) là phân tích ảnh; bộ v2 là quyết định thiết kế đề xuất. Màu/font/Lucide/nghiệp vụ hiện hành được giữ. R1 cho nhịp lịch và thứ bậc tháng–ngày, R2B cho sự gọn của lịch và hàng nội dung, R2D cho sheet, R3B cho sự ổn định của navigation. Không sao chép hình ảnh, chart, font serif, màu đào/rừng hoặc chức năng mẫu.

Đ = source/DOM có bằng chứng; Ư = ước lượng ảnh; P = mục tiêu đề xuất; ? = chưa xác minh. Số đo của preview được gọi **Đ-preview**, không biến P thành thiết kế đã duyệt. Đây là responsive web MyOS tại breakpoint hiện có 700 px; không tạo app native.

## 2. Quy tắc có thể kiểm tra

| ID | Quy tắc P | Lý do / audit | Tiêu chí khi implementation |
| --- | --- | --- | --- |
| D01 | Một trục gutter 16; 12 dưới 360. Header, section title và nội dung dùng cùng trục | A04: x12/14/20/27/29 | Không cộng thêm container padding vào thư viện; card vẫn có inset riêng cho text |
| D02 | Header navy đặc, min64 + safe top; title 22/28/600, account44 | A05; toolbar R1 gọn | Một title nhìn thấy; title dài làm header giãn, không cắt dấu. Overview dùng title Tổng quan trên toolbar, brand không thêm hàng hero |
| D03 | Primary/secondary/icon/tab/editor tool có hit area min44 cao; icon-only min44 rộng | A01–A03 | Glyph không quyết định vùng bấm; thao tác Xóa có label và vùng44, giữ xác nhận hiện hành |
| D04 | Font một hệ Be Vietnam Pro; cấp chữ theo vai trò tại tokens | A07 | Action14/20, body15/23, input 16/24, meta12/18. Không dùng meta cho action quan trọng |
| D05 | Spacing4/8/12/16/24/32; giữa section24, title–content12, field-group16 | A04/A14 | Gap theo quan hệ dữ liệu, không mỗi module chọn thêm mức. 2 chỉ chi tiết glyph/badge |
| D06 | Card theo nội dung; không min-height212/220 mobile, không preview-min65 | A06 | Empty/short/long khác chiều cao; title trước excerpt, metadata theo flow; không card trang trí |
| D07 | Phân loại tab, view segment, filter, disclosure trước khi chọn style | A08 | Tab route/submodule có underline; segment view selected trắng/chữ primary; filter selected primary-soft + trọng lượng chữ; disclosure có expanded semantics |
| D08 | Glyph action20/nav18, inline/meta16, stroke1.75 | A09 | Đo SVG render thật; Button không ép toàn bộ về16. Không thêm icon vào nhãn tab rõ nghĩa |
| D09 | Nav năm mục có nhãn11/16, icon18; min56, margin ngang10/dưới8, radius18 | A10; R3B | Một sizing contract cho token/layout/reserve; không active translate; không icon-only hoặc thêm mục |
| D10 | Form inline/portal cùng field 44, label14/20, input 16/24; textarea theo nội dung | A03/A11 | Không phụ thuộc selector bên trong shell; không field cuối bị footer/keyboard che |
| D11 | Overlay scrim trên nav, dialog giữa viewport trên scrim; title 18/26, close44, gutter16, radius16 bốn góc | A02/A11; R2D | Body cuộn; actions theo save contract của module; không tạo nút Lưu Chấm công |
| D12 | Active/focus/disabled/pending/error là trạng thái có chủ đích | A15 | Active có shape/underline/weight/semantics; focus dùng nền + underline, không outline nổi; disabled có lý do khi cần trên touch; pending không bấm trùng |
| D13 | Màu nhóm lịch/pastel ghi chú/KPI có ý nghĩa riêng, không thay bằng một màu duy nhất | Giữ nhận diện và dữ liệu | Selected không làm mất tên/giờ/trạng thái; text luôn còn đọc được và accessible name đầy đủ |
| D14 | Mobile-first theo flow, không fixed-height content hoặc ép mọi thứ trong màn hình đầu | A11–A13 | Thử dài/rỗng/nhiều mục/zoom; cho xuống dòng trước khi thu chữ; desktop giữ nguyên trong pilot |

44 là mục tiêu nội bộ cho vùng chạm, không tuyên bố chứng nhận accessibility. Grid7 cột dưới340 có bề ngang ô nhỏ hơn44; giữ cột đều, row 48, không gây overflow để đạt bề ngang giả.

## 3. Taxonomy và trạng thái

| Role | Default | Selected/focus | Tránh |
| --- | --- | --- | --- |
| Tab Lịch/Chấm công; tab trạng thái hiện có | Chữ muted14, vùng44 | Primary600 + underline3; giữ keyboard semantics hiện tại | Biến filter button thành Radix Tabs chỉ vì style |
| Segment Tháng/Tuần; Thẻ/Kanban | Surface-soft, radius6, chữ14 | Selected surface + line1 + chữ primary600; pressed/focus có nền/underline | Segment cao27 hoặc pill trang trí |
| Filter Notes / filter nghiệp vụ | Nhãn14, auto wrap/scroll có chủ đích | Primary-soft + chữ600 + pressed semantics | Chữ11, thiếu active hoặc chỉ dựa màu |
| Disclosure cài đặt | Hàng min56, title 16; chevron thao tác | Expanded có aria-expanded, field giữ giá trị | Switch thay disclosure hoặc Reset mẫu robot |
| Primary action | Primary + trắng, min44, radius6 | Pressed primary-hover; pending có nhãn/khóa trùng | Accent làm nền chữ trắng nhỏ, icon thêm không có nghĩa |
| Secondary/icon | Surface/transparent, ink; vùng44 | Nền primary-soft + underline nếu có chữ | Viền focus nổi, handler rỗng |
| Destructive | Danger + nhãn rõ, vùng44 | Pending khóa; xác nhận theo nghiệp vụ hiện có | Gộp Xóa vào vùng bấm nhỏ21px hoặc tự bỏ xác nhận |

## 4. Cách áp vào từng phân hệ sau khi duyệt

- Tổng quan: giữ số liệu thật, dải4 số và tab hiện tại. Chuẩn hóa typography/gutter, không tự đổi thành lưới2×2, thêm quick actions hoặc chart.
- Lịch: đặc tả cụ thể và bản duyệt ở [design-spec](design-spec.md), [bản thiết kế đích](mobile-design-review.md). Lịch tháng/tuần và preview một mục + sheet đầy đủ được giữ.
- Chấm công: công việc → kỳ tháng → nội dung ngày → save state. Quy tắc field/action/sheet dùng chung; autosave 700 ms, lỗi/nháp/xóa khóa các tháng giữ nguyên. Đã dựng bảng tháng, sheet ngày và form công việc trong bộ mở rộng; chưa triển khai.
- Ghi chú: search riêng hàng, Từ ảnh/Tạo ghi chú cùng hàng khi đủ chỗ, filters wrap; pastel card theo nội dung. Empty chỉ title + empty text + metadata; excerpt tối đa3 dòng trong thư viện và mở đọc đầy đủ. Editor Tiptap giữ tính năng, không đổi save contract.
- Dự án: search → create → filters/status → view/pinned → số liệu → cards; không đổi order chức năng chỉ vì cùng hình thức. Card theo nội dung; title 16/24, progress có số%, menu44. Form/chi tiết/Kanban đã có bản đích trong bộ mở rộng; chưa code.
- Cài đặt: disclosure và field groups theo cùng spacing; không bỏ HEX/swatch/tính năng nhắc. Phân nhóm sâu hơn cần bản đích riêng, chưa tự thêm disclosure cấp con.

## 5. Ownership khi chuyển sang code

Tokens sở hữu màu/font/spacing/radius/layer. Primitives sở hữu size/state của button/input/tab. Shell sở hữu header/nav/safe-area/reserve. Module sở hữu grid/editor/row và luồng nghiệp vụ. Không nhân bản shell theo tab hoặc để module sửa global nav bằng :has ở bản cuối.

Pilot vẫn chỉ một màn Lịch: nếu dùng shell mới để review route đó, phải thể hiện là rollout tạm. Chuẩn toàn app được viết thống nhất nhưng không tự triển khai các route còn lại. Giữ desktop và nguồn dữ liệu; không refactor repository/service.

## 6. Điều chưa chốt

Header đặc thay gradient, selected ngày dạng vòng32, segment compact128 và preview mở là P cần duyệt qua ảnh. Safe area/keyboard/text zoom trên iPhone thật chưa được thử. Không thiếu ảnh/icon cho màn Lịch; favicon/logo raster bổ sung là tài sản riêng, không chặn bản duyệt này.
