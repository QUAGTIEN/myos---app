import Link from 'next/link';
import { Arrow } from './Arrow';

export function ActionLink({ href, label, variant = 'text', className = '' }: {
  href: string;
  label: string;
  variant?: 'text' | 'button';
  className?: string;
}) {
  return <Link href={href} className={`${variant === 'button' ? 'button button-primary' : 'text-link'} ${className}`.trim()}>
    {label}<Arrow diagonal={variant === 'button'} />
  </Link>;
}
