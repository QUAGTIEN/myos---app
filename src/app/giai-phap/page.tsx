import type { Metadata } from 'next';
import { SolutionsHero } from '@/sections/solutions/SolutionsHero';
import { SolutionsOverview } from '@/sections/solutions/SolutionsOverview';
import { UseCaseSections } from '@/sections/solutions/UseCaseSections';
import { RelatedProducts } from '@/sections/solutions/RelatedProducts';
import { ContactCTA } from '@/components/contact/ContactCTA';

const title = 'Giải pháp tem nhãn & bao bì cho doanh nghiệp';
const description = 'Trao đổi giải pháp tem nhãn, vật tư, thiết bị và bao bì theo nhu cầu nhận diện hàng hóa, kho vận, sản xuất, may mặc và trình bày sản phẩm cùng Sunflower.';
export const metadata: Metadata = { title, description, openGraph: { title, description, url: '/giai-phap/' } };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="interior-page"><SolutionsHero /><SolutionsOverview /><UseCaseSections /><RelatedProducts /><ContactCTA /></main>;
}

