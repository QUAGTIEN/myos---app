# MyOS mobile — Design tokens v2

**Override đã xác nhận 12/10/2026:** overview tabs gap4/inset4/height44, outer margin16; calendar disclosure gap16/divider1/inset-top12/trigger44; popup create/edit calendar/project width360 tối đa (viewport−40), inset12/max78dvh trừ safe/heading18/26/gap8/footer44. Form label–field4, calendar field-group10; project field gap6. Input/select/textarea/contenteditable tối thiểu16 trên mobile hoặc pointer coarse, không khóa zoom; note title giữ21. Header direction threshold18/transition180, reduced motion0. Màu, font, nav56 và radius dialog16 giữ nguyên. [Kiểm tra ứng dụng](mobile-refinements-review.md).

**12/10/2026:** đã được cho phép code pilot Lịch v3; [báo cáo triển khai ứng dụng thật](calendar-implementation-review.md). Thiết kế các route còn lại chưa rollout.

**Cập nhật bản xem thử v3:** ảnh biển thật trong header, nav 56 px, dialog giữa màn hình. [Thông số và ảnh kiểm tra](mobile-design-update.md) thay quy định v2 về ba thành phần này; chưa sửa ứng dụng MyOS.

11/10/2026 · **P: quy chuẩn đề xuất sau audit, chờ duyệt.** Thay bảng đích của bản thử trước; không thay CSS production trong lượt này. [Quy tắc](design-rules.md) · [spec](design-spec.md) · [audit](mobile-ui-audit.md).

## 1. Màu — Đ từ globals.css, giữ nguyên

| Token hiện hữu | HEX | Role |
| --- | --- | --- |
| background | #F2F4F8 | Nền light |
| surface / surface-soft | #FFFFFF / #F0F3F8 | Nội dung/control |
| ink / muted | #07334A / #536779 | Chữ chính/phụ |
| line | #DBE2EC | Divider/border1 |
| primary / primary-hover | #007F78 / #006760 | Action/pressed |
| accent | #00B8A9 | Điểm nhận diện, không nền mặc định của chữ trắng nhỏ |
| primary-soft / primary-border | #E6F7F5 / #C8E8E3 | Active nhẹ/ranh giới |
| sidebar / sidebar-text / sidebar-hover | #102F49 / #C5D6E5 / #1C405C | Header/nav/nav inactive/focus |
| danger | #B14366 | Error/destructive có nhãn |
| blue / blue-ink | #E9F0FF / #315D9B | Màu dữ liệu xanh lam |
| peach / lavender / rose | #FFF0E3 / #F0EBFC / #FBEAF0 | Ghi chú pastel hiện hữu |
| blue-solid / turquoise-solid | #2563EB / #008578 | KPI hiện hữu |
| orange-solid / violet-solid | #FFAD38 / #7950D4 | KPI hiện hữu |

Source: [globals.css](../src/app/globals.css). Màu bộ lịch tùy người dùng là dữ liệu, không ép về bảng hệ thống. Màu chấm trên preview v2 minh họa nhóm, không phải xác nhận HEX của lịch trong screenshot người dùng. Scrim P dùng navy opacity35%; avatar dùng trắng opacity12,5%; không thêm brand color.

## 2. Typography — P theo role

Be Vietnam Pro hiện hữu; đầy đủ Latin/tiếng Việt, 400/500/600, tracking0; không chọn font từ raster. Line-height ghi CSS px.

| Role | Size / line | Weight |
| --- | --- | --- |
| Page title | 22 / 28 | 600 |
| Sheet title / month heading | 18 / 26 | 600 |
| Section / card title | 16 / 24 | 600 |
| Body / calendar event title | 15 / 23 | 400 / 600 |
| Input / editor | 16 / 24 | 400 |
| Action / tab / view / day number | 14 / 20 | 500; active600; day400 |
| Metadata / weekday / scope summary | 12 / 18 | 400–500 |
| Bottom nav label | 11 / 16 | 500 |
| KPI | 28 / 34 | 600 |

Không thu title dài xuống meta. Card preview title tối đa2 dòng; nội dung mở phải đọc đầy đủ. Tab/action được giãn khi chữ zoom. Scope summary là thông tin bộ lọc, không phải một button cỡ12.

