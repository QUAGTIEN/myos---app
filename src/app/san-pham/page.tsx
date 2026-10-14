import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = { title: 'Sản phẩm', description: 'Các nhóm tem nhãn, vật liệu và sản phẩm in ấn.' };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="content-page"><Container><h1>Sản phẩm</h1></Container></main>;
}

