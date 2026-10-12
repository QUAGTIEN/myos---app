# MyOS mobile — Component map v2

**Theo1.docx12/10/2026:** AppShell dùng chung hướng cuộn cho header/nav, slot thao tác mobile; MobileHeaderAction chỉ portal UI, handler thuộc NotesScreen/ProjectsScreen và dữ liệu không chuyển sang shell. MobileCalendar dùng count occurrence cho heatmap tròn; CalendarDialog/ProjectDialog/Notes history dùng bottom sheet. NotesScreen giữ bộ lọc/query và liên kết detail, chỉ thu gọn row. ProjectsScreen mobile chỉ danh sách, desktop giữ layout selection. [Báo cáo](mobile-document-update-review.md).

**Bổ sung 12/10/2026:** AppShell sở hữu header theo hướng cuộn, vẫn dùng header/nav hiện hữu. Overview giữ3 button lọc nội dung, thêm phân tách spacing. MobileCalendar sở hữu disclosure ngày với aria-expanded/aria-controls; không thêm kho dữ liệu hoặc thay popup ngày. CalendarDialog/EventForm và ProjectDialog giữ Radix/validation/pending/luồng lưu; form dự án có wrapper cuộn để giữ footer và heading. Quy tắc cỡ chữ chung bao phủ auth/portal/editor. [Báo cáo](mobile-refinements-review.md).

**12/10/2026:** đã được cho phép code pilot Lịch v3; [báo cáo triển khai ứng dụng thật](calendar-implementation-review.md). Thiết kế các route còn lại chưa rollout.

**Cập nhật bản xem thử v3:** ảnh biển thật trong header, nav 56 px, dialog giữa màn hình. [Thông số và ảnh kiểm tra](mobile-design-update.md) thay quy định v2 về ba thành phần này; chưa sửa ứng dụng MyOS.

11/10/2026 · Đề xuất sau audit, chờ duyệt. [Rules](design-rules.md) · [spec](design-spec.md) · [tokens](design-tokens.md). Tên role không đồng nghĩa thêm file/component mới.

## 1. Hierarchy của màn Lịch đích

~~~text
AppShell hiện hữu
├ Header: title / account
├ Main / CalendarScreen
│ ├ Tabs: Lịch / Chấm công (chưa dựng đích Chấm công)
│ └ MobileCalendar
│   ├ Month heading / arrows
│   ├ Options: view group / scope summary / search / tools
│   ├ Filters mở: search / date / group
│   ├ Weekdays + calendar day buttons + event dots
│   └ DayPreview: heading + count / add / first event / open-day
├ BottomNavigation:5 route + label
└ CalendarDialog portal: day title / close / all entries / add
~~~

## 2. Reuse và ownership

| Role / loại | Source hiện hữu | Thay đổi trình bày sau duyệt | Giữ |
| --- | --- | --- | --- |
| Shell / navigation | [app-shell.tsx](../src/components/app-shell.tsx), [globals.css](../src/app/globals.css) | D01/02/09: gutter/header/nav contract | Route/account, semantics, desktop |
| Button / icon button | [button.tsx](../src/components/ui/button.tsx) | D03/08/12: vùng44, glyph đúng render, states | Handler/type/pending/disabled/name |
| Input / select / textarea | [UI](../src/components/ui) | D10: field 44/input 16 áp cả portal | Value/validation/draft/label |
| Submodule Tabs | [tabs.tsx](../src/components/ui/tabs.tsx) | Underline/tab 44 | Keyboard/selected/attendance busy |
| Calendar view button group | [mobile-calendar.tsx](../src/modules/calendar/components/mobile-calendar.tsx) | Width128, trigger44, options cùng hàng | aria-pressed, không đổi thành Radix Tabs |
| Month/day grid / custom calendar | Cùng MobileCalendar | Row48, circle 32, todayunderline, no cell border | expandEvents, firstDay, bounds, max3dots, date selection |
| Scope/filter/tools | MobileCalendar + [calendar-screen.tsx](../src/modules/calendar/components/calendar-screen.tsx) | Gộp hàng view/summary/tools, filters một cột | Group/search/date, menu tùy state, .ics/settings |
| DayPreview / custom content | MobileCalendar | Bỏ enclosing card; row surface + colored time label | Chỉ event đầu, count, add, open-day |
| Event row / button+text | entry trong MobileCalendar | Time72, title15/23, chevron18, min64 | Click mở chi tiết, completed/textcontrast, full title |
| Sheet / overlay | [dialogs.tsx](../src/modules/calendar/components/dialogs.tsx), Radix | Padding16/close44/title18/radius16 bốn góc; centered | Trap/return/Escape/scrim, allentries/add |
| Feedback / text | [page-ui.tsx](../src/components/page-ui.tsx) + module states | Typography/state theo role | Retry thật; error/loading/empty riêng |

Không viết mới calendar business logic hoặc tạo date picker để thay component. Row entry dùng ở preview và sheet là ứng viên reuse ngay trong MobileCalendar; không bắt buộc file riêng. Event time badge là text, không button con trong button.

