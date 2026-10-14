import Image from 'next/image';
import { productCategories } from '@/content/products';
import { productMedia } from '@/content/product-media';

export function ProductGallery({ slugs }: { slugs: readonly string[] }) {
  return <div className="product-gallery" data-reveal="product-gallery">
    {slugs.map((slug, index) => {
      const product = productCategories.find(item => item.slug === slug);
      const media = productMedia.find(item => item.slug === slug);
      if (!product || !media) return null;
      return <article className="product-feature" data-sequence-index={(index % 4) + 1} key={slug}>
        <div className="product-feature-media">
          <Image src={'webSrc' in media ? media.webSrc : media.src} alt={media.alt} width={media.width} height={media.height}
            sizes="(max-width: 767px) calc(100vw - 88px), 480px" className="product-feature-image" />
        </div>
        <div className="product-feature-copy">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      </article>;
    })}
  </div>;
}
