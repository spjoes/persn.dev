import { getAllPosts } from "./posts";
import { site } from "./site";

export const siteUrl = site.url;
export const feedTitle = site.name;
export const feedDescription = site.description;

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function formatRssDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date().toUTCString()
    : date.toUTCString();
}

export function formatAtomDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString();
}

/** Resolve a post cover (possibly relative) to an absolute URL, or null. */
export function absoluteImageUrl(cover?: string) {
  if (!cover) return null;
  if (/^https?:\/\//.test(cover)) return cover;
  return `${siteUrl}${cover.startsWith("/") ? "" : "/"}${cover}`;
}

export function imageMimeType(url: string) {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
}

export async function getFeedPosts() {
  return getAllPosts();
}
