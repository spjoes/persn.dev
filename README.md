# persn.dev

Personal website & portfolio for Joseph Kerper — a redesign focused on a
dark, minimal, fast, near-monochrome aesthetic. Album-art colors from the
Apple Music module provide the only real pops of color.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a small token layer in `app/globals.css`
- **MDX** blog via `next-mdx-remote` (+ RSS / Atom feeds)
- **Apple Music** "Recently Played" — live, with per-album accent extraction
- Geist / Geist Mono, lightweight IntersectionObserver scroll reveals

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Copy `.env.example` → `.env.local` and fill in the values to enable the
live features (both are optional — the UI degrades gracefully without them):

| Variable | Purpose |
| --- | --- |
| `APPLE_MUSIC_PRIVATE_KEY` | MusicKit private key (`\n`-escaped PEM) |
| `APPLE_MUSIC_KEY_ID` | MusicKit key ID |
| `APPLE_MUSIC_TEAM_ID` | Apple developer team ID |
| `APPLE_MUSIC_USER_TOKEN` | Your Music-User-Token (recently-played scope) |
| `PHONE_NUMBER` | Optional — adds a "Text" row on `/card` |

## Structure

```
app/
  page.tsx            Home — hero, work, about, contact
  blog/               Blog list + [slug] MDX post pages
  blog/posts/*.mdx    Posts (frontmatter: title, description, date, tags)
  card/               Standalone shareable contact card (no site chrome)
  api/apple-music/    Signs a dev token, proxies recent tracks
  rss.xml, atom.xml   Feeds
components/           Header, footer, recently-played, cards, icons, …
lib/site.ts           Single source of truth for content (bio, projects, socials)
```

## Editing content

- **Bio, projects, social links:** `lib/site.ts`
- **Blog posts:** drop a new `.mdx` file in `app/blog/posts/`
- **Colors / type / spacing tokens:** the `:root` block in `app/globals.css`
  (the accent is a single `--accent` variable)

## Build

```bash
npm run build && npm run start
```
