import Image from "next/image";
import { Icon, type IconName } from "./icons";
import { site } from "@/lib/site";

interface Row {
  icon: IconName;
  label: string;
  value: string;
  href: string;
}

export function BusinessCard({ contactPhone }: { contactPhone: string | null }) {
  const rows: Row[] = [
    { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
    ...(contactPhone
      ? [
          {
            icon: "mail" as IconName, // replaced below with phone glyph inline
            label: "Text",
            value: contactPhone,
            href: `sms:+1${contactPhone.replace(/\D/g, "")}`,
          },
        ]
      : []),
    { icon: "github", label: "GitHub", value: "@spjoes", href: "https://github.com/spjoes" },
    {
      icon: "linkedin",
      label: "LinkedIn",
      value: "@jkerper",
      href: "https://www.linkedin.com/in/jkerper/",
    },
    { icon: "x", label: "X", value: "@IAmTh3Person", href: "https://x.com/IAmTh3Person" },
  ];

  const tech = [
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "Tailwind",
    "PostgreSQL",
    "Supabase",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--bg-soft)] shadow-2xl shadow-black/50">
          {/* header */}
          <div className="flex items-center gap-4 border-b border-[var(--line)] p-6">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--line-strong)]">
              <Image
                src="/images/picture.jpg"
                alt="Joseph Kerper"
                width={64}
                height={64}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white">
                {site.name}
              </h1>
              <p className="text-sm text-[var(--ink-dim)]">{site.role}</p>
              <p className="font-mono text-xs text-[var(--ink-faint)]">
                The Ohio State University
              </p>
            </div>
          </div>

          {/* contact rows */}
          <div className="flex flex-col p-2.5">
            {rows.map((row) => {
              const Glyph = row.label === "Text" ? Icon.clock : Icon[row.icon];
              return (
                <a
                  key={row.label}
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--ink-dim)] transition-colors group-hover:text-white">
                    <Glyph className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] text-[var(--ink-faint)]">
                      {row.label}
                    </span>
                    <span className="block text-sm text-[var(--ink)] transition-colors group-hover:text-white">
                      {row.value}
                    </span>
                  </span>
                  <Icon.arrowUpRight className="h-4 w-4 text-[var(--ink-faint)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </a>
              );
            })}
          </div>

          {/* tech */}
          <div className="border-t border-[var(--line)] p-6">
            <p className="eyebrow mb-3">Tech I reach for</p>
            <div className="flex flex-wrap gap-1.5">
              {tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--line)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink-dim)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* footer link */}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between border-t border-[var(--line)] p-6 transition-colors hover:bg-white/[0.03]"
          >
            <div>
              <p className="text-[13px] text-[var(--ink-faint)]">Portfolio</p>
              <p className="text-sm font-medium text-[var(--ink)] group-hover:text-white">
                persn.dev
              </p>
            </div>
            <Icon.arrowUpRight className="h-5 w-5 text-[var(--ink-faint)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </a>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-[var(--ink-faint)]">
          {site.name}
        </p>
      </div>
    </div>
  );
}
