import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = { title: 'Liên hệ & Yêu cầu báo giá', description: 'Trao đổi nhu cầu và yêu cầu báo giá với Sunflower.' };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="content-page"><Container><h1>Liên hệ & Yêu cầu báo giá</h1></Container></main>;
}

