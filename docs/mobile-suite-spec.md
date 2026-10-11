# MyOS — Đặc tả mobile cho các phân hệ còn lại

**Cập nhật bản xem thử v3:** ảnh biển thật trong header, nav 56 px, dialog giữa màn hình. [Thông số và ảnh kiểm tra](mobile-design-update.md) thay quy định v2 về ba thành phần này; chưa sửa ứng dụng MyOS.

11/10/2026 · **P: thiết kế để duyệt, chưa triển khai.** Bổ sung phạm vi theo yêu cầu dựng bản thiết kế của Tổng quan, Ghi chú, Dự án, Cài đặt và Chấm công. [Rules](design-rules.md), [tokens](design-tokens.md), [spec Lịch](design-spec.md) vẫn là hệ chung; tài liệu này chốt presentation đích của phần mở rộng. [Album](mobile-suite-review.md).

## 1. Hợp đồng toàn bộ bộ thiết kế

- Header min64 + safe top, title 22/28/600 và account44; gutter16, dưới360 dùng12. Một title phân hệ trên header; title record chỉ hiển thị trong detail hoặc trường title đang sửa.
- Navy/turquoise và màu semantic nguồn giữ nguyên. KPI dùng bốn màu hiện có; note pastel hiện có. Màu11 swatch từ calendarPalette là dữ liệu có sẵn, không là11 màu brand mới.
- Body15/23; field/editor16/24; section/card16/24/600; action14/20; metadata12/18. Glyph action20/nav18, inline metadata16; không dùng icon mới ngoài Lucide.
- Nút/tab/field min44; icon-only44×44; nav năm mục min56/label 11/16/radius18, margin8+safe-bottom. Nav giãn theo nhãn, reserve main dùng nav thực +34+safe-bottom.
- Section24, title→content12, card padding16, event row12. Library card không min-height212/220; metadata theo flow. Trục x16 là mép section và card; text trong card x32 là inset có mục đích.
- Sheet title18/26/600, close44, radius16 bốn góc, giữa viewport, max100dvh trừ32 và safe-top/bottom. Header và footer theo flow flex, body cuộn riêng, footer không che field cuối. Không thêm gesture hoặc hiệu ứng.
- Tất cả sample date/content/account/status chỉ minh họa. Không nối database/API; không gọi các preview này là dữ liệu/ứng dụng thật.

## 2. Tổng quan

**Hierarchy:** header Tổng quan → ngày hiện tại → dải4 số → nhóm Lịch hôm nay/Checklist/Dự án → nội dung theo lựa chọn hiện hành → ghi chú mới/ghim.

KPI giữ thứ tự Lịch hôm nay, Checklist cần làm, Dự án đang làm, Ghi chú. Một dải4 cột đều, gap8 (4 ở320), số28/34/600, nhãn12/18; lam/turquoise/cam/tím là màu hiện có, chữ cam navy. Cột căn trên và cùng chiều cao tự nhiên theo nhãn dài nhất, không ưu tiên cột đầu1,45fr như cũ. Không chuyển sang2×2, thêm quick actions, hero hoặc chart.

Tab lịch: section title + Xem tất cả → ngày đầy đủ → Hôm nay/prev/next → tối đa3 agenda trên mobile. Date controls chuyển thành2 hàng để giữ44, không cắt năm. Agenda surface trắng, padding ngang12; row min72, time72, title15/23/600, metadata12/18 với group và recurring icon có ý nghĩa. Không bỏ group/recurrence chỉ để giống row Lịch.

Tiến độ khi tab lịch giữ một dự án featured như source; tab dự án có tối đa3, checklist tab ẩn featured. Ghi chú mobile giữ một preview và Mới nhất/Đã ghim. Checklist sample0 dùng empty text hiện có, không bịa checklist mới. Mốc gần hạn vẫn ẩn mobile theo source, không thêm section.

**Giữ nghiệp vụ:** selector Tổng quan/ngày Việt Nam/hooks nguồn; click event mở chi tiết; checkbox thật khi có checklist; error từng nguồn không biến thành0; không tạo kho tổng hợp.

## 3. Ghi chú

**Library:** search riêng hàng → Từ ảnh/Tạo ghi chú cùng hàng → lý do disabled ảnh cloud → filters All/Pinned/Trash wrap → [Thư mục & nhãn khi có dữ liệu] → caption/count → cards.

