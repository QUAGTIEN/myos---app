import { VideoHero } from '@/components/media/VideoHero';
import { BrandIntroduction } from '@/sections/home/BrandIntroduction';
import { FeaturedProductCategories } from '@/sections/home/FeaturedProductCategories';
import { WhySunflower } from '@/sections/home/WhySunflower';
import { ContactCTA } from '@/components/contact/ContactCTA';

export default function HomePage() {
  return <main id="main-content" tabIndex={-1}>
    <VideoHero />
    <BrandIntroduction />
    <FeaturedProductCategories />
    <WhySunflower />
    <ContactCTA />
  </main>;
}
