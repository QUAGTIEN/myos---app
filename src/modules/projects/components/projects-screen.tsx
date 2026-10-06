import { FolderKanban, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { FeatureNotice } from "@/components/ui/feature-notice";
import { PageHeading } from "@/components/ui/page-heading";

export function ProjectsScreen() {
  return (
    <>
      <PageHeading
        eyebrow="TỪ Ý TƯỞNG ĐẾN KẾT QUẢ"
        title="Dự án"
        description="Một góc riêng cho mục tiêu, nội dung và những bước tiến của bạn."
        action={
          <button
            className="button primary"
            type="button"
            disabled
            aria-describedby="projects-status"
          >
            <Plus size={18} aria-hidden="true" />
            Tạo dự án
          </button>
        }
      />
      <div id="projects-status">
        <FeatureNotice>
          Chưa kết nối dữ liệu. Tạo dự án và cập nhật tiến độ sẽ được triển khai
          trong module Dự án.
        </FeatureNotice>
      </div>
      <section className="panel large-empty">
        <div className="panel-heading">
          <h2>Không gian dự án</h2>
          <span className="muted">Chưa có dự án</span>
        </div>
        <EmptyState
          icon={FolderKanban}
          title="Mục tiêu tiếp theo của bạn là gì?"
          description="Mỗi dự án sẽ có nội dung, checklist và tiến độ riêng để bạn theo dõi từng bước."
        />
        <div className="feature-strip">
          <span>Nội dung & tài liệu</span>
          <span>Checklist & cột mốc</span>
          <span>Tiến độ rõ ràng</span>
        </div>
      </section>
    </>
  );
}
