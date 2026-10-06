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
