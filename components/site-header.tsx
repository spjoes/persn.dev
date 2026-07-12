"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Work", target: "work" },
  { label: "About", target: "about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", target: "contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  // Hairline + subtle background only after leaving the top
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy for the home page sections
  useEffect(() => {
    if (!isHome) return;
    const ids = NAV.filter((n) => "target" in n).map((n) => (n as { target: string }).target);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.5] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  const handleAnchor = (e: React.MouseEvent, target: string) => {
    if (!isHome) return; // let it navigate to /#target
    e.preventDefault();
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${target}`);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full transition-colors duration-300"
      style={{
        height: "var(--nav-h)",
        backgroundColor: scrolled ? "rgba(8,8,10,0.72)" : "transparent",
        backdropFilter: scrolled ? "saturate(160%) blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(160%) blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="group inline-flex items-baseline gap-0.5 text-[15px] tracking-tight"
          aria-label="Home"
        >
          <span className="font-semibold text-[var(--ink)] transition-colors group-hover:text-white">
            persn
          </span>
          <span className="font-mono text-[var(--ink-faint)] transition-colors group-hover:text-[var(--accent)]">
            .dev
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => {
            const isActive =
              isHome && "target" in item && active === item.target;
            const href =
              "href" in item ? item.href : isHome ? `#${item.target}` : `/#${item.target}`;
            return (
              <Link
                key={item.label}
                href={href}
                onClick={
                  "target" in item ? (e) => handleAnchor(e, item.target) : undefined
                }
                className="relative rounded-md px-2.5 py-1.5 text-[13px] text-[var(--ink-dim)] transition-colors hover:text-white sm:text-sm"
              >
                {item.label}
                <span
                  className="absolute inset-x-2.5 -bottom-px h-px origin-center bg-[var(--accent)] transition-transform duration-300"
                  style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
