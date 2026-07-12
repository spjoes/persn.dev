import Image from "next/image";
import { Icon } from "./icons";
import type { Project } from "@/lib/site";

const statusBadge: Record<string, { label: string; className: string }> = {
  unreleased: {
    label: "In progress",
    className: "border-amber-400/40 bg-black/65 text-amber-200",
  },
  concept: {
    label: "Concept",
    className: "border-sky-400/40 bg-black/65 text-sky-200",
  },
};

export function ProjectCard({ project }: { project: Project }) {
  const {
    title,
    year,
    description,
    image,
    tags,
    github,
    liveUrl,
    twitter,
    devpost,
    winner,
    status = "released",
  } = project;

  const badge = statusBadge[status];

  const links = [
    liveUrl && { href: liveUrl, label: "Visit", icon: Icon.arrowUpRight },
    github && { href: github, label: "Code", icon: Icon.github },
    devpost && { href: devpost, label: "Devpost", icon: Icon.devpost },
    twitter && { href: twitter, label: "Twitter", icon: Icon.x },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Icon.github }[];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] transition-colors duration-300 hover:border-[var(--line-strong)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 430px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-soft)] via-transparent to-transparent opacity-20" />

        {(winner || badge) && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {winner && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-black/65 px-2 py-0.5 text-[11px] font-medium text-amber-200 backdrop-blur-sm">
                <Icon.trophy className="h-3 w-3" />
                Hackathon winner
              </span>
            )}
            {badge && (
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h3>
          <span className="font-mono text-xs text-[var(--ink-faint)]">{year}</span>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-[var(--ink-dim)]">
          {description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--line)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink-faint)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {links.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--line)] pt-4">
              {links.map((link) => {
                const Glyph = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1.5 text-sm text-[var(--ink-dim)] transition-colors hover:text-white"
                  >
                    <Glyph className="h-4 w-4" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
