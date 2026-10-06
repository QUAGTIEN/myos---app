# Next.js App Router

Nơi điều phối route, page, layout và HTTP boundary. G1 đã có root layout, 5 page chính, login preview, skeleton Tổng quan và error/404. API và xác thực session chưa triển khai.

## Kế hoạch

- Root layout: html lang="vi", body, font và metadata chung.
- Root page: điều hướng theo trạng thái session.
- (auth)/login: đăng nhập.
- (private): layout sidebar/header dùng chung cho 5 phân hệ.
- api: endpoints kỹ thuật như session, xuất lịch và ghép nối Zalo.
- loading/error/not-found theo route khi cần.

Route groups trong ngoặc không xuất hiện trong URL. Page đọc dữ liệu qua service và DAL; không đặt mọi logic nghiệp vụ trong page. Xem [bản đồ source](../../docs/SOURCE_MAP.md).
