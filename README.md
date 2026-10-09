# kokko-ng.github.io

Personal site and project index. Built with [Astro](https://astro.build),
deployed to GitHub Pages on every push to `main`.

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
```

## Where things live

| What | Where |
| --- | --- |
| Name, tagline, intro copy, links | `src/data/site.ts` |
| Featured projects | `src/data/projects.ts` |
| Design tokens and all styling | `src/styles/global.css` |

## Checks

```bash
npm run check    # astro check — types and template diagnostics
npm run build    # production build
```

Both run in CI before anything is deployed.
