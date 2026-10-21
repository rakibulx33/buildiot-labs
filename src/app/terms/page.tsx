import type { Metadata } from "next";
import { PageHead } from "@/components/ui/PageHead";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Terms",
  description:
    "Terms for using the BuildIoT Lab website, how calculators and reference designs should be used, and how engagement terms are agreed in writing.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <>
      <PageHead title="Terms" lead="Terms for using this website. Last updated 22 October 2026." />
      <section aria-label="Website terms" className="pb-24">
        <div className="wrap">
          <div className="grid max-w-[44rem] gap-6 text-[1.0625rem] leading-relaxed text-ink-2">
            <h2 className="t-h3 text-ink">Engagements are agreed in writing</h2>
            <p>
              Nothing on this site is an offer or a contract. Every engagement starts with a written scope, milestones
              and acceptance criteria. Access, ownership, confidentiality and handover terms are agreed in writing
              before work begins, and deliverables are subject to the agreed scope and test criteria.
            </p>
            <h2 className="t-h3 text-ink">Calculators and models</h2>
            <p>
              The calculators and the scope on the home page are models built from stated assumptions. They help you
              reason about a design; they are not a guarantee of how a real device will perform. Always verify with
              measurements on your own hardware.
            </p>
            <h2 className="t-h3 text-ink">Reference designs and lab notes</h2>
            <p>
              Reference designs and lab notes are provided for information, as internal R&amp;D demonstrators. They are
              not certified products. Check every part against its datasheet and follow the electrical safety rules
              that apply to you before building anything.
            </p>
            <h2 className="t-h3 text-ink">Content and trademarks</h2>
            <p>
              The text, diagrams and code on this site are ours unless marked otherwise. Please ask before reusing
              them. The BuildIoT Lab name and logo identify our business.
            </p>
            <h2 className="t-h3 text-ink">Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
