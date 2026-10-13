export const heroContent = {
  eyebrow: 'SUNFLOWER / TEM NHÃN & IN ẤN',
  title: ['Giải pháp', 'tem nhãn', 'cho', 'từng sản phẩm.'],
  description: 'Thiết kế tem nhãn, nhãn decal và bao bì in theo nhu cầu doanh nghiệp. Bắt đầu từ sản phẩm và yêu cầu của bạn.',
  primaryCta: { label: 'Khám phá sản phẩm', href: '/san-pham' },
  secondaryCta: { label: 'Yêu cầu báo giá', href: '/lien-he' },
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
