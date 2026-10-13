# Phong cách thiết kế — Sunflower

Ngày: 13/10/2026. Phạm vi: landing page giới thiệu doanh nghiệp in ấn, sản xuất tem nhãn và bao bì, hướng tới khách hàng B2B.

## 1. Cơ sở và định hướng

- Nội dung nghiệp vụ: `PROJECT_OVERVIEW.md` và ba ảnh Sunflower ERP người dùng cung cấp.
- Tham chiếu bố cục: https://dye-spot.myharavan.com/ — ảnh lớn, khối nội dung vuông vắn, nền trắng xen kẽ navy, phân chia dịch vụ rõ.
- Tham chiếu nhịp trang: https://knit-knot.myharavan.com/ — tiêu đề đậm, khoảng trắng rộng, điểm nhấn vàng, nút tư vấn dễ tìm.
- Tạo thiết kế riêng cho Sunflower; không sao chép mã nguồn, nội dung hoặc tài sản của hai mẫu.
- Tính cách: chuyên nghiệp, cụ thể, có chiều sâu sản xuất, thân thiện với người phụ trách mua hàng.
- Mục tiêu chuyển đổi: khách hiểu sản phẩm, quy trình và gửi yêu cầu tư vấn/báo giá.

## 2. Màu sắc

| Token | Giá trị | Sử dụng |
|---|---|---|
| Navy | `#102B46` | Logo chữ, tiêu đề, các phần nền đậm |
| Navy deep | `#081A2C` | Hero, footer |
| Sunflower yellow | `#F5BE32` | CTA chính, điểm nhấn, số thứ tự |
| Ivory | `#F7F6F2` | Nền phần giới thiệu, sản phẩm |
| White | `#FFFFFF` | Nền và chữ trên navy |
| Body | `#526171` | Văn bản phụ |
| Border | `#E3E7E9` | Đường phân chia |

Navy và trắng chiếm phần lớn trang; vàng tạo điểm nhấn có chủ đích. Tránh dùng nhiều màu cạnh tranh. Nút vàng dùng chữ navy để có độ tương phản tốt.

## 3. Chữ và bố cục

- Font: Be Vietnam Pro, hỗ trợ đầy đủ tiếng Việt; fallback sans-serif hệ thống.
- Hero desktop: 58–68px, mobile: 38–44px, weight 600–700, line-height khoảng 1.13.
- Tiêu đề phần: 36–46px desktop, 29–34px mobile. Nội dung: 15–17px, line-height 1.7.
- Nhãn phần: 11–12px, uppercase, letter-spacing 1.6px; đi cùng đường hoặc hình vuông vàng nhỏ.
- Container tối đa 1240px; gutter 48–64px desktop, 22px mobile.
- Khoảng cách phần: 88–104px desktop, 56–64px mobile.
- Grid linh hoạt; ảnh lớn xen với nội dung thay vì lặp thẻ nhỏ ở mọi phần.
- Nút: cao 48–52px, góc bo nhẹ 4px. Thẻ/ảnh bo 0–6px, viền mảnh, ít bóng.
- Header sticky, nền trắng, CTA báo giá nổi bật. Điều hướng mobile dùng nút menu có trạng thái mở/đóng và hỗ trợ Escape.

## 4. Hình ảnh và nhận diện

- Hero: nhóm bao bì và cuộn tem trên nền navy, tạo cảm giác chất liệu in thực tế.
- Ảnh minh hoạ được tạo bằng công cụ ImageGen tích hợp; không dùng làm bằng chứng sản phẩm hoặc cơ sở thực tế của công ty.
- Demo dùng wordmark Sunflower và biểu tượng hoa hình học bằng SVG; logo chính thức cần thay khi có file gốc.
- Ảnh sản phẩm minh hoạ chia theo tem nhãn, hộp giấy và túi giấy. Chủng loại chi tiết phải xác nhận trước khi xuất bản thương mại.
- Không lấy ảnh ERP làm banner quảng bá. Không biến dữ liệu thô/lead thành khách hàng đã hợp tác.
- Không dựng số năm kinh nghiệm, sản lượng, máy móc, chứng nhận hoặc lời chứng thực chưa xác minh.

## 5. Thành phần và tương tác

- CTA chính: “Nhận báo giá”; phụ: “Khám phá sản phẩm”.
- Bộ lọc sản phẩm hoạt động ngay trên trang, có trạng thái active và kết quả rõ ràng.
- Nhấn sản phẩm mở thông tin mẫu/quy cách minh hoạ; CTA điền sẵn nhóm sản phẩm vào form.
- FAQ accordion dùng HTML `details/summary`, có thể mở bằng bàn phím.
- Form có label, kiểm tra dữ liệu, chọn nhóm sản phẩm; chỉ tạo bản tóm tắt yêu cầu để xem và sao chép trong demo, chưa gửi hoặc lưu dữ liệu vào ERP.
- Không tạo hotline, địa chỉ hoặc email giả. Nút liên hệ của demo điều hướng tới form.
- Chuyển động nhẹ, không auto-slide gây phân tâm; hỗ trợ `prefers-reduced-motion`.
- Focus rõ, alt cho ảnh, semantic heading, không tràn ngang ở 375px.

## 6. Văn phong

Viết tiếng Việt rõ, ngắn, hướng vào nhu cầu mua hàng: loại sản phẩm, quy cách, duyệt mẫu, kiểm tra và giao nhận. Thể hiện quy trình dựa trên ERP, không hứa cam kết giao hàng hoặc chất lượng định lượng chưa xác nhận.

## 7. Trước khi dùng chính thức

Cần bổ sung tên pháp lý, logo gốc, địa chỉ, hotline, email, ảnh xưởng/sản phẩm thực tế, danh mục và vật liệu xác nhận, năng lực máy, điều kiện đơn hàng và chính sách bảo mật. Tích hợp tiếp nhận yêu cầu vào ERP cần quyết định API và phân quyền riêng.
