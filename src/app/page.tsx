import { TLink } from "@/components/site/TLink";

export default function Home() {
  return (
    <main className="wrap py-24">
      <p className="t-label">Prototype</p>
      <h1 className="t-display mt-4">Every microamp counted. Every packet accounted for.</h1>
      <p className="t-lead mt-6 measure">We design firmware, low-power hardware and telemetry pipelines.</p>
      <p className="mt-8"><TLink className="link" href="/services">Go to services</TLink></p>
      <div className="h-[150vh]" />
    </main>
  );
}
