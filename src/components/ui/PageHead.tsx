import type { ReactNode } from "react";

type Var = React.CSSProperties & { "--d"?: string };

type Props = {
  title: ReactNode;
  lead?: ReactNode;
  /** Optional small line above the title, e.g. a breadcrumb. */
  above?: ReactNode;
  children?: ReactNode;
};

/** The opening of an inner page: title and lead, set like a document heading. */
export function PageHead({ title, lead, above, children }: Props) {
  return (
    <header className="wrap pb-12 pt-12 sm:pt-16 lg:pb-16 lg:pt-20">
      {above ? <div className="mb-6">{above}</div> : null}
      <h1 className="t-h1 max-w-[16ch] rise" style={{ "--d": "0ms" } as Var}>
        {title}
      </h1>
      {lead ? (
        <p className="t-lead mt-6 max-w-[40rem] rise" style={{ "--d": "120ms" } as Var}>
          {lead}
        </p>
      ) : null}
      {children}
    </header>
  );
}
