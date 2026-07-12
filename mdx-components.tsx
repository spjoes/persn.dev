import type { MDXComponents } from "mdx/types";

// Required by @next/mdx. Blog posts are rendered via next-mdx-remote and
// styled globally through the `.prose` class, so no overrides are needed here.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
