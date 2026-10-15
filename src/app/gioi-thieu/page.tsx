import type { Metadata } from 'next';
import { EditorialHero } from '@/components/editorial/EditorialHero';
import { CompanyOverview } from '@/sections/about/CompanyOverview';
import { WorkingStory } from '@/sections/about/WorkingStory';
import { WorkingPrinciples } from '@/sections/about/WorkingPrinciples';
import { DepartmentCollaboration } from '@/sections/about/DepartmentCollaboration';
import { RouteLinks } from '@/components/editorial/RouteLinks';
import { ContactCTA } from '@/components/contact/ContactCTA';

const title = 'Giới thiệu — Thương mại & sản xuất tem nhãn';
const description = 'Tìm hiểu Sunflower, mô hình thương mại kết hợp thiết kế, gia công, sản xuất tem nhãn, bao bì và cách phối hợp với doanh nghiệp tại Hà Nội, khu vực lân cận.';
export const metadata: Metadata = { title, description, openGraph: { title, description, url: '/gioi-thieu/' } };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="interior-page">
    <EditorialHero id="about-title" eyebrow="GIỚI THIỆU SUNFLOWER" lines={['Kết nối cung ứng,', 'thiết kế và sản xuất.']} description="Sunflower hoạt động trong lĩnh vực tem nhãn, bao bì và vật tư in ấn, kết hợp thương mại với gia công, sản xuất để đáp ứng các yêu cầu khác nhau của doanh nghiệp." mediaId="printing-press" action={{ href: '#ve-sunflower', label: 'Tìm hiểu Sunflower' }} />
    <CompanyOverview /><WorkingStory /><WorkingPrinciples /><DepartmentCollaboration />
    <RouteLinks id="about-related-title" eyebrow="KHÁM PHÁ SUNFLOWER" title="Tìm hiểu thêm về Sunflower." description="Khám phá danh mục sản phẩm hoặc xem cách chúng tôi phối hợp từ tiếp nhận yêu cầu đến bàn giao." items={[{ href: '/san-pham', label: 'Nhóm sản phẩm', description: 'Tem nhãn, bao bì, vật tư và thiết bị.' }, { href: '/nang-luc', label: 'Năng lực & quy trình', description: 'Từ yêu cầu đến thông tin bàn giao.' }]} />
    <ContactCTA />
  </main>;
}

