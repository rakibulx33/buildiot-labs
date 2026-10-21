import type { MetadataRoute } from "next";
import { site, withBase } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: withBase("/"),
    display: "browser",
    background_color: "#dce3e4",
    theme_color: "#dce3e4",
    icons: [
      { src: withBase("/icon.png"), sizes: "128x128", type: "image/png" },
      { src: withBase("/apple-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  };
}
