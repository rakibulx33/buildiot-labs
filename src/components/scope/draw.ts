import type { TracePoint } from "@/lib/model/wake";

export type ScopeColors = {
  grid: string;
  gridStrong: string;
  text: string;
  ch1: string;
  ch2: string;
};

export type ZoomSpan = { label: string; from: number; to: number };

export type ScopeFrame = {
  width: number;
  height: number;
  font: string;
  colors: ScopeColors;
  /** points of one wake, t in ms from wake start */
  wake: TracePoint[];
  wakeMs: number;
  spans: ZoomSpan[];
  sleepMicroAmps: number;
  intervalSeconds: number;
  /** 0..1 how much of the zoom trace has been swept */
  zoomProgress: number;
  /** 0..1 how much of the overview has been swept */
  overviewProgress: number;
};

const ZOOM_WINDOW_MS = 2000;
const PRE_TRIGGER_MS = 200;
const ZOOM_MA_PER_DIV = 60;
const ZOOM_DIVS_Y = 6;
const OVERVIEW_MA_FULL = 400;

/** 1-2-5 sequence, rounded up. */
export function niceCeil(x: number): number {
  const exp = Math.floor(Math.log10(x));
  const base = 10 ** exp;
  for (const m of [1, 2, 5, 10]) if (m * base >= x - 1e-9) return m * base;
  return 10 * base;
}

export function overviewSecondsPerDiv(intervalSeconds: number): number {
  return niceCeil(intervalSeconds * 0.32);
}

function fmtTime(seconds: number): string {
  if (seconds >= 60 && seconds % 60 === 0) return `${seconds / 60} min`;
  if (seconds >= 1) return `${seconds} s`;
  return `${Math.round(seconds * 1000)} ms`;
}

function graticule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rows: number, c: ScopeColors) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = c.grid;
  ctx.beginPath();
  for (let i = 1; i < 10; i++) {
    const gx = Math.round(x + (w * i) / 10) + 0.5;
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + h);
  }
  for (let j = 1; j < rows; j++) {
    const gy = Math.round(y + (h * j) / rows) + 0.5;
    ctx.moveTo(x, gy);
    ctx.lineTo(x + w, gy);
  }
  ctx.stroke();

  // Minor ticks on the centre axes, five per division.
  ctx.strokeStyle = c.gridStrong;
  ctx.beginPath();
  const cy = Math.round(y + h / 2) + 0.5;
  const cx = Math.round(x + w / 2) + 0.5;
  for (let i = 0; i <= 50; i++) {
    const tx = Math.round(x + (w * i) / 50) + 0.5;
    ctx.moveTo(tx, cy - 3);
    ctx.lineTo(tx, cy + 3);
  }
  const yTicks = rows * 5;
  for (let j = 0; j <= yTicks; j++) {
    const ty = Math.round(y + (h * j) / yTicks) + 0.5;
    ctx.moveTo(cx - 3, ty);
    ctx.lineTo(cx + 3, ty);
  }
  ctx.stroke();

  ctx.strokeStyle = c.gridStrong;
  ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
  ctx.restore();
}

function glowStroke(ctx: CanvasRenderingContext2D, path: Path2D, color: string) {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 4;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.stroke(path);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.3;
  ctx.stroke(path);
  ctx.restore();
}

