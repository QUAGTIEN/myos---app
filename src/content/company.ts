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

// Owner-confirmed operating model and departments; no headcount or history claims.
export const companyPrinciples = [
  { title: 'Hiểu đúng nhu cầu', description: 'Làm rõ sản phẩm, quy cách và mục đích sử dụng trước khi lựa chọn phương án.' },
  { title: 'Phối hợp theo mẫu', description: 'Nội dung thiết kế, yêu cầu chỉnh sửa và quy cách đã thống nhất là cơ sở cho các bước tiếp theo.' },
  { title: 'Duy trì thông tin theo đơn', description: 'Các bộ phận tiếp nối yêu cầu, mẫu và thông tin giao nhận trong quá trình xử lý.' },
] as const;

export const companyDepartments = [
  { name: 'Sale', description: 'Tiếp nhận nhu cầu, trao đổi phương án và duy trì liên hệ với khách hàng.' },
  { name: 'Thiết kế', description: 'Tiếp nhận nội dung, thực hiện mẫu và phối hợp chỉnh sửa, duyệt mẫu cho các hạng mục cần thiết kế.' },
  { name: 'Bán hàng', description: 'Làm rõ thông tin đặt hàng, phối hợp phần việc cung ứng, thực hiện và giao nhận theo đơn.' },
  { name: 'Kế toán', description: 'Phối hợp chứng từ, hóa đơn, công nợ và thanh toán theo điều khoản đã thống nhất.' },
] as const;
