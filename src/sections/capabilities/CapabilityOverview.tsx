import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ActionLink } from '@/components/ui/ActionLink';
import { supplyModels } from '@/content/capabilities';

export function CapabilityOverview() {
  return <section id="hinh-thuc-thuc-hien" className="capability-overview section-space" aria-labelledby="supply-models-title">
    <Container>
      <SectionHeading id="supply-models-title" eyebrow="PHẠM VI THỰC HIỆN" title="Ba hình thức đáp ứng nhu cầu." description="Việc áp dụng hình thức nào được trao đổi theo từng sản phẩm và quy cách đã thống nhất." />
      <div className="supply-models">{supplyModels.map((model, index) => <article key={model.title} data-reveal="depth-card" data-reveal-delay={index + 1}><span className="supply-model-number">0{index + 1}</span><h3>{model.title}</h3><p>{model.description}</p><ActionLink {...model.link} /></article>)}</div>
    </Container>
  </section>;
}
