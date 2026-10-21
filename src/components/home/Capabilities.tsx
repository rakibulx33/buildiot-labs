"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FirmwarePlate,
  PowerPlate,
  PrototypePlate,
  TelemetryPlate,
} from "@/components/diagrams/CapabilityDiagrams";
import { TLink } from "@/components/site/TLink";
import type { Service } from "@/content/services";

const PLATES: Record<string, { plate: (p: { className?: string }) => ReactNode; caption: string }> = {
  firmware: {
    plate: FirmwarePlate,
    caption: "Tasks on a FreeRTOS timeline, with the watchdog fed at every checkpoint.",
  },
  power: {
    plate: PowerPlate,
    caption: "A duty-cycled node: short, expensive wakes and long, cheap sleeps.",
  },
  telemetry: {
    plate: TelemetryPlate,
    caption: "Store and forward: readings queue on the node while the link is down.",
  },
  prototypes: {
    plate: PrototypePlate,
    caption: "An exploded prototype. Every layer is a stocked, documented part.",
  },
};

export function Capabilities({ items }: { items: Service[] }) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    for (const el of itemRefs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-x-8 lg:grid-cols-12">
      <ol className="lg:col-span-6">
        {items.map((s, i) => {
          const Plate = PLATES[s.slug]?.plate;
          return (
            <li
              key={s.slug}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              className="cap-item"
              data-current={active === i ? "" : undefined}
            >
              <h3 className="cap-name">{s.name}</h3>
              <p className="t-h3 mt-2 max-w-[30rem]">{s.outcome}</p>
              <p className="mt-4 max-w-[34rem] text-ink-2">{s.summary}</p>
              <p className="mt-4 text-sm text-ink-3">{s.stack.join(", ")}</p>
              <p className="mt-5">
                <TLink href={`/services#${s.slug}`} className="link text-[0.9375rem] font-medium">
                  {s.name} in detail
                </TLink>
              </p>
              {Plate ? (
                <figure className="sheet mt-8 p-4 sm:p-6 lg:hidden" data-active={active === i ? "" : undefined}>
                  <Plate />
                  <figcaption className="mt-3 text-sm text-ink-2">
                    <span className="font-semibold text-ink [font-stretch:106%]">Fig. 2{"abcd"[i]}.</span>{" "}
                    {PLATES[s.slug].caption}
                  </figcaption>
                </figure>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--header-h)+2.5rem)]">
          <figure className="sheet p-6 xl:p-8">
            <div className="cap-stack">
              {items.map((s, i) => {
                const Plate = PLATES[s.slug]?.plate;
                if (!Plate) return null;
                return (
                  <div
                    key={s.slug}
                    className="cap-plate"
                    data-active={active === i ? "" : undefined}
                    aria-hidden={active === i ? undefined : true}
                  >
                    <Plate />
                  </div>
                );
              })}
            </div>
            <figcaption className="mt-4 flex items-baseline gap-2 text-sm text-ink-2">
              <span className="shrink-0 font-semibold text-ink [font-stretch:106%]">Fig. 2{"abcd"[active]}.</span>
              <span key={active} className="cap-caption">
                {PLATES[items[active].slug]?.caption}
              </span>
            </figcaption>
          </figure>
          <ol className="mt-5 flex gap-2" aria-hidden="true">
            {items.map((s, i) => (
              <li key={s.slug} className="cap-tick" data-on={active === i ? "" : undefined} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
