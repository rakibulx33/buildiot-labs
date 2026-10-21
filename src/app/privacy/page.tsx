import type { Metadata } from "next";
import { PageHead } from "@/components/ui/PageHead";
import { canonicalUrl, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What BuildIoT Lab collects when you visit this site or send a project brief, and what it does with it.",
  alternates: { canonical: canonicalUrl("/privacy/") },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHead title="Privacy" lead="What this website collects, and what we do with a project brief. Last updated 22 October 2026." />
      <section aria-label="Privacy policy" className="pb-24">
        <div className="wrap">
          <div className="grid max-w-[44rem] gap-6 text-[1.0625rem] leading-relaxed text-ink-2">
            <h2 className="t-h3 text-ink">Visiting the site</h2>
            <p>
              This website sets no cookies and loads no advertising or tracking scripts. Fonts are served from the site
              itself. Our hosting provider keeps standard server logs (such as IP address and pages requested) for
              security and operation.
            </p>
            <h2 className="t-h3 text-ink">Sending a project brief</h2>
            <p>
              The brief contains what you type: your name, work email, optional company or project name, the services
              you need, and your technical brief, timeline and budget range if you give them. We use it only to reply
              to you and to assess whether and how we can help.
            </p>
            <p>
              Depending on how the form is configured, the brief is either opened in your own email app, addressed to{" "}
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              , or sent to a form-handling service that forwards it to that inbox. In the first case nothing is sent
              until you press send in your email app.
            </p>
            <p>
              Please don&rsquo;t put unpublished schematics, source code or other confidential files in the form. We will
              agree how to share them, including an NDA if you need one, before you do.
            </p>
            <h2 className="t-h3 text-ink">Keeping and deleting your information</h2>
            <p>
              We keep correspondence for as long as it is needed to run the conversation or the project, and for
              ordinary business records. To ask what we hold about you, or to have it deleted, email{" "}
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
            <h2 className="t-h3 text-ink">Changes</h2>
            <p>If this page changes, the date at the top changes with it.</p>
          </div>
        </div>
      </section>
    </>
  );
}
