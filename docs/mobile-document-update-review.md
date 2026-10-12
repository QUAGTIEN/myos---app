# Triển khai yêu cầu mobile từ tài liệu người dùng

12/10/2026 · Phạm vi đã xác nhận: mobile. Thực hiện6 yêu cầu trong1.docx và2 ảnh minh họa; giữ navy/turquoise, font, dữ liệu và nghiệp vụ MyOS. Không sửa tài liệu Word gốc.

## Kết quả

1. Menu dưới: rộng tối đa340 px, gutter24 và safe sides, cao52 px thay56; nhãn10/14, icon18, vùng chạm44. Ẩn xuống khi cuộn xuống sau18 px; hiện khi cuộn lên, về đầu trang, chuyển route hoặc focus bàn phím. Cùng hướng cuộn với header, không đổi flow/reserve khi ẩn. Khi đang nhập hoặc có popup giữ trạng thái dễ thao tác; reduced motion tắt transition.
2. Popup: CalendarDialog, form dự án/mục dự án và lịch sử ghi chú trên mobile mở ở đáy, góc trên16 px, animation180 ms từ dưới; max72dvh trừ safe-top, padding12/16 và bottom12+safe-bottom. Form lịch/dự án giữ heading/footer, vùng fields cuộn. Giữ Radix, Escape/return focus, pending, confirmation và nháp khi lỗi; chữ nhập16 và pinch zoom chủ động giữ nguyên. Các xác nhận browser hiện hữu vẫn giữ.
3. Lịch: ngày là circle32 trong button48; màu theo count occurrence thật đang hiển thị, có tính filter/search/chuỗi và end exclusive. 0 trắng,1 primary-soft,2 medium#b4e8e2,3 high#55bdb2,4+ primary#007f78; ring selected và today underline độc lập với độ đậm. Count có trong accessible name và phần chi tiết; chạm ngày vẫn mở toàn bộ mục. Không đổi màu lưu trong event/group, không migration, không dùng màu cầu vồng của ảnh mẫu.
4. Tổng quan:3 tab chọn có nền primary và chữ trắng; vẫn aria-pressed và giữ spacing16 px, ảnh rừng và số liệu thật.
5. Ghi chú: +44 trên header gọi create hiện hữu, có tên truy cập/pending/disabled. Bỏ khung trắng bao ngoài; tìm kiếm và3 bộ lọc pill như ảnh, selected xanh. Từ ảnh vẫn có nút riêng cạnh search (cloud tiếp tục hoãn). Note row56 px, title14/22 một dòng có ellipsis và dấu ghim; nội dung/metadata vẫn lưu và xem trong chi tiết. Folder/tag/filter/search/trash/revisions/autosave giữ nguyên.
6. Dự án: bỏ khung bao ngoài, +44 trên header, trạng thái pill cuộn ngang nếu thiếu chỗ; mobile chỉ danh sách, không có Thẻ/Kanban. Giữ status/edit/progress/pin/archive/search/pagination; desktop vẫn Thẻ/Kanban/kéo đổi trạng thái. Panel mobile là region có tên thay tabpanel không có tab.

## Code và tài liệu

- `src/components/mobile-header-action.tsx`: portal UI dùng chung; handler/service ở module, không truy vấn dữ liệu tại shell.
- `src/components/app-shell.tsx`: slot header, hướng cuộn/focus cho nav.
- `src/app/globals.css`: nav52, input16 hiện hữu, pill/heatmap tokens, sheet animation và reduced motion.
- `src/modules/calendar/components/mobile-calendar.tsx`, `calendar.css`: load circles, giữ occurrence logic, bottom sheet.
- `src/modules/notes/components/notes-screen.tsx`, `notes.css`: nút +, search/filter và row gọn/history sheet.
- `src/modules/projects/components/projects-screen.tsx`, `projects.css`: nút +, filters, mobile list/desktop tabs và sheet.
- `src/modules/overview/overview.css`: selected tab xanh.
- Tests cập nhật contract mới: shell/install/calendar-design/mobile/mobile-refinements/workspace; thêm mobile-document-update cho6 yêu cầu.
- README, SOURCE_MAP, design-spec/tokens/component-map cập nhật override. Spec cũ giữ làm lịch sử, override mới có ưu tiên.

