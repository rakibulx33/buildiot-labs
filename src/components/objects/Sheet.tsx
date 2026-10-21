import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** A sheet of paper lying on the bench: reports, forms, datasheets. */
export function Sheet({ as: Tag = "div", className = "", children }: Props) {
  return <Tag className={`sheet ${className}`}>{children}</Tag>;
}
