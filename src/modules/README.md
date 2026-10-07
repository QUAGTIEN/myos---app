# Phân hệ MyOS

Ứng dụng chỉ có 5 phân hệ. Tài liệu này mô tả mã đang chạy; kiến trúc cloud và kế hoạch nằm ở MYOS_ARCHITECTURE.md và docs/IMPLEMENTATION_PLAN.md.

| Phân hệ | Route | Source | Trạng thái |
| --- | --- | --- | --- |
| Tổng quan | /dashboard | overview/overview-screen.tsx | Tổng hợp local từ G3–G5 |
| Lịch | /calendar | calendar/ | G5 local |
| Dự án | /projects, /projects/[projectId] | projects/ | G3 local |
| Ghi chú | /notes, /notes/[noteId] | notes/ | G4 local |
| Cài đặt | /settings | settings/settings-screen.tsx | Cài đặt lịch local; tài khoản/cloud còn preview |

## Cách tổ chức

- app chỉ điều phối route/layout, validate tham số và gọi màn hình của module.
- model.ts chứa schema/types/quy tắc dữ liệu; service.ts xử lý ca sử dụng; repository.ts truy cập IndexedDB và kiểm tra version trong transaction.
- Hook đặt cạnh service; Notes gom vào hooks.ts với useNotes và useNoteDraft riêng để giữ vòng đời đọc dữ liệu/autosave.
- components chỉ dùng ở module có nhiều màn hình/form/editor. Module có một màn hình đặt file ngay trong thư mục module.
- Không tạo actions, DTO, schemas, types, index.ts hoặc package domain chỉ để đủ cây thư mục; tách khi có trách nhiệm hoặc người dùng chung thật.
- CSS nằm cùng module; components/page-ui.tsx giữ các thành phần trang dùng chung; lib/local-database.ts quản lý kết nối/version/sự kiện.
- Upload, tìm kiếm, thông báo là khả năng trong 5 phân hệ, không tạo thêm menu. Hiện chưa có Auth/cloud/worker.

## Dự án

Ca sử dụng: Thẻ/Kanban, tạo/sửa dự án, nội dung, checklist, mốc, cập nhật, tiến độ và hồ sơ chi tiết.

Hồ sơ ở components/project-workspace.tsx: mục tiêu, tài liệu plain text, liên kết HTTP(S), linh kiện và chi phí VND tùy chọn, nhật ký/kiểm thử, tệp Blob tối đa 20 MB/tệp và 50 tệp/dự án. workspaceSchema default đọc được dự án cũ. Database v4 thêm projectAttachments; metadata/Blob ghi-xóa cùng transaction Projects với version check. Bản nháp hồ sơ giữ khi lỗi/conflict; dự án lưu trữ chỉ đọc. Xem [ADR 005](../../docs/decisions/005-timetables-project-dossiers.md).

G3 đã triển khai bằng IndexedDB local, chưa có Firebase hoặc auth. Checklist thuộc dự án, không mở thêm phân hệ công việc độc lập.

- `model.ts`: schema Zod, kiểu dữ liệu, ngày và tiến độ; không có item được tính thì tiến độ checklist là chưa có dữ liệu, không phải 100%.
- `repository.ts`: database `myos-local`, store `projects`, read/write transaction, kiểm tra version và thông báo cho tab khác.
- `service.ts`: tạo/sửa, ghim, lưu trữ/khôi phục, checklist/mốc, sắp xếp và lịch sử 100 cập nhật gần nhất.
- `use-projects.ts`: đọc local, cập nhật sau commit, refresh khi focus/tab khác thay đổi, loading/error/pending.
- `components/`, `projects.css`: danh sách, chi tiết, form và giao diện responsive.

Nội dung dự án là plain text. Ngày dự kiến lưu `YYYY-MM-DD`; timestamps ISO hiển thị Asia/Ho_Chi_Minh. Tiến độ thủ công được giữ khi chuyển sang checklist. Mốc mặc định không tính vào tiến độ, có thể bật trong form. Lưu trữ giữ dữ liệu và chuyển chi tiết sang chỉ đọc; không có xóa dự án vĩnh viễn.

Form giữ snapshot/version lúc mở. Tab khác ghi trước sẽ khiến lưu bị từ chối và giữ bản nháp. Có tối đa 200 item/dự án; phân trang danh sách local 12 mục, không phải Firestore cursor. Dữ liệu theo browser/origin, có thể mất khi xóa browser storage. Chưa có export/backup/migration cloud. G4/G5 đã nối relatedNoteIds/relatedEventIds qua transaction repository Notes/Calendar. Detail có lịch liên quan và tạo lịch từ mốc; thay giờ lịch không đổi hạn/tiến độ mốc.

Kiểm thử: `tests/e2e/projects.spec.ts`; quyết định: [ADR G3](../../docs/decisions/002-local-projects.md).

## Ghi chú

Ca sử dụng: văn bản/rich text, ảnh, thư mục/tag, ghim, autosave, revisions và thùng rác.

G4 đã triển khai local; Firebase Storage/Auth chưa được dùng. Tiptap 3.31.4 lưu JSON/schemaVersion, không lưu HTML hoặc Blob URLs. Node localImage tham chiếu attachmentId; ảnh Blob ở IndexedDB. PNG/JPEG/WebP/GIF được kiểm tra decode, tối đa 5 MB/tệp, 20 ảnh/nội dung. Chọn, dán, drop ảnh hoặc tạo ghi chú từ ảnh. OCR/AI chưa triển khai.

