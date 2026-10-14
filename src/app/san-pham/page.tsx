import type { Metadata } from 'next';
import { ProductsHero } from '@/sections/products/ProductsHero';
import { ProductCatalogue } from '@/sections/products/ProductCatalogue';
import { SpecificationsGuide } from '@/sections/products/SpecificationsGuide';
import { ContactCTA } from '@/components/contact/ContactCTA';

const title = 'Sản phẩm — Tem nhãn, bao bì, vật tư & thiết bị in';
const description = 'Khám phá tem cuộn, tem tờ, hộp, thẻ bài, nhãn may mặc, satin, băng dính, mực in, máy in và máy quét. Trao đổi quy cách và yêu cầu báo giá với Sunflower.';
export const metadata: Metadata = { title, description, openGraph: { title, description, url: '/san-pham/' } };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="interior-page"><ProductsHero /><ProductCatalogue /><SpecificationsGuide /><ContactCTA title="Đã có mẫu hoặc đang cần tìm quy cách?" description="Mô tả nhu cầu của bạn để Sunflower cùng xác định mặt hàng và các phần việc cần thực hiện." label="Trao đổi yêu cầu" /></main>;
}

