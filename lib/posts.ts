import { readdir, readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

export interface Post extends PostMeta {
  content: string;
}

const postsDirectory = path.join(process.cwd(), "app/blog/posts");

function toMeta(filename: string, data: Record<string, unknown>): PostMeta {
  return {
    slug: filename.replace(/\.mdx?$/, ""),
    title: (data.title as string) || "Untitled",
    description: (data.description as string) || "",
    date: (data.date as string) || "",
    tags: (data.tags as string[]) || [],
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
