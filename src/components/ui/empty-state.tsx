import type { LucideIcon } from "lucide-react";
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
