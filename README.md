# Sunflower — Header + Cinematic Hero

Phạm vi 14/10/2026: chỉ Header và Hero trang chủ. Giữ sitemap 7 trang theo `docs/STRUCTURE.md`; 6 trang con có khung chờ để kiểm tra navigation, không phải nội dung hoàn chỉnh.

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

`docs/DESIGN.md` là nguồn tokens chính. `docs/HEADER_HERO_AUDIT.md` ghi phân tích cả tám ảnh Sonoco. `docs/HEADER_HERO_QA.md` ghi vòng đối chiếu trước/sau và kiểm tra thực tế. `docs/qa/` chứa ảnh desktop/mobile.

## Media cần bổ sung

Chưa có logo gốc và footage/poster Sunflower được phép sử dụng. Wordmark là chữ tạm; poster SVG là minh hoạ bố cục phi ảnh chụp, không phải sản phẩm/xưởng thực tế. Không có tài nguyên Sonoco trong `public/`.

Cấu hình tại `src/content/hero.ts`. Khi có media: đặt file được cấp phép trong `public/videos/hero/` và poster tương ứng trong `public/images/hero/`, sửa `desktopSrc`/`mobileSrc`/`poster`, đặt `isIllustration: false`. Kiểm thử lại playback, autoplay bị chặn, pause/play, reduced motion, Save-Data và tương phản nhiều frame. Không dùng footage giả hoặc stock để giới thiệu như xưởng Sunflower.

## Lịch sử và triển khai

Demo HTML cũ được giữ ở `legacy-demo/`, không nằm trong output mới. Build xuất `out/`, Sites giữ cùng project ID và quyền riêng tư. Không tích hợp ERP/Firebase, không thu hoặc gửi dữ liệu liên hệ.
