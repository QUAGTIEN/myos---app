import type { Metadata } from 'next';
import { PendingPage } from '@/components/layout/PendingPage';

export const metadata: Metadata = { title: 'Liên hệ & Yêu cầu báo giá', description: 'Trao đổi nhu cầu và yêu cầu báo giá với Sunflower.' };

export default function Page() {
  return <PendingPage title="Liên hệ & Yêu cầu báo giá" description="Trao đổi nhu cầu và yêu cầu báo giá với Sunflower." />;
}

