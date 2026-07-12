import { site, contactLinks } from "@/lib/site";
import { Icon, type IconName } from "./icons";

export function Contact() {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="max-w-md text-[var(--ink-dim)]">
          Have a question, an idea, or just want to say hi? My inbox is open,
          and I read everything.
        </p>

        <a
          href={`mailto:${site.email}`}
          className="group mt-6 inline-flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-5 py-3.5 transition-colors hover:border-[var(--line-strong)] hover:bg-white/[0.03]"
        >
          <Icon.mail className="h-5 w-5 text-[var(--ink-dim)] transition-colors group-hover:text-white" />
          <span className="text-[15px] font-medium text-[var(--ink)]">
            {site.email}
          </span>
          <Icon.arrowUpRight className="h-4 w-4 text-[var(--ink-faint)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </a>
      </div>

      <div className="flex items-center gap-1.5">
        {contactLinks
          .filter((l) => l.label !== "Email")
          .map((l) => {
            const Glyph = Icon[l.icon as IconName];
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--ink-dim)] transition-all hover:border-[var(--line-strong)] hover:bg-white/[0.03] hover:text-white"
              >
                <Glyph className="h-5 w-5" />
              </a>
            );
          })}
      </div>
    </div>
  );
}
