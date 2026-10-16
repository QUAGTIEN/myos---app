import { Suspense } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { InquiryForm } from '@/components/contact/InquiryForm';
import { ContactDetails } from './ContactDetails';

export function ContactInquiry() {
  return <section id="yeu-cau" className="contact-inquiry section-space" aria-labelledby="inquiry-title">
    <Container className="contact-inquiry-layout">
      <ContactDetails />
      <div className="contact-inquiry-panel">
        <SectionHeading id="inquiry-title" eyebrow="BÁO GIÁ / TƯ VẤN / HỢP TÁC" title="Cho chúng tôi biết bạn cần gì." description="Những thông tin đã có sẽ giúp xác định phần cần trao đổi tiếp theo." />
        <Suspense fallback={<div className="inquiry-loading" aria-busy="true"><p>Đang chuẩn bị biểu mẫu…</p><span /><span /><span /></div>}><InquiryForm /></Suspense>
        <noscript><p className="inquiry-no-script">Biểu mẫu chưa tiếp nhận yêu cầu. Cần bật JavaScript để nhập và xem lại thông tin.</p></noscript>
      </div>
    </Container>
  </section>;
}
