import { withBase } from "@/content/site";

/**
 * The official BuildIoT Lab logo, on its own (no extra wordmark).
 * `height` is in px; the width follows the 781 × 188 artwork.
 */
export function Logo({ height = 40, className = "" }: { height?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, unoptimised images
    <img
      src={withBase("/logo.png")}
      alt="BuildIoT Lab"
      width={Math.round((height * 781) / 188)}
      height={height}
      decoding="async"
      className={`block max-w-none ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}

/** The logo on a paper-coloured plate, for dark backgrounds where maroon artwork would vanish. */
export function LogoPlate({ height = 34 }: { height?: number }) {
  return (
    <span className="inline-flex rounded-[8px] bg-silk px-3 py-2">
      <Logo height={height} />
    </span>
  );
}
