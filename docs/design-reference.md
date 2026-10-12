# MyOS mobile — Phân tích ảnh tham khảo

**Nguồn bổ sung đã xác nhận12/10/2026:1.docx.** Ảnh lịch Task schedule:7 cột, ngày trong vòng tròn trắng/màu, weekday phía trên; đây là nội dung app, không có khung điện thoại hoặc status bar trong crop. User yêu cầu độ đậm theo lượng việc; đó là yêu cầu riêng, không suy count từ màu xanh/cam/tím trong ảnh. Ảnh thứ hai:search pill trắng và hàng filter pill; selected nền đậm/chữ trắng, unselected trắng/chữ tối, không underline. Crop dùng để xác định dạng component và hierarchy; không suy số đo tuyệt đối/font hoặc lấy nền cyan làm màu MyOS. Dùng hai mẫu này cho Lịch và filters Ghi chú/Dự án theo [spec cập nhật](design-spec.md), [báo cáo triển khai](mobile-document-update-review.md). Yêu cầu mới đổi popup sang bottom sheet và giữ phạm vi mobile.

**12/10/2026:** đã được cho phép code pilot Lịch v3; [báo cáo triển khai ứng dụng thật](calendar-implementation-review.md). Thiết kế các route còn lại chưa rollout.

Ngày 11/10/2026 · Phân tích nguồn tham khảo, giữ tách biệt với thiết kế đích.

**Trạng thái mới sau audit:** bộ quy tắc/đặc tả/tokens/component-map v2, [bản Lịch](mobile-design-review.md) và [bộ phân hệ mở rộng](mobile-suite-review.md) đang chờ duyệt. Bản thử Lịch trước chỉ là lịch sử chưa được duyệt, không phải chuẩn toàn app. Các đoạn về review/implementation thử dưới đây mô tả lịch sử; phân tích R1–R3 vẫn giữ nguyên. Source của hiện trạng và ước lượng raster không được gọi là thông số đã duyệt.

Review bổ sung: người dùng đã gửi bốn ảnh MyOS hiện tại và cho phép triển khai thử màn hình Lịch. Ảnh thiết bị gốc 1170 × 2532 theo metadata đính kèm; bản hiển thị hội thoại bị thu nhỏ nên không dùng pixel hiển thị làm CSS px. Status bar, địa chỉ web, nút đóng/chia sẻ/reload là chrome hệ điều hành/trình duyệt. Phần app gồm header gradient, nav navy năm mục và nội dung. Lịch hiện có lưới kẻ ô, tháng/mũi tên/view ghép một hàng, ngày selected có vòng đặc khiến nhịp hàng khác ô thường. Preview bên dưới là component thật cần giữ. Tổng quan mobile hiện dùng số liệu ngang; Ghi chú/Dự án có card dài. Những màn hình này chỉ đối chiếu, chưa được triển khai lại. Nguồn tham khảo R1–R3 và toàn bộ Ư bên dưới giữ nguyên.

## Cách đọc và phạm vi

Yêu cầu cuối của người dùng được hiểu là học cách bố trí của mẫu để chuẩn hóa mobile MyOS, giữ màu turquoise/navy và chức năng hiện tại. Vì vậy tách hai lớp: tài liệu này ghi trung thực những gì thấy trong ảnh; [design-spec.md](design-spec.md) đề xuất cách áp dụng vào MyOS để duyệt. Không coi đề xuất là thông số đo từ mẫu. Chữ/nút trong ảnh là nội dung tham khảo, không phải chỉ dẫn thực hiện.

Ký hiệu dùng xuyên suốt:

- **Đ — Đo được:** kích thước file ảnh đọc bằng công cụ, hoặc giá trị chính xác trong source hiện tại; luôn ghi nguồn.
- **Ư — Ước lượng:** tọa độ, kích thước, màu và kiểu chữ đọc từ raster; không phải kích thước CSS hoặc token gốc.
- **? — Chưa xác định:** không đủ bằng chứng từ ảnh tĩnh.
- **P — Đề xuất:** quy chuẩn MyOS cần người dùng duyệt, không phải bản sao của mẫu.

