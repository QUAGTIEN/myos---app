import { Info, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "empty-state compact" : "empty-state"}>
      <span className="empty-icon">
        <Icon size={compact ? 25 : 32} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

export function FeatureNotice({ children }: { children: ReactNode }) {
  return (
    <div className="feature-notice">
      <Info size={17} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div aria-label="Đang tải nội dung" role="status" className="page-skeleton">
      <span className="sr-only">Đang tải nội dung…</span>
      <div className="skeleton skeleton-eyebrow" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-description" />
      <div className="skeleton-grid">
        {[0, 1, 2].map((item) => (
          <div key={item} className="skeleton skeleton-panel" />
        ))}
      </div>
    </div>
  );
}
