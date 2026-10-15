import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ProductDepthScene } from '@/components/products/ProductDepthScene';

export function WorkPreparation() {
  return <section className="work-preparation section-space" aria-labelledby="work-preparation-title">
    <Container className="work-preparation-layout">
      <div>
        <SectionHeading id="work-preparation-title" eyebrow="LÀM RÕ TRƯỚC KHI TRIỂN KHAI" title="Xác định công đoạn theo từng mặt hàng." description="Phương án thực hiện được trao đổi dựa trên vật liệu, kích thước, nội dung và yêu cầu hoàn thiện." />
        <p className="preparation-description" data-reveal="up">Những công đoạn thiết kế, gia công hoặc sản xuất được làm rõ trước khi triển khai để các phần việc có cùng cơ sở thực hiện.</p>
        <ul className="preparation-topics" aria-label="Các nội dung cần thống nhất" data-reveal="up"><li>Vật liệu & kích thước</li><li>Nội dung & mẫu</li><li>Hình thức bàn giao</li></ul>
      </div>
      <ProductDepthScene compact />
    </Container>
  </section>;
}
