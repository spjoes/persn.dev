import { readdir, readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  /** Optional cover image, e.g. "/images/blog/my-post.jpg". */
  cover?: string;
  /** Optional alt text for the cover; falls back to the title. */
  coverAlt?: string;
}

export interface Post extends PostMeta {
  content: string;
}

const postsDirectory = path.join(process.cwd(), "app/blog/posts");

function toMeta(filename: string, data: Record<string, unknown>): PostMeta {
  const cover = (data.cover as string) || (data.image as string) || undefined;
  return {
    slug: filename.replace(/\.mdx?$/, ""),
    title: (data.title as string) || "Untitled",
    description: (data.description as string) || "",
    date: (data.date as string) || "",
    tags: (data.tags as string[]) || [],
    cover: cover ? cover.trim() : undefined,
    coverAlt: (data.coverAlt as string) || undefined,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const filenames = await readdir(postsDirectory);
    const posts = await Promise.all(
      filenames
        .filter((name) => name.endsWith(".mdx"))
        .map(async (filename) => {
          const contents = await readFile(path.join(postsDirectory, filename), "utf8");
          const { data } = matter(contents);
          return toMeta(filename, data);
        })
    );
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    const contents = await readFile(filePath, "utf8");
    const { data, content } = matter(contents);
    return { ...toMeta(`${slug}.mdx`, data), content };
  } catch {
    return null;
  }
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
