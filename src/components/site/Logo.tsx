type MarkProps = { size?: number; className?: string };

/** A "b" routed as a copper trace on soldermask, ending in a test pad. */
export function LogoMark({ size = 30, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="6" fill="var(--color-mask)" />
      <path
        d="M11 9.5V25h6.5a4.5 4.5 0 0 0 4.5-4.5v-1a4.5 4.5 0 0 0-4.5-4.5H11"
        fill="none"
        stroke="var(--color-silk)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="7.2" r="3.3" fill="var(--color-gold)" />
      <circle cx="11" cy="7.2" r="1.2" fill="var(--color-mask)" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-[1.0625rem] leading-none font-[650] tracking-[-0.01em] [font-stretch:118%]">
        BuildIoT Labs
      </span>
    </span>
  );
}
