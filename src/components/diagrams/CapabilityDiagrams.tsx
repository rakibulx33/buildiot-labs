/**
 * Plates for "What we build". Drawn in ink on paper; each one animates
 * only while its parent has data-active (set by the scroll observer).
 */

type Props = { className?: string };

export function FirmwarePlate({ className = "" }: Props) {
  const lanes = [
    { y: 64, label: "Sensor", blocks: [[132, 12], [196, 12], [260, 12], [324, 12], [388, 12], [452, 12]] },
    { y: 118, label: "Network", blocks: [[146, 34], [278, 46], [402, 30]] },
    { y: 172, label: "Update", blocks: [[212, 54]] },
    { y: 280, label: "Idle", blocks: [[120, 12], [180, 16], [266, 12], [336, 52], [432, 20]] },
  ];
  const feeds = [150, 214, 278, 342, 406, 470];
  return (
    <svg viewBox="0 0 480 360" className={`plate plate-firmware ${className}`} role="img" aria-label="Firmware tasks on a timeline. The watchdog is fed at regular intervals while every task keeps running.">
      {lanes.map((lane) => (
        <g key={lane.label}>
          <text x="16" y={lane.y + 5} className="plate-label">
            {lane.label}
          </text>
          <line x1="112" x2="470" y1={lane.y} y2={lane.y} className="plate-rule" />
          {lane.blocks.map(([x, w]) => (
            <rect
              key={x}
              x={x}
              y={lane.y - 11}
              width={w}
              height={22}
              rx="2"
              className={lane.label === "Idle" ? "plate-block-soft" : "plate-block"}
            />
          ))}
        </g>
      ))}
      <g>
        <text x="16" y="231" className="plate-label">
          Watchdog
        </text>
        <line x1="112" x2="470" y1="226" y2="226" className="plate-rule" />
        {feeds.map((x) => (
          <path key={x} d={`M${x} 216 l9 10 l-9 10 l-9 -10z`} className="plate-pad" />
        ))}
      </g>
      <g className="plate-playhead">
        <line x1="112" x2="112" y1="40" y2="300" />
        <circle cx="112" cy="40" r="4" />
      </g>
      <text x="16" y="340" className="plate-note">
        Every task feeds the watchdog. One that hangs stops the feed,
      </text>
      <text x="16" y="358" className="plate-note">
        and the chip restarts into a known state.
      </text>
    </svg>
  );
}

export function PowerPlate({ className = "" }: Props) {
  const trace =
    "M24 262 H118 L120 120 L124 150 L128 74 L131 140 L136 98 L140 146 L146 66 L150 138 L156 92 L160 144 L166 80 L171 150 L176 112 L180 262 H226 M246 262 H316 L318 120 L322 150 L326 74 L329 140 L334 98 L338 146 L344 66 L348 138 L354 92 L358 144 L364 80 L369 150 L374 112 L378 262 H424 M444 262 H466";
  return (
    <svg viewBox="0 0 480 360" className={`plate plate-power ${className}`} role="img" aria-label="Supply current over time: short wake pulses of around a hundred milliamps separated by long sleeps at about fifteen microamps.">
      <line x1="24" x2="466" y1="282" y2="282" className="plate-rule" />
      <line x1="24" x2="24" y1="40" y2="282" className="plate-rule" />
      <text x="30" y="34" className="plate-label">
        Current
      </text>
      <text x="420" y="306" className="plate-label">
        Time
      </text>
      <path d={trace} className="plate-trace" pathLength={1} />
      {/* axis breaks on the long sleeps */}
      <path d="M228 254 l8 16 M236 254 l8 16 M426 254 l8 16 M434 254 l8 16" className="plate-rule-strong" />
      <path d="M118 52 V40 H180 V52" className="plate-bracket" />
      <text x="149" y="30" textAnchor="middle" className="plate-label">
        Awake 1.4 s
      </text>
      <path d="M186 238 V226 H310 V238" className="plate-bracket" />
      <text x="248" y="216" textAnchor="middle" className="plate-label">
        Asleep 298.6 s
      </text>
      <text x="276" y="252" textAnchor="middle" className="plate-note">
        15 µA
      </text>
      <text x="16" y="340" className="plate-note">
        One report every five minutes. Waking costs more than
      </text>
      <text x="16" y="358" className="plate-note">
        sleeping, so how often you wake decides the battery life.
      </text>
    </svg>
  );
}

