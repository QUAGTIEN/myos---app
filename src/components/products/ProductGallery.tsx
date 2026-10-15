import Link from 'next/link';
import { productCategories } from '@/content/products';
import { productMedia, type ProductMedia } from '@/content/product-media';
import { ProductImage } from './ProductImage';
import { Arrow } from '@/components/ui/Arrow';

export function ProductGallery({ slugs }: { slugs: readonly string[] }) {
  return <div className="product-gallery" data-reveal="product-gallery">
    {slugs.map((slug, index) => {
      const product = productCategories.find(item => item.slug === slug);
      const media: ProductMedia | undefined = productMedia.find(item => item.slug === slug);
      if (!product || !media) return null;
      return <article className="product-feature" data-sequence-index={(index % 4) + 1} key={slug}>
        <div className="product-feature-media">
          <span className="product-sheet-edge" aria-hidden="true" />
          <ProductImage slug={slug} sizes="(max-width: 767px) calc(100vw - 88px), (max-width: 1199px) 42vw, 550px" inspect />
        </div>
        <div className="product-feature-copy">
          <div className="product-feature-heading"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3><Link href={`/san-pham/#${slug}`}>{product.name}<Arrow diagonal /></Link></h3></div>
          <p>{product.description}</p>
        </div>
      </article>;
    })}
  </div>;
}
