# Hướng dẫn agent cho MyOS

## Phạm vi hiện tại

**Cập nhật G5:** người dùng đã cho phép code Lịch/thời khóa biểu local và tiếp tục hoãn G2. G5 thêm FullCalendar, chuỗi tuần/ngoại lệ, liên kết Dự án/Ghi chú, xuất .ics và cài đặt lịch. Database version 3 giữ kho cũ. Nhắc hiện chỉ lưu cấu hình; gửi tự động/Zalo chờ G7. Hướng dẫn dưới về G3/G4 tiếp tục áp dụng cho G5.

Trước G5 đã hoàn thành **G4 — Ghi chú** sau G3 Dự án, đồng thời giữ G2 (Firebase Auth/xác thực/dữ liệu nền) ở cuối. G3/G4 dùng IndexedDB qua repository riêng; G4 có Tiptap, ảnh Blob, autosave, thư mục/nhãn, thùng rác, 20 revisions và liên kết dự án. Chưa có tài khoản hoặc đồng bộ cloud. Không tự bật Firebase, Auth, Zalo hoặc deploy trong giai đoạn này. Thực hiện các module tiếp theo khi được yêu cầu.

Yêu cầu mới của người dùng có thể chuyển giai đoạn; khi đó thực hiện trong phạm vi được giao, không hỏi lại xác nhận chỉ vì đoạn hướng dẫn này. Không thêm phân hệ ngoài 5 phân hệ đã thống nhất.

## Đọc trước khi thay đổi

1. README.md: trạng thái thực tế.
2. MYOS_ARCHITECTURE.md: phạm vi sản phẩm và quyết định kiến trúc.
3. docs/SOURCE_MAP.md và src/modules/README.md: cấu trúc thực tế, trách nhiệm và phụ thuộc.
4. docs/decisions/: quyết định bổ sung nếu có.
5. docs/IMPLEMENTATION_PLAN.md: thứ tự triển khai, phụ thuộc và tiêu chí hoàn thành.

AGENTS.md là tên file chuẩn để công cụ coding agent tìm thấy; không tạo một bản agent.md trùng nội dung.

## Công nghệ và phạm vi sản phẩm

- Framework: Next.js App Router; UI: React; ngôn ngữ: TypeScript.
- Database: Cloud Firestore; auth: Firebase Authentication.
- Ảnh/tệp: Cloud Storage for Firebase; host: Firebase App Hosting.
- Worker: Cloud Functions gen 2 và Cloud Scheduler; domain dùng chung.
- Chỉ có Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt.
- Tiếng Việt; timezone mặc định Asia/Ho_Chi_Minh; web responsive.
- Tìm kiếm, upload, thông báo và Zalo là khả năng bên trong 5 phân hệ.

## Ranh giới kiến trúc khi triển khai

- src/app điều phối route/layout và gọi service; không chứa mọi quy tắc nghiệp vụ trong page.
- src/modules chia theo nghiệp vụ. Mỗi module có components, actions, service, repository, schemas/types **khi cần**, không tạo lớp trống theo nghi thức.
- src/components chỉ chứa UI/layout dùng chung; không truy vấn Firestore.
- src/lib chứa hạ tầng và DAL xác thực phía web.
- packages/domain/src chứa TypeScript thuần, không phụ thuộc Next.js, React, Firebase Admin, secrets hoặc DOM.
- functions/src không import src/app hoặc UI. Logic domain dùng chung phải được bundle vào artifact worker.
- Module không gọi vòng nhau. Điều phối liên kết lịch/dự án/ghi chú qua service và hợp đồng dữ liệu rõ ràng.

Luồng đọc: Server Component → DAL/requireUser → service → repository → DTO.
Luồng ghi: form → Server Action → xác thực → Zod → service/transaction → repository.
Worker nhận job bằng transaction, gọi dịch vụ ngoài sau transaction.

Ngoại lệ tạm cho G3/G4 đã được người dùng chấp thuận: Client Component → service → repository IndexedDB. Không tạo Server Action gọi database trình duyệt. Schema và quy tắc thuần hiện nằm trong từng module; chuyển sang domain khi có người dùng chung. `src/lib/local/database.ts` quản lý version database, sự kiện và kết nối dùng chung. Notes repository điều phối ghi note/ảnh/liên kết Projects trong một transaction; Projects không import service Notes. Khi đổi sang Firebase phải thiết kế migration riêng, không giả định dữ liệu local đã đồng bộ.

