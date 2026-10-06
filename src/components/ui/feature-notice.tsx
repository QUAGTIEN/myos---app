import { Info } from "lucide-react";

export function FeatureNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="feature-notice">
      <Info size={17} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
