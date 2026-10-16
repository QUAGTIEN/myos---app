'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { InquiryTextField, InquirySelectField, InquiryMessageField } from './InquiryFields';
import { InquiryReview } from './InquiryReview';
import { Arrow } from '@/components/ui/Arrow';
import { productCategories } from '@/content/products';
import { solutions } from '@/content/solutions';
import { projectSamples } from '@/content/projects';
import { contactPresentation, inquiryPurposes, inquiryFieldLabels, inquiryLimits } from '@/content/contact';
import { parseInquiryContext } from '@/lib/inquiry-context';
import { createInquiryDraft, normalizeInquiry, validateInquiry } from '@/lib/inquiry-validation';
import type { InquiryContext, InquiryDraft, InquiryErrors } from '@/types/inquiry';

// Query access is isolated under the page's Suspense boundary for static export.
export function InquiryForm() {
  const searchParams = useSearchParams();
  const context = parseInquiryContext(searchParams);
  const contextKey = JSON.stringify(context);
  return <InquiryFormContent key={contextKey} context={context} />;
}

function InquiryFormContent({ context }: { context: InquiryContext }) {
  const [draft, setDraft] = useState<InquiryDraft>(() => createInquiryDraft(context));
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [review, setReview] = useState<InquiryDraft | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const selectedProduct = productCategories.find(item => item.slug === draft.productSlug);
  const selectedSample = projectSamples.find(item => item.slug === draft.projectSlug);
  const selectedSolution = solutions.find(item => item.slug === draft.solutionSlug);
  const errorEntries = Object.entries(errors) as [keyof InquiryErrors, string][];

  function updateField<Key extends keyof InquiryDraft>(field: Key, value: InquiryDraft[Key]) {
    const next = { ...draft, [field]: value };
    setDraft(next);
    setReview(null);
    if (attempted) setErrors(validateInquiry(next));
  }

  function focusField(field: string) {
    const target = field === 'contact' ? 'phone' : field;
    const element = formRef.current?.querySelector<HTMLElement>(`#inquiry-${target}`);
    element?.focus();
  }

  function reviewRequest() {
    const nextErrors = validateInquiry(draft);
    setErrors(nextErrors);
    setAttempted(true);
    if (Object.keys(nextErrors).length) {
      setReview(null);
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setReview(normalizeInquiry(draft));
    window.requestAnimationFrame(() => reviewRef.current?.focus());
  }

  return <form className="inquiry-form" ref={formRef} noValidate onSubmit={event => { event.preventDefault(); reviewRequest(); }} aria-labelledby="inquiry-title" aria-describedby="inquiry-preview-notice">
    <div id="inquiry-preview-notice" className="inquiry-preview-notice"><strong>{contactPresentation.notice}</strong><p>{contactPresentation.explanation}</p></div>
    {context.hasInvalidSelection && <p className="inquiry-context-notice" role="status">Một lựa chọn trong liên kết không hợp lệ hoặc không còn trong danh mục. Bạn có thể chọn lại sản phẩm, nhu cầu bên dưới.</p>}
    {(selectedProduct || selectedSolution || selectedSample) && <div className="inquiry-context-summary" aria-label="Nội dung đang quan tâm">
      <p className="inquiry-context-label">BẠN ĐANG QUAN TÂM</p>
      {selectedSample && <div className="inquiry-sample-context"><div><span>Mẫu tham khảo</span><strong>{selectedSample.title}</strong></div><button type="button" onClick={() => updateField('projectSlug', '')} aria-label="Bỏ mẫu tham khảo">Bỏ mẫu <span aria-hidden="true">×</span></button></div>}
      <ul>{selectedProduct && <li><span>Sản phẩm</span><strong>{selectedProduct.name}</strong></li>}{selectedSolution && <li><span>Nhu cầu</span><strong>{selectedSolution.label}</strong></li>}</ul>
      {selectedProduct && <p className="inquiry-context-hint">Nên chuẩn bị: {selectedProduct.inquiryHint}</p>}
    </div>}

    {errorEntries.length > 0 && <div ref={errorRef} className="inquiry-error-summary" role="alert" tabIndex={-1} aria-labelledby="inquiry-errors-title">
      <h3 id="inquiry-errors-title">Vui lòng kiểm tra thông tin</h3><ul>{errorEntries.map(([field,message]) => <li key={field}><a href={`#inquiry-${field === 'contact' ? 'phone' : field}`} onClick={event => { event.preventDefault(); focusField(field); }}>{message}</a></li>)}</ul>
    </div>}

    <fieldset className="inquiry-group">
      <legend><span>01</span> Bạn muốn trao đổi về</legend>
      <div className="inquiry-purpose-options" id="inquiry-purpose">{inquiryPurposes.map(purpose => <label key={purpose.id} className={draft.purpose === purpose.id ? 'is-selected' : ''}><input type="radio" name="purpose" value={purpose.id} checked={draft.purpose === purpose.id} onChange={() => updateField('purpose', purpose.id)} /><span>{purpose.label}</span></label>)}</div>
      {errors.purpose && <p className="inquiry-field-error">{errors.purpose}</p>}
    </fieldset>

    <fieldset className="inquiry-group">
      <legend><span>02</span> Thông tin người liên hệ</legend>
      <p className="inquiry-required-note">Dấu * là thông tin bắt buộc.</p>
      <div className="inquiry-fields-grid">
        <InquiryTextField id="inquiry-fullName" name="fullName" label={inquiryFieldLabels.fullName} autoComplete="name" required value={draft.fullName} maxLength={inquiryLimits.fullName} placeholder="Nhập tên người liên hệ" error={errors.fullName} onChange={event => updateField('fullName', event.target.value)} />
        <InquiryTextField id="inquiry-companyName" name="companyName" label={inquiryFieldLabels.companyName} autoComplete="organization" value={draft.companyName} maxLength={inquiryLimits.companyName} placeholder="Nhập tên công ty, nếu có" error={errors.companyName} onChange={event => updateField('companyName', event.target.value)} />
      </div>
      <p id="inquiry-contact-hint" className="inquiry-contact-hint">Vui lòng cung cấp ít nhất một số điện thoại hoặc email.</p>
      <div className="inquiry-fields-grid">
        <InquiryTextField id="inquiry-phone" name="phone" label={inquiryFieldLabels.phone} type="tel" inputMode="tel" autoComplete="tel" value={draft.phone} maxLength={inquiryLimits.phone} placeholder="Nhập số điện thoại" error={errors.phone ?? errors.contact} aria-describedby="inquiry-contact-hint" onChange={event => updateField('phone', event.target.value)} />
        <InquiryTextField id="inquiry-email" name="email" label={inquiryFieldLabels.email} type="email" inputMode="email" autoComplete="email" value={draft.email} maxLength={inquiryLimits.email} placeholder="Nhập địa chỉ email" error={errors.email} aria-describedby={errors.contact ? 'inquiry-contact-hint inquiry-phone-error' : 'inquiry-contact-hint'} onChange={event => updateField('email', event.target.value)} />
      </div>
    </fieldset>

    <fieldset className="inquiry-group">
      <legend><span>03</span> Sản phẩm & nội dung yêu cầu</legend>
      <div className="inquiry-fields-grid">
        <InquirySelectField id="inquiry-productSlug" name="productSlug" label={inquiryFieldLabels.productSlug} value={draft.productSlug} error={errors.productSlug} onChange={event => updateField('productSlug', event.target.value)}><option value="">Chưa xác định — cần tư vấn</option>{productCategories.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</InquirySelectField>
        <InquirySelectField id="inquiry-solutionSlug" name="solutionSlug" label={inquiryFieldLabels.solutionSlug} value={draft.solutionSlug} error={errors.solutionSlug} onChange={event => updateField('solutionSlug', event.target.value)}><option value="">Chưa xác định nhu cầu</option>{solutions.map(item => <option key={item.slug} value={item.slug}>{item.label}</option>)}</InquirySelectField>
      </div>
      {draft.purpose === 'quotation' && <div className="inquiry-quotation-fields">
        <div className="inquiry-fields-grid">
          <InquiryTextField id="inquiry-quantity" name="quantity" label={inquiryFieldLabels.quantity} value={draft.quantity} maxLength={inquiryLimits.quantity} placeholder="Số lượng và đơn vị tính" error={errors.quantity} onChange={event => updateField('quantity', event.target.value)} />
          <InquiryTextField id="inquiry-deadline" name="deadline" label={inquiryFieldLabels.deadline} value={draft.deadline} maxLength={inquiryLimits.deadline} placeholder="Thời điểm cần nhận hàng, nếu có" error={errors.deadline} onChange={event => updateField('deadline', event.target.value)} />
        </div>
        <InquiryTextField id="inquiry-dimensions" name="dimensions" label={inquiryFieldLabels.dimensions} value={draft.dimensions} maxLength={inquiryLimits.dimensions} placeholder="Kích thước, vật liệu hoặc hình dạng đã biết" error={errors.dimensions} onChange={event => updateField('dimensions', event.target.value)} />
      </div>}
      <InquiryMessageField id="inquiry-message" name="message" label={inquiryFieldLabels.message} required rows={6} value={draft.message} maxLength={inquiryLimits.message} placeholder="Mô tả sản phẩm, mục đích sử dụng, mẫu đã có và địa điểm nhận hàng…" hint="Chưa có quy cách hoàn chỉnh? Bạn có thể bắt đầu bằng một mô tả ngắn." error={errors.message} onChange={event => updateField('message', event.target.value)} />
      <label className="inquiry-consent" htmlFor="inquiry-privacyConsent"><input type="checkbox" id="inquiry-privacyConsent" name="privacyConsent" checked={draft.privacyConsent} onChange={event => updateField('privacyConsent', event.target.checked)} /><span>Tôi đồng ý để Sunflower liên hệ về yêu cầu này.</span></label>
    </fieldset>

    <div className="inquiry-form-action"><button type="submit" className="button button-primary">{contactPresentation.reviewLabel}<Arrow diagonal /></button><p>Chỉ xem lại nội dung. Chưa gửi yêu cầu.</p></div>
    {review && <InquiryReview draft={review} reviewRef={reviewRef} onEdit={() => { setReview(null); focusField('fullName'); }} />}
  </form>;
}
