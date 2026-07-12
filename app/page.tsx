import Image from "next/image";
import { site, projects } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SocialRow } from "@/components/social-row";
import { LocalClock } from "@/components/local-clock";
import { RecentlyPlayed } from "@/components/recently-played";
import { ProjectCard } from "@/components/project-card";
import { Contact } from "@/components/contact";
import { Icon } from "@/components/icons";

const container = "mx-auto w-full max-w-7xl px-6 sm:px-10";

const aboutFacts: [string, string][] = [
  ["Based in", "Columbus, Ohio"],
  ["Studying", "CSE at The Ohio State University"]
];

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="mb-10 flex items-center gap-3">
      <span className="font-mono text-xs text-(--accent)">{index}</span>
      <span className="eyebrow">{children}</span>
      <span className="h-px flex-1 bg-(--line)" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className={`${container} pt-6 pb-12 sm:pt-16 sm:pb-16`}>
        <div className="grid items-center gap-7 sm:gap-8 lg:grid-cols-[1fr_300px] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5">{site.role}</p>
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
              Joseph
              <br />
              Kerper
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-(--ink-dim)">
              {site.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-(--ink-dim)">
                <Icon.pin className="h-4 w-4 text-(--ink-faint)" />
                {site.location}
              </span>
              <LocalClock />
              <span className="hidden h-4 w-px bg-(--line) sm:block" />
              <SocialRow />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-48 sm:max-w-64 lg:mx-0 lg:max-w-none">
              {/* soft accent bloom behind the portrait */}
              <div
                className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 60% 30%, rgba(139,157,255,0.14), transparent 70%)",
                }}
              />
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-(--line)">
                <Image
                  src="/images/picture.jpg"
                  alt="Joseph Kerper"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 460px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-(--bg)/40 to-transparent" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Recently played — full-width band, no nested card */}
        <Reveal delay={160} className="mt-8 sm:mt-20">
          <RecentlyPlayed />
        </Reveal>
      </section>

      {/* ---------------- Work ---------------- */}
      <section id="work" className={`${container} scroll-mt-24 py-16`}>
        <Reveal>
          <SectionLabel index="01">Selected work</SectionLabel>
        </Reveal>
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={(i % 3) * 80} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <section id="about" className={`${container} scroll-mt-24 py-16`}>
        <Reveal>
          <SectionLabel index="02">About</SectionLabel>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Building things
              <br className="hidden sm:block" /> people actually use.
            </h2>
            <dl className="mt-8 space-y-3 text-sm">
              {aboutFacts.map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-24 shrink-0 font-mono text-(--ink-faint)">
                    {k}
                  </dt>
                  <dd className="text-(--ink)">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={90} className="space-y-4 text-(--ink-dim) md:text-lg md:leading-relaxed">
            <p>
              I&apos;m a software engineer studying computer science at{" "}
              <span className="text-(--ink)">Ohio State</span>. I like
              building functional, good-looking, useful software (and
              actually shipping it).
            </p>
            <p>
              Lately that&apos;s meant a 24/7 concert radio station, a couple of
              hackathon-winning AI projects, and a Pokémon collection tracker. I spend
              a lot of time on fast load times, crafted interactions, and interfaces
              that get out of your way.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll usually find me tinkering with
              hardware or hanging out with friends.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className={`${container} scroll-mt-24 py-16`}>
        <Reveal>
          <SectionLabel index="03">Contact</SectionLabel>
          <h2 className="mb-8 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Let&apos;s build something.
          </h2>
        </Reveal>
        <Reveal delay={90}>
          <Contact />
        </Reveal>
      </section>
    </>
  );
}
