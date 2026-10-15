import { Container } from '@/components/layout/Container';
import { ActionLink } from '@/components/ui/ActionLink';

export function ContactHero() {
  return <section className="contact-hero" aria-labelledby="contact-title">
    <Container className="contact-hero-layout">
      <div><p className="section-eyebrow" data-reveal="up">LIÊN HỆ SUNFLOWER</p><h1 id="contact-title"><span data-reveal="hero-title">Trao đổi nhu cầu.</span>{' '}<span data-reveal="hero-title" data-reveal-delay="1">Làm rõ phương án.</span></h1></div>
      <div className="contact-hero-copy" data-reveal="right" data-reveal-delay="2"><p>Bạn đang cần tem nhãn, bao bì, nguyên vật liệu hoặc thiết bị? Mô tả sản phẩm, quy cách và số lượng để Sunflower cùng trao đổi các phần việc cần thực hiện.</p><ActionLink href="#yeu-cau" label="Chuẩn bị yêu cầu" variant="button" /></div>
    </Container>
  </section>;
}