## 3. Spacing và kích thước — P

| Role | Value | Điều kiện |
| --- | --- | --- |
| Scale | 4,8,12,16,24,32 | 2 chỉ chi tiết dot/glyph |
| Outer gutter | 16 | 12 khi width<360; max với safe-side |
| Card / sheet inset | 16 | Event row compact12, KPI12; không lồng padding thư viện |
| Internal gap | 8/12 | Label–field8, field-group16 |
| Section gap | 24 | Title–content12 |
| Button / field / icon hit area | min44 cao | Icon-only min44 rộng; text wrap tăng chiều cao |
| Header | min64 + safe-top | Padding dọc10, account44; không fixed-height |
| Nav | min56, margin ngang10 / dưới8 | Padding4, item min48; text tăng nav tự giãn |
| Main bottom reserve | nav thực +26 +max(8,safe-bottom) | max(8,safe-bottom) margin +26 breathing; không token76 trong khi DOM70 |
| Calendar weekday / row | 28 / min48 | Cột available/7; tháng5/6 hàng theo dữ liệu |
| Calendar number shape | 32 ×32 circle | Selected primary; today underline; không tăng hit area theo glyph |
| Calendar view group | width128, min44 cao | 2 trigger 64; <360 options wrap, giữ hit area |
| Event row | min64, padding12, gap12 | Theo nội dung, không max-height |
| Event time label | width72, min32 | Không phải button riêng, glyph chevron18 |

Nav height/reserve phải lấy cùng contract, zoom làm chiều cao thực tăng cần tăng reserve theo đó. 56/34 là baseline v3 tại text100%, không chứng minh text200%.

## 4. Radius, border, shadow, layer — P trừ token nguồn

| Role | Value | Căn cứ |
| --- | --- | --- |
| Control / badge | 6 | Giữ radius-control |
| Card / filter panel | 8 | Giữ radius |
| Sheet top / bottom | 16 / 16 | Dialog giữa màn hình theo yêu cầu mới; không sửa dialog desktop10 |
| Nav | 18 | Giữ nhận diện nav hiện có |
| Avatar / selected day | 50% | Hình tròn theo vai trò |
| Border/divider | 1px line | Không kẻ từng ô grid |
| Tab indicator | 3px primary | Selected ngoài màu còn underline/weight |
| Surface | Shadow thường hiện có khi cần | Không shadow từng event hoặc calendar |
| Nav shadow | 0 4px 16px #102f4920 | Đề xuất v3 |
| Header/nav layer | 10 | Giữ layer-header |
| Scrim / sheet | 40 / 50 | Theo token overlay/drawer; check portal stack lúc code |

Shadow nguồn: thường 0 3px 8px #17324f05, 0 14px 30px #17324f06; raised 0 6px 14px #17324f0a, 0 18px 35px #17324f0a. Không blur/glass/glow ở phân hệ; ngoại lệ auth giữ nguyên ngoài phạm vi.

## 5. Icon, motion, uncertainty

Lucide hiện hữu: nav18/action20, inline16, chevron row18 khi cần; stroke1.75; render thật phải khớp props. Motion tối đa150–180ms background/opacity, reduced motion; không translate active hoặc thêm animation mới.

Màu/font nguồn là Đ; mọi sizing/layout v2 là P. Preview kiểm tra geometry, không xác nhận cloud behavior, bàn phím Safari, safe area thiết bị, contrast toàn bộ màu user-chọn hoặc zoom200%. Không gọi P đã duyệt vì render thành PNG.

## 6. Áp dụng bổ sung trong bộ thiết kế mở rộng — P

Cùng token/header/nav/font/spacing/radius áp dụng các phân hệ tại [suite spec](mobile-suite-spec.md); không thêm bảng màu riêng. KPI dùng bốn màu solid nguồn, note dùng pastel nguồn, calendarPalette giữ màu dữ liệu. Attendance cell min72/number14/20/content12/18/weekday32; swatchhit44/glyph28; agenda min72/time72; disclosure56. Đây là sizing chuyên biệt theo role, không ngoại lệ primary/action44. Bộ ảnh độc lập chưa là CSS production.
