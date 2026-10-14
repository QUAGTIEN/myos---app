import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ActionLink } from '@/components/ui/ActionLink';
import { companyContent } from '@/content/company';

export function ContactCTA() {
  const copy = companyContent.inquiry;
  return <section className="contact-cta section-space" aria-labelledby="contact-cta-title">
    <Container className="contact-cta-layout">
      <SectionHeading id="contact-cta-title" {...copy} />
      <ActionLink {...copy.link} variant="button" />
    </Container>
  </section>;
}
