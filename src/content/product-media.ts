export type ProductMedia = {
  slug: string;
  src: `/images/products/${string}`;
  width: number;
  height: number;
  alt: string;
};

// User-supplied catalogue illustrations; not evidence of Sunflower projects or equipment.
// Provenance and source-quality notes: docs/MEDIA_BRIEF.md.
// Reuse these paths on Home and Products; groups without photos have no entry yet.
export const productMedia = [
  {
    slug: 'tem-trang-cuon',
    src: '/images/products/tem-trang-cuon.png',
    width: 550,
    height: 413,
    alt: 'Hai cuộn tem trắng, một cuộn mở dải nhãn để thấy bề mặt và đường bế.',
  },
  {
    slug: 'tem-mau-cuon',
    src: '/images/products/tem-mau-cuon.png',
    width: 635,
    height: 322,
    alt: 'Các cuộn tem in màu với dải nhãn mở, minh họa nhiều hình dáng và mẫu in.',
  },
  {
    slug: 'tem-mau-to',
    src: '/images/products/tem-mau-to.png',
    width: 218,
    height: 218,
    alt: 'Các mẫu nhãn chữ nhật in màu xếp lớp trên mặt gỗ.',
  },
  {
    slug: 'tem-trang-to',
    src: '/images/products/tem-trang-to.png',
    width: 550,
    height: 413,
    alt: 'Các tờ nhãn chưa in nội dung với đường bế hình tròn và chữ nhật.',
  },
  {
    slug: 'muc-in',
    src: '/images/products/muc-in.png',
    width: 1200,
    height: 900,
    alt: 'Bốn cuộn ribbon mực in chuyển nhiệt với bao bọc màu trắng và vàng.',
  },
  {
    slug: 'may-in',
    src: '/images/products/may-in.png',
    width: 400,
    height: 400,
    alt: 'Máy in tem nhãn mở nắp với một dải nhãn đang đưa ra phía trước.',
  },
  {
    slug: 'the-bai',
    src: '/images/products/the-bai.png',
    width: 218,
    height: 218,
    alt: 'Thẻ bài in đỏ hình thoi, có lỗ treo ở góc trên, đặt trên mặt gỗ.',
  },
  {
    slug: 'tem-det',
    src: '/images/products/tem-det.png',
    width: 1086,
    height: 815,
    alt: 'Các mẫu nhãn dệt nền đen với chữ trắng và đường nét xanh, thể hiện rõ sợi dệt.',
  },
  {
    slug: 'bang-dinh',
    src: '/images/products/bang-dinh.png',
    width: 1980,
    height: 1080,
    alt: 'Cuộn và dải băng dính giấy in họa tiết đặt cạnh hộp đóng gói trên mặt gỗ.',
  },
] as const satisfies readonly ProductMedia[];