Không vỏ panel bao toàn library làm cộng padding. Card width358 ở390, padding16/radius8/pastel; title16/24 tối đa2 dòng, excerpt15/23 tối đa3 dòng, metadata12/18 wrap, gap title–excerpt8 và metadata16. Không min-height. Empty-note và note có đoạn text khác chiều cao. Cần đọc đủ title/content khi mở detail.

Thư mục & nhãn chỉ xuất hiện khi có dữ liệu như source. Bản organize là fixture khác có2 folders / 2 tags để xem khu vực gập mở; không bật control trong fixture cơ bản không có folder/tag. Không thêm quản lý folder mới hoặc bộ lọc chưa tồn tại.

**Editor:** back thư viện → Ghim/Lịch sử/Thùng rác44 → surface editor với save state + Lưu ngay44 → title field16 → toolbar11 actions hit 44 wrap theo thứ tự → nội dung16/24 → updated/footer metadata → tổ chức ghi chú → liên kết dự án → lịch liên quan. Không lặp title ngoài field. Toolbar giữ Bold/Italic/Underline/Heading/List/ListOrdered/Checklist/Quote/Undo/Redo/ImagePlus; ảnh cloud disabled. Không thay Tiptap bằng editor HTML preview lúc code.

Lịch sử có sheet empty trong bộ ảnh; populated revision/select/restore chưa có bản ảnh riêng, phải giữ toàn luồng20 revisions/xác nhận khi implement. Library pinned/trash rỗng có thể xem bằng filters preview. Record trong thùng rác phải readonly, có Restore/Delete như source, chưa có bản record-trash riêng trong album.

**Giữ nghiệp vụ:** autosave hiện hữu/Lưu ngay/nháp/error/version/revisions/folders/tags/projectlinks/relatedcalendar/media limit, chế độ cloud/local. Thông báo lý do disabled là text bổ trợ action, không card mới.

## 4. Dự án

**Library:** search riêng hàng → Tạo dự án bên phải → filters5 trạng thái wrap → Thẻ/Kanban + Đã ghim → caption/statline gọn → card/columns. Không vỏ panel cộng padding. Filters wrap giúp đọc đủ cả5 nhãn, chấp nhận toolbar cao hơn scroller cũ; không tuyên bố card đầu luôn xuất hiện sớm hơn bản cũ.

Card: title16/24 và ⋯44 cùng hàng → status text12/18 → description15/23 → progress label/%12/18 + track6 → due12/18. Padding16, không fixed/min-height; menu ghi Ghim/Lưu trữ như nguồn, không thêm Delete Project chưa có. Card sample219 ở390 là chiều cao tự nhiên, không target cứng.

Kanban giữ3 cột Đang làm/Tạm dừng/Hoàn thành, xếp dọc trên mobile như source; có select trạng thái44 để không lệ thuộc drag. Không thay Kanban bằng carousel hoặc boardscroll ngang mới.

**Detail:** back → recordtitle18/26 → status/due → Ghim/Lưu trữ/Sửa → nội dung → hồ sơ → checklist/mốc → notes/calendar liên quan → tiến độ/dates → updates. Không empty blocks cao cố định. Hồ sơ6 mục dùng một hàng cuộn ngang có scrollbar, thay3 hàng buttons; active nhẹ + weight/pressed. Không thêm control hoặc bỏ Tài liệu/Tài nguyên/Phần cứng/Nhật ký&Tệp. Empty state của mỗi mục có thể xem bằng click. Form chỉnh hồ sơ/tài liệu/links/hardware/journal/attachment chưa được vẽ chi tiết, giữ chức năng source khi triển khai.

**Create/edit sheet:** fields giữ đủ tên*, description, status, color, start, due, progress-mode, manual-percent khi chọn manual. Một cột tại320–390 để date field đọc được. Footer Hủy/Tạo hoặc Hủy/Lưu thay đổi min44; field cuối cuộn lên trước footer. Không bỏ progressmode/version checks vì mẫu robot không có.

## 5. Cài đặt

Header →4 disclosure hiện có Tài khoản, Lịch & thời gian, Giao diện, Thông báo & dữ liệu. Summary min56/padding16/title16/24/chevron20; closed row56, gap12; opened body16. Không icon trang trí ở title, không switch thay disclosure.

Account sample mở: email mẫu → tên → đầu tuần → timezone read-only → Lưu tài khoản → Đăng xuất. Cloud sample đúng khả năng hiện hành. Khi local/noaccount, nội dung phải dùng Chưa đăng nhập/Xem trang đăng nhập như source, không giả cloud thật.