Lịch G5 dùng Luxon với Asia/Ho_Chi_Minh, wall-clock `YYYY-MM-DDTHH:mm`, cả ngày `YYYY-MM-DD`, metadata UTC ISO; end exclusive. Exception giữ originalStart và chỉ override các fields đã đổi. Calendar repository ghi event/liên kết Projects nguyên tử, không chỉnh hạn mốc; Notes đọc liên kết từ Calendar. Xem [ADR 004](docs/decisions/004-local-calendar.md) trước khi thay quy tắc lặp/export. Không tạo Server Action gọi IndexedDB hoặc tự bật Firebase khi G2 còn hoãn.

## Next.js và TypeScript khi triển khai

- Page/layout mặc định là Server Components; chỉ dùng 'use client' cho phần tương tác cần thiết.
- Đánh dấu Firebase Admin, session và repository server bằng server-only.
- Route groups không thay URL; dùng Link cho điều hướng nội bộ.
- Root layout dùng html lang="vi"; layout vùng riêng có sidebar/header dùng chung.
- Dùng DTO có thể serialize qua ranh giới server/client; không truyền DocumentSnapshot, Admin SDK hay secrets.
- Đối chiếu API đúng phiên bản được khóa; params/searchParams xử lý theo API hiện hành.
- Có loading, empty, error và pending phù hợp; không dùng dữ liệu mẫu giả làm dữ liệu thật.
- TypeScript strict khi khởi tạo; hạn chế any, đặt tên mô tả nghiệp vụ, validate dữ liệu không tin cậy.
- Schema nghiệp vụ dùng chung đặt tại domain; schema form đặc thù ở module.
- Chọn bản stable tương thích Firebase App Hosting; không tự chuyển major framework trong thay đổi nhỏ.

## Code sạch, dễ đọc và dễ review

- Ưu tiên giải pháp đơn giản, tên biến/hàm rõ nghĩa, luồng xử lý dễ theo dõi; không dùng cách viết ngắn gây khó hiểu.
- Mỗi hàm/component có trách nhiệm rõ ràng; tách phần lớn khi có lý do thực tế, tránh tạo nhiều lớp hoặc abstraction không cần thiết.
- Giữ quy ước format và naming nhất quán; dùng component/helper chung cho hành vi lặp lại, không gom các nghiệp vụ khác nhau chỉ vì giống vài dòng code.
- Giữ cấu trúc gọn: không tạo README/thư mục giữ chỗ, không xé helper nhỏ dùng một chỗ thành file riêng. Module một màn hình đặt file ngay trong module; chỉ thêm components khi có nhiều thành phần thực tế. Giữ model/service/repository riêng khi có quy tắc và I/O khác nhau; không ép gom thành file lớn. Hướng dẫn module tập trung ở src/modules/README.md, kiểm thử ở tests/README.md.
- Thay đổi tập trung vào yêu cầu; tránh refactor, đổi tên hoặc format cả repository trong một thay đổi nhỏ.
- Comment giải thích lý do hoặc quy tắc khó thấy; không kể lại những gì code đã thể hiện.
- Xử lý lỗi có chủ đích, giữ dữ liệu đang nhập và báo lỗi dễ hiểu; không nuốt lỗi hoặc báo thành công khi chưa lưu được.
- Không để nút giả, handler rỗng, TODO quan trọng hoặc dữ liệu mẫu xuất hiện như chức năng đã hoàn thành.
- Khi bàn giao, nêu phần thay đổi, lý do, cách kiểm tra và giới hạn còn lại để người review dễ đánh giá.

## UI/UX và phong cách thị giác

Định hướng người dùng đã chốt: **đẹp, chuyên nghiệp, thân thiện, dễ dùng; ưu tiên giao diện light, màu tươi sáng và font dễ nhìn**. Dark mode là tùy chọn, không thay định hướng mặc định.

