"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Instrument } from "@/components/objects/Instrument";
import { TLink } from "@/components/site/TLink";
import { Figure } from "@/components/ui/Figure";
import { MethodTag } from "@/components/ui/MethodTag";
import { current, lifetime, sig } from "@/lib/format";
import {
  DEFAULT_USABLE_FRACTION,
  REFERENCE_SLEEP_UA,
  REFERENCE_WAKE,
  dutyCycle,
  sampleWake,
  segmentSpans,
  wakeChargeMilliCoulombs,
  wakeDurationMs,
} from "@/lib/model/wake";
import { drawScope, type ScopeColors } from "./draw";
import { usePrefersReducedMotion, useTween } from "./useTween";

const INTERVALS = [
  { label: "10 s", seconds: 10 },
  { label: "1 min", seconds: 60 },
  { label: "5 min", seconds: 300 },
  { label: "15 min", seconds: 900 },
];

const BATTERIES = [
  { label: "1000", mah: 1000 },
  { label: "2500", mah: 2500 },
  { label: "3400", mah: 3400 },
];

const WAKE_MS = wakeDurationMs(REFERENCE_WAKE);
const WAKE_CHARGE = wakeChargeMilliCoulombs(REFERENCE_WAKE);
const SPANS = segmentSpans(REFERENCE_WAKE);

function readColors(): ScopeColors {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    grid: "rgba(233, 229, 221, 0.07)",
    gridStrong: "rgba(233, 229, 221, 0.2)",
    text: v("--color-panel-muted", "#9aa6ab"),
    ch1: v("--color-ch1", "#f2c94c"),
    ch2: v("--color-ch2", "#5cc6e0"),
  };
}

export function HeroScope() {
  const [intervalIdx, setIntervalIdx] = useState(2);
  const [batteryIdx, setBatteryIdx] = useState(1);
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef({ zoom: 0, overview: 0 });
  const drawRef = useRef<() => void>(() => {});
  const introDone = useRef(false);
  const groupId = useId();

  const wake = useMemo(() => sampleWake(REFERENCE_WAKE, 1, 11), []);
  const intervalSeconds = INTERVALS[intervalIdx].seconds;
  const capacity = BATTERIES[batteryIdx].mah;

  const result = useMemo(
    () =>
      dutyCycle({
        wakeCharge: WAKE_CHARGE,
        wakeSeconds: WAKE_MS / 1000,
        sleepMicroAmps: REFERENCE_SLEEP_UA,
        intervalSeconds,
        capacityMah: capacity,
        usableFraction: DEFAULT_USABLE_FRACTION,
      }),
    [intervalSeconds, capacity],
  );

  // The latest interval, read by the draw function without re-creating it.
  const intervalRef = useRef(intervalSeconds);
  useEffect(() => {
    intervalRef.current = intervalSeconds;
  }, [intervalSeconds]);

  const avg = useTween(result.averageMilliAmps, 600, !reduced);
  const life = useTween(result.lifeHours, 600, !reduced);
  const share = useTween(result.activeShare * 100, 600, !reduced);
  const avgQ = current(avg);
  const lifeQ = lifetime(life);

  // Set up the canvas: size, fonts, colours and a draw function.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const colors = readColors();
    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim() || "system-ui, sans-serif";
    let width = 0;
    let height = 0;

    const draw = () => {
      if (!width || !height) return;
      drawScope(ctx, {
        width,
        height,
        font: family,
        colors,
        wake,
        wakeMs: WAKE_MS,
        spans: SPANS,
        sleepMicroAmps: REFERENCE_SLEEP_UA,
        intervalSeconds: intervalRef.current,
        zoomProgress: frameRef.current.zoom,
        overviewProgress: frameRef.current.overview,
      });
    };
    drawRef.current = draw;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    document.fonts?.ready.then(draw);
    return () => ro.disconnect();
  }, [wake]);

  // Power-on: wait for the page-load sequence, then sweep the trace once.
  useEffect(() => {
    if (introDone.current) return;
    introDone.current = true;
    if (reduced) {
      frameRef.current = { zoom: 1, overview: 1 };
      drawRef.current();
      return;
    }
    let frame = 0;
    let start = 0;
    const delay = 650;
    const ovDur = 700;
    const zoomDur = 1500;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start - delay;
      frameRef.current = {
        overview: Math.min(1, Math.max(0, t / ovDur)),
        zoom: Math.min(1, Math.max(0, (t - ovDur * 0.6) / zoomDur)),
      };
      drawRef.current();
      if (frameRef.current.zoom < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  // Re-sweep the overview when the reporting interval changes.
  const firstInterval = useRef(true);
  useEffect(() => {
    if (firstInterval.current) {
      firstInterval.current = false;
      return;
    }
    if (reduced || frameRef.current.zoom < 1) {
      drawRef.current();
      return;
    }
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      frameRef.current = { ...frameRef.current, overview: Math.min(1, (now - start) / 520) };
      drawRef.current();
      if (frameRef.current.overview < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [intervalSeconds, reduced]);

  const label = `Modelled supply current of a sensor node reporting every ${INTERVALS[intervalIdx].label}: average ${avgQ.value} ${avgQ.unit}, about ${lifeQ.value} ${lifeQ.unit} on a ${BATTERIES[batteryIdx].label} mAh battery.`;

  return (
    <Figure
      number={1}
      caption={
        <>
          Modelled supply current of an ESP32-C3 sensor node that wakes, reads a sensor, joins Wi-Fi and publishes one
          MQTT message over TLS. Change how often it reports and watch the battery life move. The wake itself never
          changes; how often you pay for it does. <MethodTag status="model" className="ml-1" />{" "}
          <TLink href="/tools/battery-life" className="link ml-1 whitespace-nowrap">
            Try your own numbers
          </TLink>
        </>
      }
    >
      <Instrument legend="Bench scope, channel 1: supply current">
        <div className="screen aspect-[4/3] sm:aspect-[16/8.4]">
          <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 h-full w-full" />
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-x-8 gap-y-4">
          <fieldset>
            <legend className="mb-2 text-xs font-[560] text-panel-muted [font-stretch:94%]">Report every</legend>
            <div className="keys">
              {INTERVALS.map((it, i) => (
                <label key={it.label} className="key">
                  <input
                    type="radio"
                    name={`${groupId}-interval`}
                    checked={intervalIdx === i}
                    onChange={() => setIntervalIdx(i)}
                  />
                  <span>{it.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs font-[560] text-panel-muted [font-stretch:94%]">Battery, mAh</legend>
            <div className="keys">
              {BATTERIES.map((b, i) => (
                <label key={b.label} className="key">
                  <input
                    type="radio"
                    name={`${groupId}-battery`}
                    checked={batteryIdx === i}
                    onChange={() => setBatteryIdx(i)}
                  />
                  <span>{b.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <dl className="readouts mt-4" aria-live="polite">
          <div className="readout">
            <dt>Average current</dt>
            <dd>
              {avgQ.value}
              <small>{avgQ.unit}</small>
            </dd>
          </div>
          <div className="readout">
            <dt>Battery life</dt>
            <dd>
              {lifeQ.value}
              <small>{lifeQ.unit}</small>
            </dd>
          </div>
          <div className="readout">
            <dt>Awake per report</dt>
            <dd>
              {sig(WAKE_MS / 1000, 2)}
              <small>s</small>
            </dd>
          </div>
          <div className="readout">
            <dt>Charge spent awake</dt>
            <dd>
              {Math.round(share)}
              <small>%</small>
            </dd>
          </div>
        </dl>
      </Instrument>
    </Figure>
  );
}
