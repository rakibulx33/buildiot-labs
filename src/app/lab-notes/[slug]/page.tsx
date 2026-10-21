import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { formatDate } from "@/components/objects/NotebookPage";
import { TLink } from "@/components/site/TLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { canonicalUrl, ogImage, site } from "@/content/site";
import { allNotes, getNote, noteSlugs } from "@/lib/notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return noteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/lab-notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!noteSlugs().includes(slug)) return {};
  const { meta } = await getNote(slug);
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: canonicalUrl(`/lab-notes/${slug}/`) },
    openGraph: { type: "article", publishedTime: meta.date, siteName: site.name, images: [ogImage] },
  };
}

export default async function NotePage({ params }: PageProps<"/lab-notes/[slug]">) {
  const { slug } = await params;
  if (!noteSlugs().includes(slug)) notFound();
  const { meta, Content } = await getNote(slug);
  const others = (await allNotes()).filter((n) => n.slug !== slug).slice(0, 3);
  const entry = String(meta.entry).padStart(3, "0");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: meta.title,
    description: meta.summary,
    datePublished: meta.date,
    author: { "@type": "Organization", name: site.name, url: canonicalUrl("/") },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: canonicalUrl(`/lab-notes/${slug}/`),
  };

  return (
    <article className="wrap pb-24 pt-10 sm:pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={[{ href: "/lab-notes", label: "Lab notes" }]} current={`No. ${entry}`} />

      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-9">
          <ViewTransition name={`note-${slug}`} share="morph" default="none">
            <div className="note-sheet">
              <div className="flex flex-wrap justify-between gap-4 font-mono text-[0.8125rem] text-ink-3">
                <span>No. {entry}</span>
                <time dateTime={meta.date}>{formatDate(meta.date)}</time>
              </div>
              <h1 className="t-h2 mt-6 max-w-[24ch]">{meta.title}</h1>
              <p className="t-lead mt-5 max-w-[40rem]">{meta.summary}</p>
              <p className="mt-4 text-sm text-ink-3">{meta.topics.join(", ")}</p>
              <div className="lab-prose mt-10">
                <Content />
              </div>
            </div>
          </ViewTransition>
        </div>

        <aside className="min-w-0 lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <h2 className="t-h4">More notes</h2>
            <ul className="mt-4 grid gap-4">
              {others.map((n) => (
                <li key={n.slug} className="border-t border-line pt-3">
                  <p className="font-mono text-xs text-ink-3">No. {String(n.meta.entry).padStart(3, "0")}</p>
                  <TLink href={`/lab-notes/${n.slug}`} transitionTypes={["drill"]} className="link mt-1 inline-block text-[0.9375rem] font-medium leading-snug">
                    {n.meta.title}
                  </TLink>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-line pt-5">
              <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                Have a device with this problem? We can measure it and fix it.
              </p>
              <TLink href="/contact" className="btn btn-primary btn-sm mt-4">
                <span className="btn-pad" aria-hidden="true" />
                Start a Project
              </TLink>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
