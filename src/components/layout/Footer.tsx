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
          <h2 className="footer-heading">Thông tin liên hệ</h2>
          <p className="contact-illustration-notice">{company.contact.notice}</p>
          <dl>
            <div><dt>Điện thoại</dt><dd>{company.contact.phone}</dd></div>
            <div><dt>Email</dt><dd>{company.contact.email}</dd></div>
            <div><dt>Địa chỉ</dt><dd>{company.contact.address}</dd></div>
          </dl>
          <Link className="footer-contact-link" href="/lien-he">Đến trang Liên hệ ↗</Link>
        </div>
      </div>
      <div className="footer-bottom"><p>Sunflower · Tem nhãn, bao bì & vật tư in ấn</p><p>Bản xem website đang phát triển</p></div>
    </Container>
  </footer>;
}
