# Sunflower — Header + Cinematic Hero

Chỉ dẫn làm việc dùng một file duy nhất ở gốc workspace: `../AGENTS.md`. File này áp dụng cho toàn bộ source trong `sunflower-website/`.

Phạm vi hiện tại: Header và Hero trang chủ. Giữ sitemap 7 trang theo `docs/STRUCTURE.md`; 6 trang con hiện chỉ có tiêu đề và metadata, chưa triển khai nội dung/chức năng.

Stack: Next.js App Router, React, TypeScript, Tailwind CSS. Font Inter được self-host từ gói Fontsource, có Vietnamese subset, không phụ thuộc tải font khi build.

## Chạy

```text
npm install
npm run dev
```

Mở http://127.0.0.1:3000. Bản production: `npm run build`, `npm run preview`, mở http://127.0.0.1:4173.

## Kiểm tra

```text
npm run lint
npm run typecheck
npm run build
```

## Thiết kế

Tài liệu được quản lý tại một nơi: [docs/INDEX.md](docs/INDEX.md). Khi cập nhật, sửa file chính và dùng liên kết từ nơi khác; không tạo thêm bản sao tài liệu.

`docs/DESIGN.md` là nguồn tokens chính. `docs/STRUCTURE.md` quy định bảy trang và chức năng. `docs/REFERENCE_GUIDE.md` hướng dẫn phân tích và áp dụng bộ ảnh Sonoco; ảnh tham chiếu gốc vẫn nằm ngoài `public/`.

Kế hoạch triển khai theo module, đầu vào và tiêu chí nghiệm thu: [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md).

## Cây thư mục và kiến trúc

Đã khởi tạo thư mục section cho bảy trang, các nhóm component, thư mục hỗ trợ và media theo `docs/STRUCTURE.md`. Xem `docs/ARCHITECTURE.md` để biết cây thư mục thực tế, luồng render, vai trò từng tầng và trạng thái triển khai. `.gitkeep` giữ các thư mục chờ trong Git; chưa có nội dung/functionality ở những thư mục này.

## Media cần bổ sung

Header dùng tên thương hiệu dạng chữ, chưa có logo gốc. Hero đã tích hợp video iStock preview do người dùng cung cấp (768×432, 21,81 giây, có watermark), kèm poster trích từ video. Đây là footage minh họa ngành in, không phải hình ảnh xưởng Sunflower. Desktop/mobile dùng chung nguồn; chưa có bản mobile riêng. Xem nguồn và trạng thái quyền sử dụng tại `docs/MEDIA_BRIEF.md`. Cần thay bằng bản HD được cấp phép trước khi công khai. Không có tài nguyên Sonoco trong `public/`.

Cấu hình tại `src/content/hero.ts`. Khi có media: đặt file được cấp phép trong `public/videos/hero/` và poster tương ứng trong `public/images/hero/`, sửa `desktopSrc`/`mobileSrc`/`poster`. Kiểm thử lại playback, autoplay bị chặn, pause/play, reduced motion, Save-Data và tương phản nhiều frame. Không dùng footage giả hoặc stock để giới thiệu như xưởng Sunflower.

## Triển khai

Build xuất `out/`, Sites giữ cùng project ID và quyền riêng tư. Không tích hợp ERP/Firebase, không thu hoặc gửi dữ liệu liên hệ. Website đang phát triển và giữ `noindex` cho đến khi có nội dung được xác nhận.
