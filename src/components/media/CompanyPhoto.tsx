import Image from 'next/image';
import type { CompanyMedia } from '@/content/company-media';

// Provenance and credits are maintained in company-media.ts and MEDIA_BRIEF.md.
export function CompanyPhoto({ media, sizes, className = '', priority = false }: {
  media: CompanyMedia;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return <figure className={`company-photo ${className}`.trim()}>
    <div className="company-photo-frame">
      <Image src={media.webSrc ?? media.src} alt={media.alt} fill sizes={sizes} priority={priority} className="editorial-image" />
    </div>
  </figure>;
}
