import type { CSSProperties, ReactNode } from "react";

type Props = {
  /** Silkscreen legend printed on the board edge. */
  legend: string;
  /** Revision printed next to the legend. */
  rev?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** A soldermask board with mounting holes and a silkscreen legend. */
export function Board({ legend, rev, className = "", style, children }: Props) {
  return (
    <div className={`board ${className}`} style={style}>
      <span className="board-hole" style={{ top: 10, left: 10 }} aria-hidden="true" />
      <span className="board-hole" style={{ top: 10, right: 10 }} aria-hidden="true" />
      <span className="board-hole" style={{ bottom: 10, left: 10 }} aria-hidden="true" />
      <span className="board-hole" style={{ bottom: 10, right: 10 }} aria-hidden="true" />
      <div className="board-legend" aria-hidden="true">
        <span>{legend}</span>
        {rev ? <span>{rev}</span> : null}
      </div>
      {children}
    </div>
  );
}
