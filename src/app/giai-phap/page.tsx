import type { Metadata } from 'next';
import { PendingPage } from '@/components/layout/PendingPage';

export const metadata: Metadata = { title: 'Giải pháp', description: 'Giải pháp nhận diện sản phẩm theo nhu cầu doanh nghiệp.' };

export default function Page() {
  return <PendingPage title="Giải pháp" description="Giải pháp nhận diện sản phẩm theo nhu cầu doanh nghiệp." />;
}

