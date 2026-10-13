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
    <div className={action ? "page-heading" : "sr-only"}>
      <div className="sr-only">
        <h1>{title}</h1>
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

export function PageSkeleton({
  variant = "list",
}: {
  variant?: "list" | "cards" | "calendar" | "overview";
}) {
  return (
    <div
      aria-label="Đang tải nội dung"
      role="status"
      className={"page-skeleton loading-" + variant}
    >
      <span className="sr-only">Đang tải nội dung…</span>
      <div aria-hidden="true" className="loading-preview">
        {variant === "calendar" ? (
          <>
            <div className="loading-calendar-header">
              {Array.from({ length: 7 }, (_, i) => (
                <span className="skeleton" key={i} />
              ))}
            </div>
            <div className="loading-calendar-grid">
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i}>
                  <span className="skeleton" />
                  {i % 4 === 0 && (
                    <span className="skeleton loading-calendar-event" />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : variant === "list" ? (
          <div className="loading-list">
            {Array.from({ length: 5 }, (_, i) => (
              <div className="loading-row" key={i}>
                <span className="skeleton loading-check" />
                <span
                  className="skeleton"
                  style={{ width: `${48 + (i % 3) * 15}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            {variant === "overview" && (
              <div className="loading-metrics">
                {[0, 1, 2, 3].map((i) => (
                  <div className="skeleton" key={i} />
                ))}
              </div>
            )}
            <div className="loading-cards">
              {Array.from(
                { length: variant === "overview" ? 3 : 6 },
                (_, i) => (
                  <div className="loading-card" key={i}>
                    <span className="skeleton" />
                    <span className="skeleton" />
                    <span className="skeleton" />
                  </div>
                ),
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
