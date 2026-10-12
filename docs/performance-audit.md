# Audit hiệu năng mobile — 12/10/2026

Phạm vi: xác định điểm nghẽn và đề xuất trước khi sửa, theo yêu cầu người dùng. Người dùng xác nhận chuyển phân hệ vẫn chậm khi quay lại phân hệ vừa mở. Chưa sửa code ứng dụng, cấu hình hoặc push trong lượt audit này.

## Kết luận và giới hạn

- Đã tái hiện điểm nghẽn CPU của lịch mobile: render lại quét toàn bộ occurrence cho từng ô ngày, lặp chuyển đổi Luxon. Hai chuỗi lặp cũng có thể tạo nhiều occurrence và gây chậm.
- Đã xác định các lượt chờ trong luồng cloud/lưu/xóa qua source. Chưa có timing của request đã đăng nhập trên điện thoại thật, nên chưa xác định tỷ trọng giữa xác thực, database, mạng và render trên production.
- MyOS đã có cache SWR dùng chung theo UID và cập nhật canonical sau commit. Không kết luận rằng ứng dụng thiếu cache hoặc mọi lần đổi phân hệ đều tải lại toàn bộ dữ liệu.
- Đo local với danh sách trống: chuyển lại phân hệ trong chuỗi thao tác ngắn nhanh. Kết quả này không đại diện cho Firestore trên Vercel.

## Cách đo

Source hiện tại: commit `93d8ad8`. Server Next.js production local ở port 3100, mode IndexedDB. Browser Edge Chromium headless, viewport 390 × 844, touch, context tách biệt. Fixture chỉ ghi vào IndexedDB của context kiểm tra; không đọc/ghi dữ liệu cá nhân cloud.

Hai cấu hình: máy hiện tại; mô phỏng CPU chậm 4× với mạng 150 ms latency, download 200.000 byte/s, upload 93.750 byte/s. CPU throttling không tương đương chính xác một mẫu iPhone hoặc Safari.

Timing tương tác tính từ `pointerup` đến khi locator nội dung xuất hiện và hai animation frame tiếp theo; đây là số đo chẩn đoán, chưa phải INP/RUM hoặc thống kê production p95. Mỗi disclosure có ba mẫu; bảng dùng trung vị. Thử chuỗi lặp chỉ throttle CPU, không thêm latency mạng vì thao tác hoàn toàn ở client.

| Tình huống | Máy hiện tại | CPU 4× / mạng mô phỏng |
| --- | ---: | ---: |
| Lần chuyển đầu vào Lịch, danh sách trống | 105 ms | 1.369 ms |
| Quay lại phân hệ đã mở, danh sách trống | 42–59 ms | 49–110 ms |
| Đóng/mở chi tiết ngày, 2 lịch không lặp | 25 ms | 64 ms |
| Đóng/mở chi tiết ngày, 30 lịch không lặp | 67 ms | 314 ms |
| Đóng/mở chi tiết ngày, 100 lịch không lặp | 176 ms | 906 ms |
| Đóng/mở chi tiết ngày, 2 chuỗi lặp hằng ngày → 64 occurrence trong vùng xem | Chưa đo | 670 ms |

Trong chuỗi quay lại nhanh ở local, không ghi nhận request RSC hoặc script mới. Lần đầu vào Lịch có request RSC và ba script bổ sung. Không dùng các kết quả local để kết luận cache route của bản cloud có cùng hành vi.

Đọc endpoint công khai production: `/api/data?kind=calendarEvents` khi không đăng nhập trả 401 trong 89 ms; header `x-vercel-id` ghi `sin1::sin1`. Endpoint này chạy tại Singapore trong phép đo, nhưng không đi qua xác thực Firebase/database của người dùng. Chưa xác minh vùng Firestore; môi trường hiện tại không cung cấp credentials để đọc metadata database. Không có bằng chứng server đang chạy ở Mỹ hoặc cold start là nguyên nhân chính.

## Các phát hiện trong source

### 1. Lịch mobile tính lại dữ liệu ngày quá nhiều — đã tái hiện

`src/modules/calendar/components/mobile-calendar.tsx`: occurrence đã memoize, nhưng `onDay()` lọc lại cả danh sách và parse `start/end/day` bằng Luxon cho ngày được chọn và từng ô trong lưới. Mở filter, mở preview hoặc chọn ngày gây render và lặp công việc này. Màu heatmap dựa trên số occurrence, không phải số bản ghi chuỗi.