export function drawScope(ctx: CanvasRenderingContext2D, f: ScopeFrame) {
  const { width: W, height: H, colors: c } = f;
  ctx.clearRect(0, 0, W, H);

  const pad = W < 520 ? 10 : 14;
  const labelH = 16;
  const x = pad;
  const w = W - pad * 2;
  const ovY = pad + labelH;
  const ovH = Math.max(36, Math.round((H - pad * 2) * 0.22));
  const gap = 26;
  const zY = ovY + ovH + gap + labelH;
  const zH = H - zY - pad - 18;

  ctx.font = `500 ${W < 520 ? 10.5 : 11.5}px ${f.font}`;
  ctx.textBaseline = "alphabetic";

  // ---- Overview pane: several reports at a long time base ----
  const secPerDiv = overviewSecondsPerDiv(f.intervalSeconds);
  const windowS = secPerDiv * 10;
  graticule(ctx, x, ovY, w, ovH, 2, c);
  ctx.fillStyle = c.text;
  ctx.fillText("Overview", x, ovY - 5);
  const ovLabel = `${fmtTime(secPerDiv)}/div`;
  ctx.fillText(ovLabel, x + w - ctx.measureText(ovLabel).width, ovY - 5);

  const ovBase = ovY + ovH - 3;
  const firstWake = f.intervalSeconds * 0.35;
  const wakeS = f.wakeMs / 1000;
  const spikeW = Math.max(1.5, (wakeS / windowS) * w);
  const ovPath = new Path2D();
  const ovEnd = x + w * f.overviewProgress;
  ovPath.moveTo(x, ovBase);
  const wakes: number[] = [];
  for (let t = firstWake; t < windowS; t += f.intervalSeconds) wakes.push(t);
  for (const t of wakes) {
    const sx = x + (t / windowS) * w;
    if (sx > ovEnd) break;
    const peakY = ovY + ovH - (300 / OVERVIEW_MA_FULL) * ovH;
    const bodyY = ovY + ovH - (88 / OVERVIEW_MA_FULL) * ovH;
    ovPath.lineTo(sx, ovBase);
    ovPath.lineTo(sx, peakY);
    ovPath.lineTo(sx + spikeW * 0.35, bodyY);
    ovPath.lineTo(sx + spikeW, bodyY);
    ovPath.lineTo(sx + spikeW, ovBase);
  }
  ovPath.lineTo(Math.min(ovEnd, x + w), ovBase);
  glowStroke(ctx, ovPath, c.ch1);

  // Zoom bracket around the second report, joined to the zoom pane.
  const zoomed = wakes[1] ?? wakes[0];
  if (zoomed !== undefined && f.overviewProgress > 0.99) {
    const bx = x + (zoomed / windowS) * w;
    const bw = Math.max(12, (2 / windowS) * w);
    const bLeft = bx - bw * 0.3;
    ctx.save();
    ctx.strokeStyle = c.ch2;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(bLeft) + 0.5, ovY + 1.5, Math.round(bw), ovH - 3);
    ctx.setLineDash([2, 3]);
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(bLeft, ovY + ovH);
    ctx.lineTo(x, zY - labelH + 2);
    ctx.moveTo(bLeft + bw, ovY + ovH);
    ctx.lineTo(x + w, zY - labelH + 2);
    ctx.stroke();
    ctx.restore();
  }

  // ---- Zoom pane: one report in detail ----
  graticule(ctx, x, zY, w, zH, ZOOM_DIVS_Y, c);
  ctx.fillStyle = c.text;
  ctx.fillText("One report", x, zY - 5);
  const zLabel = `${ZOOM_WINDOW_MS / 10} ms/div   ${ZOOM_MA_PER_DIV} mA/div`;
  ctx.fillText(zLabel, x + w - ctx.measureText(zLabel).width, zY - 5);

  const toX = (ms: number) => x + ((ms + PRE_TRIGGER_MS) / ZOOM_WINDOW_MS) * w;
  const toY = (mA: number) => zY + zH - (mA / (ZOOM_MA_PER_DIV * ZOOM_DIVS_Y)) * zH;
  const sleepY = toY(f.sleepMicroAmps / 1000) - 1.5;

  // Phase brackets along the top of the zoom pane.
  ctx.save();
  ctx.strokeStyle = c.gridStrong;
  ctx.fillStyle = c.text;
  ctx.lineWidth = 1;
  const bracketY = zY + 12;
  for (const s of f.spans) {
    const a = toX(s.from);
    const b = toX(s.to);
    ctx.beginPath();
    ctx.moveTo(a + 1, bracketY + 4);
    ctx.lineTo(a + 1, bracketY);
    ctx.lineTo(b - 1, bracketY);
    ctx.lineTo(b - 1, bracketY + 4);
    ctx.stroke();
    const tw = ctx.measureText(s.label).width;
    if (tw + 6 < b - a) ctx.fillText(s.label, (a + b) / 2 - tw / 2, bracketY - 4);
  }
  ctx.restore();

  const sweepX = x + w * f.zoomProgress;
  const zPath = new Path2D();
  zPath.moveTo(x, sleepY);
  zPath.lineTo(Math.min(toX(0), sweepX), sleepY);
  let headX = Math.min(toX(0), sweepX);
  let headY = sleepY;
  if (sweepX > toX(0)) {
    for (const p of f.wake) {
      const px = toX(p.t);
      if (px > sweepX) break;
      const py = toY(p.mA);
      zPath.lineTo(px, py);
      headX = px;
      headY = py;
    }
    const endX = toX(f.wakeMs);
    if (sweepX > endX) {
      zPath.lineTo(endX, sleepY);
      zPath.lineTo(sweepX, sleepY);
      headX = sweepX;
      headY = sleepY;
    }
  }
  glowStroke(ctx, zPath, c.ch1);

  // Sweep head while drawing.
  if (f.zoomProgress > 0 && f.zoomProgress < 1) {
    ctx.save();
    const g = ctx.createRadialGradient(headX, headY, 0, headX, headY, 10);
    g.addColorStop(0, "rgba(255,240,190,0.95)");
    g.addColorStop(1, "rgba(242,201,76,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(headX, headY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Cursors around the wake, with the interval between them.
  if (f.zoomProgress >= 1) {
    const a = toX(0);
    const b = toX(f.wakeMs);
    ctx.save();
    ctx.strokeStyle = c.ch2;
    ctx.fillStyle = c.ch2;
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(a) + 0.5, zY + 20);
    ctx.lineTo(Math.round(a) + 0.5, zY + zH);
    ctx.moveTo(Math.round(b) + 0.5, zY + 20);
    ctx.lineTo(Math.round(b) + 0.5, zY + zH);
    ctx.stroke();
    ctx.setLineDash([]);
    const label = `Δt ${(f.wakeMs / 1000).toFixed(2)} s`;
    const lw = ctx.measureText(label).width;
    const ly = zY + zH + 14;
    ctx.beginPath();
    ctx.moveTo(a, ly - 4);
    ctx.lineTo((a + b) / 2 - lw / 2 - 6, ly - 4);
    ctx.moveTo((a + b) / 2 + lw / 2 + 6, ly - 4);
    ctx.lineTo(b, ly - 4);
    ctx.stroke();
    ctx.fillText(label, (a + b) / 2 - lw / 2, ly);

    // Sleep floor annotation.
    ctx.fillStyle = c.text;
    const sleepLabel = `sleep ≈ ${f.sleepMicroAmps} µA`;
    const sw = ctx.measureText(sleepLabel).width;
    if (x + w - b > sw + 12) ctx.fillText(sleepLabel, x + w - sw - 6, sleepY - 6);
    ctx.restore();
  }
}
