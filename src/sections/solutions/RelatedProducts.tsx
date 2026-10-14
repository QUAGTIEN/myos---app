import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ActionLink } from '@/components/ui/ActionLink';

export function RelatedProducts() {
  return <section className="solutions-related section-space" aria-labelledby="solutions-products-title">
    <Container className="contact-cta-layout">
      <SectionHeading id="solutions-products-title" eyebrow="TỪ NHU CẦU ĐẾN SẢN PHẨM" title="Xem các nhóm sản phẩm để trao đổi phương án." description="Khám phá hình thức tem nhãn, bao bì, vật tư và thiết bị. Nội dung, mẫu và điều kiện sử dụng giúp làm rõ lựa chọn cho từng hạng mục." />
      <ActionLink href="/san-pham" label="Khám phá sản phẩm" />
    </Container>
  </section>;
}
