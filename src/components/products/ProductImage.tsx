import Image from 'next/image';
import { productMedia, type ProductMedia } from '@/content/product-media';
import { productCategories } from '@/content/products';
import { ImageInspection } from './ImageInspection';

// Keep low-resolution source photos at their natural size, never upscale thumbnails.
export function ProductImage({ slug, sizes, priority = false, inspect = false }: {
  slug: string;
  sizes: string;
  priority?: boolean;
  inspect?: boolean;
}) {
  const media: ProductMedia | undefined = productMedia.find(item => item.slug === slug);
  if (!media) return null;
  // Only sources with enough real pixels support the inspection treatment.
  if (inspect && media.width >= 1000 && media.height >= 700) return <ImageInspection media={media} name={productCategories.find(item => item.slug === slug)!.name} sizes={sizes} />;
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
