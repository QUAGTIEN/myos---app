# Sunflower — Danh mục tài liệu

Đây là thư mục tài liệu duy nhất của dự án. Chỉnh sửa trực tiếp file phụ trách nội dung tương ứng; khi cần dẫn lại, dùng liên kết, không tạo bản sao hoặc file có hậu tố như copy/final/v2 để thay thế việc cập nhật.

| Tài liệu | Vai trò |
|---|---|
| [AGENTS.md](../../AGENTS.md) | Chỉ dẫn làm việc duy nhất ở gốc workspace, áp dụng cho website bên dưới |
| [DESIGN.md](DESIGN.md) | Design tokens, typography, màu, grid, hình ảnh và responsive |
| [STRUCTURE.md](STRUCTURE.md) | Bảy trang đã duyệt, section, chức năng và hành trình B2B |
| [REFERENCE_GUIDE.md](REFERENCE_GUIDE.md) | Cách áp dụng tám ảnh Sonoco; không phải tài sản hình ảnh của Sunflower |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cấu trúc source và trạng thái hệ thống thực tế |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Kế hoạch triển khai theo module, đầu vào và tiêu chí nghiệm thu |
| [MEDIA_BRIEF.md](MEDIA_BRIEF.md) | G0: danh sách chụp ảnh/video, vị trí sử dụng và bộ tài nguyên ưu tiên |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Tài liệu ERP gốc để hiểu bối cảnh doanh nghiệp; không phải đặc tả website |

Thứ tự và thẩm quyền làm việc được quy định trong AGENTS.md. Kế hoạch không thay thế DESIGN/STRUCTURE; ARCHITECTURE mô tả source hiện có, không xác nhận mọi chức năng trong kế hoạch đã triển khai.

Tài liệu ERP được giữ nguyên nội dung. Các tên source, tài liệu phụ trợ và quy trình trong đó thuộc hệ thống ERP gốc; không diễn giải chúng thành đường dẫn hoặc tính năng của website này. Nội dung và số liệu đưa lên website vẫn cần Sunflower xác nhận.

## Ảnh tham chiếu

Tám ảnh Sonoco chỉ có một bộ tại [reference/desktop/](../../reference/desktop/) ở gốc workspace. REFERENCE_GUIDE.md trỏ tới bộ ảnh này; không sao chép vào thư mục tài liệu, public/ hoặc output website.

## Quy ước đường dẫn

- Từ gốc workspace: `AGENTS.md`, `sunflower-website/docs/`, `reference/desktop/`.
- Từ gốc website: `../AGENTS.md`, `docs/`, `../reference/desktop/`.
- Liên kết Markdown trong các tài liệu được tính từ thư mục chứa file.

Tên trùng theo quy ước framework như page.tsx, hoặc .gitkeep giữ từng thư mục trong Git, có vai trò riêng. Không xóa chúng chỉ vì cùng tên hoặc cùng nội dung rỗng.
