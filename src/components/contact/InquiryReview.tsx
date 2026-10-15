import type { RefObject } from 'react';
import { inquiryFieldLabels, inquiryPurposes, contactPresentation } from '@/content/contact';
import { productCategories } from '@/content/products';
import { solutions } from '@/content/solutions';
import { projectSamples } from '@/content/projects';
import type { InquiryDraft } from '@/types/inquiry';

export function InquiryReview({ draft, reviewRef, onEdit }: {
  draft: InquiryDraft;
  reviewRef: RefObject<HTMLDivElement | null>;
  onEdit: () => void;
}) {
  const rows = [
    ['Mục đích', inquiryPurposes.find(item => item.id === draft.purpose)?.label],
    [inquiryFieldLabels.fullName, draft.fullName],
    [inquiryFieldLabels.companyName, draft.companyName],
    [inquiryFieldLabels.phone, draft.phone], [inquiryFieldLabels.email, draft.email],
    [inquiryFieldLabels.productSlug, productCategories.find(item => item.slug === draft.productSlug)?.name],
    [inquiryFieldLabels.solutionSlug, solutions.find(item => item.slug === draft.solutionSlug)?.label],
    [inquiryFieldLabels.projectSlug, projectSamples.find(item => item.slug === draft.projectSlug)?.title],
    [inquiryFieldLabels.quantity, draft.quantity], [inquiryFieldLabels.dimensions, draft.dimensions],
    [inquiryFieldLabels.deadline, draft.deadline],
    [inquiryFieldLabels.privacyConsent, draft.privacyConsent ? 'Đã chọn' : 'Chưa chọn'],
  ].filter(([,value]) => !!value);

  return <div ref={reviewRef} className="inquiry-review" tabIndex={-1} role="region" aria-labelledby="inquiry-review-title">
    <p className="section-eyebrow">XEM LẠI NỘI DUNG</p>
    <h3 id="inquiry-review-title">Yêu cầu của bạn — chưa gửi</h3>
    <p className="inquiry-review-notice">Thông tin dưới đây chỉ được xem lại trên trang. Sunflower chưa tiếp nhận yêu cầu này.</p>
    <dl>{rows.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="inquiry-review-message"><h4>{inquiryFieldLabels.message}</h4><p>{draft.message}</p></div>
    <div className="inquiry-review-actions"><button type="button" className="text-link" onClick={onEdit}>Chỉnh sửa nội dung</button><button type="button" className="button inquiry-send-unavailable" disabled>{contactPresentation.inactiveSendLabel}</button></div>
  </div>;
}
