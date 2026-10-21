import { TLink } from "@/components/site/TLink";
import { faqs } from "@/content/faq";

export function Faq() {
  return (
    <div>
      <dl className="grid max-w-[48rem] gap-6">
        {faqs.slice(0, 5).map((x) => (
          <div key={x.q} className="border-t border-line pt-5">
            <dt className="t-h4">{x.q}</dt>
            <dd className="mt-2 text-[1.0625rem] leading-relaxed text-ink-2">{x.a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8">
        <TLink href="/faq" className="link font-medium">
          All questions
        </TLink>
      </p>
    </div>
  );
}
