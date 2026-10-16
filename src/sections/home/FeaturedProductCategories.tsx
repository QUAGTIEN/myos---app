import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ActionLink } from '@/components/ui/ActionLink';
import { homeContent } from '@/content/home';
import { ProductDepthScene } from '@/components/products/ProductDepthScene';

export function FeaturedProductCategories() {
  const copy = homeContent.products;
  return <section className="featured-products section-space" aria-labelledby="products-title">
    <Container>
      <div className="section-topline">
        <SectionHeading id="products-title" {...copy} />
        <ActionLink {...copy.link} />
      </div>
      <ProductDepthScene />
      <ProductGallery slugs={copy.featuredSlugs} />
    </Container>
  </section>;
}
