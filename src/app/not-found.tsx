import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { ActionLink } from '@/components/ui/ActionLink';

export const metadata: Metadata = { title: 'Không tìm thấy trang', robots: { index: false, follow: false } };

export default function NotFound() {
  return <main id="main-content" tabIndex={-1} className="interior-page not-found-page">
    <Container>
      <p className="section-eyebrow">404 / KHÔNG TÌM THẤY TRANG</p>
      <h1>Trang bạn tìm không có ở đây.</h1>
      <p className="not-found-description">Liên kết có thể đã thay đổi hoặc địa chỉ chưa chính xác. Bạn có thể trở về Trang chủ hoặc tìm nhóm sản phẩm cần trao đổi.</p>
      <div className="not-found-actions"><ActionLink href="/" label="Về Trang chủ" variant="button" /><ActionLink href="/san-pham" label="Khám phá sản phẩm" /></div>
    </Container>
  </main>;
}
