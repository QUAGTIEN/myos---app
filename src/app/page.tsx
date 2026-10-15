import type { Metadata } from 'next';
import { VideoHero } from '@/components/media/VideoHero';
import { BrandIntroduction } from '@/sections/home/BrandIntroduction';
import { FeaturedProductCategories } from '@/sections/home/FeaturedProductCategories';
import { WhySunflower } from '@/sections/home/WhySunflower';
import { CapabilitiesFeature } from '@/sections/home/CapabilitiesFeature';
import { SolutionsByIndustry } from '@/sections/home/SolutionsByIndustry';
import { FeaturedProjects } from '@/sections/home/FeaturedProjects';
import { ProcessPreview } from '@/sections/home/ProcessPreview';
import { ContactCTA } from '@/components/contact/ContactCTA';

export const metadata: Metadata = {
  title: { absolute: 'Sunflower — Tem nhãn, bao bì, vật tư & thiết bị in' },
  description: 'Sunflower kết hợp cung ứng, thiết kế, gia công và sản xuất tem nhãn, bao bì. Khám phá sản phẩm, giải pháp và quy trình phối hợp cho doanh nghiệp tại Hà Nội và khu vực lân cận.',
  openGraph: {
    title: 'Sunflower — Tem nhãn, bao bì, vật tư & thiết bị in',
    description: 'Khám phá sản phẩm, giải pháp và cách phối hợp từ yêu cầu đến giao nhận cùng Sunflower.',
    locale: 'vi_VN', type: 'website', siteName: 'Sunflower',
  },
};

export default function HomePage() {
  return <main id="main-content" tabIndex={-1}>
    <VideoHero />
    <BrandIntroduction />
    <FeaturedProductCategories />
    <WhySunflower />
    <CapabilitiesFeature />
    <SolutionsByIndustry />
    <FeaturedProjects />
    <ProcessPreview />
    <ContactCTA tone="brand" />
  </main>;
}
