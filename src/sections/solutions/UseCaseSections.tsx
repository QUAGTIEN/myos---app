import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { CompanyPhoto } from '@/components/media/CompanyPhoto';
import { ProductImage } from '@/components/products/ProductImage';
import { ActionLink } from '@/components/ui/ActionLink';
import { Arrow } from '@/components/ui/Arrow';
import { solutions } from '@/content/solutions';
import { productCategories } from '@/content/products';
import { companyMedia } from '@/content/company-media';

export function UseCaseSections() {
  return <div className="use-cases">
    {solutions.map((solution, index) => {
      const media = solution.media;
      return <section id={solution.slug} key={solution.slug} className={`use-case section-space${index % 2 ? ' use-case-reversed' : ''}${index === 2 ? ' use-case-blue' : ''}`} aria-labelledby={`${solution.slug}-title`}>
      <Container className="use-case-layout">
        <div className="use-case-media" data-reveal="image-mask">
          {media.kind === 'product' ? <figure className="use-case-product-photo"><div className="use-case-product-frame"><ProductImage slug={media.slug} sizes="(max-width: 767px) calc(100vw - 88px), 560px" /></div><figcaption>Ảnh minh họa sản phẩm · {productCategories.find(item => item.slug === media.slug)?.name}</figcaption></figure> : <CompanyPhoto media={companyMedia.find(item => item.id === media.id)!} sizes="(max-width: 767px) calc(100vw - 40px), 50vw" />}
        </div>
        <div className="use-case-copy">
          <div data-reveal={index % 2 ? 'left' : 'right'}>
            <p className="section-eyebrow">0{index + 1} / {solution.label.toLocaleUpperCase('vi')}</p>
            <h2 id={`${solution.slug}-title`}>{solution.title}</h2>
            <p className="use-case-problem">{solution.problem}</p>
            <p>{solution.approach}</p>
          </div>
          <div className="use-case-goal" data-reveal="up"><span>MỤC TIÊU TRAO ĐỔI</span><p>{solution.goal}</p></div>
          <div className="related-products" data-reveal="up">
            <h3>Nhóm sản phẩm phù hợp</h3>
            <ul>{solution.products.map(slug => <li key={slug}><Link href={`/san-pham/#${slug}`}>{productCategories.find(item => item.slug === slug)!.name}<Arrow diagonal /></Link></li>)}</ul>
          </div>
          <div className="use-case-action" data-reveal="up"><ActionLink href={`/lien-he?nhu-cau=${solution.slug}`} label={solution.cta} variant="button" /></div>
        </div>
      </Container>
    </section>;
    })}
    <Container><p className="catalogue-media-note">Các nhu cầu trên là nội dung để trao đổi phương án, không phải danh mục dự án hoặc khách hàng đã thực hiện.</p></Container>
  </div>;
}