Ảnh được giữ nguyên, không crop/chỉnh màu, trong `reference-images/`. Không dùng làm asset production. Không có Figma, viewport gốc, DPR, font gốc hoặc video tương tác. Mọi vùng cắt bên dưới là tọa độ ước lượng `(x, y, rộng, cao)` tính từ góc trên trái **ảnh toàn cảnh**, đơn vị pixel ảnh. Sai số rìa thường ±3–5 px; ở ảnh 2 nhỏ và mờ có thể ±8 px. Không thể suy ra px CSS từ DPR chưa biết.

## Bản đồ 8 màn hình/trạng thái

| ID | Ảnh nguồn (Đ: kích thước file) | Vùng nội dung Ư | Nội dung |
| --- | --- | --- | --- |
| R1 | [Ảnh 1](reference-images/reference-1.png), 312 × 623 | (16, 10, 278, 604) | Calendar tháng |
| R2A | [Ảnh 2](reference-images/reference-2.png), 1010 × 652 | (46, 21, 202, 443) | Dashboard robot |
| R2B | Ảnh 2 | (286, 155, 202, 440) | Schedule |
| R2C | Ảnh 2 | (525, 59, 202, 440), đầu bị cắt | Settings, một phần màn hình |
| R2D | Ảnh 2 | (764, 186, 202, 439) | Add New Task trên nền Schedule |
| R3A | [Ảnh 3](reference-images/reference-3.png), 969 × 690 | (91, 44, 241, 517) | Carbon dashboard |
| R3B | Ảnh 3 | (385, 106, 240, 517) | Carbon insights |
| R3C | Ảnh 3 | (675, 44, 241, 517) | Offset marketplace |

## Phân biệt app, hệ điều hành và mockup

| Ảnh | Thuộc giao diện app | Thuộc hệ điều hành/mockup | Chưa chắc |
| --- | --- | --- | --- |
| 1 | Calendar, bộ chuyển Week/Month, lịch, thẻ ảnh, thanh điều hướng nổi | Nền be ngoài màn hình, đường viền và góc bo ngoài; giờ/sóng/pin, home indicator | Viền ngoài là thiết bị hay clipping của bản trình bày; chiều cao viewport thực |
| 2 | Bốn mặt giao diện, card, form và lớp dim dưới sheet | Nền poster trắng–đào, bóng lớn sau các mặt; các màn hình đặt lệch cao thấp | Các mảng đào nằm trong mặt UI có vẻ là nền app nhưng chưa có asset/layer gốc |
| 3 | Hero rừng, bong bóng số liệu, panel trắng, chart, thẻ ảnh, navigation | Thân máy đen/kim loại, nút cạnh, Dynamic Island, giờ/sóng/pin, home indicator; nền xám và bóng thiết bị | Safe area chính xác; ranh giới ảnh hero so với nền app |

Không dựng khung máy, notch, status bar hoặc home indicator bằng component MyOS. Bóng ngoài thiết bị không phải shadow của card.

## R1 — Calendar tháng

**Thứ bậc:** vùng hệ thống → toolbar (menu / Calendar / thêm) → segmented Week–Month → hàng tháng và hai mũi tên → tên thứ → lưới 7 cột × 5 hàng → tiêu đề ngày → thẻ ảnh → navigation nổi trên thẻ.

**Bố cục Ư:** mép nội dung x≈30 và x≈280, rộng ≈250, tương đương 90% vùng app. Toolbar y≈56–94; segmented y≈110–149, cao ≈39. Tiêu đề tháng y≈168; tên thứ y≈201; ô ngày y≈217–452, bước cột ≈36 và bước hàng ≈48. Tiêu đề ngày y≈471; thẻ ảnh từ y≈499, phần dưới bị che/cắt. Navigation x≈44, y≈542, rộng ≈221, cao ≈49.

