import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { ActionLink } from '@/components/ui/ActionLink';
import { companyMedia } from '@/content/company-media';
import { homeContent } from '@/content/home';

export function WhySunflower() {
  const copy = homeContent.collaboration;
  return <section className="why-sunflower editorial-collaboration section-space" aria-labelledby="collaboration-title">
    <Container>
      <div className="section-topline">
        <SectionHeading id="collaboration-title" {...copy} variant="ribbon" />
        <ActionLink {...copy.link} variant="button" />
      </div>
      <div className="collaboration-gallery">
        {copy.items.map((item, index) => {
          const media = companyMedia.find(photo => photo.id === item.mediaId);
          if (!media) return null;
          return <article className="collaboration-feature" data-reveal="story-row" key={item.title}>
            <CompanyPhoto media={media} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 45vw, 55vw" />
            <div className="collaboration-feature-copy">
              <span className="feature-number" aria-hidden="true">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>;
        })}
      </div>
    </Container>
  </section>;
}
