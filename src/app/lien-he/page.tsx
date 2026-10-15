import { pageMetadata } from '@/lib/page-metadata';
import { ContactHero } from '@/sections/contact/ContactHero';
import { ContactInquiry } from '@/sections/contact/ContactInquiry';
import { ServiceArea } from '@/sections/contact/ServiceArea';

const title = 'Liên hệ & yêu cầu báo giá tem nhãn, bao bì';
const description = 'Trao đổi nhu cầu tem nhãn, bao bì, vật tư và thiết bị in với Sunflower. Cung cấp quy cách, số lượng và địa điểm giao nhận để cùng xác định phương án.';
export const metadata = pageMetadata(title, description, '/lien-he/');

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="interior-page"><ContactHero /><ContactInquiry /><ServiceArea /></main>;
}

