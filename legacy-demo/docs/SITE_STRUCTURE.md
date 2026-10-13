# Cấu trúc website — Sunflower

Ngày: 13/10/2026. Giai đoạn: bản demo giao diện để duyệt thiết kế.

## 1. Hành trình người xem

Nhận diện công ty → xem nhóm sản phẩm → hiểu cách phối hợp và kiểm soát đơn → chọn nhu cầu → chuẩn bị yêu cầu báo giá.

## 2. Sơ đồ trang

| Phần | ID | Nội dung và mục đích |
|---|---|---|
| Thanh thông tin | — | Giới thiệu ngắn B2B và trạng thái bản demo |
| Header | — | Wordmark, điều hướng, nút nhận báo giá, menu mobile |
| Hero | `trang-chu` | Thông điệp in ấn/tem nhãn/bao bì, ảnh sản phẩm minh hoạ, 2 CTA |
| Dải năng lực | — | Theo yêu cầu; duyệt mẫu; phối hợp sản xuất; hỗ trợ đặt lại |
| Giới thiệu | `gioi-thieu` | Quy trình liên kết từ thiết kế đến giao nhận; ba điểm phối hợp |
| Sản phẩm | `san-pham` | Bộ lọc tem nhãn/hộp giấy/túi giấy, ảnh minh hoạ, thông tin mẫu |
| Giá trị hợp tác | `nang-luc` | Quy cách, mẫu, kiểm tra chất lượng và thông tin đơn hàng |
| Quy trình | `quy-trinh` | Tư vấn → thiết kế/duyệt mẫu → sản xuất/QC → giao nhận |
| Ngành phục vụ | — | Các nhóm nhu cầu B2B dựa trên danh mục ngành trong tài liệu ERP |
| FAQ | `cau-hoi` | Thông tin cần báo giá, mẫu thiết kế, duyệt mẫu, đặt lại |
| Form báo giá | `bao-gia` | Chuẩn bị yêu cầu và mở bản tóm tắt; demo chưa gửi thực tế |
| Footer | — | Thương hiệu, điều hướng, ghi chú demo |

Đưa sản phẩm gần đầu trang, không bắt người mua đọc lịch sử công ty quá dài. Không đưa bảng doanh thu, dữ liệu lead hoặc thông tin nội bộ lên website.

## 3. Điều hướng

Menu desktop: Giới thiệu / Sản phẩm / Quy trình / Câu hỏi / Nhận báo giá.
Menu mobile: cùng các mục, có nút đóng và Escape. Tất cả anchor có khoảng bù cho sticky header.

## 4. Cấu trúc tệp

```text
landing page sunflower/
├── PROJECT_OVERVIEW.md          # Tài liệu ERP do người dùng cung cấp
├── DESIGN_STYLE.md              # Phong cách thiết kế
├── SITE_STRUCTURE.md            # Cấu trúc website
└── sunflower-site/
    ├── .openai/hosting.json     # Cấu hình Sites riêng tư
    ├── README.md               # Cách xem và phạm vi demo
    ├── ASSET_NOTES.md          # Nguồn và prompt ảnh minh hoạ
    ├── server.mjs              # HTTP server cho local preview
    └── dist/
        ├── index.html          # Nội dung và cấu trúc semantic
        ├── styles.css          # Design tokens và responsive
        ├── app.js              # Menu, lọc, modal, form tóm tắt
        └── assets/
            └── packaging-hero.png
```

## 5. Công nghệ và dữ liệu

HTML/CSS/JavaScript thuần, không cần cài dependencies, không có backend. Phù hợp bản demo nội dung và hình ảnh, dễ chuyển thành React nếu cần kết nối hệ thống hiện tại. Font tải từ Google Fonts, có fallback khi offline. Ảnh nằm trong dự án. Không truy cập Firebase hoặc dữ liệu quản trị.

## 6. Chức năng demo

- Menu điều hướng và responsive.
- Bộ lọc nhóm sản phẩm.
- Modal xem thông tin sản phẩm minh hoạ, đóng bằng Escape hoặc nhấn ngoài.
- Chọn nhu cầu từ sản phẩm và đưa tới form.
- FAQ mở/đóng.
- Kiểm tra form bằng HTML validation; tạo tóm tắt yêu cầu và sao chép.
- Phản hồi rõ rằng chưa gửi yêu cầu; không giả trạng thái gửi thành công.

## 7. Hướng mở rộng

Trang chi tiết nhóm sản phẩm, danh mục có dữ liệu thực, nội dung về vật liệu và ứng dụng, bản tiếng Anh, kết nối tiếp nhận lead vào ERP. Chỉ thêm khi có yêu cầu và dữ liệu, không tự suy ra chức năng khách hàng tra cứu PO từ ERP nội bộ.
