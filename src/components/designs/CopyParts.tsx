"use client";

import { useState } from "react";

/** Copies the parts list as plain text, ready to paste into a quote request or chat. */
export function CopyParts({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("copied");
        } catch {
          setState("failed");
        }
        window.setTimeout(() => setState("idle"), 2400);
      }}
    >
      {state === "copied" ? "Parts list copied" : state === "failed" ? "Copy failed: select the table instead" : "Copy parts list"}
    </button>
  );
}
