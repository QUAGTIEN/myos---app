# 001 — Framework và khung UI G1

Trạng thái: đã triển khai local; chưa deploy Firebase.
Ngày: 06/10/2026.

## Quyết định

- Next.js 15.5.27, React 19.3.0, TypeScript 5.9.3; phiên bản chính xác trong package.json và pnpm-lock.yaml.
- Bảng App Hosting hiện đánh dấu 15.2.x active, nhưng audit phát hiện lỗ hổng đã được vá ở 15.5.x. Chọn bản vá 15.5.27 cùng major, ưu tiên bản an toàn cho local; support cloud của minor này chưa được xác nhận và phải thử staging trước deploy. Không tuyên bố App Hosting đã được kiểm chứng.
- Pin override PostCSS 8.5.29 và sharp 0.35.5 để dùng các bản vá. Phải kiểm tra lại build/audit khi cập nhật framework; bỏ override khi upstream đã đáp ứng bản vá.
- Node 22 là baseline CI/cloud; môi trường máy hiện Node 24 cũng được phép bởi engines.
- pnpm 10.32.1 được khóa cho CI và lockfile. Tắt tự tải package manager bằng binary trong .npmrc vì môi trường Windows có đường dẫn chứa khoảng trắng; dùng phiên bản đã cài hoặc npx pnpm@10.32.1.
- Tailwind v4 và CSS tokens cho nền light, màu xanh ngọc và typography nhất quán.
- Be Vietnam Pro được self-host qua Fontsource, hỗ trợ tiếng Việt, không phụ thuộc tải font mạng khi build.
- Icon từ lucide-react; Radix Dialog xử lý drawer mobile/focus/Escape. UI cơ sở hiện tự tổ chức, chưa chạy generator shadcn.
- Auth chưa được triển khai: route group (private) chỉ tổ chức mã, không bảo vệ dữ liệu. Bản G1 không có dữ liệu cá nhân.
- Firebase browser/server chỉ tách cấu hình và validate biến môi trường, chưa cài SDK/chưa gọi từ màn hình. SDK và ADC initialization thêm ở G2 để tránh dependencies chưa dùng; không thêm credential vào repo.
- Bộ lịch tháng ở G1 chỉ để xem ngày/chuyển tháng, không lưu event. FullCalendar sẽ thay phần hiển thị khi triển khai module Lịch.

## Phạm vi

5 route chính, login preview, root redirect, loading/error/not-found, responsive shell và quality CI. Không tạo cloud project, không đăng nhập thật, không gọi Zalo, không viết worker giả.

Domain và Functions vẫn là các thư mục định hướng, chưa có manifest/export; workspace chỉ kích hoạt package khi implementation thực sự cần.

## Kiểm tra G1

- Lint, TypeScript, Prettier và production build đạt với Next.js 15.5.27.
- 12 E2E đạt trên desktop/mobile bằng Chrome cài sẵn: 5 route, calendar controls, disabled actions/login, HTTP 404, font, keyboard và viewport 320px.
- Đã xem screenshots cả 5 màn hình desktop/mobile; chưa kiểm tra thiết bị iPhone vật lý.
- Audit production dependencies: 0 vulnerabilities được báo tại thời điểm kiểm tra.
- Máy local dùng Node 24; CI cấu hình Node 22, kết quả CI cần xác nhận riêng sau push.
- Tải browser Chromium từ CDN bị timeout; local dùng PLAYWRIGHT_CHANNEL=chrome. CI vẫn dùng Chromium qua Playwright.

## Tham khảo

- [Firebase App Hosting frameworks](https://firebase.google.com/docs/app-hosting/frameworks-tooling)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Lucide React](https://lucide.dev/guide/react)
