export type ToolInfo = { slug: string; name: string; summary: string; question: string };

export const tools: ToolInfo[] = [
  {
    slug: "battery-life",
    name: "Battery-life estimator",
    question: "How long will it run on this battery?",
    summary: "Sleep current, wake current and reporting interval in; average current and battery life out, with what's eating the charge.",
  },
  {
    slug: "voltage-divider",
    name: "Voltage divider for ADCs",
    question: "Will this sensor fit my ADC?",
    summary: "Checks a resistor divider against the ESP32, ESP32-S3, ESP32-C3, STM32 or ATmega328P input range, and suggests standard values.",
  },
  {
    slug: "mqtt-data",
    name: "MQTT data budget",
    question: "How much mobile data will my devices use?",
    summary: "Bytes per message and per month, counted the way a data plan counts them, for persistent and reconnecting nodes.",
  },
];
