import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ProductImage } from '@/components/products/ProductImage';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { ActionLink } from '@/components/ui/ActionLink';
import { Arrow } from '@/components/ui/Arrow';
import { homeContent } from '@/content/home';
import { solutions } from '@/content/solutions';
import { companyMedia } from '@/content/company-media';

export function SolutionsByIndustry() {
  const copy = homeContent.solutions;
  const selected = copy.featuredSlugs.map(slug => solutions.find(item => item.slug === slug)!);
  return <section className="home-solutions section-space" aria-labelledby="home-solutions-title">
    <Container className="home-solutions-layout">
      <div className="home-solutions-intro">
        <SectionHeading id="home-solutions-title" {...copy} />
        <ActionLink {...copy.link} />
      </div>
      <ul className="home-solution-list">
        {selected.map((solution, index) => {
          const media = solution.media;
          return <li key={solution.slug} data-reveal="right" data-reveal-delay={index + 1}>
          <Link href={`/giai-phap/#${solution.slug}`} className="home-solution-link" aria-labelledby={`home-solution-${solution.slug}`}>
            <div className="home-solution-media">
              {media.kind === 'product'
                ? <ProductImage slug={media.slug} sizes="(max-width: 600px) calc(100vw - 72px), 240px" />
                : <CompanyPhoto media={companyMedia.find(item => item.id === media.id)!} sizes="240px" />}
              <span className="home-image-label">Ảnh minh họa</span>
            </div>
            <div className="home-solution-copy"><span className="home-entry-number" aria-hidden="true">0{index + 1}</span><h3 id={`home-solution-${solution.slug}`}>{solution.label}</h3><p>{solution.problem}</p><span className="home-entry-action">Khám phá giải pháp <Arrow diagonal /></span></div>
          </Link>
        </li>;
        })}
      </ul>
    </Container>
  </section>;
}
