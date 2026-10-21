import type { ReactNode } from "react";

type Props = {
  number: number | string;
  caption: ReactNode;
  className?: string;
  children: ReactNode;
};

/** A numbered figure with a caption, the way a lab report would print it. */
export function Figure({ number, caption, className = "", children }: Props) {
  return (
    <figure className={className}>
      {children}
      <figcaption className="mt-3 max-w-[40rem] text-[0.875rem] leading-relaxed text-ink-2">
        <span className="font-semibold text-ink [font-stretch:106%]">Fig. {number}.</span> {caption}
      </figcaption>
    </figure>
  );
}
