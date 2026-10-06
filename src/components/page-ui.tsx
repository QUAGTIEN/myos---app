import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={32} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}

export function PageHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div aria-label="Đang tải nội dung" role="status" className="page-skeleton">
      <span className="sr-only">Đang tải nội dung…</span>
      <div className="skeleton skeleton-title" />
      <div className="skeleton-grid">
        {[0, 1, 2].map((item) => (
          <div key={item} className="skeleton skeleton-panel" />
        ))}
      </div>
    </div>
  );
}
