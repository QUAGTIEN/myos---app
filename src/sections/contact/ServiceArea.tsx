import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { deliveryAreas } from '@/content/capabilities';

export function ServiceArea() {
  return <section className="contact-service-area section-space" aria-labelledby="contact-area-title">
    <Container className="contact-area-layout">
      <SectionHeading id="contact-area-title" eyebrow="HÀ NỘI & CÁC KHU VỰC LÂN CẬN" title="Cùng trao đổi về địa điểm giao nhận." description="Nêu rõ địa điểm nhận hàng hoặc khu công nghiệp trong yêu cầu để Sunflower cùng trao đổi phương án thực hiện." />
      <div data-reveal="right"><ul className="contact-area-list" aria-label="Khu vực hoạt động">{deliveryAreas.map(area => <li key={area}>{area}</li>)}</ul><p>Và các khu công nghiệp lân cận. Địa điểm và thời điểm thực hiện được thống nhất theo từng đơn hàng.</p></div>
    </Container>
  </section>;
}
