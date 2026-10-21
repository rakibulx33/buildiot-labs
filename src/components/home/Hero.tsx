import { HeroScope } from "@/components/scope/HeroScope";
import { TLink } from "@/components/site/TLink";
import { site } from "@/content/site";

type Var = React.CSSProperties & { "--d"?: string };

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="wrap pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-16">
        <p className="t-label rise" style={{ "--d": "0ms" } as Var}>
          IoT &amp; Embedded Product Engineering
        </p>
        <h1 id="hero-title" className="hero-title mt-4">
          <span className="hero-line">
            <span style={{ "--d": "80ms" } as Var}>Engineering Ideas</span>
          </span>
          <span className="hero-line">
            <span style={{ "--d": "170ms" } as Var}>Into Reality.</span>
          </span>
        </h1>
        <p className="rise t-h3 mt-6 max-w-[44rem]" style={{ "--d": "300ms" } as Var}>
          {site.tagline}
        </p>
        <p className="rise mt-3 text-[1.0625rem] font-medium text-ink-2 [font-stretch:108%]" style={{ "--d": "340ms" } as Var}>
          Every microamp counted. Every packet accounted for.
        </p>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:pt-2">
            <p className="t-lead rise max-w-[30rem]" style={{ "--d": "420ms" } as Var}>
              From custom electronics and PCB design to embedded firmware, cloud platforms and IoT software,
              BuildIoT Lab delivers practical engineering solutions with clear documentation and maintainable
              handover.
            </p>
            <div className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ "--d": "520ms" } as Var}>
              <TLink href="/contact" className="btn btn-primary">
                <span className="btn-pad" aria-hidden="true" />
                Start a Project
              </TLink>
              <TLink href="/work" className="link font-medium">
                Explore Our Work
              </TLink>
            </div>
          </div>
          <div className="rise lg:col-span-8" style={{ "--d": "300ms" } as Var}>
            <HeroScope />
          </div>
        </div>
      </div>
    </section>
  );
}
