export type Part = {
  name: string;
  qty: number;
  role: string;
  optional?: boolean;
};

export type PinRow = { signal: string; connect: string; note?: string };

export type DesignStatus = "draft" | "validated";

export type Design = {
  slug: string;
  code: string;
  name: string;
  summary: string;
  useCases: string[];
  status: DesignStatus;
  statusNote: string;
  power: string;
  parts: Part[];
  pins: PinRow[];
  firmware: string[];
  notes: Array<{ title: string; body: string }>;
  limits: string[];
  art: "leak" | "gas" | "dc";
};

export const designs: Design[] = [
  {
    slug: "leak-sentinel",
    code: "RD-01",
    name: "Leak sentinel",
    summary:
      "An ESP32 that watches a water sensor on the floor, sounds a buzzer and publishes an MQTT alert when water appears under a tank, pump or washing machine.",
    useCases: ["Water tanks and pump rooms", "Under washing machines and water heaters", "Server and electrical rooms"],
    status: "draft",
    statusNote: "Wiring and firmware outline written. Bench validation pending.",
    power: "A 5 V USB adapter. The node stays awake, so it is not a battery design.",
    parts: [
      { name: "ESP32 DEVKIT V1", qty: 1, role: "Controller and Wi-Fi" },
      { name: "Water Sensor", qty: 1, role: "Detects water on the floor" },
      { name: "Active Buzzer", qty: 1, role: "Local alarm" },
      { name: "2N2222 NPN Transistor", qty: 1, role: "Drives the buzzer" },
      { name: "Resistor, 1 kΩ", qty: 1, role: "Transistor base" },
      {
        name: "Relay Module 2 Channel 5V",
        qty: 1,
        role: "Switches a valve or pump",
        optional: true,
      },
      { name: "Breadboard 400 Point", qty: 1, role: "Bench assembly" },
    ],
    pins: [
      { signal: "Water sensor S (analog out)", connect: "GPIO34", note: "ADC1 channel 6, which keeps working while Wi-Fi is on." },
      { signal: "Water sensor +", connect: "GPIO25", note: "Powered only while reading, to slow corrosion of the traces." },
      { signal: "Water sensor −", connect: "GND" },
      { signal: "Buzzer +", connect: "5 V (VIN)" },
      {
        signal: "Buzzer −",
        connect: "2N2222 collector; emitter to GND, base to GPIO26 through 1 kΩ",
        note: "The buzzer draws more than a GPIO should supply, so the transistor switches it.",
      },
      { signal: "Relay IN1 (optional)", connect: "GPIO27", note: "Check that your module switches reliably from 3.3 V logic." },
    ],
    firmware: [
      "Configure ADC1 channel 6 in one-shot mode with 12 dB attenuation and a calibration scheme.",
      "Every 2 s, drive GPIO25 high, wait 10 ms, average 8 samples, then drive it low again.",
      "Treat three wet readings in a row as a leak: sound the buzzer and publish to site/<name>/leak with QoS 1 and the retained flag set.",
      "Publish a heartbeat every 5 minutes so a dead node is noticed, not mistaken for a dry floor.",
      "Keep the wet threshold in NVS so it can be tuned without reflashing.",
    ],
    notes: [
      {
        title: "Why GPIO34",
        body: "On the ESP32, ADC2 cannot be read while Wi-Fi is running. Every analog input on this board goes on an ADC1 pin, GPIO32 to GPIO39.",
      },
      {
        title: "Why switch the sensor's power",
        body: "The sensor's exposed traces corrode quickly with DC on them all the time. Powering it only for a 10 ms reading every 2 s keeps it working far longer.",
      },
      {
        title: "Why three readings",
        body: "A single splash should not trigger an alarm. Three wet readings 2 s apart filter that out and still react within seconds.",
      },
      {
        title: "Why a retained message",
        body: "A dashboard or phone that connects later still sees the last leak state instead of waiting for the next change.",
      },
    ],
    limits: [
      "It detects water where the sensor sits. It will not find a slow leak inside a wall.",
      "It is not a certified safety device.",
    ],
    art: "leak",
  },
  {
    slug: "gas-watch",
    code: "RD-02",
    name: "Gas watch",
    summary:
      "An MQ-2 gas sensor read by an ESP32 that logs readings, sounds a local alarm and switches an exhaust fan relay when the level rises above a clean-air baseline.",
    useCases: ["Generator and battery rooms", "Workshops", "Monitoring alongside a certified kitchen alarm"],
    status: "draft",
    statusNote: "Wiring and firmware outline written. Bench validation pending.",
    power: "A 5 V USB adapter. The sensor's heater draws around 150 mA all the time, so this is not a battery design.",
    parts: [
      { name: "ESP32 DEVKIT V1", qty: 1, role: "Controller and Wi-Fi" },
      {
        name: "MQ2 Gas Sensor Module",
        qty: 1,
        role: "Detects LPG, methane and smoke",
      },
      {
        name: "Resistors, 12 kΩ, 10 kΩ and 1 kΩ",
        qty: 3,
        role: "Sensor divider and transistor base",
      },
      { name: "Active Buzzer", qty: 1, role: "Local alarm" },
      { name: "2N2222 NPN Transistor", qty: 1, role: "Drives the buzzer" },
      {
        name: "Relay Module 2 Channel 5V",
        qty: 1,
        role: "Exhaust fan control, for bench testing",
        optional: true,
      },
    ],
    pins: [
      { signal: "MQ-2 VCC", connect: "5 V (VIN on the dev board)" },
      { signal: "MQ-2 AO", connect: "12 kΩ to GPIO35, 10 kΩ from GPIO35 to GND", note: "Scales 5 V down to about 2.27 V for ADC1 channel 7." },
      { signal: "MQ-2 DO", connect: "Not connected", note: "It swings to 5 V, which the ESP32 pins cannot take." },
      { signal: "Buzzer +", connect: "5 V (VIN)" },
      { signal: "Buzzer −", connect: "2N2222 collector; emitter to GND, base to GPIO26 through 1 kΩ" },
      { signal: "Relay IN1 (optional)", connect: "GPIO27" },
    ],
    firmware: [
      "Ignore readings for the first two minutes after power-up while the heater warms the sensor.",
      "Record a clean-air baseline and store it in NVS; re-record it from a button press or an MQTT command.",
      "Sample once a second and keep a 10-second moving average.",
      "Raise an alarm when the average exceeds the baseline by your chosen ratio: buzzer on, relay on, alarm event published with QoS 1.",
      "Publish the averaged reading every 30 seconds for logging.",
    ],
    notes: [
      {
        title: "Why a divider on AO",
        body: "Running at 5 V, the module's analog output can reach 5 V. The ESP32's recommended range at 12 dB attenuation ends at 2.45 V, so 12 kΩ over 10 kΩ brings 5 V down to about 2.27 V.",
      },
      {
        title: "Why a baseline, not ppm",
        body: "An MQ-2 is not calibrated out of the box, and its resistance drifts with temperature, humidity and age. Comparing against a stored clean-air baseline is honest about what it can tell you.",
      },
      {
        title: "Warm-up and burn-in",
        body: "Every power-up needs a warm-up before readings settle, and a new sensor needs a long burn-in before you record a baseline. The manufacturer's datasheet asks for more than 24 hours.",
      },
    ],
    limits: [
      "It is not a certified gas detector. Where LPG is used, install a certified alarm and treat this as monitoring.",
      "Switching a mains fan needs a relay rated for the load, a proper enclosure and an electrician.",
    ],
    art: "gas",
  },
  {
    slug: "dc-power-monitor",
    code: "RD-03",
    name: "DC power monitor",
    summary:
      "Voltage and current logging for a 12 V battery system up to 20 A, such as a solar battery or a router backup, with alerts before the battery is drained too far.",
    useCases: ["Small solar battery systems", "Router and CCTV backup batteries", "12 V DC loads in a workshop"],
    status: "draft",
    statusNote: "Wiring and firmware outline written. Bench validation pending.",
    power: "From the battery being measured, through a fuse and an L7805 regulator.",
    parts: [
      { name: "ESP32 DEVKIT V1", qty: 1, role: "Controller and Wi-Fi" },
      { name: "Current Sensor ACS712 20A", qty: 1, role: "Measures DC current" },
      { name: "L7805 Voltage Regulator", qty: 1, role: "12 V to 5 V supply" },
      {
        name: "Resistors, 100 kΩ, 18 kΩ and 2 × 10 kΩ",
        qty: 4,
        role: "Battery and sensor dividers",
      },
      { name: "Veroboard Double Sided 5x7cm", qty: 1, role: "Permanent assembly" },
    ],
    pins: [
      { signal: "Battery +", connect: "100 kΩ to GPIO33, 18 kΩ from GPIO33 to GND", note: "14.4 V reads as about 2.2 V; add 100 nF from GPIO33 to GND." },
      { signal: "ACS712 OUT", connect: "10 kΩ to GPIO32, 10 kΩ from GPIO32 to GND", note: "Halves the 0.5 to 4.5 V output into the ADC range." },
      { signal: "ACS712 VCC", connect: "5 V from the L7805" },
      { signal: "L7805 IN", connect: "Battery + through a fuse", note: "0.33 µF on the input and 0.1 µF on the output, as the datasheet suggests." },
      { signal: "L7805 OUT", connect: "ESP32 VIN" },
    ],
    firmware: [
      "At start-up, with the load switched off, read the current channel and store it as the zero offset.",
      "Read voltage and current every second through the ADC calibration scheme, and compute power.",
      "Count amp-hours in and out, and reset the count when the battery reaches its full-charge voltage.",
      "Publish voltage, current, power and amp-hours every 10 seconds.",
      "Alert when the voltage under load falls below a threshold you set, before your inverter or charger cuts off on its own.",
    ],
    notes: [
      {
        title: "Measure zero, every time",
        body: "The ACS712's zero-current output moves with temperature and with its 5 V supply. Reading it at start-up with no load and subtracting it removes most of that error.",
      },
      {
        title: "A divider that sips",
        body: "100 kΩ over 18 kΩ puts a 14.4 V charging voltage at about 2.2 V, inside the ESP32's recommended range, and draws about 120 µA from the battery.",
      },
      {
        title: "Heat in the regulator",
        body: "An L7805 burns the difference: (12 V − 5 V) × 150 mA is about 1 W, so it needs a small heatsink. A switching buck module would waste far less.",
      },
      {
        title: "Bigger systems",
        body: "An inverter's battery cable often carries 30 A or more. For that, use a higher-range sensor such as the ACS709 carrier; the firmware stays the same apart from the sensitivity constant.",
      },
    ],
    limits: [
      "Voltage alone is a rough guide to how full a lead-acid battery is. Readings at rest and under load differ, so log both.",
      "Work on battery banks only with a fuse close to the battery terminal.",
    ],
    art: "dc",
  },
];

export function getDesign(slug: string): Design | undefined {
  return designs.find((d) => d.slug === slug);
}
