# Lịch mobile — Review và kiểm chứng bản thử

> Bản ghi lịch sử của pilot trước audit, chưa được duyệt về thiết kế. Bộ quy tắc và [bản thiết kế đích v2](mobile-design-review.md) thay thế proposal ở báo cáo này; không dùng số đo pilot làm sizing đích mới.

Ngày 11/10/2026. Chỉ triển khai tab Lịch; dừng chờ duyệt trước các màn hình còn lại. Không deploy.

## Review tài liệu

Đã đọc lại bốn tài liệu và đối chiếu ba ảnh tham khảo, bốn ảnh MyOS hiện tại, source và màn hình runtime. Đã sửa:

- Tổng quan mobile hiện tại là dải số liệu ngang; lưới 2 × 2 trong M1 là đề xuất, không phải hiện trạng. Không triển khai Tổng quan.
- Ghi rõ phạm vi một tab và điều kiện áp style header/nav/portal; Chấm công và route khác giữ giao diện cũ.
- Chốt thứ tự các hàng Lịch và thông số trước code; phân biệt thông số CSS đích với tỷ lệ ước lượng raster.
- Đính chính Tháng/Tuần mobile dùng Button group với aria-pressed; không thay semantics thành Radix Tabs.
- Thống nhất sheet giữ max-height 90dvh hiện có; padding 16, radius top 16. Dự trữ đáy 120 + safe bottom trong bản thử được kiểm tra bằng thao tác cuộn tới nút cuối.

## Source thay đổi

| File | Thay đổi |
| --- | --- |
| [calendar.css](../src/modules/calendar/calendar.css) | Style mobile theo spec; shell và dialog giới hạn bằng tab book, lề/safe area, kiểu chữ, grid, control, nav |
| [calendar-screen.tsx](../src/modules/calendar/components/calendar-screen.tsx) | Thuộc tính data-calendar-view phục vụ phạm vi style; không đổi state/handlers |
| [mobile-calendar.tsx](../src/modules/calendar/components/mobile-calendar.tsx) | Icon thao tác 20; giữ markup chức năng và luồng dữ liệu |

Không sửa service, repository, model, auth, schema, dữ liệu tài khoản hoặc biến môi trường. `.env.example` đã ở trạng thái deleted khi bắt đầu; không đụng thay đổi này.

## Ảnh sau implementation

Ảnh chụp từ production build local trong Microsoft Edge/Chromium, viewport CSS 1×, context mobile/touch riêng. Ba lịch hẹn là **fixture kiểm thử**, không phải dữ liệu người dùng và không được thêm vào production source. Không dùng screenshot tham khảo làm nền.

| Trạng thái | Ảnh |
| --- | --- |
| Màn hình đầu 390 × 844 | [calendar-390x844.png](design-review/calendar-390x844.png) |
| Màn hình đầu 375 × 812 | [calendar-375x812.png](design-review/calendar-375x812.png) |
| Cuộn tới cuối 390 | [calendar-scrolled-390.png](design-review/calendar-scrolled-390.png) |
| Cuộn tới cuối 375 | [calendar-scrolled-375.png](design-review/calendar-scrolled-375.png) |
| Sheet ngày ở 375 | [day-sheet-375.png](design-review/day-sheet-375.png) |
| Màn hình hẹp 320 × 740 | [calendar-320x740.png](design-review/calendar-320x740.png) |
| Desktop 1440 × 1000 | [calendar-desktop.png](design-review/calendar-desktop.png) |

Đã xem trực tiếp ảnh hai viewport yêu cầu, ảnh sheet, ảnh cuối trang, ảnh 320 và desktop. Lượt đầu phát hiện style Button thu nhỏ icon; đã sửa kích thước SVG trong phạm vi Lịch, build lại và chụp lại. Ảnh cuối cùng dùng cùng trạng thái không focus ô ngày để so sánh nhất quán.

## Đối chiếu thiết kế

