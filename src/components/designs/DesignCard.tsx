import { ViewTransition } from "react";
import { Board } from "@/components/objects/Board";
import { TLink } from "@/components/site/TLink";
import type { Design } from "@/content/designs";
import { BoardArt } from "./BoardArt";

export function DesignBoard({ design, className = "" }: { design: Design; className?: string }) {
  return (
    <ViewTransition name={`board-${design.slug}`} share="morph" default="none">
      <Board legend={`${design.code} ${design.name}`} rev="Rev A" className={`board-card ${className}`}>
        <BoardArt variant={design.art} />
      </Board>
    </ViewTransition>
  );
}

export function DesignCard({ design, headingLevel = 3 }: { design: Design; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const parts = design.parts.filter((p) => !p.optional).length;
  return (
    <article className="design-card">
      <DesignBoard design={design} />
      <H className="t-h4 mt-6">
        <TLink href={`/reference-designs/${design.slug}`} transitionTypes={["drill"]} className="stretched-link">
          {design.name}
        </TLink>
      </H>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{design.summary}</p>
      <p className="mt-3 text-sm text-ink-3">
        {parts} parts, reference design{design.status === "draft" ? ", draft" : ", bench validated"}
      </p>
    </article>
  );
}
