import type { Metadata } from "next";
import { DesignCard } from "@/components/designs/DesignCard";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { designs } from "@/content/designs";
import { canonicalUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Reference designs",
  description:
    "Open, documented IoT builds with wiring, firmware outlines, design notes and parts lists.",
  alternates: { canonical: canonicalUrl("/reference-designs/") },
};

export default function DesignsPage() {
  return (
    <>
      <PageHead
        title="Reference designs"
        lead="Small, documented builds you can copy. Each one has a wiring table, a firmware outline, design notes, its limits, and a parts list."
      />
      <section aria-label="Designs" className="pb-20">
        <div className="wrap grid gap-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {designs.map((d) => (
            <DesignCard key={d.slug} design={d} headingLevel={2} />
          ))}
        </div>
      </section>
      <section aria-labelledby="status-title" className="pb-24">
        <div className="wrap">
          <div className="grid gap-8 border-t border-line pt-14 md:grid-cols-12">
            <h2 id="status-title" className="t-h3 md:col-span-4">
              Draft or validated
            </h2>
            <div className="grid gap-5 text-[1.0625rem] leading-relaxed text-ink-2 md:col-span-7 md:col-start-6">
              <p>
                A <strong className="font-semibold text-ink">draft</strong> design has its wiring and firmware outline
                written and checked against datasheets. A{" "}
                <strong className="font-semibold text-ink">validated</strong> design has also been built and measured
                on our bench, with the method published.
              </p>
              <p>
                Reference designs are internal R&amp;D demonstrators, kept separate from paid client work. Need one
                developed further for your product?{" "}
                <TLink href="/contact" className="link">
                  Send us a brief
                </TLink>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
