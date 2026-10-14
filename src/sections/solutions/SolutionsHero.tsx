import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { ActionLink } from '@/components/ui/ActionLink';
import { productMedia } from '@/content/product-media';
import type { ProductMedia } from '@/content/product-media';

export function SolutionsHero() {
  const media: ProductMedia = productMedia.find(item => item.slug === 'bang-dinh')!;
  return <section className="solutions-hero" aria-labelledby="solutions-title">
    <div className="solutions-hero-media" data-reveal="hero-media">
      <Image src={media.webSrc ?? media.src} alt={media.alt} fill priority sizes="100vw" className="editorial-image" />
    </div>
    <Container className="solutions-hero-content">
      <p className="section-eyebrow" data-reveal="up">GIẢI PHÁP THEO NHU CẦU</p>
      <h1 id="solutions-title"><span data-reveal="hero-title">Chọn tem nhãn</span>{' '}<span data-reveal="hero-title" data-reveal-delay="1">từ cách bạn sử dụng.</span></h1>
      <p data-reveal="up" data-reveal-delay="2">Thông tin cần thể hiện, vị trí sử dụng và cách vận hành là cơ sở để lựa chọn tem nhãn, vật liệu hoặc thiết bị. Sunflower cùng bạn làm rõ yêu cầu trước khi xác định phương án.</p>
      <div data-reveal="up" data-reveal-delay="3"><ActionLink href="#nhu-cau" label="Tìm theo nhu cầu" variant="button" /></div>
      <span className="solutions-hero-caption">Ảnh minh họa sản phẩm & đóng gói</span>
    </Container>
  </section>;
}