export function TelemetryPlate({ className = "" }: Props) {
  return (
    <svg viewBox="0 0 480 360" className={`plate plate-telemetry ${className}`} role="img" aria-label="A sensor node sends readings to an MQTT broker and on to a database. When the link drops, readings wait in a buffer on the node and are sent in order when it comes back.">
      <g className="plate-box">
        <rect x="16" y="120" width="112" height="64" rx="4" />
        <text x="72" y="157" textAnchor="middle" className="plate-label-ink">
          Sensor node
        </text>
      </g>
      <g className="plate-box">
        <rect x="184" y="120" width="112" height="64" rx="4" />
        <text x="240" y="157" textAnchor="middle" className="plate-label-ink">
          MQTT broker
        </text>
      </g>
      <g className="plate-box">
        <rect x="352" y="120" width="112" height="64" rx="4" />
        <text x="408" y="157" textAnchor="middle" className="plate-label-ink">
          Database
        </text>
      </g>
      <g className="plate-box">
        <rect x="352" y="252" width="112" height="56" rx="4" />
        <text x="408" y="285" textAnchor="middle" className="plate-label-ink">
          Dashboard
        </text>
      </g>

      <line x1="128" x2="184" y1="152" y2="152" className="plate-link plate-link-a" />
      <line x1="296" x2="352" y1="152" y2="152" className="plate-link" />
      <line x1="408" x2="408" y1="184" y2="252" className="plate-link" />

      <g className="plate-break">
        <path d="M150 140 l12 24 M162 140 l-12 24" />
        <text x="156" y="122" textAnchor="middle" className="plate-label">
          Link down
        </text>
      </g>

      {/* packets crossing node -> broker, then broker -> database */}
      <rect className="pkt pkt-1" x="130" y="147" width="10" height="10" rx="1.5" />
      <rect className="pkt pkt-2" x="130" y="147" width="10" height="10" rx="1.5" />
      <rect className="pkt pkt-3" x="130" y="147" width="10" height="10" rx="1.5" />
      <rect className="pkt pkt-4" x="130" y="147" width="10" height="10" rx="1.5" />
      <rect className="pkt pkt-5" x="130" y="147" width="10" height="10" rx="1.5" />

      {/* buffer on the node */}
      <text x="16" y="216" className="plate-label">
        Buffer on the node
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={16 + i * 26} y="226" width="20" height="20" rx="2" className={`buf buf-${i + 1}`} />
      ))}

      <text x="16" y="340" className="plate-note">
        When the link drops, readings wait on the node and go out
      </text>
      <text x="16" y="358" className="plate-note">
        in order when it returns. Nothing is lost, nothing is duplicated.
      </text>
    </svg>
  );
}

export function PrototypePlate({ className = "" }: Props) {
  const layers = [
    { label: "Enclosure lid", fill: "plate-layer-outline" },
    { label: "Sensor module", fill: "plate-layer-board" },
    { label: "ESP32 board", fill: "plate-layer-board" },
    { label: "Battery and charger", fill: "plate-layer-cell" },
    { label: "Enclosure base", fill: "plate-layer-outline" },
  ];
  return (
    <svg viewBox="0 0 480 360" className={`plate plate-proto ${className}`} role="img" aria-label="An exploded view of a prototype: enclosure lid, sensor module, ESP32 board, battery and charger, and enclosure base.">
      {layers
        .map((layer, i) => ({ ...layer, n: i - 2 }))
        .reverse()
        .map((layer) => (
        <g key={layer.label} className="plate-layer" style={{ "--n": layer.n } as React.CSSProperties}>
          <path d="M60 150 L250 150 L300 182 L110 182 Z" className={layer.fill} />
          <line x1="300" x2="330" y1="166" y2="166" className="plate-rule-strong" />
          <text x="336" y="171" className="plate-label-ink">
            {layer.label}
          </text>
        </g>
        ))}
      <text x="16" y="340" className="plate-note">
        Built from stocked modules, so every part on the bill of
      </text>
      <text x="16" y="358" className="plate-note">
        materials can be bought again tomorrow.
      </text>
    </svg>
  );
}