**Căn chỉnh:** Calendar và tên tháng/ngày căn trái; số ngày căn giữa cột; mũi tên căn phải cùng baseline tiêu đề tháng. Ô chọn ngày 10 là capsule dọc ≈33 × 46; các ô trống ngoài tháng có gạch chéo nhạt. Dấu chấm đôi màu hồng/tím dưới một số ngày; ý nghĩa chưa được cung cấp. Thứ bắt đầu Chủ Nhật trong mẫu.

**Typography Ư:** tiêu đề có serif, khoảng 15–17 px ảnh; nhãn và số sans-serif 10–12 px ảnh; font và weight gốc chưa xác định. Không nhập font serif vào MyOS chỉ vì mẫu dùng serif.

**Màu/vật liệu Ư:** đỉnh đào nhạt chuyển xuống trắng xanh, selected cam đào, chữ gần đen; card và nút có nền trắng mờ. Capsule tab bo ≈20; card ảnh bo ≈18; nav bo ≈24. Có đường viền trắng và bóng rất nhẹ. Không thể tách chính xác blur/alpha/shadow từ ảnh flatten.

**Phân loại:** ảnh minh họa nhân vật và avatar = image asset; menu, thêm, mũi tên, ⋮ và năm ký hiệu nav = icon; tiêu đề/nhãn/số = text; lưới = calendar custom; Week/Month = navigation nội bộ; ô ngày/nút = button; khối ảnh = card; nav kính = lớp nổi. Không có chart.

**Giới hạn:** ngày chọn 10 nhưng tiêu đề ghi October 14; không suy ra quy tắc chọn ngày từ sự không khớp này. Không biết thẻ ảnh là lịch hẹn hay nội dung social. Không suy ra scroll, gesture hoặc menu từ ảnh.

**Áp dụng:** tham khảo tỷ lệ lịch và nhịp hàng; không đưa avatar, thẻ social, kính hoặc font serif sang MyOS.

## R2A — Dashboard robot

**Thứ bậc:** logo/menu → card robot (ảnh vuông trái, tên dạng selector và thông tin phải) → Quick Actions 2 × 2 → Battery Status với bốn hàng → Charging Progress.

**Bố cục Ư:** gutter ≈8 px ảnh, card rộng ≈188 (93% vùng app). Card robot y≈79–150, cao ≈71; ảnh ≈53 × 53. Quick Actions y≈181–239, gap ≈5–6. Khối trạng thái y≈270–410, mỗi hàng ≈29–32. Charging Progress y≈422–460, đáy bị cắt.

**Hierarchy/căn chỉnh:** section label nằm ngoài card; hàng trạng thái có icon trái, nhãn giữa, badge phải. Card nhiều hàng thống nhất lề; thanh tiến độ chiếm chiều ngang. Title đậm hơn description; chữ quá nhỏ để xác nhận font.

**Visual Ư:** nền đào/kem có mảng tròn, card trắng sữa, đường viền trắng, shadow mềm; radius card ≈12–16 px ảnh, hàng con ≈6–8. Cam cho nhận diện, xanh/vàng/tím cho trạng thái. Size chữ nhãn ≈7–9, tiêu đề ≈10–12 px ảnh; chỉ phản ánh ảnh đã thu nhỏ.

**Phân loại:** logo/ảnh robot = asset; glyph thao tác = icon; nhãn = text; quick action = button; selector = control; nhóm trắng = card; progress = chart đơn chiều. Không thấy bottom navigation hoặc modal.

**Giới hạn:** “Current Draw” lặp với trạng thái khác, có thể là nội dung mockup chưa hoàn thiện. Không suy đoán nghiệp vụ từ tên hàng.

**Áp dụng:** nhóm thông tin và hàng label–value cho Tổng quan/Cài đặt; không sao chép quick actions vì Tổng quan MyOS đã bỏ tạo nhanh, không thêm tính năng robot.

## R2B — Schedule

