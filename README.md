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
| The prompt that produces a note | `prompts/research-note.md` |

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
series:                   # optional; omit for a standalone note
  name: "Agentic Coding x Software Architecture"
  part: 2
draft: true               # remove to publish
---
```

`draft: true` keeps a post out of the production build, the blog index, `/rss.xml` and
the sitemap, while leaving it visible on `npm run dev`.

### Series

A post carrying `series` is grouped on the blog index under that name and ordered by
`part`; a post without it is listed under *Standalone notes*. Groups are ordered by
their most recent post, so a new series and a new one-off both surface at the top.
Adding a series needs no code change.

Title each part `<Series name> pt. N: <Part title>` — the index strips that prefix from
the row, so the part title has to read on its own.

### The research notes

The notes under `/blog/` are not written from recall. Each one runs `/deep-research`
over academic sources, verifies every reference against DBLP or OpenAlex, and is drafted
in the [write-like-kokko](https://github.com/kokko-ng/write-like-kokko) style against
measured targets. `prompts/research-note.md` is the prompt that reproduces that process
end to end, including the verification pass that has to run before a note is committed.

## Checks

```bash
npm run check    # astro check — types and template diagnostics
npm run build    # production build
```

Both run in CI before anything is deployed.
