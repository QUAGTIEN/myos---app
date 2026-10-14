import { Container } from '@/components/layout/Container';
import { ProductDepthScene } from '@/components/products/ProductDepthScene';
import { ActionLink } from '@/components/ui/ActionLink';

export function ProductsHero() {
  return <section className="products-hero" aria-labelledby="products-title">
    <Container className="products-hero-layout">
      <div className="interior-hero-copy">
        <p className="section-eyebrow" data-reveal="up">SẢN PHẨM SUNFLOWER</p>
        <h1 id="products-title">
          <span data-reveal="hero-title">Tem nhãn, bao bì</span>{' '}
          <span data-reveal="hero-title" data-reveal-delay="1">và vật tư cho</span>{' '}
          <span data-reveal="hero-title" data-reveal-delay="2">nhu cầu của bạn.</span>
        </h1>
        <p className="interior-hero-description" data-reveal="up" data-reveal-delay="3">Chọn nhóm sản phẩm cần tìm và trao đổi về quy cách, số lượng, nội dung thiết kế hoặc điều kiện sử dụng. Phương án cung ứng, gia công hay sản xuất được xác định theo từng mặt hàng.</p>
        <div className="interior-hero-actions" data-reveal="up" data-reveal-delay="4"><ActionLink href="#danh-muc" label="Khám phá danh mục" variant="button" /></div>
      </div>
      <ProductDepthScene compact />
    </Container>
    <Container><div className="products-hero-footnote"><span>13 nhóm sản phẩm</span><span>Cung ứng · Thiết kế · Gia công · Sản xuất</span></div></Container>
  </section>;
}