**Thứ bậc:** logo/menu → Schedule → card lịch → hàng Schedules/nút thêm → các card lịch trình xếp dọc.

**Bố cục Ư:** gutter ≈7; card lịch (293, 239, 187, 173). Tiêu đề tháng + mũi tên trong card; thứ và 5 hàng ngày bên dưới. Hàng section y≈435; card đầu y≈453–503, card hai ≈507–557; card thứ ba bị cắt. Lịch rộng ≈93% màn hình, thấp hơn R1 tương đối với bề ngang.

**Căn chỉnh và kiểu chữ:** tên tác vụ trái, zone badge phải; metadata thời gian dưới trái, chi phí/khoảng cách dưới phải. Tên trang ≈15 px ảnh, task ≈9, metadata ≈6–7. Typography sans-serif, weight phân biệt title/metadata.

**Visual Ư:** góc card lịch ≈15, thẻ lịch trình ≈8; ô ngày tròn cam đặc hoặc viền cam và chấm dưới ngày. Thanh trạng thái mảnh xanh/vàng/tím bên trái từng card; bóng nhẹ, không glass nav.

**Phân loại:** logo = asset; arrows/menu/plus = icon button; month grid = custom calendar; nhãn = text; lịch trình = card; badge = trạng thái. Không chart/overlay.

**Giới hạn:** khác biệt ô cam đặc/viền chưa rõ là hôm nay, ngày chọn hay ngày có tác vụ. Không sao chép mã nghĩa màu sang MyOS.

**Áp dụng:** lịch và danh sách có cùng mép căn, metadata gọn. Không sao chép thanh viền màu card vì quy ước MyOS không dùng viền màu trên thẻ.

## R2C — Settings, phần giữa màn hình

**Thứ bậc nhìn thấy:** mẩu nội dung phía trên bị cắt → Motion & Speed (slider + hai switch) → Mode & Color (sáu swatch) → Notifications (ba switch) → reset.

**Bố cục Ư:** section title nằm ngoài card, gutter ≈7. Card Motion y≈99–214, Mode y≈246–321, Notifications y≈351–459, reset y≈472–494. Row chia bằng khoảng cách/đường mảnh; nhãn và mô tả bên trái, switch hoặc phần trăm bên phải.

**Visual Ư:** card radius ≈12, switch ≈23 × 12, swatch đường kính ≈16; khoảng giữa các swatch ≈7. Title ≈9 px ảnh, nhãn ≈8, mô tả ≈6–7. Nền kem, controls cam, destructive hồng đỏ. Bóng card thấp hơn bóng poster.

**Phân loại:** text; slider/switch/swatch = controls; card nhóm; reset = button. Không có image nội dung/chart/navigation xác định được trong phần nhìn thấy.

**Giới hạn:** không thấy header/đáy thật; không được bổ sung header hoặc navigation như thể có trong ảnh. Trạng thái swatch đang chọn khó phân biệt; kích thước vùng chạm không thể biết.

**Áp dụng:** hàng thiết lập có nhãn/mô tả/control rõ; chỉ dùng trường đã có ở MyOS, không thêm slider, theme selector, notification switch hoặc reset toàn bộ.

## R2D — Add New Task, bottom sheet

**Thứ bậc:** Schedule phía sau bị dim → sheet trắng với grabber → title/subtitle → Task Name → Date → Time hai cột → Zone bốn lựa chọn → Repeat → Save Task → Cancel.

**Bố cục Ư:** sheet (764, 254, 202, 371), chiếm ≈85% chiều cao vùng app. Bo hai góc trên ≈19; gutter ≈11, control rộng ≈179. Grabber ≈26 × 3. Nút chính (775, 573, 179, 30), Cancel ở dưới. Time chia hai cột có gap ≈7–8. Input cao ≈27–29 px ảnh.

**Visual Ư:** title ≈13, label ≈8, helper ≈7 px ảnh; nền gần trắng, field trắng, đường phân cách rất nhạt; nút gradient cam–đỏ và bóng màu. Overlay phía sau nâu xám; không biết opacity gốc.

