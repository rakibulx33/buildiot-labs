export type MetricStatus = "measured" | "model" | "pending";

const LABEL: Record<MetricStatus, string> = {
  measured: "Measured",
  model: "Model",
  pending: "Unverified: method note pending",
};

/** Says what kind of number sits next to it. See /methods. */
export function MethodTag({ status, className = "" }: { status: MetricStatus; className?: string }) {
  return (
    <span className={`method-tag method-${status} ${className}`}>
      <span className="method-dot" aria-hidden="true" />
      {LABEL[status]}
    </span>
  );
}
