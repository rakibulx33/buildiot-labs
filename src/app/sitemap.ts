import type { MetadataRoute } from "next";
import { designs } from "@/content/designs";
import { absoluteUrl } from "@/content/site";
import { tools } from "@/content/tools";
import { reports } from "@/content/work";
import { allNotes } from "@/lib/notes";

export const dynamic = "force-static";

/** Date the site content was last reviewed. Update it when page content changes. */
const CONTENT_UPDATED = "2026-10-22";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await allNotes();
  const entry = (path: string, priority: number, lastModified = CONTENT_UPDATED): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly",
    priority,
  });
  return [
    entry("/", 1),
    entry("/services/", 0.9),
    entry("/contact/", 0.9),
    entry("/work/", 0.8),
    entry("/reference-designs/", 0.8),
    entry("/lab-notes/", 0.8),
    entry("/tools/", 0.8),
    entry("/process/", 0.7),
    entry("/pricing/", 0.7),
    entry("/about/", 0.7),
    entry("/faq/", 0.7),
    entry("/methods/", 0.6),
    ...reports.map((r) => entry(`/work/${r.slug}/`, 0.7)),
    ...designs.map((d) => entry(`/reference-designs/${d.slug}/`, 0.7)),
    ...notes.map((n) => entry(`/lab-notes/${n.slug}/`, 0.7, n.meta.date)),
    ...tools.map((t) => entry(`/tools/${t.slug}/`, 0.7)),
    entry("/privacy/", 0.3),
    entry("/terms/", 0.3),
  ];
}
