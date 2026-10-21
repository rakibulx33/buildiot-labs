export type ServiceSlug = "firmware" | "power" | "telemetry" | "prototypes" | "products";

export type Service = {
  slug: ServiceSlug;
  name: string;
  /** The outcome, in one line. Leads every service. */
  outcome: string;
  summary: string;
  includes: string[];
  deliverables: string[];
  stack: string[];
};

export const services: Service[] = [
  {
    slug: "firmware",
    name: "Firmware",
    outcome: "Devices that recover on their own.",
    summary:
      "Firmware in C and C++ on ESP-IDF and STM32, with FreeRTOS where the job needs it. We design for the bad day: a brownout, a dropped link, a sensor that stops answering, an update that fails halfway.",
    includes: [
      "Architecture and task design on FreeRTOS",
      "Watchdogs, brownout handling and safe restarts",
      "Over-the-air updates with rollback",
      "Drivers for sensors and peripherals over I²C, SPI, UART and ADC",
      "Review of an existing firmware codebase",
    ],
    deliverables: [
      "Firmware source in your repository",
      "Build and flashing instructions",
      "A test report against the agreed behaviour",
    ],
    stack: ["ESP-IDF", "STM32Cube HAL and LL", "FreeRTOS", "C", "C++17"],
  },
  {
    slug: "power",
    name: "Power",
    outcome: "Battery life you can write in a spec sheet.",
    summary:
      "We measure where the charge goes in each state, from deep sleep to a radio burst, and change the design until the numbers hold. Then we write down how we measured them.",
    includes: [
      "A power budget for every operating state",
      "Deep-sleep and wake-up design",
      "Regulator, sensor and pull-up leakage review",
      "Reporting interval and batching trade-offs",
      "Battery and charger selection",
    ],
    deliverables: [
      "A current profile per state, with method notes",
      "A battery-life estimate with its assumptions written down",
      "Firmware and hardware changes, with before and after numbers",
    ],
    stack: ["Deep sleep", "Duty cycling", "Li-ion and LiPo", "Low-quiescent regulators"],
  },
  {
    slug: "telemetry",
    name: "Telemetry",
    outcome: "Data that arrives in order and survives a dropped link.",
    summary:
      "From the device to the dashboard: MQTT over TLS, buffering on the device while the link is down, a broker, a time-series database, and dashboards your team will actually open.",
    includes: [
      "Topic and payload design",
      "Store-and-forward buffering on the device",
      "MQTT broker setup and access control",
      "Time-series storage with retention rules",
      "Dashboards and alerts",
    ],
    deliverables: [
      "A working pipeline from device to dashboard",
      "Topic and payload documentation",
      "A runbook for the broker and the database",
    ],
    stack: ["MQTT", "TLS", "Mosquitto", "EMQX", "InfluxDB", "Grafana", "Node.js", "Docker"],
  },
  {
    slug: "prototypes",
    name: "Prototypes",
    outcome: "A build you can demo, field-test and hand to a client.",
    summary:
      "Module-based prototypes built from parts we keep in stock, wired, enclosed and documented, with every part on a bill of materials.",
    includes: [
      "Sensor and module selection",
      "Wiring, harnessing and enclosure",
      "Bench bring-up and testing",
      "A bill of materials with sources",
    ],
    deliverables: ["Working prototype units", "Wiring diagram and bill of materials", "Firmware for the prototype"],
    stack: ["ESP32 family", "STM32", "Off-the-shelf sensor modules"],
  },
  {
    slug: "products",
    name: "End-to-end builds",
    outcome: "One team from the first sketch to a device in the field.",
    summary:
      "When you need all of it: firmware, power, telemetry and prototypes under one plan, with one set of test criteria and one handover.",
    includes: [
      "Requirements and test criteria",
      "A phased plan with checkpoints",
      "Firmware, power, telemetry and prototyping work",
      "Handover to your team",
    ],
    deliverables: ["Everything listed above", "A handover pack your team can maintain"],
    stack: ["Whatever the job needs from the lists above"],
  },
];

export function getService(slug: ServiceSlug): Service {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service ${slug}`);
  return s;
}
