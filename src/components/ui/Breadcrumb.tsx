import { TLink } from "@/components/site/TLink";

type Crumb = { href: string; label: string };

/** Back to the parent collection. Uses the drill transition so objects morph back. */
export function Breadcrumb({ items, current }: { items: Crumb[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-3">
        {items.map((c) => (
          <li key={c.href} className="flex items-center gap-2">
            <TLink href={c.href} transitionTypes={["drill"]} className="link text-ink-2">
              {c.label}
            </TLink>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}