## 3. Component toàn app có quy tắc nhưng chưa triển khai

Card/Badge giữ semantic nhưng bỏ min-height desktop trên mobile library. SettingsSection giữ disclosure/fieldvalue. Tiptap giữ editor/revisions/autosave; Attendance giữ content-only 700 ms/nháp/xóa khóa mọi tháng; Kanban giữ drag và selectstatus. ProgressIndicator giữ % thật. Module ownership/domain/repository/SWR/auth không đổi.

Tabs, filters và view group khác semantics; không gom vào generic switch chỉ vì có active style. Form cùng frame không đồng nghĩa cùng savebehavior. Không tạo generic business card gom notes/projects/calendar.

## 4. Asset và phân loại

| Loại | Dùng trong Lịch v2 |
| --- | --- |
| Image asset | Ảnh biển thật Silas Baisch/Unsplash trong header; không ảnh phía sau field/grid hoặc screenshot giả UI |
| Icon | Lucide ChevronLeft/Right, Search, MoreHorizontal, Plus, X và5nav hiện hữu |
| Text | Title/month/day/event/time/count/labels theo data thật lúc code |
| Chart | Không thêm chart; calendar grid là lịch nghiệp vụ |
| Navigation | Shell routes, submodule tabs, view group; không thêm mục |
| Button | Arrows/search/tools/day/add/event/open-day/close |
| Card | Event surface hiện hữu đổi style, filters khi mở; không thêm calendar card |
| Overlay | Existing day sheet/menu; không swipe/snap/haptic giả định |

Không thiếu asset bắt buộc cho pilot. Favicon/logo nguồn còn thiếu ngoài phạm vi; không generate. Assets robot/rừng/carbon của mẫu không cần bổ sung vì không nằm trong thiết kế MyOS.

## 5. Rollout boundary

Đích là một shell rule dùng chung, không nhánh permanent theo tab. Triển khai một màn để review phải giữ ranh giới pilot rõ; không mặc nhiên thay global shell ở4 route khác. Code cũ bản thử còn trong workspace và chưa được duyệt, không phải căn cứ sizing v2. Preview ở docs/mobile-design là tài liệu độc lập, không import production. Sau user duyệt mới chọn cách tích hợp nhỏ nhất có thể review.

## 6. Bổ sung cho bộ thiết kế mở rộng

Theo yêu cầu mới, bản đích cho các phân hệ còn lại ở [suite spec](mobile-suite-spec.md), [album](mobile-suite-review.md). Scope thiết kế mở rộng, scope implementation vẫn giữ gate một màn.

| Module / role | Component nguồn | Ownership trình bày P | Giữ nghiệp vụ |
| --- | --- | --- | --- |
| Tổng quan / KPI, nội dung tab | [overview-screen.tsx](../src/modules/overview/overview-screen.tsx) | Dải4 cột đều, panel heading/gutter, agenda72/time72 | Selector/ngàyVN/hooks nguồn, tab, tối đa3event/1featured/1note |
| Notes / library, card, organize | [notes-screen.tsx](../src/modules/notes/components/notes-screen.tsx) | Gutter/card theo nội dung, filterwrap, conditionalorganize | Search/folders/tags/pinned/trash/pagination |
| Notes / editor/history | [note-detail-screen.tsx](../src/modules/notes/components/note-detail-screen.tsx), [rich-editor](../src/modules/notes/components/rich-editor.tsx), [history](../src/modules/notes/components/note-history.tsx) | Title field một lần, action/tool44, portal sizing | Tiptap/autosave/nháp/revisions/media/links |
| Projects / card, Kanban | [projects-screen.tsx](../src/modules/projects/components/projects-screen.tsx) | Filterwrap/view44/card tự nhiên, menu44 | Trạng thái/drag/select/pin/archive/progress |
| Projects / detail/dossier/form | [detail](../src/modules/projects/components/project-detail-screen.tsx), [workspace](../src/modules/projects/components/project-workspace.tsx), [dialog](../src/modules/projects/components/project-dialog.tsx) | Dossier1 hàngcuộn, empty theo flow, field/body/footer | Tất cả hồ sơ/checklist/mốc/related/version/attachment modes |
| Settings / disclosure, controls | [settings](../src/modules/settings/settings-screen.tsx), [calendar-settings](../src/modules/calendar/components/calendar-settings.tsx), [color-picker](../src/modules/calendar/components/color-picker.tsx) | Summary 56, fields44, swatchhit 44 +glyph28, inline save | Profile/settings version, noaccount/local/cloud, đủpalette/HEX |
| Attendance / grid/day/activity | [attendance.tsx](../src/modules/calendar/components/attendance.tsx) | Cellmin72, content12/18, daytextarea16, actions44 | Content-only, sequential700 ms/version/draft/deletedAt |

Các role trên ưu tiên sửa style/layout component hiện hữu. Không tạo một module thứ6 hoặc import preview vào production. Các overlay prototype dùng DOM độc lập chỉ để xem; implementation giữ Radix/focus-return hiện có.
