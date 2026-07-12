import { readdir, readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface FeedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export const siteUrl = 'https://persn.dev';
export const feedTitle = 'Joseph Kerper';
export const feedDescription = 'Personal website and blog of Joseph Kerper, Software Engineer';

const postsDirectory = path.join(process.cwd(), 'app/blog/posts');

export function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function formatRssDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

export function formatAtomDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export async function getFeedPosts(): Promise<FeedPost[]> {
  const filenames = await readdir(postsDirectory);
  const posts = await Promise.all(
    filenames
      .filter((name) => name.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = await readFile(filePath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug: filename.replace('.mdx', ''),
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || '',
        };
      })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