`src/modules/calendar/components/calendar-screen.tsx` vẫn tính occurrence và DTO cho FullCalendar trong nhánh mobile; đồng thời import tĩnh FullCalendar và plugins desktop. Form tại `event-form.tsx` tính xung đột với dependency toàn bộ `input`, nên thay tiêu đề/mô tả cũng tính lại lịch. `conflictingEvents()` mở rộng toàn bộ chuỗi đề xuất và kiểm tra các khoảng thời gian; cần tối ưu mà vẫn giữ đầy đủ ngoại lệ, lịch qua ngày và phạm vi lặp.

### 2. Chuyển phân hệ có hai loại cache khác nhau

`src/lib/repository-cache.tsx`: cache dữ liệu SWR, dedupe 30 giây, cache riêng dưới layout theo UID; cache không persist/CDN. Dedupe 30 giây không phải TTL xác định dữ liệu còn mới. Mặc định SWR vẫn có thể revalidate khi mount/focus/reconnect. Khi đã có data, hook không chủ động chuyển về skeleton chỉ vì revalidation.

`src/components/app-shell.tsx`: Link có prefetch mặc định và `router.prefetch` khi pointer enter/focus. Touch intent có thể quá sát thời điểm bấm; không khẳng định prefetch chưa hoạt động. Calendar là route dynamic; hiện chỉ Dashboard có `loading.tsx`. Cache route Next.js và cache dữ liệu SWR độc lập, cần trace RSC khi tái hiện trên cloud trước khi chọn cấu hình cache route.

