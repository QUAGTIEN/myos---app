import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { specificationsGuide } from '@/content/products';

export function SpecificationsGuide() {
  return <section className="specifications-guide section-space" aria-labelledby="specifications-title">
    <Container className="specifications-layout">
      <div>
        <SectionHeading id="specifications-title" eyebrow="TỪ NHU CẦU ĐẾN QUY CÁCH" title={["Chuẩn bị thông tin", "để trao đổi quy cách."]} variant="ribbon" description="Bạn có thể bắt đầu bằng một ảnh mẫu, file thiết kế hoặc mô tả ngắn. Những thông tin này giúp Sunflower làm rõ yêu cầu." />
        <p className="specifications-note">Thông số vật liệu, loại mực, model thiết bị và phương án gia công cụ thể sẽ được đối chiếu trong quá trình tư vấn, báo giá.</p>
      </div>
      <ol className="specifications-steps">{specificationsGuide.map((step, index) => <li key={step.title} data-reveal="right" data-reveal-delay={(index % 3) + 1}><span className="specification-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
    </Container>
  </section>;
}