**Màu chủ đạo đã cập nhật theo ảnh tham chiếu:** xanh ngọc/turquoise kết hợp xanh navy. Dùng accent #00B8A9, primary #007F78 (cho nút/chữ cần tương phản), navy #07334A và nền light #F5F9FA; nền nhấn nhẹ #E6F7F5. Đây là bảng màu diễn giải từ ảnh, không phải mã màu thương hiệu đã xác nhận. Dùng tokens trong globals.css, không quay về tone xanh lá sage/olive cũ. Ảnh chỉ tham chiếu màu; giữ layout light và không tự thêm glow/gradient hoặc nội dung từ poster.

- Thiết kế theo nhu cầu dùng hằng ngày của MyOS; phân cấp nội dung rõ, khoảng trắng hợp lý và thao tác chính dễ tìm.
- Dùng nền sáng trung tính, một màu chủ đạo và số ít màu hỗ trợ; màu trạng thái nhất quán, chữ/icon có độ tương phản dễ đọc. Không dùng màu như dấu hiệu duy nhất để truyền đạt trạng thái.
- Tránh giao diện “AI slop”: không mặc định gradient tím/xanh, glow, glassmorphism, khối trang trí lớn hoặc thẻ bo tròn lặp lại mà không có mục đích. Mỗi phần trang trí phải phục vụ nội dung và nhận diện.
- Chọn font hỗ trợ đầy đủ dấu tiếng Việt, rõ ở cỡ chữ nội dung; giữ một hệ typography nhất quán. Không phối nhiều font hoặc dùng chữ quá nhỏ/mảnh để tạo vẻ hiện đại.
- Quản lý màu, font, spacing, radius và shadow bằng tokens dùng chung; không mỗi trang tự chọn một hệ style riêng.
- Nhãn nút rõ hành động; ưu tiên một hành động chính cho từng ngữ cảnh, giảm thao tác thừa. Icon-only button có tên truy cập và tooltip khi cần.
- Có trạng thái hover, focus, active, disabled và pending rõ; hỗ trợ bàn phím, label cho form và focus hợp lý sau đóng dialog.
- Thao tác xóa hoặc có nguy cơ mất nội dung cần xác nhận hoặc cơ chế hoàn tác phù hợp; không thêm xác nhận cho mọi thao tác thường ngày.
- Responsive theo nội dung thực tế; không chỉ thu nhỏ desktop. Mobile phải đọc được và bấm được, không có nội dung/nút chính bị che.

## Icon: bắt buộc dùng Lucide

