# ADR 002 — Dự án local khi hoãn xác thực

Ngày: 06/10/2026. Trạng thái: áp dụng tạm cho G3 theo yêu cầu người dùng.

Người dùng chuyển G2 xuống cuối và chấp thuận IndexedDB để triển khai Dự án trước. Kiến trúc đích vẫn là Firestore + Firebase Auth + App Hosting.

## Quyết định

UI client gọi service qua interface `ProjectRepository`; adapter hiện tại dùng IndexedDB `myos-local`, version database 1, object store `projects`. Không tạo API/server action giả. Schema Zod kiểm tra dữ liệu đọc và ghi; record có `schemaVersion: 1` và `version` tăng sau mỗi mutation. Schema lỗi được báo cho người dùng, không tự xóa database.

Đọc version hiện tại, so sánh và ghi trong cùng readwrite transaction. Không await tác vụ khác trong callback transaction; chỉ resolve và phát sự kiện sau `transaction.oncomplete`. Cách dùng transaction theo [MDN IDBTransaction](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction) và [Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB).

Form giữ bản ghi lúc mở. Nếu tab khác đã cập nhật, từ chối lưu, giữ dữ liệu nhập và hướng dẫn tải lại. BroadcastChannel/custom event cập nhật màn hình; focus refresh hỗ trợ môi trường không có BroadcastChannel. Lỗi quota/quyền có thông báo và giữ form; không báo thành công trước commit.

Progress manual và checklist độc lập; checklist không có item eligible trả null. Mốc mặc định không tính vào tiến độ. Archive giữ dữ liệu và khóa chỉnh sửa; lịch sử giữ 100 mục gần nhất, item giới hạn 200. Description plain text; ngày dự kiến date-only, timestamps ISO. Module giữ quy tắc thuần đến khi có nhu cầu dùng chung trong domain package.

## Giới hạn và chuyển đổi

Dữ liệu theo browser profile/origin, không mã hóa bằng tài khoản, không đồng bộ thiết bị hoặc backup. Xóa browser storage sẽ mất dữ liệu. UUID hợp lệ nhưng không tồn tại trong local hiển thị trạng thái thiếu dữ liệu ở client; UUID sai định dạng trả Next.js 404. Server không thể xác định tài nguyên local.

Chưa có migration tự động sang Firestore. G2 cần thiết kế import/export, mapping owner UID, timestamp, version và transaction phía server rồi mới thay adapter; phải giữ hành vi form/conflict. Không deploy cloud chứa dữ liệu riêng tư trước auth/Rules. Liên kết lịch/ghi chú mới có arrays ID rỗng, chưa có chức năng liên kết.

## Kiểm chứng

E2E desktop/mobile kiểm tra CRUD/reload, search/filter/pagination, archive/restore, checklist/mốc/chuyển mode, bản nháp khi quota lỗi, xung đột hai tab, quyền storage và route thiếu dữ liệu. Kiểm tra lint, TypeScript, format và production build cùng suite trước bàn giao.
