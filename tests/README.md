# Chiến lược kiểm thử

G1 có Playwright kiểm tra shell trên desktop/mobile: navigation, calendar controls, disabled mutations/login, 404, font và bàn phím/overflow. Chạy theo README ở root; chưa có domain/service/Rules để kiểm thử các lớp đó.

unit: domain; integration: service/repository/transaction; rules: quyền Firestore/Storage bằng Emulator; e2e: luồng dùng chính. Commands sẽ theo package.json thật.
