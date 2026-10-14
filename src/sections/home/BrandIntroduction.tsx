import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { ActionLink } from '@/components/ui/ActionLink';
import { companyMedia } from '@/content/company-media';
import { homeContent } from '@/content/home';

export function BrandIntroduction() {
  const copy = homeContent.introduction;
  return <section className="brand-introduction section-space" aria-labelledby="introduction-title">
    <Container className="introduction-layout">
      <CompanyPhoto media={companyMedia[0]} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 45vw, 42vw" className="introduction-photo" />
      <div className="introduction-copy">
        <SectionHeading id="introduction-title" {...copy} />
        <ul className="supply-approaches">
          {copy.approaches.map((approach, index) => <li key={approach}>
            <span className="approach-number" aria-hidden="true">0{index + 1}</span>{approach}
          </li>)}
        </ul>
        <ActionLink {...copy.link} />
      </div>
    </Container>
  </section>;
}
