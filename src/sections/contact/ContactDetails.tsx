import Image from 'next/image';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { companyContent } from '@/content/company';
import { officeMedia } from '@/content/contact-media';

export function ContactDetails() {
  const contact = companyContent.contact;
  return <aside className="contact-details" aria-labelledby="contact-details-title">
    <SectionHeading id="contact-details-title" eyebrow="KẾT NỐI VỚI SUNFLOWER" title="Cùng trao đổi về yêu cầu của bạn." />
    <p className="contact-details-notice">{contact.notice}</p>
    <dl className="contact-details-list"><div><dt>Tên doanh nghiệp</dt><dd>{contact.legalName}</dd></div><div><dt>Điện thoại</dt><dd>{contact.phone}</dd></div><div><dt>Email</dt><dd>{contact.email}</dd></div><div><dt>Địa chỉ</dt><dd>{contact.address}</dd></div></dl>
    <figure className="contact-office-photo" data-reveal="image-mask"><Image src={officeMedia.src} width={officeMedia.width} height={officeMedia.height} alt={officeMedia.alt} sizes="(max-width: 767px) calc(100vw - 40px), 420px" /><figcaption>{officeMedia.caption}</figcaption></figure>
  </aside>;
}
