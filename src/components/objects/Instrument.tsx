import type { ReactNode } from "react";

type Props = {
  /** Small legend printed on the bezel, top left. */
  legend?: string;
  className?: string;
  children: ReactNode;
};

/** A bench instrument: dark anodised faceplate with corner screws. */
export function Instrument({ legend, className = "", children }: Props) {
  return (
    <div className={`instrument on-dark ${className}`}>
      <span className="instrument-screw" style={{ top: 9, left: 9 }} aria-hidden="true" />
      <span className="instrument-screw" style={{ top: 9, right: 9 }} aria-hidden="true" />
      <span className="instrument-screw" style={{ bottom: 9, left: 9 }} aria-hidden="true" />
      <span className="instrument-screw" style={{ bottom: 9, right: 9 }} aria-hidden="true" />
      {legend ? (
        <p className="instrument-legend" aria-hidden="true">
          {legend}
        </p>
      ) : null}
      {children}
    </div>
  );
}
