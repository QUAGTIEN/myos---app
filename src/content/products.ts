// Canonical catalogue copy from docs/CONTENT.md. Names confirmed; descriptions are inquiry guidance.
// Shared by Home, the catalogue and solution links; no model/stock/capacity claims.
export const productCategories = [
  {
    "slug": "tem-trang-cuon",
    "name": "Tem trắng cuộn",
    "description": "Tem nhãn trắng dạng cuộn cho nhu cầu bổ sung thông tin sản phẩm, mã hàng hoặc thông tin quản lý theo cách sử dụng của doanh nghiệp.",
    "inquiryHint": "Kích thước tem, vật liệu mong muốn, thiết bị in đang dùng, số lượng."
  },
  {
    "slug": "tem-mau-cuon",
    "name": "Tem màu cuộn",
    "description": "Tem nhãn in theo nội dung và nhận diện thương hiệu, cung cấp ở dạng cuộn phù hợp với cách sử dụng được thống nhất.",
    "inquiryHint": "Nội dung/file mẫu, kích thước, vật liệu, cách dán hoặc sử dụng, số lượng."
  },
  {
    "slug": "tem-mau-to",
    "name": "Tem màu tờ",
    "description": "Tem nhãn in theo nội dung yêu cầu và bố trí trên tờ để sử dụng cho từng sản phẩm hoặc hạng mục.",
    "inquiryHint": "Kích thước tem, bố trí mong muốn trên tờ, nội dung, vật liệu, số lượng."
  },
  {
    "slug": "tem-trang-to",
    "name": "Tem trắng tờ",
    "description": "Tem nhãn trắng dạng tờ để doanh nghiệp lựa chọn quy cách và bổ sung thông tin theo nhu cầu.",
    "inquiryHint": "Kích thước tem, quy cách tờ, vật liệu, cách in hoặc sử dụng, số lượng."
  },
  {
    "slug": "muc-in",
    "name": "Mực in",
    "description": "Mực in phục vụ nhu cầu in ấn, được trao đổi theo thiết bị, vật liệu và mục đích sử dụng.",
    "inquiryHint": "Loại/model thiết bị, loại mực đang dùng hoặc cần tìm, vật liệu in, số lượng."
  },
  {
    "slug": "may-in",
    "name": "Máy in",
    "description": "Thiết bị in được cung ứng theo nhu cầu công việc. Sunflower trao đổi yêu cầu sử dụng và model cần tìm trước khi xác định phương án.",
    "inquiryHint": "Nội dung cần in, vật liệu/kích thước, môi trường sử dụng, model nếu đã chọn."
  },
  {
    "slug": "may-quet",
    "name": "Máy quét",
    "description": "Thiết bị quét được lựa chọn theo thông tin cần thu thập và cách sử dụng của doanh nghiệp.",
    "inquiryHint": "Nhu cầu quét, môi trường sử dụng, cách kết nối mong muốn, model nếu đã chọn."
  },
  {
    "slug": "hop",
    "name": "Hộp",
    "description": "Hộp phục vụ đóng gói và trình bày sản phẩm, với cấu trúc, kích thước và nội dung in được thống nhất theo yêu cầu.",
    "inquiryHint": "Kích thước sản phẩm, kiểu hộp hoặc mẫu tham khảo, vật liệu, nội dung in, số lượng."
  },
  {
    "slug": "the-bai",
    "name": "Thẻ bài",
    "description": "Thẻ thể hiện thương hiệu và thông tin sản phẩm, được trao đổi về hình dạng, nội dung, vật liệu và cách gắn.",
    "inquiryHint": "Kích thước, nội dung, vật liệu, cách gắn/dây nếu cần, số lượng."
  },
  {
    "slug": "tem-det",
    "name": "Tem dệt",
    "description": "Nhãn dệt để thể hiện thương hiệu hoặc thông tin trên sản phẩm, theo mẫu và quy cách được trao đổi.",
    "inquiryHint": "File/mẫu nội dung, kích thước, màu sắc, vị trí gắn, số lượng."
  },
  {
    "slug": "tem-vai-nilon",
    "name": "Tem vải nilon",
    "description": "Nhãn trên vật liệu vải nilon cho các nội dung cần thể hiện trên sản phẩm. Quy cách và nội dung được thống nhất theo yêu cầu.",
    "inquiryHint": "Nội dung nhãn, kích thước, vị trí sử dụng, yêu cầu vật liệu, số lượng."
  },
  {
    "slug": "satin",
    "name": "Satin",
    "description": "Vật liệu và nhãn satin cho nhu cầu làm nhãn hoặc sử dụng theo quy cách của doanh nghiệp.",
    "inquiryHint": "Cần vật liệu hay nhãn hoàn thiện, chiều rộng/kích thước, nội dung nếu cần in, số lượng."
  },
  {
    "slug": "bang-dinh",
    "name": "Băng dính",
    "description": "Băng dính phục vụ đóng gói và nhu cầu sử dụng theo quy cách được lựa chọn.",
    "inquiryHint": "Mục đích sử dụng, loại vật liệu, chiều rộng/chiều dài mong muốn, số lượng."
  }
] as const;

