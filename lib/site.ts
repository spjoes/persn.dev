import type { ReactNode } from "react";

export const site = {
  name: "Joseph Kerper",
  role: "Software Engineer",
  handle: "persn.dev",
  url: "https://persn.dev",
  location: "Columbus, Ohio",
  timeZone: "America/New_York",
  email: "joeykerp@gmail.com",
  // Short, human intro. No filler.
  intro: "I build functional, good-looking software for what comes next.",
  description:
    "Personal website of Joseph Kerper, a software engineer at Ohio State. Projects, writing, and whatever I'm listening to.",
};

export interface Project {
  title: string;
  year: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  twitter?: string;
  devpost?: string;
  liveUrl?: string;
  winner?: boolean;
  status?: "released" | "unreleased" | "concept";
}

export const projects: Project[] = [
  {
    title: "ReListen Radio",
    year: "2025",
    description:
      "A 24/7 radio station streaming old concerts through Archive.org and ReListen.net, right from the browser or a Sonos.",
    image: "/images/projects/relistenradio.jpg",
    tags: ["TypeScript", "Hono", "Bun", "Icecast", "Liquidsoap"],
    liveUrl: "https://radio.aserver.online",
    status: "released",
  },
  {
    title: "Pokedex0",
    year: "2025",
    description:
      "A Pokémon collection tracker built for more customization, more features, and a better experience than what was out there.",
    image: "/images/projects/pokedex0.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    twitter: "https://x.com/PokedexZero",
    liveUrl: "https://pokedex0.com",
    status: "released",
  },
  {
    title: "The Convergence",
    year: "2025",
    description:
      "A platform where autonomous AI agents improve over time by combining multi-armed bandit learning, peer-to-peer teaching, and evolutionary competition.",
    image: "/images/projects/convergence.jpg",
    tags: ["Python", "Reinforcement Learning", "Thompson Sampling"],
    devpost: "https://devpost.com/software/the-convergence",
    winner: true,
    status: "released",
  },
  {
    title: "Detour",
    year: "2025",
    description:
      "An AI travel guide that builds custom itineraries with distinct guide personalities and verified facts, so you get routes that actually match your vibe.",
    image: "/images/projects/detour.jpg",
    tags: ["React Native", "Expo", "DigitalOcean", "TypeScript"],
    github: "https://github.com/spjoes/detour",
    devpost: "https://devpost.com/software/detour-xdv26b",
    winner: true,
    status: "released",
  },
  {
    title: "Longday",
    year: "2025",
    description:
      "A live-streaming platform for bands and independent artists to broadcast concerts, jam sessions, and more to their audience.",
    image: "/images/projects/longday.jpg",
    tags: ["Next.js", "TypeScript", "MongoDB", "LiveKit"],
    twitter: "https://x.com/LongdayTV",
    status: "unreleased",
  },
  {
    title: "persn.dev",
    year: "2025",
    description:
      "This website. My corner of the internet: portfolio, blog, and a live look at what I'm listening to.",
    image: "/images/projects/persndev.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    github: "https://github.com/spjoes/persn.dev",
    liveUrl: "https://persn.dev",
    status: "released",
  },
];

export interface SocialLink {
  label: string;
  href: string;
  /** icon name resolved in components/icons.tsx */
  icon: string;
}

// Primary socials (compact row in the hero)
export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/spjoes", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jkerper/", icon: "linkedin" },
  { label: "X", href: "https://x.com/IAmTh3Person", icon: "x" },
  { label: "Bluesky", href: "https://bsky.app/profile/persn.dev", icon: "bluesky" },
  { label: "Email", href: "mailto:joeykerp@gmail.com", icon: "mail" },
];

// Full contact set (Get in touch section)
export const contactLinks: SocialLink[] = [
  { label: "Email", href: "mailto:joeykerp@gmail.com", icon: "mail" },
  {
    label: "Discord",
    href: "https://discord.com/users/202109343678726144",
    icon: "discord",
  },
  {
    label: "Signal",
    href: "https://signal.me/#eu/hA8tkD7HOLAWcSWwtVW3aJeimfQmNfMhRqDER1bIqP5sausURUhLxZbAejG8L7BK",
    icon: "signal",
  },
  { label: "Bluesky", href: "https://bsky.app/profile/persn.dev", icon: "bluesky" },
  { label: "X", href: "https://x.com/IAmTh3Person", icon: "x" },
];

export type IconNode = ReactNode;
