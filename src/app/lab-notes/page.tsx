import type { Metadata } from "next";
import { NoteCard } from "@/components/notes/NoteCard";
import { PageHead } from "@/components/ui/PageHead";
import { allNotes } from "@/lib/notes";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "ESP32 and IoT Engineering Notes",
  description:
    "Engineering notes from BuildIoT Lab on low-power ESP32 design, ADC accuracy, the cost of MQTT over TLS, and devices that survive unstable power.",
  path: "/lab-notes/",
});

export default async function NotesPage() {
  const notes = await allNotes();
  return (
    <>
      <PageHead
        title="Lab notes"
        lead="What we learn on the bench, written down so you don't have to learn it the hard way. Each note says where its numbers come from."
      />
      <section aria-label="Notes" className="pb-24">
        <div className="wrap grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <NoteCard key={n.slug} slug={n.slug} meta={n.meta} headingLevel={2} />
          ))}
        </div>
      </section>
    </>
  );
}
