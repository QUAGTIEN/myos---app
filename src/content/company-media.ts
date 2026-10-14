export type CompanyMedia = {
  id: string;
  src: `/images/company/${string}`;
  webSrc?: `/images/company/${string}`;
  width: number;
  height: number;
  alt: string;
  kind: 'stock-illustration';
  caption: 'Ảnh minh họa ngành in';
  credit: {
    provider: 'Unsplash';
    photographer: string;
    photoId: string;
    originalFileName: string;
  };
};

// User-supplied stock photos for G0; never present as Sunflower premises or staff.
// Keep the visible illustration caption and credit when used in future sections.
// Section allocation, crop notes and usage status: docs/MEDIA_BRIEF.md.
export const companyMedia = [
  {
    id: 'printing-workshop',
    src: '/images/company/printing-workshop-unsplash.jpg',
    webSrc: '/images/company/printing-workshop-unsplash.webp',
    width: 3168,
    height: 4752,
    alt: 'Máy in với các trục lăn trong không gian xưởng, chụp theo khung dọc.',
    kind: 'stock-illustration',
    caption: 'Ảnh minh họa ngành in',
    credit: {
      provider: 'Unsplash',
      photographer: 'Aleksandr Galichkin',
      photoId: 'QRykXu51r_0',
      originalFileName: 'aleksandr-galichkin-QRykXu51r_0-unsplash.jpg',
    },
  },
  {
    id: 'printing-press',
    src: '/images/company/printing-press-unsplash.jpg',
    webSrc: '/images/company/printing-press-unsplash.webp',
    width: 6016,
    height: 4016,
    alt: 'Cận cảnh trục lăn và các tờ giấy đang chạy qua máy in.',
    kind: 'stock-illustration',
    caption: 'Ảnh minh họa ngành in',
    credit: {
      provider: 'Unsplash',
      photographer: 'Bank Phrom',
      photoId: 'Tzm3Oyu_6sk',
      originalFileName: 'bank-phrom-Tzm3Oyu_6sk-unsplash.jpg',
    },
  },
  {
    id: 'press-operators',
    src: '/images/company/press-operators-unsplash.jpg',
    webSrc: '/images/company/press-operators-unsplash.webp',
    width: 6000,
    height: 4000,
    alt: 'Hai người làm việc bên thiết bị in và bảng điều khiển.',
    kind: 'stock-illustration',
    caption: 'Ảnh minh họa ngành in',
    credit: {
      provider: 'Unsplash',
      photographer: 'Daulet Turubayev',
      photoId: 'RAwn1QFwfss',
      originalFileName: 'daulet-turubayev-RAwn1QFwfss-unsplash.jpg',
    },
  },
  {
    id: 'large-format-printing',
    src: '/images/company/large-format-printing-unsplash.jpg',
    webSrc: '/images/company/large-format-printing-unsplash.webp',
    width: 5184,
    height: 3456,
    alt: 'Máy in khổ lớn với cụm cấp mực và vật liệu cuộn đang in màu.',
    kind: 'stock-illustration',
    caption: 'Ảnh minh họa ngành in',
    credit: {
      provider: 'Unsplash',
      photographer: 'Geri Sakti',
      photoId: 'CYrYxz-uvE4',
      originalFileName: 'geri-sakti-CYrYxz-uvE4-unsplash.jpg',
    },
  },
  {
    id: 'print-color-samples',
    src: '/images/company/print-color-samples-unsplash.jpg',
    webSrc: '/images/company/print-color-samples-unsplash.webp',
    width: 5472,
    height: 3648,
    alt: 'Các tờ mẫu in xếp lớp với ô màu và dải màu, chụp cận cảnh.',
    kind: 'stock-illustration',
    caption: 'Ảnh minh họa ngành in',
    credit: {
      provider: 'Unsplash',
      photographer: 'Pierre Bamin',
      photoId: 'X16N5J0uRD4',
      originalFileName: 'pierre-bamin-X16N5J0uRD4-unsplash.jpg',
    },
  },
] as const satisfies readonly CompanyMedia[];
