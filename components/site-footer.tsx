import Link from "next/link";
import { site, socials } from "@/lib/site";
import { Icon, type IconName } from "./icons";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-[var(--line)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Link
              href="/"
              className="group inline-flex items-baseline gap-0.5 text-sm tracking-tight"
            >
              <span className="font-semibold text-[var(--ink)] transition-colors group-hover:text-white">
                persn
              </span>
              <span className="font-mono text-[var(--ink-faint)] transition-colors group-hover:text-[var(--accent)]">
                .dev
              </span>
            </Link>
            <p className="font-mono text-xs text-[var(--ink-faint)]">
              © {year} {site.name}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {socials.map((s) => {
              const Glyph = Icon[s.icon as IconName];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-faint)] transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Glyph className="h-[18px] w-[18px]" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
