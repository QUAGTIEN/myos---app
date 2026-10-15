# Sunflower — Danh mục tài liệu

Đây là thư mục tài liệu duy nhất của dự án. Chỉnh sửa trực tiếp file phụ trách nội dung tương ứng; khi cần dẫn lại, dùng liên kết, không tạo bản sao hoặc file có hậu tố như copy/final/v2 để thay thế việc cập nhật.

| Tài liệu | Vai trò |
|---|---|
| [AGENTS.md](../../AGENTS.md) | Chỉ dẫn làm việc duy nhất ở gốc workspace, áp dụng cho website bên dưới |
| [DESIGN.md](DESIGN.md) | Design tokens, typography, màu, grid, motion/3D bắt buộc và responsive; mục 8 là contract duy nhất về effect |
| [STRUCTURE.md](STRUCTURE.md) | Bảy trang đã duyệt, section, chức năng và hành trình B2B |
| [REFERENCE_GUIDE.md](REFERENCE_GUIDE.md) | Sonoco tham chiếu chính về bố cục; MWDT tham chiếu phụ về chiều sâu/sản phẩm; không phải tài sản của Sunflower |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Cấu trúc source và trạng thái hệ thống thực tế |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Kế hoạch triển khai theo module, đầu vào và tiêu chí nghiệm thu |
| [MEDIA_BRIEF.md](MEDIA_BRIEF.md) | G0: danh sách chụp ảnh/video, vị trí sử dụng và bộ tài nguyên ưu tiên |
| [CONTENT.md](CONTENT.md) | G0: copy bảy trang, catalogue đã xác nhận, CTA, microcopy và dữ liệu liên hệ minh họa |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | Tài liệu ERP gốc để hiểu bối cảnh doanh nghiệp; không phải đặc tả website |

Thứ tự và thẩm quyền làm việc được quy định trong AGENTS.md. Kế hoạch không thay thế DESIGN/STRUCTURE; ARCHITECTURE mô tả source hiện có, không xác nhận mọi chức năng trong kế hoạch đã triển khai.

Tài liệu ERP được giữ nguyên nội dung. Các tên source, tài liệu phụ trợ và quy trình trong đó thuộc hệ thống ERP gốc; không diễn giải chúng thành đường dẫn hoặc tính năng của website này. Nội dung và số liệu đưa lên website vẫn cần Sunflower xác nhận.

## Ảnh tham chiếu

Hướng cập nhật 14/10/2026: sạch sẽ/chuyên nghiệp, đồng thời hiện đại/mạnh mẽ/bắt mắt với nhiều animation và khối 3D. Quy định nằm trong DESIGN.md mục 1 và 8; G2.Motion đã được triển khai và ghi nhận trong IMPLEMENTATION_PLAN.md. Không tạo thêm file motion/design hoặc bản sao AGENTS.

G3 đã code Sản phẩm/Giải pháp trên hai route hiện có; trạng thái và giới hạn kiểm tra nằm trong IMPLEMENTATION_PLAN.md, source thực tế tại ARCHITECTURE.md. Không tạo tài liệu G3 riêng hoặc bản catalogue/copy song song.

G4 đã code Giới thiệu, Năng lực và Mẫu thành phẩm; tái sử dụng dữ liệu/ảnh hiện có. Phạm vi nội dung và tình trạng QA nằm trong IMPLEMENTATION_PLAN.md; không tạo file mô tả G4 riêng.

G5.1 đã code giao diện Liên hệ, nhận ngữ cảnh catalogue/giải pháp/mẫu, kiểm tra dữ liệu và xem lại nội dung tại chỗ. Chủ dự án chọn hoàn thiện giao diện trước vì chưa có đích nhận. G5.2 gửi thật còn chờ; không coi toàn bộ G5 đã hoàn tất. Source và QA được cập nhật trong ARCHITECTURE.md/IMPLEMENTATION_PLAN.md.

G6 đã ghép đủ câu chuyện Trang chủ theo STRUCTURE.md: năng lực, giải pháp chọn lọc, mẫu thành phẩm minh họa và quy trình nằm sau WhySunflower, trước CTA cuối. Dùng chung dữ liệu/ảnh với trang con; không có tài liệu hoặc catalogue Home thứ hai. Kết quả đối chiếu/QA ghi ở IMPLEMENTATION_PLAN.md.

Tám ảnh Sonoco chỉ có một bộ tại [reference/desktop/](../../reference/desktop/) ở gốc workspace. REFERENCE_GUIDE.md trỏ tới bộ ảnh này; không sao chép vào thư mục tài liệu, public/ hoặc output website.

## Quy ước đường dẫn

- Từ gốc workspace: `AGENTS.md`, `sunflower-website/docs/`, `reference/desktop/`.
- Từ gốc website: `../AGENTS.md`, `docs/`, `../reference/desktop/`.
- Liên kết Markdown trong các tài liệu được tính từ thư mục chứa file.

Tên trùng theo quy ước framework như page.tsx, hoặc .gitkeep giữ từng thư mục trong Git, có vai trò riêng. Không xóa chúng chỉ vì cùng tên hoặc cùng nội dung rỗng.
