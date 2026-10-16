import Link from 'next/link';
import { Container } from './Container';
import { companyContent as company } from '@/content/company';
import { siteRoutes } from '@/content/navigation';
import { BrandMark } from './BrandMark';

export function Footer() {
  return <footer className="site-footer">
    <Container>
      <div className="footer-layout">
        <div className="footer-brand">
          <Link href="/" className="brand-home" aria-label="Sunflower — Trang chủ">
            <BrandMark />
          </Link>
          <p>{company.description}</p>
          <h2 className="footer-heading">Khu vực hoạt động</h2>
          <p>{company.serviceArea}</p>
        </div>
        <nav aria-label="Điều hướng cuối trang">
          <h2 className="footer-heading">Khám phá Sunflower</h2>
          <ul>{siteRoutes.map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>
        </nav>
        <div className="footer-contact">
          <h2 className="footer-heading">Bắt đầu trao đổi</h2>
          <p>Sản phẩm cần làm, quy cách, số lượng và địa điểm nhận hàng — những thông tin đầu tiên để cùng xác định phương án.</p>
          <Link className="footer-contact-link" href="/lien-he">Đến trang Liên hệ ↗</Link>
        </div>
      </div>
      <p className="footer-signature" aria-hidden="true">SUNFLOWER<span>.</span></p>
      <div className="footer-bottom"><p>Tem nhãn · Bao bì · Vật tư in ấn</p><a href="#main-content">Về đầu trang ↑</a></div>
    </Container>
  </footer>;
}
