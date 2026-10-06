# Session và quyền

Dự kiến require-user.ts, session.ts và DAL. Xác minh session Firebase và allowlist, lấy UID cho query.

Action/handler/read đều kiểm tra quyền; không dựa duy nhất vào private layout. Không lưu mật khẩu hoặc tự xây password hashing thay Firebase Auth.