- Dùng icon có sẵn từ [repo Lucide](https://github.com/lucide-icons/lucide/tree/main/icons); trong Next.js/React dùng package lucide-react khi bắt đầu implementation. [Tài liệu React chính thức](https://lucide.dev/guide/react).
- Không generate icon bằng AI, không tự vẽ SVG/path, không dùng emoji hoặc trộn bộ icon khác để thay icon giao diện.
- Import trực tiếp các icon cần dùng; không import toàn bộ catalog. Đối chiếu tên export với phiên bản package được cài.
- Giữ size, strokeWidth và màu nhất quán theo design tokens; chọn icon đúng ý nghĩa hành động, không thêm hiệu ứng trang trí riêng cho từng icon.
- Icon trang trí không thay nhãn; nút chỉ có icon phải có accessible name rõ ràng.
- Nếu thiếu icon phù hợp, tìm biểu tượng gần nghĩa trong Lucide hoặc dùng nhãn chữ; không tự tạo icon thay thế.
- Quy tắc này áp dụng cho icon giao diện; logo/favicon là tài sản nhận diện riêng, chưa được yêu cầu thiết kế và không tự generate.

## Ngăn lỗi giao diện và tương tác cơ bản

- Dùng layout flow, Flex/Grid trước khi dùng absolute/fixed; không chữa bố cục bằng margin âm hoặc z-index tùy tiện.
- Quy định lớp cho header, dropdown, dialog và toast; dùng overlay/portal thống nhất. Kiểm tra stacking context, clipping và pointer-events khi thành phần bị che hoặc không bấm được.
- Kiểm tra nội dung dài, dấu tiếng Việt, danh sách trống, nhiều mục, ảnh thiếu/lỗi và phóng to trình duyệt; tránh tràn ngang, chữ bị cắt và phần tử đè nhau.
- Kiểm tra font đã tải, fallback và line-height để tránh nhảy bố cục hoặc mất dấu tiếng Việt.
- Mọi nút có hành vi đúng: submit dùng type="submit", nút phụ trong form dùng type="button"; tránh gửi form ngoài ý muốn, gửi trùng hoặc thao tác bị overlay chặn.
- Sau thao tác lưu/xóa/kéo thả, UI phải khớp kết quả server; nếu thất bại giữ hoặc khôi phục trạng thái và báo rõ.
- Trước khi bàn giao UI, xem màn hình thật ở desktop và mobile; thử các nút chính, form, menu, dialog và bàn phím. Build thành công không thay việc kiểm tra giao diện.
- Dùng test tự động khi có giá trị cho hành vi quan trọng hoặc lỗi hồi quy; không viết test chỉ để xác nhận từng class CSS hay chi tiết triển khai.

## Tiết kiệm token và thao tác

- Đọc đúng file/phần liên quan; ưu tiên rg và tìm có phạm vi, tránh dump toàn bộ source hoặc đọc lại tài liệu không thay đổi.
- Gom các kiểm tra độc lập khi hợp lý; thao tác phụ thuộc kết quả phải làm tuần tự. Không gọi tool lặp lại nếu chưa có thay đổi hay thông tin mới.
- Sửa đúng phần cần thiết bằng patch; không viết lại toàn bộ file dài chỉ để thay vài dòng.
- Chỉ dùng dependency, abstraction hoặc công cụ mới khi giải quyết nhu cầu cụ thể; không tạo nhiều phương án/prototype mà yêu cầu chưa cần.
- Chạy kiểm tra phù hợp một lần sau thay đổi; chỉ mở rộng/chạy lại khi có lỗi, thay đổi mới hoặc nghi vấn chưa giải quyết. Không bỏ kiểm tra cần thiết để tiết kiệm token.
- Tra tài liệu khi API/phiên bản chưa rõ; không lặp tìm kiếm đã có kết quả đủ và còn phù hợp.
- Cập nhật tiến độ ngắn, nêu kết quả và việc tiếp theo; tránh lặp kế hoạch, báo cáo dài hoặc sao chép output tool vào câu trả lời.

## Dữ liệu, quyền và tích hợp

- Lấy UID từ session đã xác thực, không từ giá trị do client tự gửi.
- Kiểm tra quyền tại DAL, Server Action và Route Handler; layout/Proxy chỉ hỗ trợ điều hướng.
- Admin SDK bỏ qua Security Rules nên server phải kiểm tra quyền sở hữu.
- Browser trực tiếp dùng Firebase cho đăng nhập/upload; realtime chỉ thêm theo nhu cầu có rules rõ ràng.
- Không cache dữ liệu cá nhân ở CDN dùng chung. Không đưa secret hoặc nội dung riêng tư vào URL/metadata/log.
- Không commit key, credential, token hoặc file môi trường thật.
- Query Firestore có limit, indexes và cursor ổn định; không giả định có SQL/full-text search.
- Timestamp lưu nhất quán, đổi timezone tại ranh giới hiển thị; lịch lặp phải xử lý ngoại lệ/version.
- Autosave ghi chú cần chống ghi đè bản mới và giữ nháp khi lỗi.
- Không gọi Zalo hay gửi tin trong callback transaction vì callback có thể chạy lại.
- Tích hợp Zalo chỉ triển khai sau kiểm tra quyền gửi, phí và hạn mức thực tế; không dùng API không chính thức như một quyết định đã chốt.
- Không tạo cloud project, bật billing, deploy hoặc gửi tin thật chỉ vì đã tạo bộ khung.

## Kiểm tra và báo cáo

Ở giai đoạn tài liệu: kiểm tra đường dẫn, cấu trúc, link nội bộ và tính nhất quán; không chạy build/test giả khi chưa có project chạy được.

Khi có implementation: chạy lint, typecheck, build và kiểm thử phù hợp với thay đổi theo scripts thực tế trong package.json. Test logic lịch lặp, quyền truy cập, transaction và nhắc lịch bằng Emulator khi cần; tránh test chỉ sao chép implementation.

Báo rõ phần đã tạo, phần chưa triển khai và kết quả kiểm tra. Cập nhật MYOS_ARCHITECTURE.md, SOURCE_MAP và README liên quan khi đổi kiến trúc. Ghi quyết định có tác động vào docs/decisions; không viết lại tài liệu dài cho thay đổi giao diện nhỏ.
