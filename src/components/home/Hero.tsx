import { HeroScope } from "@/components/scope/HeroScope";
import { TLink } from "@/components/site/TLink";

type Var = React.CSSProperties & { "--d"?: string };

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="wrap pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-16">
        <p className="t-label rise" style={{ "--d": "0ms" } as Var}>
          Embedded and IoT engineering lab, Dhaka
        </p>
        <h1 id="hero-title" className="hero-title mt-4">
          <span className="hero-line">
            <span style={{ "--d": "80ms" } as Var}>Every microamp counted.</span>
          </span>
          <span className="hero-line">
            <span style={{ "--d": "170ms" } as Var}>Every packet accounted for.</span>
          </span>
        </h1>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:pt-2">
            <p className="t-lead rise max-w-[30rem]" style={{ "--d": "420ms" } as Var}>
              We design firmware, low-power hardware and telemetry pipelines for connected devices, for teams in
              Bangladesh and abroad. Every number we quote comes with how we measured it.
            </p>
            <div className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ "--d": "520ms" } as Var}>
              <TLink href="/contact" className="btn btn-primary">
                <span className="btn-pad" aria-hidden="true" />
                Start a project brief
              </TLink>
              <TLink href="/methods" className="link font-medium">
                How we measure
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
