import { productionSteps } from '@/content/capabilities';

export function ProcessTimeline({ compact = false }: { compact?: boolean } = {}) {
  return <ol className={`process-timeline${compact ? ' process-timeline-compact' : ''}`}>{productionSteps.map((step, index) => <li key={step.title} data-reveal="right" data-reveal-delay={compact ? (index % 3) + 1 : undefined}><span className="process-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>;
}
