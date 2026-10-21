export type ServiceSlug = "hardware" | "pcb" | "firmware" | "software" | "consulting";

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

/**
 * The five primary service families. Power and telemetry are specialities
 * inside them, not separate services. Everything here is delivered remotely
 * as designs, source files, documentation and advice.
 */
export const services: Service[] = [
  {
    slug: "hardware",
    name: "IoT Hardware R&D & Design",
    outcome: "An electronics design you can explain, build and test.",
    summary:
      "We turn a connected-product idea into a system architecture and a circuit design: sensor interfaces, power, radios and protection. Low-power design is a speciality: we budget where the charge goes in each state and change the design until the budget holds.",
    includes: [
      "System architecture and block design",
      "Circuit design and sensor interfaces",
      "Power budgets, deep-sleep and regulator choices",
      "Design review and optimisation of an existing design",
      "Component recommendations with alternatives",
    ],
    deliverables: [
      "Architecture diagram",
      "Schematics and component recommendations",
      "Design notes with the reasoning behind each choice",
    ],
    stack: ["ESP32 family", "STM32", "Sensor interfaces (I²C, SPI, UART, ADC)", "Li-ion and LiPo power", "Low-quiescent regulators"],
  },
  {
    slug: "pcb",
    name: "Custom PCB Design",
    outcome: "Board files a fabrication house can build from.",
    summary:
      "Schematic capture, 2- to multilayer layout, stack-up, design-for-manufacture review and component selection. We supply the digital output a board house or assembler needs; we do not run manufacturing or assembly ourselves.",
    includes: [
      "Schematic capture and component selection",
      "2-layer and multilayer layout",
      "Stack-up and impedance planning where needed",
      "Design-for-manufacture (DFM) review",
      "Revision of an existing board",
    ],
    deliverables: [
      "Editable CAD source files",
      "Gerber and drill files",
      "Bill of materials",
      "Fabrication and assembly data, when in scope",
    ],
    stack: ["Schematic and layout CAD", "Multilayer stack-ups", "DFM checks", "Gerber and drill output"],
  },
  {
    slug: "firmware",
    name: "Embedded Firmware",
    outcome: "Devices that recover on their own.",
    summary:
      "Firmware in C and C++ for ESP32 and STM32, with FreeRTOS where the job needs it. We design for the bad day: a brownout, a dropped link, a sensor that stops answering, an update that fails halfway.",
    includes: [
      "Architecture and task design",
      "Drivers for sensors and peripherals",
      "BLE, Wi-Fi, MQTT and LoRa connectivity",
      "Over-the-air updates with rollback",
      "Power management and reliability: watchdogs, brownout handling, safe restarts",
    ],
    deliverables: [
      "Source repository",
      "Build and flashing instructions",
      "Firmware binaries",
      "Test notes against the agreed behaviour",
    ],
    stack: ["ESP-IDF", "STM32Cube HAL and LL", "FreeRTOS", "C", "C++17", "BLE", "Wi-Fi", "MQTT", "LoRa"],
  },
  {
    slug: "software",
    name: "IoT Software & Cloud",
    outcome: "Data that arrives in order and survives a dropped link.",
    summary:
      "From the device to the screen: web dashboards, mobile apps, backend and APIs, MQTT and cloud services, telemetry pipelines and device management. Reliable delivery is a speciality: buffering on the device while the link is down, ordered ingestion, and alerts people will act on.",
    includes: [
      "Web dashboards and mobile apps",
      "Backend and API design",
      "MQTT broker and cloud setup with access control",
      "Telemetry storage with retention rules",
      "Device management and monitoring",
    ],
    deliverables: [
      "Source code",
      "API documentation",
      "Deployment guide",
      "Configuration files and tests",
    ],
    stack: ["MQTT", "TLS", "Mosquitto", "EMQX", "InfluxDB", "Grafana", "Node.js", "Docker"],
  },
  {
    slug: "consulting",
    name: "Technical Consulting & Remote Engineering",
    outcome: "A clear next engineering step, before you spend on the wrong one.",
    summary:
      "Feasibility checks, architecture advice, debugging of a design that misbehaves, prototype guidance and remote support for your own team. Everything is done remotely, with the work and the findings written down.",
    includes: [
      "Feasibility studies",
      "Architecture and technology choices",
      "Debugging and root-cause analysis",
      "Prototype guidance and remote test assistance",
      "Remote engineering support for your team",
    ],
    deliverables: [
      "Feasibility report",
      "Design review",
      "Roadmap",
      "Issue findings",
      "Agreed milestone outputs",
    ],
    stack: ["Design reviews", "Bench measurement guidance", "Remote debugging sessions"],
  },
];

export function getService(slug: ServiceSlug): Service {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service ${slug}`);
  return s;
}
