import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences. Used on the index, in <meta>, and in the feed. */
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /**
     * Set on every post that belongs to a run of related notes. The index
     * groups by `name` and orders by `part`; a post without this field is
     * listed as a standalone note. Adding a new series needs no code change.
     */
    series: z
      .object({
        name: z.string(),
        part: z.number().int().positive(),
      })
      .optional(),
    /** Drafts build locally but are excluded from the index, feed and sitemap. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
