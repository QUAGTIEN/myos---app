import { Container } from '@/components/layout/Container';
import { ProductImage } from '@/components/products/ProductImage';
import { ActionLink } from '@/components/ui/ActionLink';

export function ProjectsHero() {
  return <section className="projects-hero" aria-labelledby="projects-title">
    <Container className="projects-hero-layout">
      <div className="projects-hero-copy">
        <p className="section-eyebrow" data-reveal="up">MẪU THÀNH PHẨM</p>
        <h1 id="projects-title"><span data-reveal="hero-title">Xem tổng thể.</span>{' '}<span data-reveal="hero-title" data-reveal-delay="1">Hiểu từng chi tiết.</span></h1>
        <p data-reveal="up" data-reveal-delay="2">Góc nhìn về tem nhãn, bao bì và các hạng mục hoàn thiện — từ hình thức tổng thể đến vật liệu, nội dung in và chi tiết gia công.</p>
        <div data-reveal="up" data-reveal-delay="3"><ActionLink href="#mau-tham-khao" label="Khám phá mẫu tham khảo" variant="button" /></div>
      </div>
      <figure className="sample-composition" data-reveal="scene" aria-label="Mẫu nhãn dệt và băng dính dùng đóng gói">
        <div className="sample-composition-back"><ProductImage slug="tem-det" sizes="(max-width: 767px) 65vw, 360px" priority /></div>
        <div className="sample-composition-front"><ProductImage slug="bang-dinh" sizes="(max-width: 767px) 70vw, 460px" priority /></div>
      </figure>
    </Container>
  </section>;
}
