import type { Metadata } from "next";
import { NoteCard } from "@/components/notes/NoteCard";
import { PageHead } from "@/components/ui/PageHead";
import { canonicalUrl } from "@/content/site";
import { allNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Lab notes",
  description: "Engineering notes from BuildIoT Lab on low-power design, ESP32 firmware, ADCs, MQTT and devices that survive load-shedding.",
  alternates: { canonical: canonicalUrl("/lab-notes/") },
};

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