export type ProductSlug = typeof productCategories[number]['slug'];

export const productGroups = [
  { id: 'tem-cuon-tem-to', name: 'Tem cuộn & tem tờ', description: 'Từ nhãn trắng để bổ sung thông tin đến tem in theo nhận diện. Bắt đầu bằng nội dung, cách in và cách dán nhãn.', slugs: ['tem-trang-cuon', 'tem-mau-cuon', 'tem-trang-to', 'tem-mau-to'] },
  { id: 'nhan-may-mac-the-bai', name: 'Nhãn may mặc & thẻ bài', description: 'Thông tin thương hiệu và sản phẩm được trao đổi cùng vị trí gắn, nội dung và cách hoàn thiện từng loại nhãn, thẻ.', slugs: ['tem-det', 'the-bai', 'tem-vai-nilon', 'satin'] },
  { id: 'hop-bang-dinh', name: 'Hộp & băng dính', description: 'Xem xét hạng mục đóng gói từ kích thước sản phẩm, hình thức trình bày đến nội dung in và cách sử dụng.', slugs: ['hop', 'bang-dinh'] },
  { id: 'muc-in-thiet-bi', name: 'Mực in & thiết bị', description: 'Trao đổi theo công việc cần thực hiện, vật liệu và thiết bị đang dùng trước khi lựa chọn quy cách hoặc model.', slugs: ['muc-in', 'may-in', 'may-quet'] },
] as const satisfies readonly { id: string; name: string; description: string; slugs: readonly ProductSlug[] }[];

export const productApplications = {
  'tem-trang-cuon': ['Thông tin sản phẩm', 'Mã hàng & quản lý'],
  'tem-mau-cuon': ['Nhận diện thương hiệu', 'Nhãn sản phẩm'],
  'tem-trang-to': ['Bổ sung thông tin', 'Nhãn dạng tờ'],
  'tem-mau-to': ['Nhận diện sản phẩm', 'Nội dung in theo mẫu'],
  'tem-det': ['Nhãn thương hiệu', 'Hoàn thiện may mặc'],
  'the-bai': ['Thông tin sản phẩm', 'Thẻ treo thương hiệu'],
  'tem-vai-nilon': ['Nội dung trên nhãn', 'Nhãn may mặc'],
  'satin': ['Vật liệu làm nhãn', 'Nhãn hoàn thiện'],
  'hop': ['Đóng gói', 'Trình bày sản phẩm'],
  'bang-dinh': ['Đóng gói', 'Nội dung in theo yêu cầu'],
  'muc-in': ['Vật tư in ấn', 'Lựa chọn theo thiết bị'],
  'may-in': ['In thông tin & nhãn', 'Thiết bị theo nhu cầu'],
  'may-quet': ['Thu thập thông tin', 'Quản lý hàng hóa'],
} as const satisfies Record<ProductSlug, readonly string[]>;

export const specificationsGuide = [
  { title: 'Sản phẩm & mục đích', text: 'Nhóm sản phẩm cần làm hoặc vật tư, thiết bị cần tìm; cách bạn dự định sử dụng.' },
  { title: 'Kích thước & vật liệu', text: 'Hình dạng, kích thước, bề mặt hoặc vị trí sử dụng và vật liệu mong muốn.' },
  { title: 'Nội dung & mẫu', text: 'Ảnh mẫu, nội dung cần in hoặc file thiết kế nếu hạng mục cần thiết kế.' },
  { title: 'Số lượng & thời điểm', text: 'Số lượng dự kiến và thời điểm mong muốn nhận hàng để cùng trao đổi phương án.' },
  { title: 'Địa điểm & yêu cầu khác', text: 'Địa điểm giao nhận và các thông tin cần đối chiếu thêm trong quá trình tư vấn.' },
] as const;
