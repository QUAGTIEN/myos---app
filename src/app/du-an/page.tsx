import type { Metadata } from 'next';
import { PendingPage } from '@/components/layout/PendingPage';

export const metadata: Metadata = { title: 'Dự án', description: 'Dự án và mẫu thành phẩm được phép công bố.' };

export default function Page() {
  return <PendingPage title="Dự án" description="Dự án và mẫu thành phẩm được phép công bố." />;
}

