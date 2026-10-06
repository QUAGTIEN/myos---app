# MyOS

Bộ khung định hướng cho phần mềm cá nhân gồm **Tổng quan, Lịch, Dự án, Ghi chú, Cài đặt**.

## Trạng thái hiện tại

Chỉ có thư mục và tài liệu thiết kế. **Chưa có mã ứng dụng, dependencies, cấu hình chạy hay kết nối cloud.** Các README trong source mô tả trách nhiệm và tên file dự kiến; chúng không phải Next.js page hay endpoint đang hoạt động.

Chưa có lệnh install/dev/build/test để chạy. Không cài package hoặc tạo project Firebase ở giai đoạn này.

## Công nghệ đã chọn

- Next.js App Router + React + TypeScript.
- Firestore cho database; Firebase Authentication cho tài khoản.
- Cloud Storage for Firebase cho ảnh/tệp.
- Firebase App Hosting cho web Next.js.
- Cloud Functions gen 2 + Cloud Scheduler cho nhắc lịch.
- pnpm workspace dự kiến cho web ở root, domain và worker.

Các thư viện UI, lịch, editor và kiểm thử là đề xuất trong tài liệu kiến trúc; chưa được cài hay khóa phiên bản.

## Tài liệu

- [Kiến trúc đầy đủ](MYOS_ARCHITECTURE.md): công nghệ, 5 phân hệ, dữ liệu, triển khai và cách áp dụng Next.js Learn.
- [Hướng dẫn agent](AGENTS.md): phạm vi, quy ước và ranh giới mã nguồn.
- [Bản đồ source](docs/SOURCE_MAP.md): cây thư mục thực tế và các file sẽ tạo khi bắt đầu code.
- [Kế hoạch triển khai](docs/IMPLEMENTATION_PLAN.md): 5 module, 8 giai đoạn và tiêu chí bàn giao.
- [Quyết định kiến trúc](docs/decisions/README.md).
- [Vận hành và triển khai](docs/runbooks/README.md).

## Cấu trúc chính

| Thư mục | Vai trò |
| --- | --- |
| src/app | Route, page, layout, loading/error và HTTP boundary của Next.js |
| src/modules | 5 phân hệ nghiệp vụ |
| src/components | UI và bố cục dùng chung |
| src/lib | Firebase, xác thực và helper Firestore |
| packages/domain/src | Quy tắc nghiệp vụ thuần dùng chung |
| functions/src | Worker nhắc lịch và adapter tích hợp |
| public | Tài nguyên tĩnh công khai |
| scripts | Seed Emulator và migration được kiểm soát |
| tests | Kiểm thử theo lớp khi có implementation |
| docs | Bản đồ source, quyết định và runbook |

Chi tiết trách nhiệm nằm trong README từng thư mục. **Nguồn chính cho phạm vi sản phẩm là MYOS_ARCHITECTURE.md**; SOURCE_MAP mô tả phần đã tạo trên ổ đĩa.

## Bước tiếp theo khi được yêu cầu lập trình

Khởi tạo Next.js vào bộ khung này, thêm manifest/cấu hình và chọn phiên bản tương thích App Hosting. Sau đó làm layout 5 mục, xác thực, rules và các luồng nghiệp vụ theo roadmap. Cập nhật tài liệu khi cấu trúc thực tế thay đổi.
