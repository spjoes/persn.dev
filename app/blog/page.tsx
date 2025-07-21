import { readdir, readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { BlogClientWrapper } from '@/components/blog-client-wrapper';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  
  try {
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
            tags: data.tags || [],
          };
        })
    );

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.log('No posts directory found, returning empty array');
    return [];
  }
}

export default async function Blog() {
  const posts = await getBlogPosts();
  return <BlogClientWrapper posts={posts} />;
} 