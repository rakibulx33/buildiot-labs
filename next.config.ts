import type { NextConfig } from "next";
import createMDX from "@next/mdx";

/**
 * Static HTML export, deployed to GitHub Pages by .github/workflows/deploy.yml.
 *
 * PAGES_BASE_PATH is set by the workflow: "/buildiot-labs" while the site is
 * served from rakibulx33.github.io/buildiot-labs, or "" once a custom domain
 * (buildiotlabs.com) is configured for Pages.
 *
 * Cache Components (and with it Partial Prerendering) cannot be used with a
 * static export, so it stays off.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    // With the Tailwind Turbopack loader, cached builds kept serving an old
    // globals.css after edits. Fresh compiles are a few seconds; keep them.
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
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