| Tiêu chí | Đo runtime/kết quả | So với spec |
| --- | --- | --- |
| Header | 64 px; navy #102F49, title 22/28 | Khớp |
| Lề/grid 390 | x=16, rộng 358, cột ≈51,14 | Khớp |
| Lề/grid 375 | x=16, rộng 343, cột 49 | Khớp |
| Hàng lịch | 52 px; cả lưới tháng 5 hàng cao 302 (gồm thứ 42) | Khớp, selected không làm hàng cao thêm |
| Màu, font | Turquoise/navy, Be Vietnam Pro; trắng/pastel hiện có | Giữ nhận diện, không nhập màu đào/xanh rừng |
| Hierarchy | Title tháng trái; mũi tên phải; view riêng; bộ lọc; thứ/ngày; preview | Khớp review M2; giữ controls MyOS |
| Bo góc | Card/grid 8, controls 6, sheet 16, nav 24 | Khớp tokens áp dụng |
| Navigation | 72 px ở 390/375; 83 ở 320 do Tổng quan xuống hai dòng | Đủ 5 nhãn, không cắt chữ |
| Tràn ngang | Không ở 390/375/320 | Đạt kiểm tra DOM |
| Nội dung cuối | Cuộn tới cuối đưa nút xem ngày lên trên nav ở cả ba chiều rộng | Đạt; không tuyên bố toàn preview nằm trong màn hình đầu |
| Sheet | Ba mục hiện đầy đủ; nav bị scrim che; Escape trả focus ô ngày | Đạt kiểm tra hành vi và ảnh |
| Phạm vi | Chấm công/Ghi chú vẫn header gradient; desktop giữ FullCalendar/sidebar | Không triển khai màn hình khác |

Số đo chi tiết: [metrics.json](design-review/metrics.json). Font ghi trên header/nav container trong JSON là font kế thừa; cỡ title/label được quy định riêng trên phần tử con.

## Kiểm tra chức năng và build

- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`: đạt.
- `NEXT_PUBLIC_MYOS_MODE=local pnpm build`: đạt; đã build lại sau chỉnh icon/weight cuối cùng.
- `PLAYWRIGHT_CHANNEL=msedge pnpm exec playwright test mobile.spec.ts calendar.spec.ts workspace.spec.ts --workers=2`: **21 passed, 13 skipped** theo điều kiện desktop/mobile có sẵn. Bộ này chạy trước chỉnh kích thước SVG và weight cuối; các thay đổi cuối chỉ CSS và đã smoke-test trên build mới.
- Các ca đạt gồm Calendar CRUD, recurrence/ngoại lệ, marks, conflict giữ nháp, rollback, ICS, bộ lịch độc lập/copy; mobile tạo ghi chú/công việc, filter/reload, đủ mục/qua đêm, tháng/tuần, sửa nội dung; hồi quy Chấm công tự lưu và 320 px. Không diễn giải các ca desktop bị skip ở mobile là đã kiểm tra trên cả hai nền tảng.
- Smoke-test build cuối: 390/375/320, không tràn ngang, mở đủ ba mục, Escape/focus, đổi tuần, filter, scroll tới nút cuối; tab Chấm công/route Ghi chú giữ style cũ; desktop không có nav mobile. Không có pageerror hoặc console error ứng dụng ngoài tài nguyên favicon thiếu bên dưới.
- Không chạy lại Firebase Emulator vì không sửa dữ liệu/auth/API; không xác nhận cloud hoặc deployment mới.

## Sai lệch và giới hạn còn lại

- Không phải bản sao pixel của R1: MyOS giữ font, màu, tab Chấm công, bộ lọc và menu; không có ảnh nhân vật/glass. Mẫu R1 đặt Week/Month trước tháng, bản MyOS giữ tháng trước view theo M2. Đây là khác biệt đã ghi trong review.
- So với mẫu, phần controls phía trên nhiều hơn; preview chưa hiện trọn ở vị trí cuộn đầu, cần cuộn để thấy nút cuối. Không thu chữ hoặc bỏ chức năng để nhét vừa một màn hình.
- Ở 320, nhãn Tổng quan xuống hai dòng và ô lịch rộng ≈42,3 px; chiều cao vẫn 52. Không tuyên bố mọi ô rộng tối thiểu 44.
- Safe-area CSS đã có, nhưng môi trường Chromium không chứng minh cách Safari/iPhone thật xử lý thanh trình duyệt động, bàn phím và text zoom 200%. Các trường hợp đó chưa kiểm chứng trên thiết bị thật.
- Font/DPR/blur gốc của mẫu vẫn chưa có; không thể cam kết pixel-match nguyên mẫu. Bản này không cần asset hình ảnh mới.
- `/favicon.ico` trả 404, dự án chưa có asset này. Không tự thiết kế favicon/logo; ghi riêng với lỗi ứng dụng và để ngoài scope màn hình Lịch.

Preview local đang chạy tại `http://localhost:3100/calendar`, dùng mode local riêng. `.env.local` không bị sửa. Bản thử chưa deploy Vercel và chưa áp dụng sang các màn hình còn lại.