Không thay service/repository/schema/API, không thêm dependency/asset hoặc cache riêng. Giữ xóa.env.example đã có trước nhiệm vụ ngoài commit.

## Kiểm tra

- Lint, TypeScript, format và production build local đạt.
- Toàn bộ Playwright local:102 đạt,34 skip theo desktop/mobile. Bao gồm calendar recurrence/ICS/colors, tạo/sửa và rollback/version conflict, chấm công autosave/deleted activity, ghi chú ảnh/revisions/trash, hồ sơ dự án/attachments, overview dữ liệu thật, keyboard/navigation và các yêu cầu mobile mới.
- Sau khi chuyển màu/radius vào tokens và chốt nav max340 px, build lại và chạy12 kiểm tra mobile liên quan:12 đạt. Không có lượt thất bại trong các suite của đợt triển khai này.
- Đã kiểm tra ảnh và các luồng ở390×844,375×812,320×740. Test riêng xác nhận nav52 và hit44, ẩn khỏi viewport khi cuộn, hiện qua focus;5 mức lịch, selected vẫn giữ count color; note row<=60 px/một dòng và mở lại đủ nội dung; nút+ ởheader tạo dữ liệu thật trong kho test; filters hoạt động, mobile không Kanban; sheets ở đáy và giữ footer khi viewport thấp480 px. Safe-bottom0/34 px của nav được mô phỏng.
- Screenshot chạy trong Edge Chromium mobile emulation; fixtures chỉ trong browser test riêng, không dữ liệu tài khoản. Ảnh có2 ghi chú,1 dự án và10 mục lịch trải4 ngày để đối chiếu hình học/màu.
- Không có pageerror ở các test mobile-document-update đạt. Chưa kiểm chứng bàn phím/animation/safe area trên iPhone thật; Firebase Emulator không chạy lại vì server/DAL/schema không thay đổi. Vercel do người dùng quản lý triển khai.

## Screenshot

| Màn hình | 390×844 | 375×812 | 320×740 |
| --- | --- | --- | --- |
| Tổng quan | [Ảnh](mobile-document-update/overview-390.png) | [Ảnh](mobile-document-update/overview-375.png) | [Ảnh](mobile-document-update/overview-320.png) |
| Lịch theo số mục | [Ảnh](mobile-document-update/calendar-load-390.png) | [Ảnh](mobile-document-update/calendar-load-375.png) | [Ảnh](mobile-document-update/calendar-load-320.png) |
| Ghi chú | [Ảnh](mobile-document-update/notes-list-390.png) | [Ảnh](mobile-document-update/notes-list-375.png) | [Ảnh](mobile-document-update/notes-list-320.png) |
| Dự án | [Ảnh](mobile-document-update/projects-list-390.png) | [Ảnh](mobile-document-update/projects-list-375.png) | [Ảnh](mobile-document-update/projects-list-320.png) |
| Tạo lịch | [Ảnh](mobile-document-update/calendar-create-390.png) | [Ảnh](mobile-document-update/calendar-create-375.png) | [Ảnh](mobile-document-update/calendar-create-320.png) |
| Tạo dự án | [Ảnh](mobile-document-update/project-create-390.png) | [Ảnh](mobile-document-update/project-create-375.png) | [Ảnh](mobile-document-update/project-create-320.png) |

Bộ tháng/tuần/filter/day/form cuối và geometry: [thư mục](mobile-document-update/calendar/). Viewport0-safe mới: header lịch64/grid y233/preview y517; nav52; popup đáy thay vị trí giữa theo yêu cầu.
