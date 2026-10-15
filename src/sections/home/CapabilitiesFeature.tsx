import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { ActionLink } from '@/components/ui/ActionLink';
import { homeContent } from '@/content/home';
import { companyMedia } from '@/content/company-media';
import { supplyModels } from '@/content/capabilities';

export function CapabilitiesFeature() {
  const copy = homeContent.capabilities;
  const media = companyMedia.find(item => item.id === copy.mediaId)!;
  return <section className="home-capabilities section-space" aria-labelledby="home-capabilities-title">
    <Container>
      <div className="section-topline">
        <SectionHeading id="home-capabilities-title" {...copy} />
        <ActionLink {...copy.link} />
      </div>
      <div className="home-capabilities-media" data-reveal="image-mask">
        <CompanyPhoto media={media} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1440px) 90vw, 1320px" />
      </div>
      <ol className="home-supply-models" aria-label="Ba hình thức thực hiện">
        {supplyModels.map((model, index) => <li key={model.title} data-reveal="up" data-reveal-delay={index + 1}>
          <span className="home-model-number" aria-hidden="true">0{index + 1}</span>
          <h3>{model.title}</h3><p>{model.description}</p>
        </li>)}
      </ol>
    </Container>
  </section>;
}
