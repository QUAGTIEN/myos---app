import type { Metadata } from 'next';
import { PendingPage } from '@/components/layout/PendingPage';

export const metadata: Metadata = { title: 'Sản phẩm', description: 'Các nhóm tem nhãn, vật liệu và sản phẩm in ấn.' };

export default function Page() {
  return <PendingPage title="Sản phẩm" description="Các nhóm tem nhãn, vật liệu và sản phẩm in ấn." />;
}

