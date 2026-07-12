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

export async function getFeedPosts() {
  return getAllPosts();
}
