import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MotionController } from '@/components/motion/MotionController';

export const metadata: Metadata = {
  metadataBase: new URL('https://sunflower-print-demo-tien.quangtienpham4705.chatgpt.site'),
  title: { default: 'Sunflower — Tem nhãn & bao bì in', template: '%s | Sunflower' },
  description: 'Giải pháp thiết kế tem nhãn, nhãn decal và bao bì in theo nhu cầu doanh nghiệp.',
  robots: { index: false, follow: false },
  icons: { icon: { url: '/images/brand/sunflower-logo.png', type: 'image/png' }, apple: '/images/brand/sunflower-logo.png' },
  openGraph: { title: 'Sunflower — Tem nhãn & bao bì in', description: 'Giải pháp tem nhãn và in ấn cho doanh nghiệp.', locale: 'vi_VN', type: 'website', siteName: 'Sunflower' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" data-accent="warm"><body><a className="skip-link" href="#main-content">Đến nội dung chính</a><MotionController /><Header />{children}<Footer /></body></html>;
}
