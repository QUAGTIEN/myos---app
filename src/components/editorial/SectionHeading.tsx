export function SectionHeading({ id, eyebrow, title, description, className = '' }: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return <div className={`section-heading ${className}`.trim()}>
    <p className="section-eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    {description && <p className="section-description">{description}</p>}
  </div>;
}
