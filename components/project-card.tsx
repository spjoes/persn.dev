"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  liveUrl?: string;
  twitter?: string;
  status?: "released" | "unreleased" | "concept";
}

export function ProjectCard({
  title,
  description,
  image,
  tags,
  github,
  liveUrl,
  twitter,
  status = "released",
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="opacity-0 group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors duration-300 hover:shadow-md hover:border-zinc-700"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-xl font-bold">{title}</h3>
            {status === "unreleased" && (
              <span className="relative top-px rounded-full border border-dashed border-amber-500/50 bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-500">
                Unreleased
              </span>
            )}
            {status === "concept" && (
              <span className="relative top-px rounded-full border border-dashed border-sky-500/50 bg-sky-900/30 px-2 py-0.5 text-xs font-medium text-sky-500">
                Concept
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        
        <div className="mt-auto pt-4">
          <div className="mb-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-800 px-2 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {github && (
              <Link
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:scale-105 hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
              >
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors group-hover:text-white" fill="currentColor"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                <span>Code</span>
              </Link>
            )}
            {liveUrl && (
              <Link
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:scale-105 hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-colors group-hover:text-white"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                <span>View</span>
              </Link>
            )}
            {twitter && (
              <Link
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:scale-105 hover:border-zinc-600 hover:bg-zinc-700 hover:text-white"
              >
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors group-hover:text-white"><title>X</title><path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                <span>Twitter</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 