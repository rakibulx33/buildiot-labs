import type { MetadataRoute } from "next";
import { designs } from "@/content/designs";
import { absoluteUrl } from "@/content/site";
import { tools } from "@/content/tools";
import { reports } from "@/content/work";
import { noteSlugs } from "@/lib/notes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/services/",
    "/work/",
    "/reference-designs/",
    "/lab-notes/",
    "/tools/",
    "/process/",
    "/pricing/",
    "/about/",
    "/methods/",
    "/contact/",
    ...reports.map((r) => `/work/${r.slug}/`),
    ...designs.map((d) => `/reference-designs/${d.slug}/`),
    ...noteSlugs().map((s) => `/lab-notes/${s}/`),
    ...tools.map((t) => `/tools/${t.slug}/`),
  ];
  return pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
