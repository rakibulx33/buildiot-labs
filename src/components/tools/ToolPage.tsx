import type { ReactNode } from "react";
import { TLink } from "@/components/site/TLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type Props = {
  title: string;
  lead: ReactNode;
  tool: ReactNode;
  how: ReactNode;
  limits: ReactNode;
  related?: { href: string; label: string };
};

/** Shared layout for a tool: the instrument, then how it works and what it leaves out. */
export function ToolPage({ title, lead, tool, how, limits, related }: Props) {
  return (
    <article className="pb-24">
      <header className="wrap pb-10 pt-10 sm:pt-14">
        <Breadcrumb items={[{ href: "/tools", label: "Tools" }]} current={title} />
        <h1 className="t-h1 mt-8 max-w-[18ch]">{title}</h1>
        <p className="t-lead mt-5 max-w-[42rem]">{lead}</p>
      </header>
      <div className="wrap">{tool}</div>
      <div className="wrap mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <section aria-labelledby="how-title" className="explain lg:col-span-7">
          <h2 id="how-title">How it works</h2>
          <div className="mt-5 grid gap-5">{how}</div>
        </section>
        <section aria-labelledby="limits-title" className="explain lg:col-span-4 lg:col-start-9">
          <h2 id="limits-title">What it leaves out</h2>
          <div className="mt-5 grid gap-4">{limits}</div>
          {related ? (
            <p className="mt-8">
              <TLink href={related.href} className="link font-medium">
                {related.label}
              </TLink>
            </p>
          ) : null}
        </section>
      </div>
    </article>
  );
}
