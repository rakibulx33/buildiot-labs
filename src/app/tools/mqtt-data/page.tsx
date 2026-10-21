import type { Metadata } from "next";
import { MqttTool } from "@/components/tools/MqttTool";
import { ToolPage } from "@/components/tools/ToolPage";
import { canonicalUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "MQTT data budget",
  description:
    "Estimate how much mobile data MQTT devices use per message and per month, with TLS, QoS, keep-alive and reconnect overheads.",
  alternates: { canonical: canonicalUrl("/tools/mqtt-data/") },
};

export default function MqttDataPage() {
  return (
    <ToolPage
      title="MQTT data budget"
      lead="Before you pick a SIM plan for a fleet of devices, count the bytes. Paste a real payload, choose how the device connects, and see where every byte goes."
      tool={<MqttTool />}
      how={
        <>
          <p>
            The PUBLISH packet is sized from the MQTT wire format: a fixed header, a variable-length remaining-length
            field, the topic with its two-byte length, a packet identifier at QoS 1 and 2, a property length in MQTT 5,
            then your payload.
          </p>
          <pre className="formula">{`publish   = 1 + len(remaining length) + 2 + topic + packet id + payload
per send  = publish + acks + TLS record overhead + TCP/IP headers
per month = per send × messages per day × 30`}</pre>
          <p>
            Each segment carries about 52 bytes of IPv4 and TCP headers with timestamps, and each TLS record adds 22
            bytes in TLS 1.3 or 29 in TLS 1.2 with AES-GCM. Every packet sent is acknowledged by a TCP ACK coming back.
          </p>
          <p>
            Reconnecting each time adds the TCP open and close, the MQTT CONNECT and DISCONNECT, and a TLS handshake. The
            handshake presets are typical sizes; most of a full handshake is the server&rsquo;s certificate chain.
          </p>
        </>
      }
      limits={
        <>
          <p>A persistent connection&rsquo;s first handshake is not counted; it is spread over every message that follows.</p>
          <p>Retransmissions on a weak signal, DNS lookups and NTP time sync are not included.</p>
          <p>Operators round sessions differently. Treat the result as a floor, and leave headroom on the plan.</p>
        </>
      }
      related={{ href: "/lab-notes/mqtt-tls-cost-battery-node", label: "What MQTT over TLS costs a battery node" }}
    />
  );
}
