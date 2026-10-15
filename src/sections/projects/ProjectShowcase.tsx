import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ProjectGallery } from '@/components/projects/ProjectGallery';

export function ProjectShowcase() {
  return <section id="mau-tham-khao" className="project-showcase section-space" aria-labelledby="project-showcase-title">
    <Container>
      <SectionHeading id="project-showcase-title" eyebrow="QUAN SÁT HÌNH THỨC & CHI TIẾT" title="Tìm mẫu gần với nhu cầu của bạn." description="Tham khảo hình thức sản phẩm, cách bố trí thông tin và các chi tiết thể hiện trong ảnh để bắt đầu trao đổi về mẫu riêng." />
      <p className="sample-provenance">Hình ảnh sản phẩm minh họa, không phải hồ sơ dự án khách hàng của Sunflower. Mẫu, vật liệu và quy cách sẽ được trao đổi theo yêu cầu của bạn.</p>
      <ProjectGallery />
    </Container>
  </section>;
}
