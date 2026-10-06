# API session — kế hoạch

POST đổi Firebase ID token thành HttpOnly/Secure session cookie. Kiểm tra token, recent sign-in, allowlist và chống CSRF trước khi cấp cookie. Không tin UID do request tự khai.
