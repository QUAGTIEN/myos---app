import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ProductImage } from '@/components/products/ProductImage';
import { ActionLink } from '@/components/ui/ActionLink';
import { Arrow } from '@/components/ui/Arrow';
import { homeContent } from '@/content/home';
import { projectSamples, sampleCategories } from '@/content/projects';

export function FeaturedProjects() {
  const copy = homeContent.samples;
  const selected = copy.featuredSlugs.map(slug => projectSamples.find(item => item.slug === slug)!);
  return <section className="home-samples section-space" aria-labelledby="home-samples-title">
    <Container>
      <div className="section-topline"><SectionHeading id="home-samples-title" {...copy} /><ActionLink {...copy.link} /></div>
      <ul className="home-sample-gallery">
        {selected.map((sample, index) => <li key={sample.slug} data-reveal="depth-card" data-reveal-delay={index + 1}>
          <article aria-labelledby={`home-sample-${sample.slug}`}>
            <div className="home-sample-media"><ProductImage slug={sample.productSlug} sizes={index === 0 ? '(max-width: 767px) calc(100vw - 40px), 55vw' : '(max-width: 767px) calc(100vw - 72px), 240px'} /></div>
            <div className="home-sample-copy"><p className="section-eyebrow">{sampleCategories.find(category => category.id === sample.category)!.label}</p><h3 id={`home-sample-${sample.slug}`}>{sample.title}</h3><p>{sample.description}</p>
              <Link href={`/lien-he?du-an=${sample.slug}`} className="text-link" aria-label={`Trao đổi mẫu tương tự: ${sample.title}`}>Trao đổi mẫu tương tự<Arrow diagonal /></Link>
            </div>
          </article>
        </li>)}
      </ul>
      <p className="section-media-note">{copy.note}</p>
    </Container>
  </section>;
}
