import { Container } from '@/components/layout/Container';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { companyMedia } from '@/content/company-media';

export function WorkingStory() {
  return <section className="working-story section-space" aria-labelledby="working-story-title">
    <Container className="working-story-layout">
      <div data-reveal="image-mask"><CompanyPhoto media={companyMedia.find(item => item.id === 'printing-workshop')!} sizes="(max-width: 767px) calc(100vw - 40px), 44vw" className="working-story-photo" /></div>
      <div>
        <SectionHeading id="working-story-title" eyebrow="CÁCH CHÚNG TÔI LÀM VIỆC" title="Mỗi phương án bắt đầu từ một yêu cầu cụ thể." />
        <div className="editorial-prose" data-reveal="right">
          <p>Cùng một loại tem nhãn hoặc bao bì có thể được sử dụng theo những cách khác nhau. Vì vậy, Sunflower bắt đầu bằng việc trao đổi sản phẩm cần làm, nội dung cần thể hiện, quy cách, số lượng và cách sử dụng.</p>
          <p>Từ thông tin đó, các phần việc được xác định: cung cấp hàng hóa, chuẩn bị vật liệu, thiết kế, duyệt mẫu hay triển khai sản xuất, gia công.</p>
          <p>Mẫu, phản hồi và yêu cầu được lưu theo đơn để các bộ phận cùng có cơ sở thực hiện và đối chiếu.</p>
        </div>
        <div className="working-story-caption" aria-label="Cơ sở phối hợp" data-reveal="up"><span>Yêu cầu</span><span>Mẫu & quy cách</span><span>Phần việc</span></div>
      </div>
    </Container>
  </section>;
}
