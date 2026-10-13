import Link from 'next/link';
import { Container } from './Container';
import { Arrow } from '../ui/Arrow';

export function PendingPage({ title, description }: { title: string; description: string }) {
  return <main id="main-content" className="pending-page"><Container><p className="pending-eyebrow">SUNFLOWER / KHUNG TRANG ĐÃ CHỐT</p><h1>{title}</h1><p>{description}</p><div className="pending-notice"><h2>Nội dung đang chờ triển khai</h2><p>Giai đoạn hiện tại chỉ xây dựng Header và Hero trang chủ. Đường dẫn này được giữ theo cấu trúc bảy trang đã duyệt.</p><p>Chưa có biểu mẫu tiếp nhận hoặc thông tin liên hệ được công bố ở bản thử này.</p></div><Link href="/" className="button button-primary">Về trang chủ <Arrow /></Link></Container></main>;
}
