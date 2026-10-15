import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';
import { Arrow } from '@/components/ui/Arrow';

export function RouteLinks({ id, eyebrow, title, description, items }: {
  id: string; eyebrow: string; title: string; description: string;
  items: readonly { href: string; label: string; description: string }[];
}) {
  return <section className="related-routes section-space" aria-labelledby={id}>
    <Container className="related-routes-layout">
      <SectionHeading id={id} eyebrow={eyebrow} title={title} description={description} />
      <div className="related-route-list">{items.map(item => <Link key={item.href} href={item.href} data-reveal="right"><span><strong>{item.label}</strong><small>{item.description}</small></span><Arrow diagonal /></Link>)}</div>
    </Container>
  </section>;
}
