import { Container } from '@/components/layout/Container';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { ActionLink } from '@/components/ui/ActionLink';
import { companyMedia } from '@/content/company-media';

export function EditorialHero({ id, eyebrow, lines, description, mediaId, variant = 'curve', action }: {
  id: string;
  eyebrow: string;
  lines: readonly string[];
  description: string;
  mediaId: typeof companyMedia[number]['id'];
  variant?: 'curve' | 'split';
  action: { href: string; label: string };
}) {
  const media = companyMedia.find(item => item.id === mediaId)!;
  return <section className={`editorial-page-hero editorial-page-hero-${variant}`} aria-labelledby={id}>
    <div className="editorial-hero-shape" aria-hidden="true" />
    <Container className="editorial-hero-layout">
      <div className="editorial-hero-copy">
        <p className="section-eyebrow" data-reveal="up">{eyebrow}</p>
        <h1 id={id}>{lines.map((line, index) => <span key={line} data-reveal="hero-title" data-reveal-delay={index}>{line}{index < lines.length - 1 ? ' ' : ''}</span>)}</h1>
        <p className="editorial-hero-description" data-reveal="up" data-reveal-delay="3">{description}</p>
        <div className="editorial-hero-action" data-reveal="up" data-reveal-delay="4"><ActionLink {...action} variant="button" /></div>
      </div>
      <div className="editorial-hero-photo" data-reveal="hero-media"><CompanyPhoto media={media} sizes="(max-width: 900px) calc(100vw - 40px), 48vw" priority /></div>
    </Container>
  </section>;
}
