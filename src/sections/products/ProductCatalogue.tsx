import { Container } from '@/components/layout/Container';
import { Arrow } from '@/components/ui/Arrow';
import { ActionLink } from '@/components/ui/ActionLink';
import { ProductImage } from '@/components/products/ProductImage';
import { productGroups, productCategories, productApplications } from '@/content/products';
import { productMedia } from '@/content/product-media';

export function ProductCatalogue() {
  return <div id="danh-muc" className="product-catalogue">
    <div className="category-directory">
      <Container>
        <p className="section-eyebrow">TÌM THEO NHÓM SẢN PHẨM</p>
        <nav aria-label="Nhóm sản phẩm" className="category-directory-links">
          {productGroups.map((group, index) => <a href={`#${group.id}`} key={group.id}><span className="directory-number">0{index + 1}</span><span>{group.name}</span><Arrow diagonal /></a>)}
        </nav>
        <p className="directory-help">Chưa xác định được nhóm phù hợp? <a href="/lien-he/">Mô tả nhu cầu của bạn <Arrow diagonal /></a></p>
      </Container>
    </div>
    {productGroups.map((group, groupIndex) => <section id={group.id} className="catalogue-group section-space" aria-labelledby={`${group.id}-title`} key={group.id}>
      <Container className="catalogue-group-layout">
        <div className="catalogue-group-intro" data-reveal="left">
          <p className="section-eyebrow">DANH MỤC / 0{groupIndex + 1}</p>
          <h2 id={`${group.id}-title`}>{group.name}</h2>
          <p>{group.description}</p>
          <a className="text-link" href="#danh-muc">Về mục lục <Arrow /></a>
        </div>
        <div className="catalogue-grid" data-reveal="product-gallery">
          {group.slugs.map((slug, index) => {
            const product = productCategories.find(item => item.slug === slug)!;
            const hasImage = productMedia.some(item => item.slug === slug);
            return <article id={slug} className={`catalogue-product product-feature${hasImage ? '' : ' catalogue-product-text'}`} key={slug} data-sequence-index={(index % 4) + 1} aria-labelledby={`${slug}-title`}>
              {hasImage && <div className="catalogue-product-media"><ProductImage slug={slug} sizes="(max-width: 767px) calc(100vw - 72px), (max-width: 1199px) 40vw, 360px" /></div>}
              <div className="catalogue-product-copy">
                {!hasImage && <p className="catalogue-text-label">LỰA CHỌN THEO YÊU CẦU</p>}
                <h3 id={`${slug}-title`}>{product.name}</h3>
                <p>{product.description}</p>
                <ul className="product-applications" aria-label="Nhu cầu sử dụng">{productApplications[slug].map(label => <li key={label}>{label}</li>)}</ul>
                <details className="product-inquiry-details"><summary>Thông tin nên chuẩn bị<span aria-hidden="true">+</span></summary><p>{product.inquiryHint}</p></details>
                <ActionLink href={`/lien-he?san-pham=${slug}`} label={`Báo giá ${product.name.toLocaleLowerCase('vi')}`} />
              </div>
            </article>;
          })}
        </div>
      </Container>
    </section>)}
  </div>;
}
