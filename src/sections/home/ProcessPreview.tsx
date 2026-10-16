import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ProcessTimeline } from '@/components/capabilities/ProcessTimeline';
import { ActionLink } from '@/components/ui/ActionLink';
import { homeContent } from '@/content/home';

export function ProcessPreview() {
  const copy = homeContent.process;
  return <section className="home-process section-space" aria-labelledby="home-process-title">
    <Container>
      <div className="section-topline"><SectionHeading id="home-process-title" {...copy} variant="ribbon" /><ActionLink {...copy.link} /></div>
      <ProcessTimeline compact />
    </Container>
  </section>;
}