**Phân loại:** sheet + scrim = overlay; handle = trang trí/hint (không đủ chứng cứ có kéo); input/date/time = controls; zone = choice buttons; Save/Cancel = buttons; calendar/chevron = icons; nhãn = text. Không ảnh/chart mới.

**Giới hạn:** không biết snap points, drag-to-close, keyboard, validation, loading, click ngoài sheet. Không coi grabber là bằng chứng đã có gesture.

**Áp dụng:** bố cục form một cột và sheet; không mang zone/repeat robot/nút gradient vào MyOS. Chấm công vẫn tự lưu, không có Save Task.

## R3A — Carbon dashboard

**Thứ bậc:** hero rừng chứa pill mục tiêu/settings và vòng số liệu → panel trắng bo phía trên → lời chào/goal badge → so sánh nhỏ → card bar chart tuần → Offset Emissions/See more → hai thẻ ảnh.

**Bố cục Ư:** hero từ y≈44 đến 225, cao ≈181 (35% vùng app). Panel trắng bắt đầu y≈223, phủ mép hero; inset nội dung panel ≈10. Chart (102, 281, 220, 112); hàng tiêu đề danh sách y≈418; ảnh thẻ bắt đầu y≈432, thẻ rộng ≈114, gap ≈7. Vòng số liệu đường kính ≈97.

**Typography/visual Ư:** title ≈14, body ≈8–10, số hero ≈23 px ảnh. Rừng có overlay tối, vòng glass xanh mờ; panel bo ≈17, chart/card bo ≈13. Bar chart 7 cột dọc bo tròn, có nhãn ngày và số; màu phân biệt từng cột, ý nghĩa chưa rõ. Card ảnh có hộp caption trắng đè mép dưới.

**Phân loại:** rừng/ảnh cầm cây = image assets; vòng = số liệu + lớp trang trí, không xác nhận là progress; weekly bars = chart; pill = badge; settings = icon button; card nội dung = card; See more = link. Không thấy app bottom nav trong R3A; vạch đen dưới cùng là home indicator.

**Áp dụng:** thứ tự số liệu → nội dung cụ thể và nhóm thông tin; không thêm hero rừng, chỉ số carbon hoặc chart không có trong MyOS.

## R3B — Carbon insights

**Thứ bậc:** title → card Monthly overview / Carbon Footprint / D–W–M → donut năm phần kèm label bên ngoài → bảng chú giải 5 hàng → insight strip → Tip of the Day với ảnh bên phải → navigation nổi 4 icon.

**Bố cục Ư:** gutter ≈9; card chart (394, 172, 220, 178). Donut tâm ≈(500, 278), đường kính ngoài ≈123, lỗ ≈65–70. Legend (394, 355, 220, 128), mỗi hàng ≈20. Tip card (394, 489, 220, 90). Nav (431, 570, 144, 35), bằng ≈60% bề ngang app; nav che một phần tip.

**Typography/visual Ư:** title ≈14, section ≈11, body ≈8; nhiều cấp xám và xanh. Donut có khe và góc bo ở đầu segment; đường dẫn mảnh nối label. Legend chia cột tên/khối lượng/phần trăm. Nav xanh rất đậm, active có vòng nền sáng hơn; radius nav ≈18. Shadow mềm, card viền xám mảnh.

**Phân loại:** donut = chart tùy biến, legend = bảng dữ liệu; rừng trong Tip = asset; nav = navigation/icon buttons; D/W/M = segmented control; các khối = card; insight strip = thông tin. Không modal.

**Giới hạn:** không có dữ liệu/chart spec gốc; không suy ra tooltip, animation hay thao tác bấm chart. Nav 4 icon không đủ dùng cho 5 phân hệ MyOS và nhãn tiếng Việt.

**Áp dụng:** alignment của bảng và nav nổi; không ép nav MyOS về chiều rộng 60%, không bỏ nhãn để giống ảnh, không thêm donut.

