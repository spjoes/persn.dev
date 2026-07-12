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

### Blog post covers

Posts are fine with no cover. To add one, drop an image in
`public/images/blog/` and reference it in the post's frontmatter:

```yaml
cover: "/images/blog/my-post.webp"
coverAlt: "Short description"   # optional; defaults to the title
```

The cover then shows as a banner on the post, a thumbnail in the list, and
as the social/RSS preview image. Posts without a cover show none of those.

### Generating cover art

`scripts/generate-cover.mjs` makes soft, layered "petals in soft light" art
(à la OpenAI's blog cards). It composites several translucent, soft-edged
shapes at different focus depths (seeded value-noise), dithers to avoid
banding, then encodes a small WebP with sharp. Outputs a 16:9 WebP (~5–30 KB)
by default. Each seed is a different composition — use `--count` to roll a few
and keep the one you like.

```bash
npm run cover -- --palette periwinkle          # one image
npm run cover -- --count 6                      # a batch of random palettes/seeds
npm run cover -- --palette mint --seed 42       # reproducible
npm run cover -- --palette azure --out public/images/blog/my-post.webp
npm run cover -- --list                         # list palettes
npm run cover -- --square                       # square instead of 16:9
npm run cover -- --format png                   # PNG instead of WebP
```

Palettes: `periwinkle` (matches the site accent), `azure`, `skygreen`, `mint`,
`teallime`, `blush`, `lavender`, `amber`. Each run prints the exact
`cover:` line to paste into a post. Images land in `public/images/blog/` unless
`--out` is given.

## Build

```bash
npm run build && npm run start
```
