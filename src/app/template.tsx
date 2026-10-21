import { ViewTransition } from "react";
import { Footer } from "@/components/site/Footer";

/**
 * Every page is wrapped in a ViewTransition so navigations can animate:
 * - "sweep": moving between sections (pages wipe across a soldermask stage)
 * - "drill": opening an object (pages cross-fade while the object morphs)
 * Navigations without a type (browser back/forward) switch instantly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ sweep: "page-in", drill: "page-fade-in", default: "none" }}
      exit={{ sweep: "page-out", drill: "page-fade-out", default: "none" }}
      default="none"
    >
      <div className="page-shell">
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </div>
    </ViewTransition>
  );
}
