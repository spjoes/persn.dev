import type { Metadata } from "next";
import { readdir } from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, formatDate } from "@/lib/posts";
import { Icon } from "@/components/icons";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const dir = path.join(process.cwd(), "app/blog/posts");
    const filenames = await readdir(dir);
    return filenames
      .filter((name) => name.endsWith(".mdx"))
      .map((filename) => ({ slug: filename.replace(".mdx", "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        {/* Meta sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
          >
            <Icon.arrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to blog
          </Link>

          <dl className="mt-8 space-y-6 border-t border-[var(--line)] pt-6">
            <div>
              <dt className="eyebrow mb-2">Published</dt>
              <dd className="font-mono text-sm text-[var(--ink)]">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </dd>
            </div>
            {post.tags.length > 0 && (
              <div>
                <dt className="eyebrow mb-2">Tags</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[var(--line)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink-faint)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>

        {/* Article */}
        <article className="min-w-0">
          <header className="mb-10">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 max-w-2xl text-lg text-[var(--ink-dim)]">
                {post.description}
              </p>
            )}
          </header>

          <hr className="rule mb-10" />

          <div className="prose max-w-[72ch]">
            <MDXRemote source={post.content} />
          </div>

          <hr className="rule my-12" />

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
          >
            <Icon.arrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All posts
          </Link>
        </article>
      </div>
    </div>
  );
}
