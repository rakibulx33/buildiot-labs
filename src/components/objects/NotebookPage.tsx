import type { ReactNode } from "react";

type Props = {
  entry: number;
  date: string;
  className?: string;
  children: ReactNode;
};

/** A ruled lab-notebook page with a maroon margin line and an entry number. */
export function NotebookPage({ entry, date, className = "", children }: Props) {
  return (
    <div className={`notebook ${className}`}>
      <div className="notebook-meta">
        <span>No. {String(entry).padStart(3, "0")}</span>
        <time dateTime={date}>{formatDate(date)}</time>
      </div>
      <div className="notebook-body">{children}</div>
    </div>
  );
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
