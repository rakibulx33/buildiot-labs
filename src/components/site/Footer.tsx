import { primaryNav, secondaryNav, site } from "@/content/site";
import { BriefBand } from "./BriefBand";
import { LogoPlate } from "./Logo";
import { TLink } from "./TLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <BriefBand />
      <div className="on-dark bg-panel text-panel-text">
        <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:gap-8 lg:py-20">
          <div className="md:col-span-4">
            <LogoPlate height={40} />
            <p className="mt-5 max-w-[22rem] text-[0.9375rem] leading-relaxed text-panel-muted">
              {site.motto} {site.tagline}
            </p>
            <p className="mt-5 text-[0.9375rem]">
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-4">
            <div>
              <p className="text-sm font-semibold text-panel-muted [font-stretch:92%]">The lab</p>
              <ul className="mt-3 space-y-2 text-[0.9375rem]">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <TLink href={item.href} className="footer-link">
                      {item.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-panel-muted [font-stretch:92%]">Working with us</p>
              <ul className="mt-3 space-y-2 text-[0.9375rem]">
                {secondaryNav.map((item) => (
                  <li key={item.href}>
                    <TLink href={item.href} className="footer-link">
                      {item.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="md:col-span-4">
            <div className="rounded-[10px] border border-panel-line p-5">
              <p className="text-sm font-semibold text-panel-muted [font-stretch:92%]">Confidential by arrangement</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">
                We can discuss NDA arrangements before reviewing confidential design files. Access, ownership and
                handover terms are agreed in writing before work begins.
              </p>
              <a className="btn btn-on-dark btn-sm mt-4" href={`mailto:${site.email}`}>
                Email {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-panel-line">
          <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-panel-muted">
            <p>
              © {year} {site.name}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <TLink href="/methods" className="footer-link">
                  How we measure
                </TLink>
              </li>
              <li>
                <TLink href="/privacy" className="footer-link">
                  Privacy
                </TLink>
              </li>
              <li>
                <TLink href="/terms" className="footer-link">
                  Terms
                </TLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
