import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/editorial/SectionHeading';
import { companyDepartments } from '@/content/company';
import { officeMedia } from '@/content/contact-media';

export function DepartmentCollaboration() {
  return <section className="department-collaboration section-space" aria-labelledby="departments-title">
    <Container className="departments-layout">
      <div>
        <SectionHeading id="departments-title" eyebrow="PHỐI HỢP THEO ĐƠN HÀNG" title="Các bộ phận phối hợp trong một đơn hàng." />
        <figure className="office-photo" data-reveal="image-mask"><Image src={officeMedia.src} width={officeMedia.width} height={officeMedia.height} alt={officeMedia.alt} sizes="(max-width: 767px) calc(100vw - 40px), 520px" /><figcaption>{officeMedia.caption}</figcaption></figure>
      </div>
      <ol className="department-list">{companyDepartments.map((department, index) => <li key={department.name} data-reveal="right" data-reveal-delay={(index % 3) + 1}><span className="department-number">0{index + 1}</span><div><h3>{department.name}</h3><p>{department.description}</p></div></li>)}</ol>
    </Container>
  </section>;
}
