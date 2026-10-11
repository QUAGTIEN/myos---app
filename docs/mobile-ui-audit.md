# MyOS mobile — Audit giao diện hiện tại

Ngày 11/10/2026 · Kết quả audit, chưa phải bộ thiết kế đích.

## 1. Kết luận

MyOS đã có nền nhận diện chung: turquoise/navy, Be Vietnam Pro, Lucide, năm mục điều hướng, nền sáng và component form dùng lại. Điểm yếu chính là **các phân hệ chưa cùng tuân theo một quy tắc về bố cục, mật độ và kích thước tương tác**. Các màn hình đang sử dụng nhiều padding, cấp chữ và chiều cao nút khác nhau; card thư viện còn giữ chiều cao tối thiểu kiểu desktop. Thay màu header hoặc vài thông số của Lịch chưa giải quyết được các vấn đề này.

Bản Lịch thử hiện có giúp kiểm tra kỹ thuật nhưng chưa được người dùng duyệt về thiết kế. Header/nav riêng của bản thử tạo thêm khác biệt với các màn hình khác. Không dùng bản thử làm chuẩn để nhân rộng.

## 2. Phạm vi và bằng chứng

Đã đối chiếu:

- Bốn screenshot ứng dụng hiện tại do người dùng gửi: [Tổng quan](mobile-ui-audit/original-overview.png), [Lịch cũ](mobile-ui-audit/original-calendar.png), [Ghi chú](mobile-ui-audit/original-notes.png), [Dự án](mobile-ui-audit/original-projects.png). Bản gốc được lưu nguyên byte; status bar, thanh địa chỉ và thanh công cụ trình duyệt không thuộc app.
- Source shell, tokens, UI primitives, năm module, form/dialog/editor và các quy tắc CSS mobile.
- Runtime production build local tại 390 × 844 và 375 × 812: năm route, tab Chấm công, Cài đặt gập/mở, form dự án, chi tiết dự án, editor ghi chú. Có 19 ảnh/trạng thái được ghi nhận; các trạng thái bổ sung form/detail chủ yếu kiểm tra tại 390.
- Bản Lịch thử được ghi riêng là `calendar-pilot`; runtime hiện không còn nguyên style Lịch cũ. Đánh giá Lịch cũ dùng ảnh người dùng gửi, không gọi ảnh bản thử là bản cũ.

**Đ**: số đo DOM/source chính xác trong môi trường kiểm tra. **Q**: quan sát từ ảnh, nhận định về hierarchy/mật độ. **C**: cần xác minh thêm. **H**: hướng cần giải quyết ở bước thiết kế tiếp theo, chưa phải thông số đã duyệt.

Runtime sử dụng Microsoft Edge/Chromium, context riêng, local mode, dữ liệu fixture: một dự án, hai ghi chú, ba lịch hẹn và nội dung chấm công. Dữ liệu được tạo trong browser kiểm thử; không truy cập/sửa dữ liệu tài khoản thật. Từ ảnh được phép dùng trong local; screenshot cloud của người dùng có thể hiển thị disabled đúng phạm vi sản phẩm. Không coi khác biệt đó là lỗi dữ liệu.

[Số đo chi tiết](mobile-ui-audit/measurements.json) gồm vị trí/kích thước/cỡ chữ/padding/radius của các phần tử. Ảnh full-page giữ vị trí fixed nav theo viewport lúc chụp; nav có thể xuất hiện giữa ảnh dài. Đây không phải bằng chứng nội dung bên dưới không thể cuộn tới. Không suy ra viewport CSS từ chiều cao screenshot iPhone có chrome trình duyệt.

## 3. Bản đồ nhất quán giữa các màn hình

Các số dưới đây đo ở viewport 390 CSS px; header của bản cũ khác bản thử Lịch được ghi rõ.

