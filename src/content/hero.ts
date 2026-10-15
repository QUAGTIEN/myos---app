export const heroContent = {
  eyebrow: 'SUNFLOWER / GIẢI PHÁP IN ẤN',
  title: ['Tem nhãn.', 'Tạo dấu ấn.'],
  description: 'Thiết kế, gia công, sản xuất tem nhãn và bao bì; cung cấp vật tư in ấn cho doanh nghiệp tại Hà Nội và khu vực lân cận.',
  primaryCta: { label: 'Khám phá sản phẩm', href: '/san-pham' },
  secondaryCta: { label: 'Yêu cầu báo giá', href: '/lien-he' },
  disciplines: ['Thiết kế', 'Gia công', 'Sản xuất'],
  discovery: { label: 'Câu chuyện Sunflower', href: '#introduction-title' },
} as const;

// User-selected iStock preview, retained with its watermark; see docs/MEDIA_BRIEF.md.
// Illustrative printing footage, not evidence of Sunflower's facility.
// TODO: Replace with licensed HD media before public release.
export const heroMedia: {
  poster: string | null;
  desktopSrc: string | null;
  mobileSrc: string | null;
  caption: string;
} = {
  poster: '/images/hero/hero-poster.webp',
  desktopSrc: '/videos/hero/hero-desktop.mp4',
  mobileSrc: null,
  caption: 'Video minh họa ngành in',
};
