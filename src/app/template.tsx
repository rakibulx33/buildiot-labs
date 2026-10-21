import { ViewTransition } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ sweep: "page-in", default: "none" }}
      exit={{ sweep: "page-out", default: "none" }}
      default="none"
    >
      <div className="page-shell">{children}</div>
    </ViewTransition>
  );
}
