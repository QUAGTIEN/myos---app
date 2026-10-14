import type { ProductSlug } from './products';
import type { companyMedia } from './company-media';

type Solution = {
  slug: string;
  label: string;
  title: string;
  problem: string;
  approach: string;
  goal: string;
  cta: string;
  products: readonly ProductSlug[];
  media: { kind: 'product'; slug: ProductSlug } | { kind: 'company'; id: typeof companyMedia[number]['id'] };
};

// G0 inquiry scenarios from CONTENT.md, not claims of a client/industry portfolio.
export const solutions = [
  {
    slug: 'nhan-dien-san-pham', label: 'Nhận diện sản phẩm',
    title: 'Thông tin đúng chỗ trên mỗi sản phẩm.',
    problem: 'Bạn cần thể hiện thương hiệu, mã hàng hoặc thông tin sản phẩm trên một mẫu nhãn mới.',
    approach: 'Bắt đầu bằng nội dung cần in và vị trí gắn nhãn. Sunflower cùng bạn trao đổi hình thức tem cuộn hoặc tem tờ, kích thước, vật liệu và cách sử dụng để xác định quy cách.',
    goal: 'Xác định quy cách nhãn phù hợp với nội dung và thao tác sử dụng.',
    cta: 'Trao đổi nhu cầu nhận diện',
    products: ['tem-trang-cuon', 'tem-mau-cuon', 'tem-trang-to', 'tem-mau-to', 'muc-in', 'may-in'],
    media: { kind: 'product', slug: 'tem-mau-cuon' },
  },
  {
    slug: 'kho-van', label: 'Kho vận & hàng hóa',
    title: 'Tem nhãn gắn với cách quản lý hàng hóa.',
    problem: 'Nhãn cho kiện hàng, vị trí lưu trữ hoặc thông tin quản lý cần đi cùng cách in và cách thu thập thông tin.',
    approach: 'Mô tả công việc và thiết bị đang sử dụng. Sunflower trao đổi nhóm tem, mực in, máy in hoặc máy quét theo yêu cầu trước khi lựa chọn model hay quy cách cụ thể.',
    goal: 'Thống nhất vật tư và yêu cầu thiết bị theo công việc thực tế.',
    cta: 'Trao đổi nhu cầu kho vận',
    products: ['tem-trang-cuon', 'tem-trang-to', 'muc-in', 'may-in', 'may-quet', 'bang-dinh'],
    media: { kind: 'product', slug: 'tem-trang-cuon' },
  },
  {
    slug: 'nhan-dien-san-xuat', label: 'Nhận diện trong sản xuất',
    title: 'Làm rõ nhãn cần dùng trong từng công đoạn.',
    problem: 'Vị trí gắn, bề mặt và môi trường sử dụng ảnh hưởng đến yêu cầu của một nhãn nhận diện.',
    approach: 'Hãy mô tả công việc cần thực hiện để Sunflower cùng trao đổi nội dung, vật liệu và quy cách trước khi cung ứng hoặc triển khai. Yêu cầu cụ thể được đối chiếu trong quá trình tư vấn.',
    goal: 'Đối chiếu yêu cầu thực tế trước khi chọn vật liệu và hình thức nhãn.',
    cta: 'Trao đổi nhu cầu sản xuất',
    products: ['tem-trang-cuon', 'tem-mau-cuon', 'tem-trang-to', 'tem-mau-to', 'muc-in', 'may-in', 'may-quet'],
    media: { kind: 'company', id: 'printing-press' },
  },
  {
    slug: 'nhan-may-mac', label: 'Nhãn & thẻ may mặc',
    title: 'Thẻ bài và nhãn theo cách hoàn thiện sản phẩm.',
    problem: 'Tên thương hiệu, thông tin sản phẩm và nội dung trên nhãn cần được bố trí phù hợp với vị trí gắn.',
    approach: 'Sunflower trao đổi thẻ bài, tem dệt, tem vải nilon và satin theo nội dung, kích thước cùng cách sử dụng của từng hạng mục. Mẫu và vị trí gắn là cơ sở để cùng làm rõ yêu cầu.',
    goal: 'Thống nhất bộ thông tin và quy cách giữa các loại nhãn, thẻ của sản phẩm.',
    cta: 'Trao đổi nhu cầu may mặc',
    products: ['the-bai', 'tem-det', 'tem-vai-nilon', 'satin'],
    media: { kind: 'product', slug: 'tem-det' },
  },
  {
    slug: 'bao-bi-thuong-hieu', label: 'Bao bì thương hiệu',
    title: 'Hộp và tem nhãn cùng cách trình bày sản phẩm.',
    problem: 'Hình thức bao bì cần được xem xét cùng kích thước sản phẩm, cách đóng gói và nội dung cần thể hiện.',
    approach: 'Sunflower cùng bạn trao đổi quy cách hộp, tem nhãn và các hạng mục đi kèm; xác định phần việc thiết kế, gia công hoặc sản xuất cần thực hiện theo yêu cầu.',
    goal: 'Có cơ sở thống nhất hình thức bao bì và các hạng mục đi kèm.',
    cta: 'Trao đổi nhu cầu bao bì',
    products: ['hop', 'tem-mau-cuon', 'tem-mau-to', 'the-bai', 'bang-dinh'],
    media: { kind: 'product', slug: 'bang-dinh' },
  },
] as const satisfies readonly Solution[];

export type SolutionSlug = typeof solutions[number]['slug'];
