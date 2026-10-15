// Owner approved interface-only G5 on 15/10/2026. No recipient or endpoint exists.
export const contactPresentation = {
  mode: 'preview',
  notice: 'Bản minh họa — biểu mẫu chưa tiếp nhận yêu cầu.',
  explanation: 'Bạn có thể nhập và xem lại nội dung ngay trên trang. Thông tin chưa được gửi đến Sunflower.',
  reviewLabel: 'Xem lại yêu cầu',
  inactiveSendLabel: 'Gửi yêu cầu — chưa mở',
} as const;

export const inquiryPurposes = [
  { id: 'quotation', label: 'Yêu cầu báo giá' },
  { id: 'consultation', label: 'Tư vấn sản phẩm' },
  { id: 'partnership', label: 'Hợp tác cung ứng' },
] as const;
export type InquiryPurpose = typeof inquiryPurposes[number]['id'];

export const inquiryFieldLabels = {
  purpose: 'Bạn muốn trao đổi về',
  fullName: 'Họ và tên',
  companyName: 'Công ty / đơn vị',
  phone: 'Số điện thoại',
  email: 'Email',
  contact: 'Số điện thoại hoặc email',
  productSlug: 'Sản phẩm quan tâm',
  solutionSlug: 'Nhu cầu sử dụng',
  projectSlug: 'Mẫu tham khảo',
  quantity: 'Số lượng dự kiến',
  dimensions: 'Kích thước / quy cách',
  deadline: 'Thời điểm mong muốn',
  message: 'Nội dung yêu cầu',
  privacyConsent: 'Đồng ý liên hệ',
} as const;

export const inquiryLimits = {
  fullName: 120, companyName: 200, phone: 32, email: 254,
  quantity: 100, dimensions: 200, deadline: 120, message: 5000,
} as const;
