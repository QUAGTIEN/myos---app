export function SectionHeading({ id, eyebrow, title, description, className = '', variant = 'default' }: {
  id: string;
  eyebrow: string;
  title: string | readonly string[];
  description?: string;
  className?: string;
  variant?: 'default' | 'statement' | 'ribbon' | 'process';
}) {
  return <div className={`section-heading section-heading-${variant} ${className}`.trim()} data-reveal={variant === 'default' ? 'up' : undefined}>
    <p className="section-eyebrow" data-reveal={variant === 'default' ? undefined : 'up'}>{eyebrow}</p>
    <h2 id={id}>{typeof title === 'string' ? title : title.map((phrase, index) => <span className="editorial-phrase" data-reveal="type-rise" data-reveal-delay={index + 1} key={phrase}>{index > 0 && ' '}{phrase}</span>)}</h2>
    {description && <p className="section-description">{description}</p>}
  </div>;
}
