import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

/**
 * Internal link that plays the sweep page transition.
 * Use plain <a> for external links and in-page anchors.
 */
export function TLink({ transitionTypes = ["sweep"], ...props }: Props) {
  return <Link transitionTypes={transitionTypes} {...props} />;
}
