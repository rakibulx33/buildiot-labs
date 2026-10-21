"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  as?: "div" | "figure";
  className?: string;
  threshold?: number;
  children: ReactNode;
};

/** Sets data-active while the element is on screen, so its drawing can move. */
export function ActiveWhenVisible({ as = "div", className = "", threshold = 0.35, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      className={className}
      data-active={active ? "" : undefined}
    >
      {children}
    </Tag>
  );
}
