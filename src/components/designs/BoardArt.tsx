/**
 * Silkscreen drawings for the reference-design boards. Not schematics:
 * just enough of each layout to tell the boards apart at a glance.
 */
type Variant = "leak" | "gas" | "dc";

function DevKit({ x, y }: { x: number; y: number }) {
  // An ESP32 dev board footprint: outline, module can, two pin rows.
  const pins = Array.from({ length: 15 }, (_, i) => i);
  return (
    <g>
      <rect x={x} y={y} width="96" height="196" rx="4" className="silk" />
      <rect x={x + 18} y={y + 12} width="60" height="70" rx="2" className="silk" />
      <text x={x + 48} y={y + 52} textAnchor="middle" className="silk-text">
        ESP32
      </text>
      {pins.map((i) => (
        <g key={i}>
          <circle cx={x + 9} cy={y + 96 + i * 6.4} r="2.2" className="pad" />
          <circle cx={x + 87} cy={y + 96 + i * 6.4} r="2.2" className="pad" />
        </g>
      ))}
    </g>
  );
}

export function BoardArt({ variant }: { variant: Variant }) {
  return (
    <svg viewBox="0 0 500 300" className="board-art" aria-hidden="true">
      <DevKit x={44} y={56} />
      {variant === "leak" ? (
        <g>
          {/* water sensor: a comb of exposed traces */}
          <rect x="300" y="64" width="150" height="112" rx="4" className="silk" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={312 + i * 19} y="76" width="7" height="80" rx="1" className="pad pad-soft" />
          ))}
          <text x="375" y="196" textAnchor="middle" className="silk-text">
            Water sensor
          </text>
          {/* buzzer */}
          <circle cx="232" cy="218" r="28" className="silk" />
          <circle cx="232" cy="218" r="6" className="silk" />
          <text x="232" y="266" textAnchor="middle" className="silk-text">
            Buzzer
          </text>
          <path d="M140 150 H220 V96 H300" className="trace" />
          <path d="M140 170 H196 V218 H204" className="trace" />
        </g>
      ) : null}
      {variant === "gas" ? (
        <g>
          {/* MQ-2: round sensor with mesh cap */}
          <circle cx="372" cy="116" r="54" className="silk" />
          <circle cx="372" cy="116" r="38" className="silk" />
          {[-24, -12, 0, 12, 24].map((d) => (
            <line key={`h${d}`} x1={346} x2={398} y1={116 + d} y2={116 + d} className="silk-fine" />
          ))}
          {[-24, -12, 0, 12, 24].map((d) => (
            <line key={`v${d}`} y1={90} y2={142} x1={372 + d} x2={372 + d} className="silk-fine" />
          ))}
          <text x="372" y="196" textAnchor="middle" className="silk-text">
            MQ-2
          </text>
          {/* divider resistors */}
          <rect x="196" y="78" width="44" height="14" rx="3" className="silk" />
          <rect x="196" y="112" width="44" height="14" rx="3" className="silk" />
          <text x="218" y="150" textAnchor="middle" className="silk-text">
            Divider
          </text>
          <path d="M140 150 H170 V85 H196 M240 85 H318" className="trace" />
          <path d="M240 119 H272 V236 H140" className="trace" />
          <circle cx="232" cy="236" r="18" className="silk" />
        </g>
      ) : null}
      {variant === "dc" ? (
        <g>
          {/* ACS712 module with screw terminal */}
          <rect x="304" y="60" width="140" height="92" rx="4" className="silk" />
          <rect x="316" y="72" width="44" height="68" rx="2" className="silk" />
          <circle cx="338" cy="92" r="7" className="pad" />
          <circle cx="338" cy="120" r="7" className="pad" />
          <text x="400" y="110" textAnchor="middle" className="silk-text">
            ACS712
          </text>
          {/* L7805 in TO-220 */}
          <rect x="318" y="190" width="56" height="44" rx="2" className="silk" />
          <circle cx="346" cy="204" r="6" className="silk" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={328 + i * 14} y="234" width="6" height="22" className="pad" />
          ))}
          <text x="410" y="218" className="silk-text">
            L7805
          </text>
          <path d="M140 140 H230 V106 H304" className="trace" />
          <path d="M140 230 H250 V246 H332" className="trace" />
          <rect x="196" y="160" width="40" height="13" rx="3" className="silk" />
          <rect x="196" y="186" width="40" height="13" rx="3" className="silk" />
        </g>
      ) : null}
    </svg>
  );
}
