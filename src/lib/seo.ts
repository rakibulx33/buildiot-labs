import type { Metadata } from "next";
import { canonicalUrl, ogImage, site } from "@/content/site";

type PageMetaInput = {
  /** Page title without the site name; the layout template appends " | BuildIoT Lab". */
  title: string;
  /** 110 to 160 characters reads best in search results. */
  description: string;
  /** Path with a trailing slash, e.g. "/services/". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/**
 * One place for per-page metadata, so every page gets a unique title and
 * description, a canonical URL on the production domain, and matching Open
 * Graph and Twitter cards. (Next replaces a parent's openGraph object rather
 * than merging it, so each page must set its own.)
 */
export function pageMeta({ title, description, path, type = "website", publishedTime }: PageMetaInput): Metadata {
  const url = canonicalUrl(path);
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: "en_US",
      title: fullTitle,
      description,
      images: [ogImage],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage.url] },
  };
}

/** schema.org BreadcrumbList for a trail of [label, path] pairs, ending at the current page. */
export function breadcrumbJsonLd(trail: Array<[string, string]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...trail].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: canonicalUrl(path),
    })),
  };
}

/** The organisation and website graph, rendered once for the whole site. */
export function organizationJsonLd() {
  const orgId = canonicalUrl("/#organization");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": orgId,
        name: site.name,
        url: canonicalUrl("/"),
        logo: { "@type": "ImageObject", url: canonicalUrl("/logo.png"), width: 781, height: 188 },
        image: canonicalUrl("/og.png"),
        slogan: site.motto.replace(/\.$/, ""),
        description: site.description,
        email: site.email,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "project enquiries",
          email: site.email,
          availableLanguage: "English",
        },
        knowsAbout: [
          "IoT hardware design",
          "PCB design",
          "Embedded firmware",
          "ESP32",
          "STM32",
          "MQTT",
          "IoT software and cloud platforms",
        ],
      },
      {
        "@type": "WebSite",
        "@id": canonicalUrl("/#website"),
        url: canonicalUrl("/"),
        name: site.name,
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
    ],
  };
}
