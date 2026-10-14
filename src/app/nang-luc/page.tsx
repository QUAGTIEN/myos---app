import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = { title: 'Năng lực', description: 'Quy trình phối hợp thiết kế, gia công và sản xuất theo từng đơn hàng.' };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="content-page"><Container><h1>Năng lực</h1></Container></main>;
}

