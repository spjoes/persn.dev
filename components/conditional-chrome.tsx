"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/** The /card page is a standalone shareable card — no site chrome. */
export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/card") return null;
  return <SiteHeader />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/card") return null;
  return <SiteFooter />;
}
