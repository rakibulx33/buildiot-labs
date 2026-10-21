import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Static HTML export: deploys to Cloudflare Pages (or any static host).
  // The project brief form posts to a Cloudflare Pages Function in /functions.
  // Note: cacheComponents (and with it Partial Prerendering) cannot be used
  // with a static export, so it stays off here.
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
