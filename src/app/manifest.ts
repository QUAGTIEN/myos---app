import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "MyOS — Không gian cá nhân",
    short_name: "MyOS",
    description:
      "Sắp xếp lịch, công việc, dự án và ghi chú trong một không gian cá nhân.",
    lang: "vi",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f2f4f8",
    theme_color: "#102f49",
  };
}
