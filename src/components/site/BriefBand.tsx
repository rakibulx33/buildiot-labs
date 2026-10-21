"use client";

import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { TLink } from "./TLink";

/** The closing call to action, printed like silkscreen on a soldermask board. */
export function BriefBand() {
  const pathname = usePathname().replace(/\/$/, "");
  if (pathname === "/contact") return null;

  return (
    <section aria-labelledby="brief-band-title" className="board-band on-dark">
      <div className="wrap relative grid gap-8 py-16 md:grid-cols-12 md:items-end lg:py-24">
        <div className="md:col-span-8">
          <h2 id="brief-band-title" className="t-h1 text-silk">
            Tell us what you&rsquo;re building.
          </h2>
          <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-silk/80">
            Have a device, a design challenge, or a connected product idea? Share a short technical brief and we&rsquo;ll
            discuss the next engineering step.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:col-span-4 md:justify-end">
          <TLink href="/contact" className="btn btn-silk">
            <span className="btn-pad" aria-hidden="true" />
            Start a Project
          </TLink>
          <a className="link text-silk" href={`mailto:${site.email}`}>
            or email {site.email}
          </a>
        </div>
        <svg className="board-band-traces" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 H120 L150 60 H400" />
          <path d="M0 52 H96 L126 82 H400" />
          <path d="M0 74 H72 L102 104 H400" />
        </svg>
      </div>
    </section>
  );
}
