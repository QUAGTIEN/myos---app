// G2 copy from docs/CONTENT.md; references existing media IDs rather than copying assets.
export const homeContent = {
  introduction: {
    eyebrow: 'VỀ SUNFLOWER',
    title: 'Một đầu mối cho tem nhãn, bao bì và vật tư.',
    description: 'Sunflower vừa cung ứng hàng hóa, nguyên vật liệu, vừa thực hiện thiết kế, gia công và sản xuất. Với từng nhu cầu, chúng tôi làm rõ sản phẩm cần cung cấp, các công đoạn cần thực hiện và quy cách bàn giao để cùng khách hàng thống nhất phương án.',
    approaches: ['Cung ứng nguyên vật liệu', 'Gia công từ vật liệu', 'Thiết kế và sản xuất'],
    link: { href: '/gioi-thieu', label: 'Tìm hiểu Sunflower' },
  },
  products: {
    eyebrow: 'NHÓM SẢN PHẨM',
    title: 'Tìm đúng nhóm sản phẩm bạn cần.',
    description: 'Từ tem cuộn, tem tờ đến nhãn may mặc, hộp, mực in và thiết bị, mỗi nhóm là một điểm bắt đầu để trao đổi về quy cách.',
    // Select only adequately sized photos. Small/missing G0 photos remain for later modules.
    featuredSlugs: ['tem-trang-cuon', 'tem-mau-cuon', 'muc-in', 'tem-det'],
    link: { href: '/san-pham', label: 'Xem toàn bộ sản phẩm' },
  },
  collaboration: {
    eyebrow: 'CÁCH CHÚNG TÔI LÀM VIỆC',
    title: 'Phối hợp theo từng yêu cầu, theo sát từng đơn hàng.',
    link: { href: '/nang-luc', label: 'Tìm hiểu cách làm việc' },
    items: [
      {
        title: 'Ba phương án thực hiện',
        description: 'Cung cấp nguyên vật liệu, gia công từ vật liệu hoặc thiết kế và sản xuất theo yêu cầu. Hình thức được thống nhất theo mặt hàng và mục đích sử dụng.',
        mediaId: 'large-format-printing',
      },
      {
        title: 'Mẫu và quy cách làm cơ sở',
        description: 'Nội dung, kích thước, vật liệu và mẫu được trao đổi trước khi triển khai các hạng mục cần thiết kế hoặc gia công.',
        mediaId: 'print-color-samples',
      },
      {
        title: 'Các bộ phận cùng phối hợp',
        description: 'Sale, Thiết kế, Bán hàng và Kế toán tiếp nối thông tin trong quá trình tư vấn, thực hiện đơn hàng, bàn giao và xử lý chứng từ.',
        mediaId: 'press-operators',
      },
      {
        title: 'Từ đặt hàng đến bàn giao',
        description: 'Thông tin mặt hàng, mẫu và các bước xử lý được lưu theo đơn để thuận tiện đối chiếu khi phối hợp.',
        mediaId: 'printing-press',
      },
    ],
  },
} as const;
