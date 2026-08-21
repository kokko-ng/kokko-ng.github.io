# kokko-ng.github.io

Personal site — projects and written notes. Built with [Astro](https://astro.build),
deployed to GitHub Pages on every push to `main`.

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
```

Drafts are visible in `dev` and excluded from `build`.

## Where things live

| What | Where |
| --- | --- |
| Name, tagline, intro copy, links | `src/data/site.ts` |
| Featured projects | `src/data/projects.ts` |
| Posts | `src/content/blog/*.md` |
| Post frontmatter schema | `src/content.config.ts` |
| Design tokens and all styling | `src/styles/global.css` |

## Writing a post

Copy `src/content/blog/template.md` to `src/content/blog/your-slug.md`. The filename
becomes the URL. Frontmatter:

```yaml
---
title: "Title of the note"
description: "One or two sentences. Shown on the index, in the feed, and as the meta description."
pubDate: 2026-08-21
updatedDate: 2026-09-01   # optional
tags: ["python", "dsa"]
draft: true               # remove to publish
---
```

`draft: true` keeps a post out of the production build, the blog index, `/rss.xml` and
the sitemap, while leaving it visible on `npm run dev`.

## Checks

```bash
npm run check    # astro check — types and template diagnostics
npm run build    # production build
```

Both run in CI before anything is deployed.