| Vai trò | Tổng quan | Ghi chú | Dự án | Cài đặt | Lịch thử / Chấm công |
| --- | --- | --- | --- | --- | --- |
| Header | 72; brand 26, title nội dung 27 | 72; title 25 | 72; title 25 | 72; title 25 | Lịch thử 64/title 22; Chấm công 72/title 25 |
| Lề main | 0; panel x=12 | 14; card x=29 | 14; card x=27 | 14; card x=14 | Lịch thử 16; Chấm công 14 |
| Padding card/panel | 14 | Card 14, container khác 12/14 | Card 14, container 12 | 12 dọc/16 ngang | Preview 16; sheet Chấm công 20/18 |
| Gap giữa khối | Panel 12 | Card 10 | Card 10 | Nhóm 10 | Preview cách grid 24 |
| Title nội dung | Section 14/21 | Card 16/25,6 | Card 17/27,2 | Heading 16/24, nút nhóm 15 | Preview 16/24; sheet Chấm công 18/27 |
| Nút thao tác nổi bật | Hôm nay 34 cao | Tạo ghi chú 44, chữ 12 | Tạo dự án 40, chữ 14 | Lưu cài đặt lịch 44 | Nút thêm ngày 44; Xong 44, chữ 11 |
| View/filter | Tab 46; lọc ghi chú 40 | Lọc chính 40, chữ 11 | Filter 40; Thẻ/Kanban trigger 27 | Disclosure 40 trong card 66 | Lịch/Chấm công trigger 43; view Lịch thử 44 |
| Nav chung | 70, nhãn 11 | 70, nhãn 11 | 70, nhãn 11 | 70, nhãn 11 | Lịch thử 72, nhãn 12; Chấm công 70/11 |

Khác biệt về vai trò có thể hợp lý: số liệu lớn hơn metadata, card ghi chú có pastel, lịch hẹn có màu theo bộ lịch. Audit tập trung vào **cùng vai trò nhưng khác quy tắc**, không yêu cầu mọi thứ cùng kích thước hay cùng hình thức.

## 4. Findings và thứ tự ưu tiên

Ưu tiên trong tài liệu này: **P1** ảnh hưởng trực tiếp thao tác/đọc; **P2** ảnh hưởng nhất quán và hierarchy; **P3** hoàn thiện phụ trợ. Đây là thứ tự xử lý thiết kế, không phải phân loại lỗi bảo mật.

