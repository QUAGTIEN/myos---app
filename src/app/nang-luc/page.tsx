import type { Metadata } from 'next';
import { EditorialHero } from '@/components/editorial/EditorialHero';
import { CapabilityOverview } from '@/sections/capabilities/CapabilityOverview';
import { WorkPreparation } from '@/sections/capabilities/WorkPreparation';
import { ProductionProcess } from '@/sections/capabilities/ProductionProcess';
import { QualityControl } from '@/sections/capabilities/QualityControl';
import { CollaborationDelivery } from '@/sections/capabilities/CollaborationDelivery';
import { ContactCTA } from '@/components/contact/ContactCTA';

const title = 'Năng lực & quy trình làm việc';
const description = 'Tìm hiểu cách Sunflower kết hợp cung ứng vật tư, thiết kế, gia công và sản xuất; phối hợp từ yêu cầu, duyệt mẫu đến kiểm tra, giao nhận và chứng từ.';
export const metadata: Metadata = { title, description, openGraph: { title, description, url: '/nang-luc/' } };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="interior-page">
    <EditorialHero id="capabilities-title" eyebrow="NĂNG LỰC & CÁCH LÀM VIỆC" lines={['Từ vật liệu và', 'bản thiết kế đến', 'đơn hàng hoàn thiện.']} description="Sunflower kết hợp hoạt động thương mại với gia công, thiết kế và sản xuất. Mỗi mặt hàng được xác định phương án thực hiện, phần việc liên quan và thông tin bàn giao theo yêu cầu đã thống nhất." mediaId="print-color-samples" variant="split" action={{ href: '#quy-trinh', label: 'Xem quy trình phối hợp' }} />
    <CapabilityOverview /><WorkPreparation /><ProductionProcess /><QualityControl /><CollaborationDelivery /><ContactCTA />
  </main>;
}

