import { DesignCard } from "@/components/designs/DesignCard";
import { Capabilities } from "@/components/home/Capabilities";
import { Engagements } from "@/components/home/Engagements";
import { Hero } from "@/components/home/Hero";
import { ProcessTrace } from "@/components/home/ProcessTrace";
import { NoteCard } from "@/components/notes/NoteCard";
import { TLink } from "@/components/site/TLink";
import { SectionHead } from "@/components/ui/SectionHead";
import { ReportSheet } from "@/components/work/ReportSheet";
import { designs } from "@/content/designs";
import { services } from "@/content/services";
import { absoluteUrl, site } from "@/content/site";
import { reports } from "@/content/work";
import { allNotes } from "@/lib/notes";

export const metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default async function Home() {
  const notes = (await allNotes()).slice(0, 3);
  const featured = reports[0];
  const coreServices = services.filter((s) => s.slug !== "products");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: absoluteUrl("/"),
    email: site.email,
    description: site.description,
    areaServed: ["Bangladesh", "Worldwide"],
    address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
    knowsAbout: ["Embedded firmware", "ESP32", "STM32", "FreeRTOS", "Low-power design", "MQTT", "IoT telemetry"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />

      <section aria-labelledby="build-title" className="pb-20 pt-16 lg:pb-28 lg:pt-20">
        <div className="wrap">
          <SectionHead
            id="build-title"
            title="What we build"
            intro="Four kinds of work, usually combined in one project. Each starts from the outcome you need."
          />
          <div className="mt-12 lg:mt-6">
            <Capabilities items={coreServices} />
          </div>
          <p className="mt-6">
            <TLink href="/services" className="link font-medium">
              All services, including end-to-end builds
            </TLink>
          </p>
        </div>
      </section>

      <section aria-labelledby="work-title" className="py-20 lg:py-28">
        <div className="wrap">
          <SectionHead
            id="work-title"
            title="From the lab"
            intro="Client work, written up as test reports: the problem, what we built, and what we measured."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-9">
              <ReportSheet report={featured} />
            </div>
            <aside className="min-w-0 lg:col-span-3 lg:pt-6">
              <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                Numbers on a report carry a tag. <strong className="font-semibold text-ink">Measured</strong> means
                the method is published. <strong className="font-semibold text-ink">Method note pending</strong> means
                we have the number but haven&rsquo;t written up how it was taken yet.
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

      <section aria-labelledby="designs-title" className="py-20 lg:py-28">
        <div className="wrap">
          <SectionHead
            id="designs-title"
            title="Reference designs"
            intro="Small, documented builds you can copy: wiring, firmware outline, design notes, and a parts list stocked at our sister store."
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
            intro="Pick the shape that fits. We quote after reading your brief, in taka or US dollars."
          />
          <div className="mt-12">
            <Engagements />
          </div>
        </div>
      </section>
    </>
  );
}