Calendar mở: starttime/endtime/reminder-not-enabled → groupname + color picker từng group → Add group → Save calendar. Chỉ một Save calendar ngoài nhóm, không thay bằng autosave. Swatch hit 44, glyph28, grid6cột ở375/390 và5cột ở320; có checked/focus; giữ đủ11 màu, custom color/HEX/preview. Tất cả group editors vẫn hiển thị khi mở section, không thêm disclosure cấp con hoặc giấu fields; do hit area tăng, form mở vẫn dài và cần cuộn. Không gọi đây là đã giải quyết toàn bộ độ dài settings.

Giao diện chỉ thông tin light/font như nguồn; không thêm theme switch chức năng chưa có. Notification/data chỉ Zalo chưa kết nối, Firestore hoặc Local theo mode; không switch bật nhắc giả. Native date/time/month render theo OS/browser (ảnh Chromium có English month/AM), không bịa control replacement chỉ để screenshot tiếng Việt hoàn hảo.

## 6. Chấm công trong Lịch

Header Lịch và submodule tabs cùng geometry với calendar v2 → Công việc/Tạo công việc → activity buttons → selected activity/edit → month title/arrows + month input → grid → save state. Không phân hệ thứ6.

Calendar tab row44+divider dướiheader 64. Grid7cột, weekday32, cell min72, padding6dọc/4ngang; number14/20, nội dung12/18 tối đa2 dòng. Ngoài tháng không thao tác; ô trong tháng rỗng giữ Plus hiện có, có nội dung primary-soft và chỉ text nội dung; không trạng thái Done/Rest/hour. Today underline. Nội dung đầy đủ trong sheet.

Day sheet: titleactivity/date18/26 → nội dungtextarea16/24 → save state12/18 → lỗi/conflict14/20 + actions khi có → footer Xóa44 và Xong44. Xóa nội dung chỉ hiện khi cóentry, cần confirm hiện hữu. Xong giữ submit/force-save hiện có, disabled khi pending/conflict/dataError; close vẫn theo luồng bảo vệ nháp. Không thêm nút Lưu ngày. Xung đột có text Bản nháp đang được giữ + Tải bản mới; không cho Xong commit bản cũ. Autosave700 ms tuần tự/version/error giữ source, không được thay bằng logic mock.

Activity form: name + color + Đóng/Lưu công việc. Edit variant có Xóa công việc44 tách ở cuối body trước footer, giữ nhãn/confirm/deletedAt/khóa mọi tháng; không nút phục hồi. Lưu công việc là commit activity riêng, không nhầm Lưu chấm công. Mẫu conflict không thực hiện save/network.

## 7. Ranh giới component và implementation

Giữ AppShell/Button/Input/NativeSelect/Textarea/Tabs/Card/Badge/SettingsSection/Radix, module components/Tiptap/Kanban/ProgressIndicator. Preview dùng DOM để trình bày design, không là source dùng thay service/repository/business UI. Các component map source ở [component-map](component-map.md).

Một bộ quy tắc đồng nhất không có nghĩa một SaveBehavior hoặc generic card cho mọi module. Route/data/auth/schema/cache/autosave/delete behavior không thay. Scope **thiết kế** được mở rộng; scope **code** vẫn chỉ màn đầu tiên sau review, không tự triển khai toàn bộ vì đã có album.

## 8. Các điểm cần duyệt, chưa chứng minh

P: KPI 4 màu ngang, card Notes theo nội dung, filters Project wrap5 nhãn, dossier scroll 1 hàng, editor bỏ title lặp, swatch 44/settingsform dài, activitydelete trong body. Bản v3 dùng ảnh biển Silas Baisch/Unsplash trong header; preview tải từ nguồn mạng. Favicon/logo vẫn cần nguồn riêng nếu yêu cầu hoàn thiện nhận diện; không tự generate.

Chưa vẽ tất cả form hồ sơ, recordtrash, populatedhistory, fixture nhiềuproject/note, pending/loading/auth/noaccount/error toàn module. Không coi thiếu ảnh trạng thái đó là bỏ chức năng. Chưa xác minh iPhone thật/safe area/keyboard/zoom 200/cloud version/conflict; kiểm tra preview chỉ chứng minh presentation trong Chromium với fixture. Sau duyệt cần QA app thật.
