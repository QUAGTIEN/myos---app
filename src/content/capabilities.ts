// Public workflow from CONTENT.md / the ERP overview, not a claim of machine ownership.
export const supplyModels = [
  { title: 'Cung ứng nguyên vật liệu', description: 'Mua và cung cấp lại vật liệu, vật tư theo mặt hàng và quy cách doanh nghiệp cần, để khách hàng sử dụng trong công việc của mình.', link: { href: '/san-pham/#muc-in-thiet-bi', label: 'Vật tư & thiết bị' } },
  { title: 'Gia công từ nguyên vật liệu', description: 'Chuẩn bị nguyên vật liệu và thực hiện các phần việc gia công đã thống nhất để bàn giao sản phẩm hoặc hạng mục hoàn thiện.', link: { href: '/san-pham/#tem-cuon-tem-to', label: 'Nhóm tem nhãn' } },
  { title: 'Thiết kế & sản xuất theo yêu cầu', description: 'Tiếp nhận nội dung, thực hiện mẫu cho phần việc cần thiết kế, phối hợp duyệt mẫu và triển khai sản xuất theo thông tin đơn hàng.', link: { href: '/giai-phap', label: 'Giải pháp theo nhu cầu' } },
] as const;

export const productionSteps = [
  { title: 'Tiếp nhận nhu cầu', description: 'Sale trao đổi mặt hàng cần làm hoặc cung cấp, mục đích sử dụng, số lượng và yêu cầu ban đầu.' },
  { title: 'Thống nhất thông tin đơn hàng', description: 'Làm rõ quy cách, hình thức thực hiện, thời điểm mong muốn, địa điểm giao nhận và điều kiện thương mại.' },
  { title: 'Thiết kế & duyệt mẫu khi cần', description: 'Với hạng mục cần thiết kế, mẫu được gửi để khách hàng xem, phản hồi và thống nhất trước phần việc tiếp theo.' },
  { title: 'Chuẩn bị hàng hóa & triển khai', description: 'Chuẩn bị hàng, vật tư hoặc thực hiện gia công, sản xuất theo phương án của từng mặt hàng.' },
  { title: 'Kiểm tra & đối chiếu', description: 'Đối chiếu sản phẩm, số lượng, quy cách và các yêu cầu đã thống nhất trước khi phối hợp bàn giao.' },
  { title: 'Giao nhận & chứng từ', description: 'Phối hợp địa điểm, số lượng bàn giao; tiếp nối hóa đơn, chứng từ và thanh toán theo điều khoản đơn hàng.' },
] as const;

export const deliveryAreas = ['Hà Nội', 'Hưng Yên', 'Nam Định', 'Bắc Ninh', 'Thái Nguyên', 'Vĩnh Phúc'] as const;