| ID | Ưu tiên | Bằng chứng | Vấn đề và ảnh hưởng | Hướng xử lý ở bước thiết kế |
| --- | --- | --- | --- | --- |
| A01 | P1 | Đ: nút tạo ghi chú 44, tạo dự án 40; editor ghi chú 32/34; Thẻ/Kanban 27 | Chưa có chính sách kích thước vùng bấm mobile theo vai trò. Cùng thao tác quan trọng có kích thước khác nhau; nhóm dày nhỏ khó thao tác chính xác hơn | Chốt chiều cao/vùng bấm cho primary, secondary, icon, tabs, editor; tách kích thước glyph khỏi hit area |
| A02 | P1 | Đ: nút Xóa Chấm công ≈21,9 × 36, chữ 11; Xong 44 nhưng chữ 11 | Thao tác nhạy cảm có vùng bấm rất hẹp và cấp chữ nhỏ. Không được suy ra toàn bộ hàng là vùng bấm | Xác định vị trí, nhãn và vùng bấm của destructive/close/done; giữ xác nhận và autosave hiện có |
| A03 | P1 | Đ: Input/select thường cao 40; title input editor 42; nhiều action cao 44 | Điều kiện mobile `.app-shell .button` không bao phủ mọi primitive; portal ở ngoài shell. Tăng chữ 16 chưa thống nhất chiều cao field/label/action | Quy chuẩn form phải áp cho cả inline và portal, có min-height và text wrapping theo role |
| A04 | P2 | Đ: header ngang 20, panel x12, main14, card x27/x29; Lịch thử16 | Không có một trục căn nội dung được sử dụng xuyên phân hệ. Các lớp container cộng padding làm thư viện hẹp hơn Cài đặt | Chốt outer gutter, inset panel, inset card; chỉ lồng khi có nhóm nội dung thật |
| A05 | P2 | Đ/Q: Tổng quan nối header với khối ngày/title/KPI; các trang khác bắt đầu toolbar; Lịch thử có header riêng | Chưa có taxonomy header và vị trí page title thống nhất. Tổng quan có cấu trúc riêng có thể hợp lý, nhưng cần chủ đích; chốt shell riêng ở Lịch gây lệch app | Thiết kế shell chung và biến thể overview có lý do; xác định title, action, account và vùng dữ liệu |
| A06 | P2 | Đ: Ghi chú min-height220, preview min65, footer margin-top:auto; Dự án min-height212, card fixture230,5 | Chiều cao card còn thiên về desktop. Ghi chú rỗng và ghi chú một đoạn đều cao220, khiến người dùng phải cuộn qua khoảng trống để quét danh sách | Thiết kế card mobile theo nội dung; giới hạn excerpt có chủ đích; metadata theo flow; không áp chiều cao cố định đồng loạt |
| A07 | P2 | Đ: create note chữ12, create project14; section overview14, setting label15, title note16/project17 | Scale chữ có tokens nhưng module override nhiều mức cho cùng vai trò. Chưa có mapping role → font/line-height/weight đủ rõ | Chốt cấp chữ theo page/section/card/body/meta/action; tiếng Việt dài là dữ liệu thử bắt buộc |
| A08 | P2 | Đ/Q: underline cho overview/project filters, nền nhẹ cho Notes, segment trắng cho Thẻ/Kanban, turquoise đặc cho Lịch thử | Các pattern có vai trò gần nhau chưa được phân loại. Không nên gom mọi filter thành tabs, nhưng người dùng cần hiểu active nhất quán | Phân biệt route tab, view segment, filter chip, disclosure; chốt active/focus/pressed riêng cho từng pattern |
| A09 | P2 | Đ: runtime action icons có 14/16/18/20; Button ép SVG về16 dù Lucide size prop có thể18/20 | Kích thước khai báo không luôn là kích thước render; override cục bộ trong Lịch chưa thành quy tắc dùng lại | Chốt glyph scale theo role và cách áp qua primitive; giữ Lucide và accessible names |
| A10 | P2 | Đ: nav token76, runtime chung70; bản thử72; active cũ translateY(-2px) | Chiều cao dự trữ nội dung và nav thực chưa cùng một nguồn. Nhãn11 khá nhỏ; bản thử tạo variant chưa được duyệt | Chốt một nav5 mục có nhãn, safe area, reserve và text wrapping; kiểm tra cùng viewport và zoom |
| A11 | P2 | Q/Đ: Project form có footer sticky; input tiến độ bắt đầu y≈855 ở màn hình đầu, cuộn xuống đưa về≈695 | Form dài có vùng hành động nổi; cần đọc rõ phần đang cuộn và phần cố định. Chưa thấy mất field: input cuối có thể cuộn lên trước footer | Chốt cấu trúc sheet heading/body/footer, spacing và scroll reserve; không kết luận footer đang làm field không truy cập được |
| A12 | P2 | Đ/Q: Cài đặt Lịch mở cao≈1199 ở375; cả3 nhóm hiển thị toàn bộ11 swatch + HEX | Disclosure cấp section giảm độ dài khi đóng nhưng nội dung mở vẫn rất dài, nhiều control lặp. Chưa có quy tắc phân nhóm form theo tần suất dùng | Phân tích thứ tự trường và grouping; giữ khả năng đổi nhóm/màu/HEX, không tự bỏ hoặc thêm tính năng |
| A13 | P2 | Q/Đ: chi tiết ghi chú lặp tên ở title trang và title field; chi tiết Dự án có6 mục hồ sơ dưới dạng nút xuống nhiều hàng | Có nhiều cấp điều hướng/chỉnh sửa/thông tin cùng cạnh tranh. Chưa có hierarchy chi tiết được chốt cho mobile | Chốt vị trí title đang xem/title đang sửa, công cụ editor và mục hồ sơ; giữ chức năng/revisions/liên kết |
| A14 | P2 | Đ: `.button` cũ + shadcn `data-slot`; media queries600/700/800/900; CSS module thêm override | Có component dùng lại nhưng presentation vẫn quyết định tại nhiều nơi. Đây là nguyên nhân hệ thống khiến chỉnh một màn hình không nhất quán với phần còn lại | Lập ownership tokens/primitives/module; không refactor toàn source trước khi thiết kế đích được duyệt |
| A15 | P3 | Đ: favicon.ico404; cloud Từ ảnh disabled với lý do chỉ ở title attribute | Favicon chưa có; lý do disabled khó tìm trên touch nếu chỉ là tooltip/title. Disabled do cloud chưa hỗ trợ ảnh là hành vi đúng | Chờ asset nhận diện; quy định giải thích disabled bằng thông tin nhìn thấy theo ngữ cảnh, không thêm card giả |