- `model.ts`: schema Zod, metadata, revisions, rich nodes và helper nội dung.
- `repository.ts`: đọc/ghi Notes và ảnh, điều phối liên kết Projects nguyên tử cùng transaction.
- `service.ts`: tạo/lưu/ghim/thùng rác/xóa vĩnh viễn, ảnh và retention.
- `hooks.ts` / `useNoteDraft`: debounce 800 ms, serialize các lần lưu, snapshot/version, giữ nháp trong bộ nhớ khi lỗi, manual retry.
- `hooks.ts` / `useNotes`: đọc và refresh sau commit/focus/tab khác.
- `components/`: thư viện, workspace, rich editor và lịch sử; khối ghi chú liên quan nằm trong project-detail-screen.tsx; `notes.css` là style module.

Tối đa 20 phiên bản trước, gồm title/content/folder/tags/projectIds. Ảnh được giữ khi nội dung hiện tại hoặc revision còn tham chiếu; dọn ảnh không còn tham chiếu trong cùng transaction. Thùng rác không tự hết hạn. Xóa vĩnh viễn bỏ note, revisions, ảnh và liên kết dự án. Thư mục là tên trên metadata (đổi/để trống tại ghi chú), nhãn tối đa 10; không có hệ thư mục lồng nhau.

Khi tab khác cập nhật, bản sạch được refresh; bản đang sửa được giữ và tạm dừng autosave. Có sao chép văn bản, tải bản mới với xác nhận và Lưu ngay để thử lại. Nháp lỗi chỉ ở bộ nhớ trang, không phải backup; xóa browser storage mất mọi dữ liệu. Browser/origin khác không đồng bộ. UUID sai trả HTTP 404; UUID hợp lệ nhưng thiếu local hiển thị trạng thái trống phía client.

G5 bổ sung Lịch liên quan trong sidebar và tạo lịch gắn ghi chú. Liên kết event→note là nguồn duy nhất, không thêm bản sao eventIds vào note. Trash/xóa note không xóa lịch; Calendar báo liên kết không khả dụng.

Kiểm chứng trong `tests/e2e/notes.spec.ts`; quyết định tại [ADR G4](../../docs/decisions/003-local-notes.md).

## Lịch

Ca sử dụng: tab Lịch xem ngày/tháng/năm, tab Công việc lập nhiều bộ thời khóa biểu tuần/tháng; lịch lặp tuần, ngoại lệ, đánh dấu, nhắc và xuất .ics.

calendar-book.tsx giữ lưới năm và form bộ lịch. Groups hiện hữu là bộ lịch lưu riêng: tên/màu, sự kiện theo groupId; tạo nhanh dùng bộ đang chọn. Sao chép nhóm và masters/ngoại lệ nguyên tử; bản sao cùng khoảng ngày có ID riêng, không mang liên kết và trạng thái hoàn thành từ bản gốc. Chưa có dịch toàn bộ bộ lịch sang kỳ mới. Tab đang chọn được giữ trong sessionStorage; nội dung vẫn ở IndexedDB.

G5 đã triển khai local, G2 hoãn. `model.ts` Zod/timezone; `recurrence.ts` mở rộng tuần hữu hạn/ngoại lệ; `service.ts` mutations; `repository.ts` IndexedDB version 4 và liên kết Projects nguyên tử; `ics.ts` iCalendar; `use-calendar.ts` đọc/error/cập nhật tab; `components` FullCalendar, form, chi tiết, dialogs.tsx (khung dialog và xuất lịch), settings và lịch liên quan. CSS scoped `schedule-*`.

Việt Nam UTC+7; end exclusive, form cả ngày hiển thị ngày cuối inclusive. Chuỗi nhiều thứ tối đa 5 năm có ngày kết thúc, mỗi buổi tối đa 7 ngày. Exception giữ originalStart và chỉ override fields đã đổi. Đổi lịch gốc reset ngoại lệ sau xác nhận. Hủy soft, hoàn thành riêng từng buổi; lỗi/version conflict giữ nháp, kéo/resize rollback.

Xuất tối đa 367 ngày với UID/RRULE/EXDATE/RECURRENCE-ID/VTIMEZONE, Unicode folding 75 octets. Chỉ lưu reminder config, chưa gửi thông báo/Zalo. Lặp ngày/tháng, sửa từ buổi này trở đi, print/PDF còn G8. Không có Auth/cloud/migration. Xem [ADR G5](../../docs/decisions/004-local-calendar.md) và hai test calendar trong tests/e2e.

## Tổng quan

overview-screen.tsx dùng useCalendar/useProjects/useNotes để đọc/cập nhật từng nguồn và dùng lại form/service cho tạo nhanh, checklist và lịch hẹn. model.ts tổng hợp dữ liệu thuần: ngày Việt Nam, lặp/ngoại lệ/qua đêm, nhiệm vụ/mốc chưa hoàn thành trong dự án chưa lưu trữ và chưa hoàn thành, dự án active, ghi chú ngoài thùng rác. Không lưu bản sao số liệu. Cả ngày dùng end exclusive; lịch hôm nay vẫn là hôm nay khi điều hướng ngày trong panel. Mỗi khối có loading/error/retry; số liệu lỗi hiển thị không khả dụng. overview.css quản lý panel trắng, màu nhấn và lưới responsive. Ghi chú có bộ lọc mới/ghim; các danh sách có giới hạn hiển thị và liên kết tới module nguồn. Tìm kiếm chung và thông báo tích hợp còn là kế hoạch. Kiểm chứng trong tests/e2e/overview.spec.ts.

## Cài đặt

settings-screen.tsx dùng CalendarSettingsPanel của module Lịch: nhóm/tên/màu, giờ hiển thị và nhắc mặc định được lưu IndexedDB có kiểm tra version. Timezone Việt Nam và đầu tuần Thứ Hai. Tài khoản, theme, cloud và gửi nhắc chưa hoạt động; reminder chỉ là cấu hình.
