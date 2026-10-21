import type { ReactNode } from "react";

type Props = {
  id: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
};

export function SectionHead({ id, title, intro, className = "" }: Props) {
  return (
    <div className={`grid gap-4 md:grid-cols-12 md:items-end md:gap-8 ${className}`}>
      <h2 id={id} className="t-h2 md:col-span-7">
        {title}
      </h2>
      {intro ? <p className="t-lead md:col-span-5 md:pb-1">{intro}</p> : null}
    </div>
  );
}
