import { socials } from "@/lib/site";
import { Icon, type IconName } from "./icons";

export function SocialRow() {
  return (
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-[var(--ink-dim)] transition-all hover:border-[var(--line)] hover:bg-white/[0.04] hover:text-white"
          >
            <Glyph className="h-[18px] w-[18px]" />
          </a>
        );
      })}
    </div>
  );
}
