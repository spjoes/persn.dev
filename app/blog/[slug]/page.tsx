import { readdir, readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';


interface BlogPostMetadata {
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), 'app/blog/posts', `${slug}.mdx`);
  
  try {
    const fileContents = await readFile(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      metadata: data as BlogPostMetadata,
      content,
    };
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'app/blog/posts');
  
  try {
    const filenames = await readdir(postsDirectory);
    return filenames
      .filter((name) => name.endsWith('.mdx'))
      .map((filename) => ({
        slug: filename.replace('.mdx', ''),
      }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.metadata.title} | Joseph Kerper`,
    description: post.metadata.description,
  };
}

const components = {
  h1: (props: any) => (
    <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight md:text-3xl" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="mb-3 mt-6 text-xl font-semibold tracking-tight md:text-2xl" {...props} />
  ),
  p: (props: any) => <p className="mb-4 leading-7 text-zinc-300" {...props} />,
  ul: (props: any) => <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />,
  ol: (props: any) => <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />,
  li: (props: any) => <li className="leading-7 text-zinc-300" {...props} />,
  blockquote: (props: any) => (
    <blockquote 
      className="mb-4 border-l-4 border-zinc-600 pl-4 italic text-zinc-400" 
      {...props} 
    />
  ),
  code: (props: any) => (
    <code 
      className="rounded bg-zinc-800 px-1 py-0.5 text-sm font-mono text-zinc-300" 
      {...props} 
    />
  ),
  pre: (props: any) => (
    <pre 
      className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm" 
      {...props} 
    />
  ),
  a: (props: any) => (
    <a 
      className="text-blue-400 underline hover:text-blue-300" 
      {...props} 
    />
  ),
};

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link 
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
        Back to blog
      </Link>
      
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {post.metadata.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <time dateTime={post.metadata.date}>
            {new Date(post.metadata.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
          
          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="flex gap-2">
              {post.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-zinc prose-invert max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>
    </article>
  );
} 