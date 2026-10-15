import type { Metadata } from 'next';
import { ProjectsHero } from '@/sections/projects/ProjectsHero';
import { ProjectShowcase } from '@/sections/projects/ProjectShowcase';
import { RouteLinks } from '@/components/editorial/RouteLinks';
import { ContactCTA } from '@/components/contact/ContactCTA';

const title = 'Mẫu thành phẩm tem nhãn & bao bì';
const description = 'Quan sát tem nhãn, bao bì và các hạng mục hoàn thiện qua hình ảnh tổng thể, chi tiết vật liệu, nội dung in và gia công để trao đổi yêu cầu với Sunflower.';
export const metadata: Metadata = { title, description, openGraph: { title, description, url: '/du-an/' } };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="interior-page">
    <ProjectsHero /><ProjectShowcase />
    <RouteLinks id="samples-related-title" eyebrow="TỪ MẪU ĐẾN PHƯƠNG ÁN" title="Từ mẫu tham khảo đến yêu cầu sử dụng." description="Trao đổi thêm về sản phẩm, vật liệu và cách sử dụng để xác định phương án cho nhu cầu của bạn." items={[{ href: '/giai-phap', label: 'Giải pháp theo nhu cầu', description: 'Bắt đầu từ cách sản phẩm được sử dụng.' }, { href: '/san-pham', label: 'Khám phá sản phẩm', description: 'Xem hình thức và thông tin cần trao đổi.' }]} />
    <ContactCTA title="Bạn muốn trao đổi về một mẫu riêng?" description="Cho Sunflower biết loại sản phẩm, mẫu tham khảo và những điểm cần điều chỉnh. Chúng tôi sẽ cùng làm rõ nội dung, quy cách và phần việc cần thực hiện." label="Trao đổi yêu cầu" />
  </main>;
}