Tài liệu đối chiếu: [Next.js 15 prefetching](https://nextjs.org/docs/15/app/guides/prefetching), [SWR revalidation](https://swr.vercel.app/docs/revalidation).

### 3. Mỗi API cloud có đường chờ xác thực rồi database

`src/app/api/data/route.ts` gọi `authenticatedUser()` trước `readData/writeData`. Trong `src/lib/firebase/session.ts`: verify cookie, rồi `getUser` và đọc session Firestore song song để kiểm tra thu hồi/vô hiệu hóa/hết hạn. Đây là kiểm tra cần giữ; source đã tránh lấy UserRecord hai lần.

`CalendarScreen` gọi Calendar, Projects và Notes hooks ngay khi mount, kể cả chưa mở form liên kết. Khi cache trống/revalidate, có thể phát sinh bốn API đọc: events, settings, projects, notes. Các request được phép chạy đồng thời nhưng mỗi request vẫn kiểm tra quyền riêng. Shared layout thường được tái sử dụng khi chuyển trang; không khẳng định toàn bộ layout xác thực lại mỗi lần.

### 4. Danh sách cloud trả toàn bộ nội dung

`src/lib/firebase/data.ts`: danh sách đọc từng trang Firestore 250 mục tuần tự đến hết, có trần 5.000 mục/3 MB. Notes trả rich content nhưng bỏ revisions; Projects trả cả workspace/history; Calendar trả tất cả events. Phân trang 12 thẻ ở UI không phải phân trang server.

Chi phí tăng theo dung lượng và số lượng, chưa có bằng chứng tài khoản hiện tại đủ lớn để đây là nguyên nhân chính. Trường JSON `payload` đã có cấu hình miễn index trong `firestore.indexes.json`; trạng thái áp dụng production chưa xác minh. Không đề xuất thêm exemption như một phần đang thiếu trong source.

### 5. Lưu/xóa chờ commit; ghi chú có lượt chờ bổ sung

`src/lib/firebase/cloud-client.ts`: mutation đầu khi chưa có CSRF token cần GET `/api/auth` rồi POST `/api/data`. Token được cache 55 phút và dùng chung promise; không có GET CSRF riêng cho mọi lần lưu. Project service đã truyền baseline, nên luồng cập nhật thông thường không bắt buộc GET project trước POST.

`noteInTransaction()` đọc note rồi tối đa 20 revision documents. Hiện được dùng cả đọc chi tiết và mỗi mutation Notes; response canonical chứa revisions. `note-detail-screen.tsx` lưu nháp đang sửa trước thao tác ghim/chuyển thùng rác. Nếu có thay đổi chưa lưu hoặc save đang chạy, thao tác phải đợi save rồi mutation tiếp theo. Đây là chuỗi chờ có chủ đích để giữ nội dung.

Form/calendar/project/notes hiện chỉ báo lưu thành công sau server xác nhận. Debounce chấm công 700 ms và ghi chú 800 ms phục vụ autosave tuần tự; không quy các khoảng debounce này cho mọi nút lưu/xóa.

### 6. Ảnh/animation chưa được xác định là nguyên nhân chính

Ảnh header đã là WebP: Calendar khoảng 16 KB, Notes 125 KB, Projects 100 KB. Cover Tổng quan khoảng 430 KiB, animation transform và có cơ chế pause ngoài viewport/hidden/reduced motion. Có thể tối ưu decode/tải đầu, nhưng chưa có trace cho thấy ảnh gây delay lặp lại khi quay lại phân hệ.

## Thứ tự xử lý đề xuất — chưa triển khai

1. **Đo cloud trước khi đổi hạ tầng:** ghi thời gian tổng, xác thực, read/transaction và serialization bằng Server-Timing; đo tap→paint, RSC, data request và long tasks. Thu nhiều mẫu lần đầu/quay lại, Wi-Fi/4G, có/không nháp, quy mô chuỗi lịch. Không ghi cookie, UID, nội dung hoặc secrets vào telemetry. Xác minh Firestore region và cấu hình Vercel trước khi cân nhắc đổi vùng.
2. **Sửa điểm nghẽn Lịch đã có bằng chứng:** chuẩn bị chỉ mục occurrence theo ngày một lần cho vùng xem; parse thời gian một lần; tái sử dụng khi chỉ đổi trạng thái disclosure. Tách component FullCalendar desktop để tải khi cần, bỏ tính DTO desktop ở mobile. Giới hạn dependency kiểm tra trùng vào trường ảnh hưởng lịch, vẫn kiểm tra đầy đủ trước lưu. Bảo toàn end exclusive/timezone/ngoại lệ/occurrence nhiều ngày và thứ tự.
3. **Giảm chờ khi điều hướng:** thêm loading boundary phù hợp, phản hồi trạng thái điều hướng ngay; prefetch route có kiểm soát khi rảnh/intent trên touch. Tiếp tục hiển thị dữ liệu đã cache khi refresh nền. Nếu trace chứng minh remount revalidation thừa, điều chỉnh freshness theo module và invalidation, giữ refresh thủ công/tab khác/logout/401. Không bật persist/CDN hoặc cache quyền server.
4. **Giảm công việc cloud theo số đo:** trì hoãn danh sách liên kết khi chưa cần; chuẩn bị CSRF trước thao tác đầu bằng cơ chế hiện có. Với Notes, xem xét tránh tải lại toàn bộ nội dung revision khi chỉ đổi metadata, giữ lịch sử 20 bản và transaction/version check. Chỉ thêm list DTO/phân trang/range query nếu payload/quy mô chứng minh cần; đây là thay đổi hợp đồng repository, phải cập nhật selector Tổng quan và dữ liệu cũ, không cắt danh sách âm thầm.
5. **Phản hồi thao tác ngay:** pending đúng mục, tránh khóa cả màn hình nếu nghiệp vụ cho phép. Canonical cache tiếp tục cập nhật sau commit. Optimistic UI chỉ cân nhắc riêng thao tác đơn giản có rollback và kiểm thử race/version; không báo đã lưu trước xác nhận, không bỏ save nháp hoặc xác nhận xóa.

Không đổi framework major, schema hoặc chuyển sang browser Firestore/realtime toàn bộ chỉ để tối ưu. Không tự đổi vùng database, deploy, bật billing hoặc push ở giai đoạn audit.

## Tiêu chí kiểm tra sau khi được giao triển khai

- So sánh trước/sau trên cùng viewport 390 × 844 và 375 × 812, cùng fixture và throttle; thêm kiểm tra iPhone/Safari standalone thực tế.
- Ghi nhận trung vị và p95 cho route lần đầu/quay lại, đổi tab, mở/đóng ngày, lưu/xóa; phân biệt thời gian phản hồi UI và thời gian commit.
- Kiểm tra 2 chuỗi lặp, 30/100 sự kiện, lịch nhiều ngày, ngoại lệ chuyển buổi, bộ lọc, query liên kết và desktop FullCalendar.
- Giữ version conflict, autosave tuần tự, nháp khi lỗi, canonical sau commit, đổi tài khoản/401/logout, broadcast tab khác và thu hồi phiên.
- Chạy lint, typecheck, build và tests phù hợp khi có thay đổi implementation. Audit này chỉ chạy script chẩn đoán tách biệt, chưa có thay đổi code cần các kiểm tra đó.
