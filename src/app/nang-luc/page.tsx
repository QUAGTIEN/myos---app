import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = { title: 'Năng lực', description: 'Quy trình và năng lực sản xuất đã được xác minh.' };

export default function Page() {
  return <main id="main-content" className="content-page"><Container><h1>Năng lực</h1></Container></main>;
}

