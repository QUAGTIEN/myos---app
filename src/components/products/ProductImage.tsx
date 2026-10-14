import Image from 'next/image';
import { productMedia, type ProductMedia } from '@/content/product-media';

// Keep low-resolution source photos at their natural size, never upscale thumbnails.
export function ProductImage({ slug, sizes, priority = false }: {
  slug: string;
  sizes: string;
  priority?: boolean;
}) {
  const media: ProductMedia | undefined = productMedia.find(item => item.slug === slug);
  if (!media) return null;
  return <div className="product-image-bounds"><Image
    src={media.webSrc ?? media.src}
    alt={media.alt}
    width={media.width}
    height={media.height}
    sizes={sizes}
    priority={priority}
    className="catalogue-image"
    style={{ maxWidth: media.width, maxHeight: media.height }}
  /></div>;
}