Ngưỡng 44 px ở đây xuất phát từ quy ước mobile đã có trong MyOS và spec trước, dùng làm tiêu chí nội bộ để audit. Không tuyên bố các kích thước nhỏ hơn tự động vi phạm một tiêu chuẩn bên ngoài. Checkbox/radio có label lớn cần đo vùng label thực; không đánh giá chỉ từ ô vuông/glyph.

## 5. Phân tích theo màn hình

### Tổng quan

Điểm giữ: dữ liệu thật từ module nguồn, tab giảm chiều dài, xem tất cả tới nguồn, trạng thái riêng từng khối. Số liệu trên mobile là dải ngang, không phải card2×2; không sửa mô tả hiện trạng theo đề xuất cũ.

Vấn đề: vùng gradient gộp brand/ngày/title/KPI có trọng lượng lớn so với phần nội dung; cột đầu1,45fr và số29 trong khi số khác23 đặt ưu tiên riêng chưa được giải thích. Nhãn số liệu11 và section14 khiến hierarchy giữa số liệu, tab và lịch chưa cân bằng. Header20, tab12, panel12 + inset14 tạo nhiều trục. Nút Hôm nay34 khác controls điều hướng.

Đích cần thiết kế sau audit: thứ tự ưu tiên thông tin trong màn hình đầu, vai trò title, mật độ KPI và phần lịch. Không thêm quick actions/hero/chart. Không áp lưới2×2 chỉ vì đã ghi trong proposal trước.

### Lịch cũ và bản thử

Ảnh cũ: toolbar ghép tháng/mũi tên/view một hàng, thêm hàng bộ lịch/search/menu; grid có đường kẻ; selected gồm nền ô và vòng số ngày. Có đủ thao tác, nhưng thiếu quyết định về cách tổ chức các cấp controls và cách đọc nội dung ngày.

Bản thử: đổi header, view ra một hàng, grid bỏ đường kẻ, row52. Ở390 grid bắt đầu y307, preview y633; tổng cấu trúc vẫn toolbar → grid → preview cũ. Thêm hàng view làm phần trên dài hơn; chỉ đổi thông số không tạo được bố cục đích đủ khác biệt. Không lấy việc không overflow làm bằng chứng thiết kế đã đạt.

Đích cần thiết kế: mapping controls theo tần suất dùng, tỷ lệ grid/ngày/preview và quan hệ với shell. R1/R2B giúp tham khảo tỷ lệ và alignment, nhưng MyOS còn tab Chấm công/bộ lịch/search/menu. Phải thể hiện các quyết định này trong bản thiết kế trước code.

### Chấm công

Giữ: công việc riêng, tháng riêng, ô có nội dung, sheet ngày, autosave700 ms và nháp khi lỗi. Vấn đề: title công việc13, title tháng14, các action và trạng thái11–12; Xóa nhỏ trong sheet; header/nav thay đổi khi chuyển từ tab Lịch thử. Không thêm nút Lưu để giải quyết presentation.

