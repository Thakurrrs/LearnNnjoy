import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LearnNnjoy",
    short_name: "LearnNnjoy",
    description: "A gentle, visual Maths adventure for Grades 4–12.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#6847e8",
    orientation: "portrait-primary",
    categories: ["education", "kids"],
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
