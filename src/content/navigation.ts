export const siteRoutes = [
  { href: '/', label: 'Trang chủ', description: 'Giải pháp tem nhãn và in ấn dành cho doanh nghiệp.' },
  { href: '/gioi-thieu', label: 'Giới thiệu', description: 'Thông tin về Sunflower và cách tiếp cận thiết kế, sản xuất.' },
  { href: '/san-pham', label: 'Sản phẩm', description: 'Các nhóm tem nhãn, vật liệu và sản phẩm in ấn.' },
  { href: '/giai-phap', label: 'Giải pháp', description: 'Giải pháp nhận diện sản phẩm theo nhu cầu doanh nghiệp.' },
  { href: '/nang-luc', label: 'Năng lực', description: 'Quy trình phối hợp thiết kế, gia công và sản xuất theo từng đơn hàng.' },
  { href: '/du-an', label: 'Dự án', description: 'Dự án và mẫu thành phẩm được phép công bố.' },
  { href: '/lien-he', label: 'Liên hệ', description: 'Trao đổi nhu cầu và yêu cầu báo giá với Sunflower.' },
] as const;

export const mainNavigation = siteRoutes.slice(1, 6);
