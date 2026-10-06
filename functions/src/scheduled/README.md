# Trigger định kỳ

Dự kiến dispatch-reminders, recurring-items và poll-zalo nếu cơ chế tích hợp hỗ trợ.

Scheduler quét jobs đến hạn với limit. Có lease, idempotency, xử lý job cũ và quá hạn. Không cam kết exactly-once nếu timeout gửi không xác định kết quả.
