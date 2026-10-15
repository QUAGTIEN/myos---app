import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ActionLink } from '@/components/ui/ActionLink';
import { companyContent } from '@/content/company';

export function CompanyOverview() {
  return <section id="ve-sunflower" className="company-overview section-space" aria-labelledby="company-overview-title">
    <Container className="company-overview-layout">
      <SectionHeading id="company-overview-title" eyebrow="THƯƠNG MẠI & SẢN XUẤT" title="Sunflower là ai?" />
      <div className="editorial-prose" data-reveal="right">
        <p className="editorial-lead">Chúng tôi cung cấp tem nhãn, bao bì, vật tư và thiết bị phục vụ hoạt động in ấn, nhận diện sản phẩm.</p>
        <p>Tùy từng đơn hàng, Sunflower có thể cung ứng nguyên vật liệu, gia công từ vật liệu hoặc thực hiện thiết kế và sản xuất theo yêu cầu.</p>
        <p>Phạm vi hoạt động tập trung tại {companyContent.serviceArea} Nhu cầu, quy cách và địa điểm giao nhận được làm rõ trong quá trình trao đổi với từng khách hàng.</p>
        <ActionLink href="/san-pham" label="Khám phá sản phẩm" />
      </div>
    </Container>
  </section>;
}
