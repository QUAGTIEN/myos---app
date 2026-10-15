import type { ProductSlug } from './products';
import type { SolutionSlug } from './solutions';

export const sampleCategories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'tem-nhan', label: 'Tem nhãn' },
  { id: 'nhan-may-mac', label: 'Nhãn may mặc' },
  { id: 'bao-bi', label: 'Bao bì' },
  { id: 'the-bai', label: 'Thẻ bài' },
] as const;
export type SampleCategory = typeof sampleCategories[number]['id'];

// Catalogue illustrations supplied for the preview. Never treated as client projects.
export const projectSamples = [
  { slug: 'mau-tem-mau-cuon', productSlug: 'tem-mau-cuon', category: 'tem-nhan', title: 'Tem màu dạng cuộn', description: 'Quan sát cách bố trí nội dung và hình dạng nhãn trên dải cuộn.', solutionSlug: 'nhan-dien-san-pham' },
  { slug: 'mau-tem-det', productSlug: 'tem-det', category: 'nhan-may-mac', title: 'Chi tiết bề mặt nhãn dệt', description: 'Tham khảo cách thể hiện chữ, nét và màu trên bề mặt nhãn dệt.', solutionSlug: 'nhan-may-mac' },
  { slug: 'mau-bang-dinh', productSlug: 'bang-dinh', category: 'bao-bi', title: 'Băng dính in dùng đóng gói', description: 'Góc nhìn về dải băng dính in và cách sử dụng cùng bao bì.', solutionSlug: 'bao-bi-thuong-hieu' },
  { slug: 'mau-tem-trang-cuon', productSlug: 'tem-trang-cuon', category: 'tem-nhan', title: 'Tem trắng dạng cuộn', description: 'Quan sát hình thức cuộn, dải nhãn và đường bế trên bề mặt.', solutionSlug: 'kho-van' },
  { slug: 'mau-the-bai', productSlug: 'the-bai', category: 'the-bai', title: 'Hình dáng & nội dung thẻ bài', description: 'Một mẫu tham khảo về hình dáng, vị trí lỗ treo và bố trí nội dung.', solutionSlug: 'nhan-may-mac' },
  { slug: 'mau-tem-trang-to', productSlug: 'tem-trang-to', category: 'tem-nhan', title: 'Đường bế trên tem dạng tờ', description: 'Tham khảo hình tròn, hình chữ nhật và cách bố trí nhãn trên tờ.', solutionSlug: 'nhan-dien-san-pham' },
] as const satisfies readonly { slug: string; productSlug: ProductSlug; category: Exclude<SampleCategory, 'all'>; title: string; description: string; solutionSlug: SolutionSlug }[];

export type ProjectSampleSlug = typeof projectSamples[number]['slug'];
