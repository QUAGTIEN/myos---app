import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { ActionLink } from '@/components/ui/ActionLink';
import { companyMedia } from '@/content/company-media';
import { homeContent } from '@/content/home';

export function BrandIntroduction() {
  const copy = homeContent.introduction;
  return <section className="brand-introduction editorial-introduction section-space" aria-labelledby="introduction-title">
    <Container className="introduction-layout">
      <SectionHeading id="introduction-title" eyebrow={copy.eyebrow} title={copy.title} variant="statement" className="introduction-heading" />
      <div className="introduction-photo-reveal" data-reveal="sheet-photo">
        <CompanyPhoto media={companyMedia[0]} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 45vw, 42vw" className="introduction-photo" />
      </div>
      <div className="introduction-copy">
        <p className="section-description" data-reveal="up">{copy.description}</p>
        <ul className="supply-approaches">
          {copy.approaches.map((approach, index) => <li key={approach} data-reveal="ink-rule" data-reveal-delay={index + 1}>
            <span className="approach-number" aria-hidden="true">0{index + 1}</span>{approach}
          </li>)}
        </ul>
        <div data-reveal="up" data-reveal-delay="4"><ActionLink {...copy.link} /></div>
      </div>
    </Container>
  </section>;
}
