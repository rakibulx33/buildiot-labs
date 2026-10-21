import type { Metadata } from "next";
import { BatteryTool } from "@/components/tools/BatteryTool";
import { ToolPage } from "@/components/tools/ToolPage";
import { canonicalUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Battery-life estimator",
  description:
    "Estimate how long a duty-cycled IoT node runs on a battery from its sleep current, wake current and reporting interval.",
  alternates: { canonical: canonicalUrl("/tools/battery-life/") },
};

export default function BatteryLifePage() {
  return (
    <ToolPage
      title="Battery-life estimator"
      lead="Put in what your node draws asleep and awake, and how often it reports. The defaults describe the reference node from our home page: an ESP32-C3 that joins Wi-Fi and publishes one MQTT message over TLS."
      tool={<BatteryTool />}
      how={
        <>
          <p>
            A duty-cycled node spends most of its life in two states. The average current is the charge used in one
            cycle divided by the length of the cycle:
          </p>
          <pre className="formula">{`charge per cycle = I_awake × t_awake + I_sleep × (T − t_awake)
average current  = charge per cycle ÷ T
battery life     = capacity × usable fraction ÷ average current`}</pre>
          <p>
            T is the reporting interval. Usable fraction is the share of the label capacity you can count on once
            temperature, ageing and the cut-off voltage take their part. 80% is a cautious starting point for a
            lithium cell.
          </p>
          <p>
            The chart draws the same formula across intervals from 10 seconds to an hour. As reports get rarer, the
            curve flattens towards the dashed line: the life the battery would have if the node never woke. That ceiling
            is set entirely by sleep current.
          </p>
        </>
      }
      limits={
        <>
          <p>It uses one average for the whole wake. Radio bursts heat the cell and sag its voltage more than an average suggests.</p>
          <p>It ignores self-discharge beyond the usable fraction, and capacity lost in the cold.</p>
          <p>
            It can&rsquo;t measure your board. Sleep current on development boards is often thousands of times the
            datasheet figure.
          </p>
        </>
      }
      related={{ href: "/lab-notes/esp32-deep-sleep-dev-boards", label: "Why dev boards miss their sleep current" }}
    />
  );
}
