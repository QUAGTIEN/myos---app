# Source worker

index.ts sẽ export các Functions thật khi triển khai. scheduled nhận trigger, services điều phối, adapters gọi dịch vụ ngoài, lib chứa SDK/logging.

Claim job bằng transaction/lease; gửi bên ngoài transaction; ghi kết quả theo lease/version và retry có giới hạn.
