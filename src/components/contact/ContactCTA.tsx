import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ActionLink } from '@/components/ui/ActionLink';
import { companyContent } from '@/content/company';

export function ContactCTA({ title, description, label, tone = 'light' }: { title?: string; description?: string; label?: string; tone?: 'light' | 'brand' } = {}) {
  const copy = { ...companyContent.inquiry, ...(title ? { title } : {}), ...(description ? { description } : {}) };
  return <section className={`contact-cta section-space${tone === 'brand' ? ' contact-cta-brand' : ''}`} aria-labelledby="contact-cta-title">
    <div className="cta-label-ribbon" aria-hidden="true" data-reveal="ribbon-open"><span /><span /><span /></div>
    <Container className="contact-cta-layout">
      <SectionHeading id="contact-cta-title" {...copy} title={title ?? ['Bắt đầu từ', 'yêu cầu của bạn.']} variant="ribbon" />
      <div data-reveal="right" data-reveal-delay="2"><ActionLink {...copy.link} label={label ?? copy.link.label} variant="button" /></div>
    </Container>
  </section>;
}
