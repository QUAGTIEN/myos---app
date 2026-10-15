import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';

export function QualityControl() {
  return <section className="quality-control section-space" aria-labelledby="quality-title">
    <Container className="quality-control-layout">
      <SectionHeading id="quality-title" eyebrow="MẪU & THÔNG TIN ĐƠN HÀNG" title="Kiểm tra theo mẫu và thông tin đã thống nhất." />
      <div className="quality-control-copy" data-reveal="right">
        <p>Nội dung, quy cách và mẫu đã duyệt là cơ sở để đối chiếu các hạng mục cần thiết kế hoặc sản xuất.</p>
        <p>Sản phẩm và số lượng bàn giao được kiểm tra theo thông tin đơn hàng; các nội dung cần xử lý được trao đổi trong quá trình phối hợp.</p>
        <p>Phản hồi, mẫu và các cập nhật liên quan được theo dõi cùng đơn để thuận tiện đối chiếu khi điều chỉnh hoặc đặt lại.</p>
        <div className="quality-basis"><span>Mẫu đã thống nhất</span><span>Quy cách & số lượng</span><span>Phản hồi theo đơn</span></div>
      </div>
    </Container>
  </section>;
}
