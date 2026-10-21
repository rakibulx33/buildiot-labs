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

/** Social preview image, shared by pages that set their own Open Graph data. */
export const ogImage = {
  url: absoluteUrl("/og.png"),
  width: 1200,
  height: 630,
  alt: "BuildIoT Labs: every microamp counted, every packet accounted for.",
};

export const site = {
  name: "BuildIoT Labs",
  url: siteUrl,
  email: "hello@buildiotlabs.com",
  location: "Dhaka, Bangladesh",
  description:
    "BuildIoT Labs designs firmware, low-power hardware and telemetry pipelines for connected devices, and publishes how every number was measured.",
  store: {
    name: "BuildIoT BD",
    url: "https://buildiotbd.com",
    quoteUrl: "https://buildiotbd.com/quote",
  },
} as const;

export type NavItem = { href: string; label: string; blurb: string };

export const primaryNav: NavItem[] = [
  { href: "/services", label: "Services", blurb: "Firmware, power, telemetry and prototypes" },
  { href: "/work", label: "Work", blurb: "Test reports from client projects" },
  { href: "/reference-designs", label: "Reference designs", blurb: "Open builds with parts lists" },
  { href: "/lab-notes", label: "Lab notes", blurb: "What we learn on the bench" },
  { href: "/tools", label: "Tools", blurb: "Battery, divider and data calculators" },
];

export const secondaryNav: NavItem[] = [
  { href: "/process", label: "Process", blurb: "How a project runs" },
  { href: "/pricing", label: "Pricing", blurb: "Ways to work with us" },
  { href: "/about", label: "About", blurb: "Who runs the lab" },
  { href: "/methods", label: "How we measure", blurb: "What our numbers mean" },
  { href: "/contact", label: "Contact", blurb: "Start a project brief" },
];
