import { Image as ImageIcon, NotebookPen, Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { FeatureNotice } from "@/components/ui/feature-notice";
import { PageHeading } from "@/components/ui/page-heading";

export function NotesScreen() {
  return (
    <>
      <PageHeading
        eyebrow="ĐỪNG ĐỂ Ý TƯỞNG TRÔI MẤT"
        title="Ghi chú"
        description="Giữ lại một suy nghĩ, một tấm hình hay điều bạn muốn nhớ."
        action={
          <button
            className="button primary"
            type="button"
            disabled
            aria-describedby="notes-status"
          >
            <Plus size={18} aria-hidden="true" />
            Tạo ghi chú
          </button>
        }
      />
      <div id="notes-status">
        <FeatureNotice>
          Trình soạn thảo, tải ảnh và lưu tự động sẽ được kết nối trong module
          Ghi chú.
        </FeatureNotice>
      </div>
      <section className="panel notes-layout">
        <aside className="notes-collections" aria-label="Thư mục ghi chú">
          <h2>Thư viện</h2>
          <div className="collection-label">
            <NotebookPen size={18} aria-hidden="true" />
            Tất cả ghi chú
          </div>
          <p>Thư mục và nhãn sẽ giúp bạn tìm lại nội dung dễ dàng hơn.</p>
        </aside>
        <div className="notes-empty">
          <EmptyState
            icon={NotebookPen}
            title="Một trang mới, nhiều điều để viết"
            description="Không cần phải là một ý tưởng lớn. Bắt đầu từ những điều nhỏ bạn muốn giữ lại."
          />
          <div className="notes-hint">
            <ImageIcon size={18} aria-hidden="true" />
            <span>Nội dung và hình ảnh, cùng một ghi chú.</span>
          </div>
        </div>
      </section>
    </>
  );
}
