import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { companyMedia } from '@/content/company-media';
import { deliveryAreas } from '@/content/capabilities';

export function CollaborationDelivery() {
  return <section className="collaboration-delivery section-space" aria-labelledby="delivery-title">
    <Container className="delivery-layout">
      <div data-reveal="image-mask"><CompanyPhoto media={companyMedia.find(item => item.id === 'press-operators')!} sizes="(max-width: 767px) calc(100vw - 40px), 45vw" /></div>
      <div>
        <SectionHeading id="delivery-title" eyebrow="KHU VỰC HOẠT ĐỘNG" title={["Phối hợp giao nhận", "theo đơn hàng."]} variant="process" description="Địa điểm nhận, số lượng bàn giao và thời điểm thực hiện được trao đổi trong quá trình xác nhận đơn hàng." />
        <ul className="delivery-areas" aria-label="Các khu vực hoạt động">{deliveryAreas.map(area => <li key={area}>{area}</li>)}</ul>
        <p className="delivery-note">Cùng các khu công nghiệp lân cận. Với đơn có nhiều mặt hàng hoặc nhu cầu giao theo đợt, bạn có thể nêu rõ yêu cầu để cùng thống nhất phương án.</p>
      </div>
    </Container>
  </section>;
}
