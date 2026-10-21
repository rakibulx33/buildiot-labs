import type { Metadata } from "next";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { faqs } from "@/content/faq";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "FAQ: Scope, Ownership and NDAs",
  description:
    "Answers about deliverables, PCB files, ownership, NDAs, remote delivery and pricing at BuildIoT Lab, an IoT and embedded product engineering team.",
  path: "/faq/",
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead title="Frequently asked questions" lead="Scope, deliverables, ownership and confidentiality, in plain terms." />
      <section aria-label="Questions" className="pb-24">
        <div className="wrap">
          <dl className="grid max-w-[48rem] gap-8">
            {faqs.map((x) => (
              <div key={x.q} className="border-t border-line pt-5">
                <dt className="t-h4">{x.q}</dt>
                <dd className="mt-2 text-[1.0625rem] leading-relaxed text-ink-2">{x.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-[1.0625rem] text-ink-2">
            Something else?{" "}
            <TLink href="/contact" className="link">
              Share a short brief
            </TLink>
            .
          </p>
        </div>
      </section>
    </>
  );
}
