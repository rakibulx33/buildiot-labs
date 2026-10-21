import { DesignCard } from "@/components/designs/DesignCard";
import { Capabilities } from "@/components/home/Capabilities";
import { Engagements } from "@/components/home/Engagements";
import { Faq } from "@/components/home/Faq";
import { Handover } from "@/components/home/Handover";
import { Hero } from "@/components/home/Hero";
import { Showcase } from "@/components/home/Showcase";
import { ProcessTrace } from "@/components/home/ProcessTrace";
import { NoteCard } from "@/components/notes/NoteCard";
import { TLink } from "@/components/site/TLink";
import { SectionHead } from "@/components/ui/SectionHead";
import { ReportSheet } from "@/components/work/ReportSheet";
import { designs } from "@/content/designs";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { reports } from "@/content/work";
import { allNotes } from "@/lib/notes";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "BuildIoT Lab | Engineering Ideas Into Reality",
  description: site.description,
  path: "/",
});

export default async function Home() {
  const notes = (await allNotes()).slice(0, 3);
  const featured = reports[0];

  return (
    <>
      <Hero />

      <section aria-labelledby="build-title" className="pb-20 pt-16 lg:pb-28 lg:pt-20">
        <div className="wrap">
          <SectionHead
            id="build-title"
            title="What we engineer"
            intro="Connected products need hardware, firmware and software that work together. We design the electronics, develop the embedded systems, build the supporting applications and document the handover."
          />
          <div className="mt-12 lg:mt-6">
            <Capabilities items={services} />
          </div>
          <p className="mt-6">
            <TLink href="/services" className="link font-medium">
              All five services, with deliverables
            </TLink>
          </p>
        </div>
      </section>

      <section aria-labelledby="work-title" className="py-20 lg:py-28">
        <div className="wrap">
          <SectionHead
            id="work-title"
            title="Selected engineering work"
            intro="Projects written up as engineering reports: the problem, what we built, the evidence and its limits."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-9">
              <ReportSheet report={featured} />
            </div>
            <aside className="min-w-0 lg:col-span-3 lg:pt-6">
              <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                Numbers on a report carry a tag. <strong className="font-semibold text-ink">Measured</strong> means
                the method is published. <strong className="font-semibold text-ink">Unverified</strong> means
                we have the number but haven&rsquo;t published how it was taken, so don&rsquo;t rely on it.
              </p>
              <p className="mt-4">
                <TLink href="/methods" className="link text-[0.9375rem] font-medium">
                  How we measure
                </TLink>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section aria-labelledby="showcase-title" className="py-20 lg:py-28">
        <div className="wrap">
          <SectionHead
            id="showcase-title"
            title="From board to dashboard"
            intro="A connected product is a PCB, firmware and software working as one. These two panels are labelled illustrations; real, approved examples replace them as projects are cleared for publication."
          />
          <div className="mt-12">
            <Showcase />
          </div>
        </div>
      </section>

      <section aria-labelledby="designs-title" className="py-20 lg:py-28">
        <div className="wrap">
          <SectionHead
            id="designs-title"
            title="Reference designs"
            intro="Internal R&D demonstrators, separate from client work: wiring, firmware outline, design notes and a parts list. Our calculators are in the Tools section."
          />
          <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {designs.map((d) => (
              <DesignCard key={d.slug} design={d} />
            ))}
          </div>
          <p className="mt-10">
            <TLink href="/reference-designs" className="link font-medium">
              All reference designs
            </TLink>
          </p>
        </div>
      </section>

      <section aria-labelledby="process-title" className="py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <h2 id="process-title" className="t-h2">
                How a project runs
              </h2>
              <p className="t-lead mt-4 max-w-[28rem]">
                Five steps, the same every time. You always know what we&rsquo;re doing next and what you&rsquo;ll
                get from it.
              </p>
              <p className="mt-6">
                <TLink href="/process" className="link font-medium">
                  The process in detail
                </TLink>
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ProcessTrace />
          </div>
        </div>
      </section>

      <section aria-labelledby="handover-title" className="py-20 lg:py-28">
        <div className="wrap">
          <SectionHead
            id="handover-title"
            title="Deliverables and ownership"
            intro="You should be able to build, test and maintain the work without us in the room."
          />
          <div className="mt-12">
            <Handover />
          </div>
        </div>
      </section>

      <section aria-labelledby="notes-title" className="py-20 lg:py-28">
        <div className="wrap">
          <SectionHead
            id="notes-title"
            title="Lab notes"
            intro="What we learn on the bench, written down so you don't have to learn it the hard way."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {notes.map((n) => (
              <NoteCard key={n.slug} slug={n.slug} meta={n.meta} />
            ))}
          </div>
          <p className="mt-10">
            <TLink href="/lab-notes" className="link font-medium">
              All lab notes
            </TLink>
          </p>
        </div>
      </section>

      <section aria-labelledby="engage-title" className="pb-24 pt-20 lg:pb-32 lg:pt-28">
        <div className="wrap">
          <SectionHead
            id="engage-title"
            title="Ways to work with us"
            intro="Pick the shape that fits. We quote after reading your brief, as a written proposal."
          />
          <div className="mt-12">
            <Engagements />
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="pb-24 pt-4 lg:pb-32">
        <div className="wrap">
          <SectionHead id="faq-title" title="Common questions" intro="The short answers. The full list is on the FAQ page." />
          <div className="mt-12">
            <Faq />
          </div>
        </div>
      </section>
    </>
  );
}
