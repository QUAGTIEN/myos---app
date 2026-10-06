# Phân hệ nghiệp vụ

Chỉ có overview, calendar, projects, notes, settings. Overview là tên module của màn hình Tổng quan (/dashboard).

Khi triển khai mỗi module tạo components, actions, service, repository và schemas/types theo nhu cầu. Action xử lý boundary; service điều phối ca sử dụng; repository truy cập dữ liệu; domain chứa quy tắc thuần dùng chung.

Upload, tìm kiếm và thông báo là khả năng dùng trong các phân hệ, không phải menu mới.
