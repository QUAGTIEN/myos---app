import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { ProcessTimeline } from '@/components/capabilities/ProcessTimeline';

export function ProductionProcess() {
  return <section id="quy-trinh" className="production-process section-space" aria-labelledby="process-title">
    <Container className="production-process-layout">
      <div className="process-introduction">
        <SectionHeading id="process-title" eyebrow="QUY TRÌNH PHỐI HỢP" title={["Từ yêu cầu", "đến giao nhận."]} variant="process" description="Các phần việc tiếp nối theo thông tin đã thống nhất của từng đơn hàng." />
        <p className="process-note">Đơn cung ứng vật tư hoặc hàng hóa không cần thiết kế mới sẽ đi theo các bước tương ứng. Thiết kế, chuẩn bị vật tư và sản xuất có thể được phối hợp theo từng hạng mục.</p>
      </div>
      <ProcessTimeline />
    </Container>
  </section>;
}
