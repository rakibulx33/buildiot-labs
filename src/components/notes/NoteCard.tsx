import { ViewTransition } from "react";
import { NotebookPage } from "@/components/objects/NotebookPage";
import { TLink } from "@/components/site/TLink";
import type { NoteMeta } from "@/lib/notes";

export function NoteCard({ slug, meta, headingLevel = 3 }: { slug: string; meta: NoteMeta; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="note-card">
      <ViewTransition name={`note-${slug}`} share="morph" default="none">
        <NotebookPage entry={meta.entry} date={meta.date} className="h-full">
          <H className="t-h4 mt-3 leading-[1.625rem]">
            <TLink href={`/lab-notes/${slug}`} transitionTypes={["drill"]} className="stretched-link">
              {meta.title}
            </TLink>
          </H>
          <p className="mt-[1.625rem] text-[0.9375rem] leading-[1.625rem] text-ink-2">{meta.summary}</p>
          <p className="mt-[1.625rem] text-sm leading-[1.625rem] text-ink-3">{meta.topics.join(", ")}</p>
        </NotebookPage>
      </ViewTransition>
    </article>
  );
}
