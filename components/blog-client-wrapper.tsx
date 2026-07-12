"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

interface BlogClientWrapperProps {
  posts: BlogPost[];
}

export function BlogClientWrapper({ posts }: BlogClientWrapperProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Blog
          </h1>
          <div className="flex w-fit overflow-hidden rounded-md border border-zinc-700 text-sm font-medium text-zinc-300 transition-colors hover:border-orange-500/70">
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-2 px-3 py-2 transition-colors hover:bg-orange-500/10 hover:text-orange-200"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
              Subscribe via RSS
            </a>
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger
                className="inline-flex w-10 cursor-pointer items-center justify-center border-l border-zinc-700 transition-colors hover:bg-orange-500/10 hover:text-orange-200 focus:outline-none"
                aria-label="More feed options"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  onCloseAutoFocus={(event) => event.preventDefault()}
                  className="z-50 mt-2 min-w-44 rounded-md border border-zinc-800 bg-zinc-950 p-1 text-sm text-zinc-300 shadow-lg shadow-black/30"
                >
                  <DropdownMenu.Item asChild>
                    <a
                      href="/atom.xml"
                      className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 outline-none transition-colors hover:bg-orange-500/10 hover:text-orange-200 focus:bg-orange-500/10 focus:text-orange-200 data-[highlighted]:bg-orange-500/10 data-[highlighted]:text-orange-200"
                    >
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1.5" />
                        <path d="M19.1 4.9c1.4 1.4-.8 5.8-4.9 9.9s-8.5 6.3-9.9 4.9.8-5.8 4.9-9.9 8.5-6.3 9.9-4.9Z" />
                        <path d="M4.3 4.9c1.4-1.4 5.8.8 9.9 4.9s6.3 8.5 4.9 9.9-5.8-.8-9.9-4.9-6.3-8.5-4.9-9.9Z" />
                      </svg>
                      Atom XML feed
                    </a>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
        <p className="mb-12 text-lg text-zinc-400">
          Updates and thoughts on my projects -- and whatever else is on my mind.
        </p>
      </motion.div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-b border-zinc-800 pb-8 last:border-b-0"
            >
              <Link 
                href={`/blog/${post.slug}`}
                className="group block transition-colors hover:text-zinc-300"
              >
                <h2 className="mb-2 text-2xl font-semibold group-hover:text-zinc-300">
                  {post.title}
                </h2>
                <p className="mb-3 text-zinc-400 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-800 px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
} 