Đích cần thiết kế: hierarchy công việc → kỳ tháng → nội dung ngày → trạng thái lưu; vùng nhập/action có cùng quy tắc form với các module khác, nhưng cơ chế lưu vẫn riêng.

### Ghi chú

Giữ: tìm kiếm một hàng, Từ ảnh/Tạo ghi chú cạnh nhau, pastel, tiêu đề trước metadata, editor chuyên biệt. Vấn đề: nhiều lớp padding; filter11 so với action12/body13/title16; card rỗng220; metadata tận đáy tạo khoảng trống lớn. Editor: tên ngoài và title field lặp; action32/tool34; các nhóm thuộc tính và liên kết kéo dài trang.

Đích cần thiết kế: mật độ thư viện cho empty/short/long note, hệ cấp điều hướng/lọc; hierarchy editor và save state. Không thêm cover stock hoặc thay Tiptap bằng textarea.

### Dự án

Giữ: tìm kiếm, trạng thái, Thẻ/Kanban, ghim/lưu trữ, progress text, dossier. Vấn đề: nhiều hàng toolbar trước danh sách (card đầu y≈377 ở390); trạng thái cuối bị lộ một phần trong scroller, cần quy tắc thể hiện nội dung ngoài vùng; trigger Thẻ/Kanban27; create40; min-height card212. Chi tiết nhiều panel/empty blocks, nút hồ sơ xuống ba hàng trong fixture, khiến hierarchy yếu khi ít dữ liệu.

Đích cần thiết kế: phân loại search/create/filter/view/stats, mật độ card và thứ tự chi tiết theo nhu cầu sử dụng. Không bỏ Kanban hoặc đổi sang carousel.

### Cài đặt

Giữ: nhóm label–control, gập/mở, giá trị không mất khi gập, cho biết nhắc chưa bật. Vấn đề: nút disclosure40 trong card66; field40/action44; form nhóm màu lặp dài. Native date/time phụ thuộc locale hệ điều hành/browser: audit Chromium hiển thị12h và tháng tiếng Anh ở một số control; đây là bằng chứng phụ thuộc môi trường, chưa đủ kết luận Safari tiếng Việt bị lỗi.

Đích cần thiết kế: field groups, disclosure hierarchy, hint/error/disabled và action-save placement. Không sao chép switch robot/Reset/all notification controls từ mẫu.

## 6. Component và quy tắc nên giữ

| Tài sản hiện tại | Vai trò | Kết luận audit |
| --- | --- | --- |
| [AppShell](../src/components/app-shell.tsx), [tokens](../src/app/globals.css) | Nhận diện/điều hướng | Giữ nền tảng, cần một specification shell chung |
| [Button](../src/components/ui/button.tsx), [Input](../src/components/ui/input.tsx), Textarea, NativeSelect | Form controls | Tiếp tục reuse, cần quy định role/size thay cho overrides rải rác |
| Tabs | Tab/view | Giữ keyboard/semantics; Button filter không đổi thành Tabs chỉ để giống nhau |
| Card/Badge | Nhóm nội dung/trạng thái | Giữ, card không đồng nghĩa cố định chiều cao |
| SettingsSection | Disclosure | Giữ state/children; thiết kế lại hierarchy và vùng bấm theo rule sau |
| Radix dialog + wrappers | Overlay/focus | Giữ focus trap/return/close theo module; cần spec heading/body/footer chung |
| Tiptap, MobileCalendar, Attendance, Kanban | Nghiệp vụ chuyên biệt | Không viết lại logic chỉ để đồng nhất hình thức |
| Repository/SWR/Auth | Dữ liệu và phiên | Ngoài phạm vi audit trình bày; giữ nguyên |

Những khác biệt cần bảo toàn: lịch có màu theo bộ/event; ghi chú có pastel; progress có số liệu; autosave của Ghi chú/Chấm công khác commit form Dự án/Lịch. Không đồng nhất chúng thành một kiểu Save hoặc một generic card.

## 7. Album bằng chứng

Ảnh full-page để quan sát toàn nội dung, không phải mockup đích.

