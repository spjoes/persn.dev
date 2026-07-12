import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import { Reveal } from "@/components/reveal";
import { SubscribeButton } from "@/components/subscribe-button";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on projects, engineering, and whatever else is on my mind.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
      <Reveal>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-4">Writing</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Blog
            </h1>
          </div>
          <SubscribeButton />
        </div>
        <p className="mt-5 max-w-lg text-[var(--ink-dim)]">
          Notes on what I&apos;m building, and whatever else is on my mind.
        </p>
      </Reveal>

      <hr className="rule my-12" />

      {posts.length === 0 ? (
        <p className="text-[var(--ink-faint)]">No posts yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 60}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-3 border-b border-[var(--line)] py-8 first:pt-0 sm:grid-cols-[180px_1fr_auto] sm:items-start sm:gap-10"
              >
                <time
                  dateTime={post.date}
                  className="font-mono text-xs text-[var(--ink-faint)] sm:pt-1"
                >
                  {formatDate(post.date)}
                </time>
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-medium tracking-tight text-[var(--ink)] transition-colors group-hover:text-white">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-[var(--ink-dim)]">
                    {post.description}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[var(--line)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink-faint)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="hidden items-center gap-1.5 justify-self-end pt-1.5 font-mono text-xs text-[var(--ink-faint)] transition-colors group-hover:text-[var(--ink)] sm:inline-flex">
                  Read
                  <Icon.arrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
