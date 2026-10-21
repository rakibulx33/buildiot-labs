import { primaryNav, secondaryNav, site } from "@/content/site";
import { BriefBand } from "./BriefBand";
import { LogoMark } from "./Logo";
import { TLink } from "./TLink";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <BriefBand />
      <div className="on-dark bg-panel text-panel-text">
        <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:gap-8 lg:py-20">
          <div className="md:col-span-4">
            <p className="inline-flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[1.0625rem] font-[650] leading-none [font-stretch:118%]">BuildIoT Labs</span>
            </p>
            <p className="mt-5 max-w-[22rem] text-[0.9375rem] leading-relaxed text-panel-muted">
              An embedded and IoT engineering lab in {site.location}. We design firmware, low-power hardware and
              telemetry pipelines, and we publish how we measure.
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
              <p className="text-sm font-semibold text-panel-muted [font-stretch:92%]">Parts for your build</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">
                Every reference design uses parts stocked at {site.store.name}, our sister store in Dhaka. Cash on
                delivery to all 64 districts.
              </p>
              <a className="btn btn-on-dark btn-sm mt-4" href={site.store.url} rel="noopener">
                Visit {site.store.name}
              </a>
            </div>
          </div>
        </div>

        <div className="wrap overflow-hidden">
          <p
            aria-hidden="true"
            className="select-none whitespace-nowrap text-[clamp(2.75rem,11.2vw,10.5rem)] font-[760] leading-[0.8] tracking-[-0.045em] text-panel-2 [font-stretch:125%] translate-y-[0.12em]"
          >
            BuildIoT Labs
          </p>
        </div>
        <div className="border-t border-panel-line">
          <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-panel-muted">
            <p>
              © {year} {site.name}, {site.location}
            </p>
            <p>
              <TLink href="/methods" className="footer-link">
                How we measure
              </TLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
