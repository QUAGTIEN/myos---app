import type { InquiryPurpose } from '@/content/contact';

export type InquiryDraft = {
  purpose: InquiryPurpose;
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  productSlug: string;
  solutionSlug: string;
  projectSlug: string;
  quantity: string;
  dimensions: string;
  deadline: string;
  message: string;
  privacyConsent: boolean;
};

export type InquiryErrors = Partial<Record<keyof InquiryDraft | 'contact', string>>;

export type InquiryContext = {
  productSlug: string;
  solutionSlug: string;
  projectSlug: string;
  hasInvalidSelection: boolean;
};
