export const heroContent = {
  eyebrow: 'SUNFLOWER / TEM NHÃN & IN ẤN',
  title: ['Giải pháp', 'tem nhãn', 'cho', 'từng sản phẩm.'],
  description: 'Thiết kế tem nhãn, nhãn decal và bao bì in theo nhu cầu doanh nghiệp. Bắt đầu từ sản phẩm và yêu cầu của bạn.',
  primaryCta: { label: 'Khám phá sản phẩm', href: '/san-pham' },
  secondaryCta: { label: 'Yêu cầu báo giá', href: '/lien-he' },
} as const;

// TODO: XÁC NHẬN VỚI SUNFLOWER — supply licensed footage + matching poster.
// Do not substitute Sonoco imagery or advertise illustrative media as a real facility.
export const heroMedia: {
  poster: string;
  desktopSrc: string | null;
  mobileSrc: string | null;
  isIllustration: boolean;
} = {
  poster: '/images/hero/hero-poster.svg',
  desktopSrc: null,
  mobileSrc: null,
  isIllustration: true,
};
