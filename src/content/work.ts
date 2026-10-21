import type { MetricStatus } from "@/components/ui/MethodTag";

export type Metric = {
  label: string;
  value: string;
  unit?: string;
  status: MetricStatus;
  /** Required before status can be "measured". */
  method?: { device: string; conditions: string; instrument: string; date: string };
};

export type Report = {
  slug: string;
  number: string;
  title: string;
  sector: string;
  status: string;
  platform: string[];
  data: string[];
  summary: string;
  problem: string;
  approach: string[];
  metrics: Metric[];
  outcome: string;
};

/**
 * Client work, written up as test reports. Public reports stay high level:
 * what the problem was, what we built, and what we measured.
 *
 * Metrics stay "pending" until their method fields are filled in.
 * See CONTENT_TODO.md.
 */
export const reports: Report[] = [
  {
    slug: "hydroalert",
    number: "BIL-TR-001",
    title: "HydroAlert: leak detection with valve control on the device",
    sector: "Water management",
    status: "Field stage",
    platform: ["ESP32", "FreeRTOS"],
    data: ["MQTT", "InfluxDB"],
    summary:
      "A water-monitoring node that tracks consumption, learns demand patterns and closes a valve by itself when it sees a leak, without waiting for a server.",
    problem:
      "A burst or leaking supply line wastes water and damages property long before anyone reads a dashboard. A system that only reports a leak still needs a person to act on it, and the network is least reliable exactly when something has gone wrong.",
    approach: [
      "Flow is sampled on the device and scored by a small model that runs on the ESP32 itself.",
      "When the leak score crosses its threshold, the firmware closes the solenoid valve first and reports the event over MQTT second, so the valve still closes if the network is down.",
      "Readings stream to InfluxDB, where consumption history and demand patterns are kept for the operator.",
    ],
    metrics: [
      { label: "Broker round trip", value: "14", unit: "ms", status: "pending" },
      { label: "Leak prediction accuracy", value: "96.7", unit: "%", status: "pending" },
    ],
    outcome:
      "Project status: field stage. The two figures above are unverified: we have not yet published device revision, setup, conditions, sample count, method or date for them, so treat them as unconfirmed and do not rely on them. They will be marked measured only once that evidence is published.",
  },
];

export function getReport(slug: string): Report | undefined {
  return reports.find((r) => r.slug === slug);
}
