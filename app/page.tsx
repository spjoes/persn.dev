"use client";

import { motion } from "framer-motion";
import { FlipCard } from "@/components/flip-card";
import { SocialLinks } from "@/components/social-links";
import { ProjectCard } from "@/components/project-card";
import { SpotifyNowPlaying } from "@/components/spotify-now-playing";
import { CurrentTime } from "@/components/current-time";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  twitter?: string;
  status?: "released" | "unreleased" | "concept";
  liveUrl?: string;
}

export default function Home() {
  const projects: Project[] = [
    {
      title: "Longday",
      description: "A music live streaming platform that allows bands and independent musical artists to stream their concerts, jam sessions, and more to their audience.",
      image: "/images/projects/longday.jpg",
      tags: ["Next.js", "TypeScript", "Tailwind", "MongoDB", "LiveKit"],
      twitter: "https://x.com/longdaytv",
      status: "unreleased",
    },
    {
      title: "Pokedex0",
      description: "After seeing current Pokemon collection tracking websites, I decided to make my own that allows for more customization, features, and a better user experience.",
      image: "/images/projects/pokedex0.jpg",
      tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
      github: "https://github.com/Pokedex0",
      twitter: "https://x.com/PokedexZero",
      status: "unreleased",
    },
    {
      title: "ReListen Radio",
      description: "A 24/7 radio station streaming old concerts through Archive.org and ReListen.net directly from their browser or Sonos.",
      image: "/images/projects/relistenradio.jpg",
      tags: ["TypeScript", "Hono", "Bun", "Icecast", "Liquidsoap"],
      liveUrl: "https://radio.aserver.online",
      status: "released",
    },
    {
      title: "Persn.dev",
      description: "This website! My personal website that I use to showcase my projects and skills.",
      image: "/images/projects/persndev.jpg",
      tags: ["Next.js", "Motion", "TypeScript", "Tailwind", "Vercel"],
      github: "https://github.com/spjoes/persn.dev",
      liveUrl: "https://persn.dev",
      status: "released",
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <section className="flex flex-col items-center justify-center py-12 md:py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center text-4xl font-bold tracking-tight md:text-6xl"
        >
          Joseph Kerper
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 text-center text-xl text-zinc-400 md:text-2xl"
        >
          Software Engineer
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 flex justify-center"
        >
          <CurrentTime />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SocialLinks />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 w-full max-w-md"
        >
          <SpotifyNowPlaying />
        </motion.div>
      </section>

      <section id="about" className="py-4 md:py-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
          About Me
        </h2>
        <div className="grid gap-8 md:grid-cols-[2fr_3fr] md:gap-12 mx-auto max-w-5xl">
          <div className="flex relative justify-center md:justify-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FlipCard
                frontImage="/images/picture.jpg"
                backImage="/images/avatar.jpg"
                alt="Joseph Kerper"
              />
            </motion.div>
            <motion.div
              className="absolute top-1/2 -left-50 -translate-y-1/2 hidden md:flex flex-row items-center gap-2 text-sm font-medium opacity-75"
              animate={{ x: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="bg-zinc-800 px-3 py-1 rounded-full shadow-sm">
                Hover over me!
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                imageRendering="optimizeQuality"
                fillRule="evenodd"
                clipRule="evenodd"
                viewBox="0 0 512 190.285"
                transform="rotate(0)"
                width="50"
                height="50"
              >
                <path
                  d="M512 62.269c-32.208 3.503-65.126 11.155-82.935 11.576-5.87.14-13.175-.651-5.825-3.929 17.743-7.915 39.85-13.415 61.461-14.291-4.787-1.077-9.548-2.473-15.993-4.683-42.916-14.717-91.165-23.694-138.308-23.756-39.015-.053-79.822 5.737-115.535 22.126 13.263 12.299 25.007 25.723 35.154 40.787 21.629 32.107 31.567 79.665-13.75 96.773-37.675 14.221-72.262-18.318-76.731-54.787-3.222-26.29 6.915-45.475 19.352-63.408 5.258-7.581 11.717-14.262 19.168-20.104C105.119-16.905 17.276 26.293 0 117.511 4.91 5.165 125.544-21.164 205.932 42.942c70.469-46.003 210.713-30.084 282.411 7.501-9.463-9.291-17.535-22.446-22.866-35.006-.79-1.859-4.569-8.993-4.29-12.878.102-1.443.766-2.442 2.348-2.553.903-.063 1.863.407 2.868 1.35 2.92 2.749 9.199 13.053 15.44 23.057C491.104 39.255 499.115 50.13 512 62.269zm-304.367-6.573c13.918 12.907 26.764 28.048 37.028 43.982 16.542 25.678 22.453 56.275-1.472 72.95-14.806 10.319-30.931 9.682-44.76 1.389-49.808-29.871-25.747-96.994 9.204-118.321z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>
          </div>
          <div className="flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-4 text-zinc-300"
            >
              Hi! I&apos;m Joseph Kerper, a passionate software engineer with a focus
              on building functional, visually appealing, and user-friendly
              applications.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-4 text-zinc-300"
            >
              I&apos;m an incoming freshman at San Jose State University, where I will be
              expanding my knowledge and skills in software development,
              algorithms, and computer science principles.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-zinc-300"
            >
              When I&apos;m not coding, you can find me tinkering with hardware and hanging out with my friends.
            </motion.p>
          </div>
        </div>
      </section>

      <section id="projects" className="py-12 md:py-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
          My Projects
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-5xl">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section id="contact" className="py-12 md:py-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Get In Touch
        </h2>
        <div className="mx-auto max-w-md text-center">
          <p className="mb-8 text-zinc-300">
            Have a question or want to chat?
            Feel free to reach out!
          </p>
          <div className="grid grid-cols-2 gap-4 justify-center sm:flex sm:flex-wrap">
            <a
              href="mailto:joeykerp@gmail.com"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
              <span className="leading-none relative bottom-px">Email</span>
            </a>
            <a
              href="https://discord.com/users/202109343678726144"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white"><title>Discord</title><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
              <span className="leading-none relative bottom-px">Discord</span>
            </a>
            <a
              href="https://signal.me/#eu/hA8tkD7HOLAWcSWwtVW3aJeimfQmNfMhRqDER1bIqP5sausURUhLxZbAejG8L7BK"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white"><title>Signal</title><path fill="currentColor" d="M12 0q-.934 0-1.83.139l.17 1.111a11 11 0 0 1 3.32 0l.172-1.111A12 12 0 0 0 12 0M9.152.34A12 12 0 0 0 5.77 1.742l.584.961a10.8 10.8 0 0 1 3.066-1.27zm5.696 0-.268 1.094a10.8 10.8 0 0 1 3.066 1.27l.584-.962A12 12 0 0 0 14.848.34M12 2.25a9.75 9.75 0 0 0-8.539 14.459c.074.134.1.292.064.441l-1.013 4.338 4.338-1.013a.62.62 0 0 1 .441.064A9.7 9.7 0 0 0 12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25m-7.092.068a12 12 0 0 0-2.59 2.59l.909.664a11 11 0 0 1 2.345-2.345zm14.184 0-.664.909a11 11 0 0 1 2.345 2.345l.909-.664a12 12 0 0 0-2.59-2.59M1.742 5.77A12 12 0 0 0 .34 9.152l1.094.268a10.8 10.8 0 0 1 1.269-3.066zm20.516 0-.961.584a10.8 10.8 0 0 1 1.27 3.066l1.093-.268a12 12 0 0 0-1.402-3.383M.138 10.168A12 12 0 0 0 0 12q0 .934.139 1.83l1.111-.17A11 11 0 0 1 1.125 12q0-.848.125-1.66zm23.723.002-1.111.17q.125.812.125 1.66c0 .848-.042 1.12-.125 1.66l1.111.172a12.1 12.1 0 0 0 0-3.662M1.434 14.58l-1.094.268a12 12 0 0 0 .96 2.591l-.265 1.14 1.096.255.36-1.539-.188-.365a10.8 10.8 0 0 1-.87-2.35m21.133 0a10.8 10.8 0 0 1-1.27 3.067l.962.584a12 12 0 0 0 1.402-3.383zm-1.793 3.848a11 11 0 0 1-2.345 2.345l.664.909a12 12 0 0 0 2.59-2.59zm-19.959 1.1L.357 21.48a1.8 1.8 0 0 0 2.162 2.161l1.954-.455-.256-1.095-1.953.455a.675.675 0 0 1-.81-.81l.454-1.954zm16.832 1.769a10.8 10.8 0 0 1-3.066 1.27l.268 1.093a12 12 0 0 0 3.382-1.402zm-10.94.213-1.54.36.256 1.095 1.139-.266c.814.415 1.683.74 2.591.961l.268-1.094a10.8 10.8 0 0 1-2.35-.869zm3.634 1.24-.172 1.111a12.1 12.1 0 0 0 3.662 0l-.17-1.111q-.812.125-1.66.125a11 11 0 0 1-1.66-.125"/></svg>
              <span className="leading-none relative bottom-px">Signal</span>
            </a>
            <a
              href="https://bsky.app/profile/persn.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white"><title>Bluesky</title><path fill="currentColor" d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>
              <span className="leading-none relative bottom-px">Bluesky</span>
            </a>
            <a
              href="https://x.com/IAmTh3Person"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-white"><title>X</title><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              <span className="leading-none relative bottom-px">Twitter</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t border-zinc-800 py-6 text-center text-sm text-zinc-400">
        <p>Built with ❤️ by Joseph Kerper</p>
        <p>© {new Date().getFullYear()} Joseph Kerper. All rights reserved.</p>
      </footer>
    </div>
  );
}
