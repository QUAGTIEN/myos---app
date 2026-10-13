import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = { title: 'Dự án', description: 'Dự án và mẫu thành phẩm được phép công bố.' };

export default function Page() {
  return <main id="main-content" className="content-page"><Container><h1>Dự án</h1></Container></main>;
}

