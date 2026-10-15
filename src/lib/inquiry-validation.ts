import { inquiryFieldLabels, inquiryLimits, inquiryPurposes } from '@/content/contact';
import { productCategories } from '@/content/products';
import { solutions } from '@/content/solutions';
import { projectSamples } from '@/content/projects';
import type { InquiryContext, InquiryDraft, InquiryErrors } from '@/types/inquiry';

export function createInquiryDraft(context: InquiryContext): InquiryDraft {
  return {
    purpose: context.productSlug || context.projectSlug ? 'quotation' : context.solutionSlug ? 'consultation' : 'quotation',
    fullName: '', companyName: '', phone: '', email: '',
    productSlug: context.productSlug, solutionSlug: context.solutionSlug, projectSlug: context.projectSlug,
    quantity: '', dimensions: '', deadline: '', message: '', privacyConsent: false,
  };
}

export function validateInquiry(draft: InquiryDraft): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!inquiryPurposes.some(item => item.id === draft.purpose)) errors.purpose = 'Vui lòng chọn mục đích trao đổi.';
  if (!draft.fullName.trim()) errors.fullName = 'Vui lòng nhập tên người liên hệ.';
  if (!draft.phone.trim() && !draft.email.trim()) errors.contact = 'Vui lòng cung cấp số điện thoại hoặc email.';
  if (draft.phone.trim()) {
    const phone = draft.phone.trim();
    const digits = phone.replace(/\D/g, '');
    if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) errors.phone = 'Vui lòng kiểm tra lại số điện thoại.';
  }
  if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Vui lòng kiểm tra lại địa chỉ email.';
  if (!draft.message.trim()) errors.message = 'Vui lòng mô tả nhu cầu của bạn.';
  if (draft.productSlug && !productCategories.some(item => item.slug === draft.productSlug)) errors.productSlug = 'Vui lòng chọn nhóm sản phẩm trong danh mục.';
  if (draft.solutionSlug && !solutions.some(item => item.slug === draft.solutionSlug)) errors.solutionSlug = 'Vui lòng chọn nhu cầu trong danh sách.';
  if (draft.projectSlug && !projectSamples.some(item => item.slug === draft.projectSlug)) errors.projectSlug = 'Mẫu tham khảo không còn trong danh sách.';

  for (const [field, limit] of Object.entries(inquiryLimits)) {
    const key = field as keyof typeof inquiryLimits;
    if (draft[key].length > limit) errors[key] = `${inquiryFieldLabels[key]} không vượt quá ${limit} ký tự.`;
  }
  // Consent is displayed for review, not required to preview locally. A live
  // intake needs an approved privacy policy and server-side validation first.
  return errors;
}

export function normalizeInquiry(draft: InquiryDraft): InquiryDraft {
  return {
    ...draft,
    fullName: draft.fullName.trim(), companyName: draft.companyName.trim(),
    phone: draft.phone.trim(), email: draft.email.trim(), message: draft.message.trim(),
    quantity: draft.purpose === 'quotation' ? draft.quantity.trim() : '',
    dimensions: draft.purpose === 'quotation' ? draft.dimensions.trim() : '',
    deadline: draft.purpose === 'quotation' ? draft.deadline.trim() : '',
  };
}
