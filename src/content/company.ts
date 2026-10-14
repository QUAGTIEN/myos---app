// Shared public copy and owner-authorized illustrative contact values from CONTENT.md.
// Illustrative values must never become tel/mailto/map/form or structured-data destinations.
export const companyContent = {
  name: 'SUNFLOWER',
  descriptor: 'TEM NHÃN · BAO BÌ · VẬT TƯ IN',
  description: 'Tem nhãn, bao bì và vật tư in ấn cho doanh nghiệp — từ cung ứng đến thiết kế, gia công và sản xuất theo yêu cầu.',
  serviceArea: 'Hà Nội và các khu vực Hưng Yên, Nam Định, Bắc Ninh, Thái Nguyên, Vĩnh Phúc cùng các khu công nghiệp lân cận.',
  contact: {
    notice: 'Thông tin liên hệ minh họa — sẽ cập nhật thông tin chính thức.',
    legalName: 'Công ty TNHH Sunflower — minh họa, chưa xác nhận tên pháp lý',
    phone: '0000 000 000',
    email: 'lienhe@sunflower.example',
    address: 'Số 00, đường Minh Họa, Hà Nội — địa chỉ minh họa',
  },
  inquiry: {
    eyebrow: 'TRAO ĐỔI CÙNG SUNFLOWER',
    title: 'Bắt đầu từ yêu cầu của bạn.',
    description: 'Cho Sunflower biết sản phẩm cần làm, quy cách, số lượng và địa điểm nhận hàng. Chúng tôi sẽ trao đổi để xác định phương án cung ứng, gia công hoặc sản xuất phù hợp.',
    link: { href: '/lien-he', label: 'Yêu cầu báo giá' },
  },
} as const;
