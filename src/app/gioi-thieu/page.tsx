import type { Metadata } from 'next';
import { PendingPage } from '@/components/layout/PendingPage';

export const metadata: Metadata = { title: 'Giới thiệu', description: 'Thông tin về Sunflower và cách tiếp cận thiết kế, sản xuất.' };

export default function Page() {
  return <PendingPage title="Giới thiệu" description="Thông tin về Sunflower và cách tiếp cận thiết kế, sản xuất." />;
}

