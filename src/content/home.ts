import type { SolutionSlug } from './solutions';
import type { ProjectSampleSlug } from './projects';

// Home editorial copy/selections from CONTENT.md. Catalogue, workflow and media
// remain in their canonical registries; do not copy them into a second catalogue.
export const homeContent = {
  introduction: {
    eyebrow: 'VỀ SUNFLOWER',
    title: ['Một đầu mối', 'cho tem nhãn,', 'bao bì và vật tư.'],
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
    title: ['Phối hợp theo từng yêu cầu,', 'theo sát từng đơn hàng.'],
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
  capabilities: {
    eyebrow: 'NĂNG LỰC & HÌNH THỨC THỰC HIỆN',
    title: ['Từ yêu cầu ban đầu', 'đến phương án thực hiện.'],
    description: 'Một đơn hàng có thể cần thiết kế mới, gia công từ vật liệu hoặc cung ứng sản phẩm, vật tư. Phần việc được làm rõ trước khi chuẩn bị hàng hóa và triển khai.',
    mediaId: 'printing-press',
    link: { href: '/nang-luc', label: 'Xem năng lực và quy trình' },
  },
  solutions: {
    eyebrow: 'GIẢI PHÁP THEO NHU CẦU',
    title: ['Bắt đầu từ cách', 'sản phẩm được sử dụng.'],
    description: 'Nội dung cần thể hiện, vị trí gắn và cách đóng gói là cơ sở để lựa chọn nhóm tem nhãn, vật liệu và hình thức thực hiện.',
    featuredSlugs: ['nhan-dien-san-pham', 'nhan-may-mac', 'bao-bi-thuong-hieu'] satisfies readonly SolutionSlug[],
    link: { href: '/giai-phap', label: 'Khám phá các giải pháp' },
  },
  samples: {
    eyebrow: 'MẪU THÀNH PHẨM',
    title: 'Nhìn gần hơn vào thành phẩm.',
    description: 'Quan sát hình thức, bề mặt và chi tiết để có thêm cơ sở trao đổi về sản phẩm bạn cần.',
    featuredSlugs: ['mau-bang-dinh', 'mau-tem-trang-to', 'mau-tem-det'] satisfies readonly ProjectSampleSlug[],
    link: { href: '/du-an', label: 'Xem các mẫu thành phẩm' },
  },
  process: {
    eyebrow: 'QUY TRÌNH PHỐI HỢP',
    title: ['Các bước phối hợp', 'cùng Sunflower.'],
    description: 'Từng đơn hàng đi theo các bước phù hợp với mặt hàng và hình thức thực hiện. Đơn cung ứng vật tư không cần qua toàn bộ công đoạn của một đơn thiết kế, sản xuất mới.',
    link: { href: '/nang-luc/#quy-trinh', label: 'Xem quy trình chi tiết' },
  },
} as const;
