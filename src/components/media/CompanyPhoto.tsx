import Image from 'next/image';
import type { CompanyMedia } from '@/content/company-media';

// Illustration/credit stays attached to the photo in both editorial and feature layouts.
export function CompanyPhoto({ media, sizes, className = '' }: {
  media: CompanyMedia;
  sizes: string;
  className?: string;
}) {
  return <figure className={`company-photo ${className}`.trim()}>
    <div className="company-photo-frame">
      <Image src={media.webSrc ?? media.src} alt={media.alt} fill sizes={sizes} className="editorial-image" />
    </div>
    <figcaption>{media.caption} · {media.credit.photographer} / {media.credit.provider}</figcaption>
  </figure>;
}
