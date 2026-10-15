import { productionSteps } from '@/content/capabilities';

export function ProcessTimeline() {
  return <ol className="process-timeline">{productionSteps.map((step, index) => <li key={step.title} data-reveal="right"><span className="process-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>;
}
