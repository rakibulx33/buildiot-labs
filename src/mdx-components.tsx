import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes } from "react";
import { TLink } from "@/components/site/TLink";

function A({ href = "", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/")) {
    return (
      <TLink href={href} className="link">
        {children}
      </TLink>
    );
  }
  return (
    <a href={href} className="link" rel="noopener" {...rest}>
      {children}
    </a>
  );
}

const components: MDXComponents = {
  a: A,
  table: (props) => (
    <div className="prose-table">
      <table {...props} />
    </div>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
