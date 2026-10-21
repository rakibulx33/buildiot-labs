import type { MetadataRoute } from "next";
import { absoluteUrl, isPreview } from "@/content/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Preview builds (such as the GitHub Pages address) are kept out of search results.
  if (isPreview) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
