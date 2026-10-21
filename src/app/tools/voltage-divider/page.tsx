import type { Metadata } from "next";
import { DividerTool } from "@/components/tools/DividerTool";
import { ToolPage } from "@/components/tools/ToolPage";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Voltage Divider Calculator for ESP32 ADC",
  description:
    "Choose resistors to scale a higher voltage into an ESP32 ADC range. Shows whether the signal fits, the divider current and suggested standard resistor pairs.",
  path: "/tools/voltage-divider/",
});

export default function DividerPage() {
  return (
    <ToolPage
      title="Voltage divider for ADCs"
      lead="Scale a sensor or battery voltage into your microcontroller's ADC and check it lands inside the range where readings are accurate. The defaults fit an MQ-2 gas sensor's 5 V output to an ESP32."
      tool={<DividerTool />}
      how={
        <>
          <p>R1 sits between the signal and the ADC pin; R2 between the pin and ground.</p>
          <pre className="formula">{`ratio          = R2 ÷ (R1 + R2)
voltage at pin = signal × ratio
current        = signal ÷ (R1 + R2)
pin impedance  = R1 × R2 ÷ (R1 + R2)`}</pre>
          <p>
            The accurate ranges for Espressif chips come from the ESP-IDF ADC documentation, one per attenuation
            setting. On the original ESP32, readings below about 100 to 150 mV are not reliable, so the tool flags a
            signal whose low end falls there.
          </p>
          <p>
            Suggestions search every pair of standard E12 values from 1 kΩ to 1 MΩ, keep those that put your highest
            voltage just under the top of the range while drawing under 100 µA, and show the closest three.
          </p>
        </>
      }
      limits={
        <>
          <p>It assumes ideal resistors. With 5% parts the ratio can move by several percent; calibrate in firmware.</p>
          <p>It doesn&rsquo;t model the source. A sensor with a high output impedance loads differently than a battery.</p>
          <p>Input per ADC step is approximate: real ADCs have offset and non-linearity, especially near the ends.</p>
        </>
      }
      related={{ href: "/lab-notes/esp32-adc-without-fooling-yourself", label: "Reading analog sensors on the ESP32" }}
    />
  );
}
