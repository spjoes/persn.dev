"use client";

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
        <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
          Blog
        </h1>
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