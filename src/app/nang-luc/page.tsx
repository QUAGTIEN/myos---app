import type { Metadata } from 'next';
import { PendingPage } from '@/components/layout/PendingPage';

export const metadata: Metadata = { title: 'Năng lực', description: 'Quy trình và năng lực sản xuất đã được xác minh.' };

export default function Page() {
  return <PendingPage title="Năng lực" description="Quy trình và năng lực sản xuất đã được xác minh." />;
}

