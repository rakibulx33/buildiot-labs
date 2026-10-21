import { TLink } from "@/components/site/TLink";

export default function Services() {
  return (
    <main className="wrap py-24 bg-sheet min-h-screen">
      <h1 className="t-h1">Services</h1>
      <p className="t-lead mt-6 measure">Firmware, power, telemetry, prototypes.</p>
      <p className="mt-8"><TLink className="link" href="/">Back home</TLink></p>
    </main>
  );
}
