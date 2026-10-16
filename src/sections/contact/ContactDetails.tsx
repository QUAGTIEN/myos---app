import Image from 'next/image';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { officeMedia } from '@/content/contact-media';

export function ContactDetails() {
  return <aside className="contact-details" aria-labelledby="contact-details-title">
    <SectionHeading id="contact-details-title" eyebrow="KẾT NỐI VỚI SUNFLOWER" title="Cùng trao đổi về yêu cầu của bạn." />
    <p className="contact-details-intro">Chuẩn bị những thông tin bạn đã có. Chúng tôi cùng làm rõ phần còn lại theo sản phẩm và cách sử dụng.</p>
    <ol className="contact-preparation"><li><span>01</span>Sản phẩm & mục đích sử dụng</li><li><span>02</span>Mẫu, kích thước & vật liệu</li><li><span>03</span>Số lượng & địa điểm nhận hàng</li></ol>
    <figure className="contact-office-photo" data-reveal="image-mask"><Image src={officeMedia.src} width={officeMedia.width} height={officeMedia.height} alt={officeMedia.alt} sizes="(max-width: 767px) calc(100vw - 40px), 420px" /><figcaption>{officeMedia.caption}</figcaption></figure>
  </aside>;
}