## R3C — Offset marketplace

**Thứ bậc:** hero rừng + hai vòng số liệu chồng nhau + help → panel trắng → title → information pill → search/filter/sort → carousel thẻ ảnh → pagination dots → nav nổi 4 icon.

**Bố cục Ư:** hero cao ≈149 (29% vùng app), panel từ y≈193; gutter ≈10. Hai vòng đường kính ≈104 và ≈69, vòng nhỏ đè góc trên phải vòng lớn. Search row y≈267–295; ảnh card chính (714, 303, 163, 106); card lân cận lộ hai bên. Caption địa điểm đè trong đáy ảnh; body trắng dưới ảnh với tên/mô tả/metadata và nút mũi tên tròn. Nav (722, 509, 145, 36).

**Typography/visual Ư:** title ≈14, card title ≈9 đậm, description ≈8 xám, số hero ≈17; panel radius ≈18, ảnh ≈12, action tròn ≈28. Layer: ảnh → vòng translucent; panel → ảnh card → địa điểm; nav nổi cao hơn danh sách. Xanh rừng/đen/trắng, không phải màu MyOS.

**Phân loại:** ảnh = assets; vòng số liệu = text/decoration; search = input; filter/sort/help/action = icon buttons; list ngang = carousel; dots = navigation indicators; thẻ = card; nav = navigation. Không xác nhận vòng là chart.

**Giới hạn:** card hai bên bị cắt có vẻ chủ ý gợi cuộn, nhưng swipe/snap/loop chưa biết. Không biết số lượng kết quả hoặc logic tìm kiếm.

**Áp dụng:** metadata và action rõ trong card; không chuyển danh sách Dự án/Ghi chú sang carousel làm ẩn nội dung cần tra cứu.

## Asset còn thiếu và mức độ cần thiết

| Asset/thông tin | Đang có | Cần nếu tái dựng nguyên mẫu | Với hướng MyOS đề xuất |
| --- | --- | --- | --- |
| Ba ảnh tham khảo | Bản raster nguyên gốc trong tài liệu | Đủ đối chiếu tổng thể, không đủ tách layer sắc nét | Chỉ tham khảo |
| R1 ảnh nhân vật, avatar | Chỉ thấy trong screenshot | File gốc, crop và quyền dùng | Không cần; không tự thay ảnh |
| R2 logo, ảnh robot, nền mảng đào | Chỉ thấy trong screenshot | Vector/ảnh gốc và layer nền | Không cần |
| R3 hero rừng, ảnh trồng cây, rừng Bavaria, tip và card bên cạnh | Chỉ thấy trong screenshot | Ảnh gốc đủ độ phân giải, vị trí crop, quyền sử dụng | Không cần; không dùng ảnh rừng đăng nhập để thế chỗ |
| Font, weight, icon bộ mẫu | Chưa xác định | Tên font/file có quyền dùng, bộ glyph gốc | Giữ Be Vietnam Pro và Lucide hiện có |
| Figma/export riêng từng screen | Chưa có | Cần để xác nhận thông số chính xác và phần bị cắt | Hữu ích nếu muốn độ trung thực pixel cao hơn |
| Video/prototype | Chưa có | Cần xác nhận scroll, drag, transition và trạng thái | Không đoán thêm gesture |
| MyOS ảnh nhận diện | Có `public/images/sidebar-city.png`, `login-forest.jpg` | Không liên quan việc dựng mẫu | Giữ đúng phạm vi sử dụng đã duyệt |

**Không có asset hình ảnh mới bắt buộc** cho hướng chuẩn hóa MyOS không dùng hero/ảnh trang trí. Nếu người dùng chọn đưa hình ảnh vào giao diện, phải chốt asset và vị trí trước; không sinh ảnh, tự tìm stock hoặc thay icon tùy ý.

Xem [thông số và các điểm cần duyệt](design-spec.md), [tokens](design-tokens.md), [component map](component-map.md).
