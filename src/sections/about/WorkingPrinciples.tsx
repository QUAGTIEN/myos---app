import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { companyPrinciples } from '@/content/company';

export function WorkingPrinciples() {
  return <section className="working-principles section-space" aria-labelledby="working-principles-title">
    <Container>
      <SectionHeading id="working-principles-title" eyebrow="ĐIỀU CHÚNG TÔI CHÚ TRỌNG" title="Rõ yêu cầu. Rõ phần việc. Rõ thông tin bàn giao." />
      <ol className="principle-list">{companyPrinciples.map((item, index) => <li key={item.title} data-reveal="up" data-reveal-delay={index + 1}><span className="principle-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol>
    </Container>
  </section>;
}
