'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ProductImage } from '@/components/products/ProductImage';
import { Arrow } from '@/components/ui/Arrow';
import { projectSamples, sampleCategories, type SampleCategory } from '@/content/projects';

export function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState<SampleCategory>('all');
  const visible = projectSamples.filter(sample => activeCategory === 'all' || sample.category === activeCategory);

  return <div className="sample-browser">
    <div className="sample-filter-bar">
      <div className="sample-filters" role="group" aria-label="Lọc hình ảnh mẫu">
        {sampleCategories.map(category => <button key={category.id} type="button" aria-pressed={category.id === activeCategory} aria-controls="sample-results" onClick={() => setActiveCategory(category.id)}>{category.label}<span aria-hidden="true">{category.id === 'all' ? projectSamples.length : projectSamples.filter(sample => sample.category === category.id).length}</span></button>)}
      </div>
      <p className="sample-result-count" aria-live="polite" aria-atomic="true">{visible.length} hình minh họa · {sampleCategories.find(category => category.id === activeCategory)!.label}</p>
    </div>
    <div id="sample-results">
      {visible.length ? <ul className="sample-gallery" aria-label="Hình ảnh mẫu sản phẩm">{visible.map(sample => <li key={sample.slug} className={`sample-gallery-item sample-gallery-${sample.category}`}>
        <article aria-labelledby={`${sample.slug}-title`}>
          <div className="sample-gallery-media"><ProductImage slug={sample.productSlug} inspect sizes="(max-width: 767px) calc(100vw - 72px), (max-width: 1199px) 45vw, 40vw" /><span className="sample-category-label">{sampleCategories.find(category => category.id === sample.category)!.label}</span></div>
          <div className="sample-gallery-copy"><p className="sample-illustration-label">HÌNH ẢNH SẢN PHẨM MINH HỌA</p><h3 id={`${sample.slug}-title`}>{sample.title}</h3><p>{sample.description}</p>
            <div className="sample-gallery-actions"><Link className="text-link" href={`/lien-he?du-an=${sample.slug}`}>Trao đổi mẫu tương tự<Arrow diagonal /></Link><Link href={`/san-pham/#${sample.productSlug}`} className="sample-product-link">Xem nhóm sản phẩm<Arrow /></Link></div>
          </div>
        </article>
      </li>)}</ul> : <div className="sample-empty"><p>Chưa có mẫu trong nhóm này. Bạn có thể xem tất cả hoặc mô tả nhu cầu với Sunflower.</p><button className="button button-primary" type="button" onClick={() => setActiveCategory('all')}>Xem tất cả mẫu</button></div>}
    </div>
  </div>;
}
