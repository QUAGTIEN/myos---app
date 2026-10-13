import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = { title: 'Giới thiệu', description: 'Thông tin về Sunflower và cách tiếp cận thiết kế, sản xuất.' };

export default function Page() {
  return <main id="main-content" className="content-page"><Container><h1>Giới thiệu</h1></Container></main>;
}