| Màn hình/trạng thái | 390 | 375 |
| --- | --- | --- |
| Tổng quan | [Ảnh](mobile-ui-audit/overview-390.png) | [Ảnh](mobile-ui-audit/overview-375.png) |
| Ghi chú | [Ảnh](mobile-ui-audit/notes-390.png) | [Ảnh](mobile-ui-audit/notes-375.png) |
| Dự án | [Ảnh](mobile-ui-audit/projects-390.png) | [Ảnh](mobile-ui-audit/projects-375.png) |
| Cài đặt đóng | [Ảnh](mobile-ui-audit/settings-390.png) | [Ảnh](mobile-ui-audit/settings-375.png) |
| Cài đặt mở | [Ảnh](mobile-ui-audit/settings-open-390.png) | [Ảnh](mobile-ui-audit/settings-open-375.png) |
| Chấm công | [Ảnh](mobile-ui-audit/attendance-390.png) | [Ảnh](mobile-ui-audit/attendance-375.png) |
| Editor Chấm công | [Ảnh](mobile-ui-audit/attendance-editor-390.png) | [Ảnh](mobile-ui-audit/attendance-editor-375.png) |

Bổ sung: [Lịch thử](mobile-ui-audit/calendar-pilot-390.png), [editor Ghi chú](mobile-ui-audit/note-editor-390.png), [form Dự án](mobile-ui-audit/project-form-390.png), [form Dự án sau cuộn](mobile-ui-audit/project-form-bottom-390.png), [chi tiết Dự án](mobile-ui-audit/project-detail-390.png).

Nguồn kiểm tra nguyên nhân: [Notes CSS](../src/modules/notes/notes.css), [Projects CSS](../src/modules/projects/projects.css), [Overview CSS](../src/modules/overview/overview.css), [Settings CSS](../src/modules/settings/settings.css), [Calendar CSS](../src/modules/calendar/calendar.css), [SettingsSection](../src/components/settings-section.tsx).

## 8. Giới hạn và trạng thái workflow

- 19 trạng thái đo không tràn ngang ở viewport ghi nhận; không có pageerror trong luồng audit. Favicon404 là asset thiếu đã biết. Không suy ra toàn bộ ứng dụng không còn lỗi từ kết quả này.
- Chưa audit form hồ sơ tài khoản đăng nhập thật, đăng xuất/cloud media: browser kiểm thử local không có session. Source xác nhận chức năng, không giả màn hình cloud để chụp.
- Chưa tái kiểm tra offline/conflict/error/loading/disabled tất cả module, 200% zoom, screen reader, Safari thật/keyboard/safe area động. Các hành vi đó phải có trong checklist thiết kế và kiểm chứng về sau; không kết luận đạt trong audit này.
- Không chạy lint/build/E2E mới cho lượt audit vì không thay source ứng dụng; sử dụng production preview hiện có và đo/chụp runtime. Các pass của lượt implementation trước không được dùng làm chứng nhận cho thiết kế tương lai.
- Không đảo ngược bản thử Lịch, không chỉnh source hoặc dữ liệu thật, không deploy. Các thay đổi source có sẵn vẫn giữ nguyên để người dùng review.

**Audit đã hoàn thành trong phạm vi bằng chứng trên. Bước tiếp theo là xây bộ quy tắc MyOS mobile dựa trên A01–A15**, gồm shell/grid, typography, spacing, controls, states, cards và overlays. Mỗi quy tắc phải ghi role, lý do, source tham khảo và tình huống dài/rỗng/lỗi. Bốn file design trước là tài liệu tham khảo/bản thử, chưa phải hệ thống thiết kế cuối.

Sau bộ quy tắc cần bản thiết kế đích của Lịch đủ trạng thái ở390/375, đặt cạnh screenshot cũ theo cùng tỷ lệ. Người dùng duyệt thiết kế đích rồi mới tiếp tục Design-to-Code và visual verification. Không mở rộng implementation sang màn hình khác trước khi duyệt màn hình đầu.
