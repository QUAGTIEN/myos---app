# UI cơ sở

G1 có heading, empty state, feature notice, skeleton và error state; style button/input qua CSS tokens/Tailwind. Drawer mobile dùng Radix Dialog. Chưa sinh bộ shadcn/toast; không truy vấn Firestore ở lớp này.

Icon giao diện chỉ dùng Lucide qua lucide-react; import trực tiếp icon cần dùng, thống nhất size/stroke/màu. Không generate icon, tự vẽ SVG hoặc thay icon bằng emoji. Xem quy tắc trong AGENTS.md.
