import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = { title: 'Giải pháp', description: 'Giải pháp nhận diện sản phẩm theo nhu cầu doanh nghiệp.' };

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="content-page"><Container><h1>Giải pháp</h1></Container></main>;
}

