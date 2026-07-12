import {
  escapeXml,
  feedDescription,
  feedTitle,
  formatAtomDate,
  getFeedPosts,
  siteUrl,
} from "@/lib/feed";

export async function GET() {
  const posts = await getFeedPosts();
  const updated = posts[0]?.date
    ? formatAtomDate(posts[0].date)
    : new Date().toISOString();

  const entries = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      return `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${postUrl}" />
    <id>${postUrl}</id>
    <updated>${formatAtomDate(post.date)}</updated>
    <summary>${escapeXml(post.description)}</summary>
  </entry>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(feedTitle)}</title>
  <link href="${siteUrl}" />
  <link href="${siteUrl}/atom.xml" rel="self" />
  <id>${siteUrl}/</id>
  <subtitle>${escapeXml(feedDescription)}</subtitle>
  <updated>${updated}</updated>
  <author><name>${escapeXml(feedTitle)}</name></author>${entries}
</feed>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
