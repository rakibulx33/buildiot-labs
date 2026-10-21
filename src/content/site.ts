/** Public origin of the site, without the base path. Set by the deploy workflow. */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://buildiotlabs.com").replace(/\/$/, "");

/** Path prefix when served from a project page, e.g. "/buildiot-labs". */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix a file in /public with the base path. Links via next/link don't need this. */
export function withBase(path: string): string {
  return `${basePath}${path}`;
}

/** Absolute URL for a path on this site, e.g. for canonical links and the sitemap. */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${basePath}${path}`;
}

/** The one canonical domain. Any other host (such as the GitHub Pages preview) is a preview only. */
export const productionUrl = "https://buildiotlabs.com";
export const isPreview = siteUrl !== productionUrl;

/** Canonical URL: always the production domain, with no preview base path. */
export function canonicalUrl(path = "/"): string {
  return `${productionUrl}${path}`;
}

/** Social preview image, shared by pages that set their own Open Graph data. */
export const ogImage = {
  url: absoluteUrl("/og.png"),
  width: 1200,
  height: 630,
  alt: "BuildIoT Lab: Engineering Ideas Into Reality.",
};

export const site = {
  name: "BuildIoT Lab",
  url: productionUrl,
  email: "contact@buildiotlabs.com",
  motto: "Engineering Ideas Into Reality.",
  tagline: "From Circuit to Cloud \u2014 Hardware, Firmware & Software Engineering.",
  description:
    "From Circuit to Cloud \u2014 custom PCB design, embedded firmware, IoT hardware R&D, cloud platforms and connected software engineering.",
} as const;

export type NavItem = { href: string; label: string; blurb: string };

export const primaryNav: NavItem[] = [
  { href: "/services", label: "Services", blurb: "Hardware, PCB, firmware, software and consulting" },
  { href: "/work", label: "Work", blurb: "Projects and engineering evidence" },
  { href: "/reference-designs", label: "Reference designs", blurb: "Documented builds with parts lists" },
  { href: "/lab-notes", label: "Lab notes", blurb: "What we learn on the bench" },
  { href: "/tools", label: "Tools", blurb: "Battery, divider and data calculators" },
];

export const secondaryNav: NavItem[] = [
  { href: "/process", label: "Process", blurb: "How a project runs" },
  { href: "/pricing", label: "Engagement", blurb: "Review, sprint or retainer" },
  { href: "/about", label: "About", blurb: "Our engineering approach" },
  { href: "/methods", label: "How we measure", blurb: "What our numbers mean" },
  { href: "/faq", label: "FAQ", blurb: "Scope, ownership and confidentiality" },
  { href: "/contact", label: "Contact", blurb: "Start a project" },
];
